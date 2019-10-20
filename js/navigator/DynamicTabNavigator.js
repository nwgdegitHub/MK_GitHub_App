import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {connect} from 'react-redux';

import { createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createDrawerNavigator,
  createSwitchNavigator,
 } from 'react-navigation';

import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import NavigationUtil from './NavigationUtil'
import {BottomTabBar} from 'react-navigation-tabs';

import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';

const TABS = {
    PopularPage:{
      screen:PopularPage,
      navigationOptions:{
        tabBarLabel:'最热',
        tabBarIcon:({tintColor,focused})=>(<MaterialIcons
           name={'whatshot'}
           size={26}
           style={{color:tintColor}}
        />)
      }
    },
    TrendingPage:{
      screen:TrendingPage,
      navigationOptions:{
        tabBarLabel:'趋势',
        tabBarIcon:({tintColor,focused})=>(<Ionicons
           name={'md-trending-up'}
           size={26}
           style={{color:tintColor}}
        />)
      }
    },
    FavoritePage:{
      screen:FavoritePage,
      navigationOptions:{
        tabBarLabel:'收藏',
        tabBarIcon:({tintColor,focused})=>(<MaterialIcons
           name={'favorite'}
           size={26}
           style={{color:tintColor}}
        />)
      }
    },
    MyPage:{
      screen:MyPage,
      navigationOptions:{
        tabBarLabel:'我的',
        tabBarIcon:({tintColor,focused})=>(<MaterialIcons
           name={'my-location'}
           size={26}
           style={{color:tintColor}}
        />)
      }
    },
} //将页面定义成常量 或者说路由 根据需要加载 

class DynamicTabNavigator extends Component {

  constructor(props){
    super()
    console.disableYellowBox=true;//禁止警告
  }

  _tabNavigator(){
    if(this.Tabs){
      return this.Tabs;
    }

    const {PopularPage,TrendingPage,FavoritePage,MyPage}=TABS;
    const tabs = {PopularPage,TrendingPage,FavoritePage,MyPage}; //根据需要配置
    PopularPage.navigationOptions.tabBarLabel = '最新'; //这里可以修改底部导航栏属性
    return this.Tabs = createAppContainer(createBottomTabNavigator(tabs,{
      tabBarComponent:props=>{
        return <TabBarComponent theme={this.props.theme} {...props}/>
      }
    }))
  }

  render(){
    //NavigationUtil.navigation = this.props.navigation;//此处保存下来的导航栏是为了界面跳转之用(已经获取不到了,直接在HomePage中获取)

    const Tab = this._tabNavigator();
    return (<Tab
        onNavigationStateChange={(prevState,newState,action)=>{
          EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select,//发送底部tab切换事件
              {
                from:prevState.index,
                to:newState.index,
              })
        }}
      />)
  }
}

class TabBarComponent extends React.Component{
  constructor(props) {
    super(props);
    this.theme={
      tintColor:props.activeTintColor,
      updateTime:new Date().getTime(),
    }
  }

  render(){
    // const {routes,index} = this.props.navigation.state;
    // if (routes[index].params) {
    //   const {theme} = routes[index].params;
    //   if (theme && theme.updateTime > this.theme.updateTime) {
    //     this.theme = theme;
    //   }
    //
    // }
    return <BottomTabBar
    {...this.props}
    activeTintColor={this.props.theme.themeColor}//this.theme.tintColor || this.props.activeTintColor
/>
  }
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  text:{
    marginTop: 100,
    alignItems: 'center'
  }
});

const mapStateToProps = state => ({
  theme: state.theme.theme, // v2
});

export default connect(mapStateToProps)(DynamicTabNavigator);
