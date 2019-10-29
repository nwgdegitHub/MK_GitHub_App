import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
  DeviceInfo,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';

import {connect} from 'react-redux';
import actions from '../action/index'; //此处导入actions是一种用法 其实在index.js中并没有actions 定义任意对象名都行

import TrendingItem from '../common/TrendingItem'

import { createStackNavigator,
  createAppContainer,
  createMaterialTopTabNavigator,
 } from 'react-navigation';

import NavigationUtil from '../navigator/NavigationUtil';

import Toast from 'react-native-easy-toast';

import NavigationBar from '../common/NavigationBar';

const URL = 'https://github.com/trending/';

// const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
//https://github.com/trending/c++?since=daily


import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog';

const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";

import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

import FavoriteUtil from '../util/FavoriteUtil';

import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import ArrayUtil from '../util/ArrayUtil';

class TrendingPage extends Component {
  constructor(props){
    super(props);
    // this.tabNames=['Any','C','C#','PHP','JavaScript'];
    this.state={
      timeSpan:TimeSpans[0],//打开App默认选中今天
    };
    const {onLoadLanguage} = props;
    onLoadLanguage(FLAG_LANGUAGE.flag_language);
    this.preKeys=[];
  }

  _genTabs(){

    const tabs = {};
    const {keys,theme} = this.props;
    this.preKeys=keys;
    keys.forEach((item,index)=>{
      if(item.checked){
        tabs[`tab${index}`]={
          screen:props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.name} theme={theme}/>,//配置路由的时候可以传递参数(实用，但官网没有)
          navigationOptions:{
            title:item.name
          }
        }
      }

    })
    return tabs;
  }

  //实现自定义导航栏标题
  renderTitleView(){
    return <View>
      <TouchableOpacity
        underlayColor='transparent'
        onPress={()=>this.dialog.show()}
      >
        <View style={{flexDirection: 'row',alignItems: 'center'}}>
          <Text style={{fontSize: 18,color: '#FFFFFF',fontWeight: '400'}}>
            趋势 {this.state.timeSpan.showText}
          </Text>
          <MaterialIcons
            name={'arrow-drop-down'}
            size={22}
            style={{color: 'white'}}
          />
        </View>

      </TouchableOpacity>
    </View>
  }

  onSelectTimeSpan(tab){
    this.dialog.dismiss();
    this.setState({
       timeSpan:tab
    });

    //发送事件 在切换时间维度的时候 tab不刷新 下面的页面刷新
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE,tab);

  }

  renderTrendingDialog(){
    return (<TrendingDialog
      ref={dialog=>this.dialog=dialog}
      onSelect={tab=>this.onSelectTimeSpan(tab)}
    />)
  }

  _tabNav(){

    const {theme} = this.props;

    if(theme !== this.theme || !this.tabNavi || !ArrayUtil.isEqual(this.preKeys,this.props.keys)){
      this.theme = theme;
      //优化顶部tab 不让他切换时间维度时刷新
      this.tabNavi = createAppContainer(createMaterialTopTabNavigator(
        this._genTabs(),{
          tabBarOptions:{
            tabStyle:styles.tabStyle,
            upperCaseLabel:false,//是否使标签大写
            scrollEnabled:true,
            style:{
              backgroundColor:theme.themeColor,height:30,
            },
            indicatorStyle:styles.indicatorStyle,
            labelStyle:styles.labelStyle,
          },
          lazy:true
        }
      ));
    }
    return this.tabNavi;
  }

  render(){
    const {theme} = this.props;
    
    const {keys} = this.props;
    let statusBar={
      barStyle:'default',
      backgroundColor:theme.themeColor,
    };
    let navigationBar = <NavigationBar
    titleView={this.renderTitleView()}
    statusBar={statusBar}
    style={{backgroundColor: theme.themeColor}}/>;

    const TabNavigator = keys.length?this._tabNav():null;
    return <View style={{flex: 1,marginTop: DeviceInfo.isIPhoneX_deprecated?30:0}}>
      {/*{navigationBar}//使用自定义导航栏*/}
      {navigationBar}
      {TabNavigator && <TabNavigator/> }

      {this.renderTrendingDialog()}
    </View>

  }

}

const mapPopularStateToProps = state => ({
  keys:state.language.languages,
  theme:state.theme.theme
});

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage:(flag)=>dispatch(actions.onLoadLanguage(flag)),
});

export default connect(mapPopularStateToProps,mapPopularDispatchToProps)(TrendingPage);

const pageSize = 10;// 设为常量 防止修改

//自定义组件
class TrendingTab extends Component {

  constructor(props) {
      super(props);
      const {tabLabel, timeSpan} = this.props;
      this.storeName = tabLabel;
      this.timeSpan = timeSpan;
      this.isFavoriteChanged = false;
  }

  componentDidMount(){
    this.loadData();
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE,(timeSpan)=>{
      this.timeSpan=timeSpan;
      this.loadData();
    });

