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
import TrendingItem from '../common/TrendingItem'
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

export default class FavoritePage extends Component {
  constructor(props){
    super(props);
    this.tabNames=['最热','趋势'];
  }

  render(){
    let statusBar={
      barStyle:'default',
      backgroundColor:THEME_COLOR,
    };
    let navigationBar = <NavigationBar
    title={'收藏'}
    statusBar={statusBar}
    style={{backgroundColor: THEME_COLOR}}/>;

    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
      {
        'Popular':{
          screen:props=><FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular}/>,
          navigationOptions:{
            title:'最热',
          },

        },
        'Trending':{
          screen:props=><FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending}/>,
          navigationOptions:{
            title:'趋势',
          },

        },

      },{
        tabBarOptions:{
          tabStyle:styles.tabStyle,
          upperCaseLabel:false,//是否使标签大写
          // scrollEnabled:true,
          style:{
            backgroundColor:'#678',
            height:30,//解决安卓上闪烁问题
          },
          indicatorStyle:styles.indicatorStyle,
          labelStyle:styles.labelStyle,
        }
      }
    ));
    return <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated?30:0}}>
      {/*{navigationBar}//使用自定义导航栏*/}
      {navigationBar}
      <TabNavigator/>
    </View>

  }
}

const pageSize = 10;// 设为常量 防止修改
//自定义组件
class FavoriteTab extends Component {

  constructor(props){
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }

  componentDidMount(){
    this.loadData(true);
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select,this.listener = data =>{
      if(data.to === 2){
        this.loadData(false);
      }
    })
  }
  componentWillUnmount(){
    EventBus.getInstance().removeListener(this.listener);
  }

  loadData(isShowLoading){
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName,isShowLoading)
  }

  // 获取与当前页面有关的数据
  _store(){
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if(!store){
      store = {
        items:[],
        isLoading:false,
        projectModes:[], // 要显示的数据

      }
    }
    return store;
  }


  renderItem(data){
    //Alert.alert(data);
    const item = data.item;
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem :TrendingItem;
    return <Item
    projectModel={item}
    onSelect={(callback)=>{
      NavigationUtil.goPage({
        projectModel:item,
        flag:this.storeName,
        callback,
      },'DetailPage')
    }}
    onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}
    />
  }
  onFavorite(item,isFavorite){
    FavoriteUtil.onFavorite(this.favoriteDao,item,isFavorite,this.props.flag);
    if(this.storeName === FLAG_STORAGE.flag_popular){
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular);
    }
    else{
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending );
    }
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
          keyExtractor={item=>""+(item.item.id || item.item.fullName)} //参数item相当于projectModel
          refreshControl={
            <RefreshControl
              title={'加载中'}
              // titleColor:{THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={()=>this.loadData(true)}
              tintColor={THEME_COLOR}
            />
          }

        />
        <Toast ref={'toast'} position={'center'}/>

      </View>
      );
  }
}

const mapStateToProps = state =>({
  favorite:state.favorite
});// 所有页面订阅的地方都可以参照此处写法

const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData: (flag,isShowLoading) => dispatch(actions.onLoadFavoriteData(flag,isShowLoading))

});

const FavoriteTabPage = connect(mapStateToProps,mapDispatchToProps)(FavoriteTab);

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
