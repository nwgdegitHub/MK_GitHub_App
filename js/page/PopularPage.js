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
} from 'react-native';

import {connect} from 'react-redux';
import actions from '../action/index'; //此处导入actions是一种用法 其实在index.js中并没有actions 定义任意对象名都行

import PopularItem from '../common/PopularItem'

import { createStackNavigator,
  createAppContainer,
  createMaterialTopTabNavigator,
 } from 'react-navigation';

import NavigationUtil from '../navigator/NavigationUtil';

import Toast from 'react-native-easy-toast';

import NavigationBar from '../common/NavigationBar'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';

import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

import FavoriteUtil from '../util/FavoriteUtil';

import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';

import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

/* PopularPage+redux */

class PopularPage extends Component {
  constructor(props){
    super(props);

    //this.tabNames=['Java','Android','iOS','React Native','PHP'];
    const {onLoadLanguage} = props;
    onLoadLanguage(FLAG_LANGUAGE.flag_key);//从本地加载tabNames

  }

  _genTabs(){

    const tabs = {};
    const {keys} = this.props;
    keys.forEach((item,index)=>{
      if(item.checked){
        tabs[`tab${index}`]={
          screen:props => <PopularTabPage {...props} tabLabel={item.name}/>,//配置路由的时候可以传递参数(实用，但官网没有)
          navigationOptions:{
            title:item.name
          }
        }
      }

    })
    return tabs;
  }
  render(){

    const {keys} = this.props;
    let statusBar={
      barStyle:'default',
      backgroundColor:THEME_COLOR,
    };
    let navigationBar = <NavigationBar
    title={'最热'}
    statusBar={statusBar}
    style={{backgroundColor: THEME_COLOR}}/>;

    const TabNavigator = keys.length>0?createAppContainer(createMaterialTopTabNavigator(
      this._genTabs(),{
        tabBarOptions:{
          tabStyle:styles.tabStyle,
          upperCaseLabel:false,//是否使标签大写
          scrollEnabled:true,
          style:{
            backgroundColor:'#678',
            height:30,//解决安卓上闪烁问题
          },
          indicatorStyle:styles.indicatorStyle,
          labelStyle:styles.labelStyle,
        }
      }
    )):null;
    return <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated?30:0}}>
      {/*{navigationBar}//使用自定义导航栏*/}
      {navigationBar}
      {TabNavigator && <TabNavigator/>}

    </View>

  }
}

const mapPopularStateToProps = state => ({
  keys:state.language.keys,
});

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage:(flag)=>dispatch(actions.onLoadLanguage(flag)),
});

export default connect(mapPopularStateToProps,mapPopularDispatchToProps)(PopularPage);


/* PopularTab+redux */

const pageSize = 10;// 设为常量 防止修改
//自定义组件
class PopularTab extends Component {

  constructor(props){
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false;
  }

  componentDidMount(){
    this.loadData();
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular,this.favoriteChangeListener = ()=>{
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select,this.bottomTabSelectListener = (data)=>{
      if(data.to === 0 && this.isFavoriteChanged){
        this.loadData(null,true);
      }
    });
  }

  componentWillUnmount(){
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }



  loadData(loadMore,refershFavorite){
    const {onLoadPopularData,onLoadMorePopularData,onFlushPopularFavorite} = this.props;
    const store=this._store();
    const url = this.genFetchUrl(this.storeName);

    if(loadMore){
        onLoadMorePopularData(this.storeName,++store.pageIndex,pageSize,store.items,favoriteDao,callback=>{

        this.refs.toast.show('没有更多了');
      });
    }
    else if(refershFavorite){
      onFlushPopularFavorite(this.storeName,store.pageIndex,pageSize,store.items,favoriteDao)
    }
    else
    {
      onLoadPopularData(this.storeName,url,pageSize,favoriteDao);
    }

  }

  // 获取与当前页面有关的数据
  _store(){
    const {popular} = this.props;
    let store = popular[this.storeName];
    if(!store){
      store = {
        items:[],
        isLoading:false,
        projectModes:[], // 要显示的数据
        hideLoadingMore:true, // 默认隐藏加载更多
      }
    }
    return store;
  }

  genFetchUrl(key){
    return URL + key + QUERY_STR;
  }

  renderItem(data){
    //Alert.alert(data);
    const item = data.item;
    return <PopularItem
    projectModel={item}
    onSelect={(callback)=>{
      NavigationUtil.goPage({
        projectModel:item,
        flag:FLAG_STORAGE.flag_popular,
        callback,
      },'DetailPage')
    }}
    onFavorite={(item,isFavorite)=>FavoriteUtil.onFavorite(favoriteDao,item,isFavorite,FLAG_STORAGE.flag_popular)}
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
    //Alert.alert('124');

    const {popular}=this.props;
    let store=this._store();
    //Alert.alert(store.projectModels);
    // console.log('1')
    // console.log(store.projectModes)
    // console.log('2')
    return (

      <View style={styles.container}>

        <FlatList
          data={store.projectModes}

          renderItem={data=>this.renderItem(data)}
          keyExtractor={item=>""+item.item.id} //参数item相当于projectModel
          refreshControl={
            <RefreshControl
              title={'加载中'}
              // titleColor:{THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={()=>this.loadData()}
              tintColor={THEME_COLOR}
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
  popular:state.popular,

});// 所有页面订阅的地方都可以参照此处写法

const mapDispatchToProps = dispatch => ({
  onLoadPopularData: (storeName,url,pageSize,favoriteDao) => dispatch(actions.onLoadPopularData(storeName,url,pageSize,favoriteDao)),
  onLoadMorePopularData: (storeName,pageIndex,pageSize,items,favoriteDao,callback) => dispatch(actions.onLoadMorePopularData(storeName,pageIndex,pageSize,items,favoriteDao,callback)),
  onFlushPopularFavorite:(storeName,pageIndex,pageSize,items,favoriteDao) =>dispatch(actions.onFlushPopularFavorite(storeName,pageIndex,pageSize,items,favoriteDao)),

});

const PopularTabPage = connect(mapStateToProps,mapDispatchToProps)(PopularTab);

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