    EventBus.getInstance().addListener(EventTypes.favorite_changed_trending,this.favoriteChangeListener = ()=>{
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select,this.bottomTabSelectListener = (data)=>{
      if(data.to === 1 && this.isFavoriteChanged){
        this.loadData(null,true);
      }
    });
  }

  componentWillUnmount(){
    if(this.timeSpanChangeListener){
      this.timeSpanChangeListener.remove();
    }

    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }

  loadData(loadMore,refershFavorite){
    const {onLoadTrendingData,onLoadMoreTrendingData,onFlushTrendingFavorite} = this.props;
    const store=this._store();
    const url = this.genFetchUrl(this.storeName);

    if(loadMore){
      onLoadMoreTrendingData(this.storeName,++store.pageIndex,pageSize,store.items,favoriteDao,callback=>{

        this.refs.toast.show('没有更多了');
      });
    }
    else if(refershFavorite){
      onFlushTrendingFavorite(this.storeName,store.pageIndex,pageSize,store.items,favoriteDao);
    }
    else
    {
      // console.log('onLoadTrendingData')

      onLoadTrendingData(this.storeName,url,pageSize,favoriteDao);
    }

  }

  // 获取与当前页面有关的数据
  _store(){
    const {trending} = this.props;
    let store = trending[this.storeName];
    if(!store){
      store = {
        items:[],
        isLoading:false,
        projectModels:[], // 要显示的数据
        hideLoadingMore:true, // 默认隐藏加载更多
      }
    }
    return store;
  }

  genFetchUrl(key){
    // Alert.alert(this.timeSpan);
    // if(key === 'Any'){
    //
    //   return URL + '' + '?since=daily';
    // }
    // else{
    //   return URL + key + '?since=daily';
    // }
    //console.log(URL + key + '?' + this.timeSpan.searchText)
    return URL + key + '?' + this.timeSpan.searchText;
  }
//https://github.com/trending/c++?since=daily
  renderItem(data){
    const item = data.item;
    const {theme} = this.props;
    return <TrendingItem
     projectModel={item}
     theme = {theme}
     onSelect={(callback)=>{
      NavigationUtil.goPage({
        projectModel:item,
        flag:FLAG_STORAGE.flag_trending,
        callback,
      },'DetailPage')
    }}
    onFavorite={(item,isFavorite)=>FavoriteUtil.onFavorite(favoriteDao,item,isFavorite,FLAG_STORAGE.flag_trending)}

    />
  }

  genIndicator(){
    return this._store().hideLoadingMore?null:
      <View style={{alignItems: 'center'}}>
        <ActivityIndicator style={{color: 'red',margin: 10}}

        />
        <Text>正在加载更多</Text>
      </View>
  }

  render(){

    const {popular,theme}=this.props;
    let store=this._store();

    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data=>this.renderItem(data)}
          keyExtractor={item=>""+item.item.fullName}
          refreshControl={
            <RefreshControl
              title={'加载中'}
              // titleColor:{THEME_COLOR}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={()=>this.loadData()}
              tintColor={theme.themeColor}
            />
          }
          ListFooterComponent={()=>this.genIndicator()}
          onEndReached={()=>{

            setTimeout(()=>{
              if(this.canLoadMore){ //解决上拉加载更多调用2次的问题
                this.loadData(true);
                this.canLoadMore=false;
              }
            },100);

          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={()=>{
            this.canLoadMore=true; //修复 初始化页时调用onEndReached的问题
          }}
        />
        <Toast ref={'toast'} position={'center'}/>

      </View>
      );
  }
}

const mapStateToProps = state =>({
  trending:state.trending,
  theme:state.theme.theme,
});// 所有页面订阅的地方都可以参照此处写法

const mapDispatchToProps = dispatch => ({
  onLoadTrendingData: (storeName,url,pageSize,favoriteDao) => dispatch(actions.onLoadTrendingData(storeName,url,pageSize,favoriteDao)),
  onLoadMoreTrendingData: (storeName,pageIndex,pageSize,items,favoriteDao,callback) => dispatch(actions.onLoadMoreTrendingData(storeName,pageIndex,pageSize,items,favoriteDao,callback)),
onFlushTrendingFavorite:(storeName,pageIndex,pageSize,items,favoriteDao)=>dispatch(actions.onFlushTrendingFavorite(storeName,pageIndex,pageSize,items,favoriteDao))
});

const TrendingTabPage = connect(mapStateToProps,mapDispatchToProps)(TrendingTab);

const styles = StyleSheet.create({
  container:{
    flex: 1,
    //marginTop: 30
  },
  text:{
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  tabStyle:{
      //minWidth: 60 //此处不要设置初始化宽度 会导致安卓上UI问题
      padding: 0
  },
  indicatorStyle:{
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle:{
    fontSize: 13,
    margin: 0,
  }
});
