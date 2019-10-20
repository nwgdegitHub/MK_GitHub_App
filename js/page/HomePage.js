import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  BackHandler,//处理安卓物理返回健
} from 'react-native';

import { createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createDrawerNavigator,
  createSwitchNavigator,
  NavigationActions,
 } from 'react-navigation';

 import {connect} from 'react-redux';

import PopularPage from './PopularPage';
import TrendingPage from './TrendingPage';
import FavoritePage from './FavoritePage';
import MyPage from './MyPage';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import NavigationUtil from '../navigator/NavigationUtil'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'

import AppNavigator from '../navigator/AppNavigator'

import BackPressComponent from '../common/BackPressComponent'

import CustomTheme from '../page/CustomTheme'

import actions from '../action/index'; //此处导入actions是一种用法 其实在index.js中并没有actions 定义任意对象名都行

class HomePage extends Component {

  //处理安卓物理返回键
  constructor(props){
    super(props);
    // this.onBackPress = this.onBackPress.bind(this);
    this.backPress = new BackPressComponent({backPress:this.onBackPress()});
  }

  componentDidMount(){
    this.backPress.componentDidMount();
  }
  componentWillUnmount(){
    this.backPress.componentWillUnmount();
  }
  onBackPress = () => {
    const {dispatch,nav} = this.props;
    //if(nav.index === 0){
    if(nav.routes[1].index === 0){ //如果RootNavigator 中的MainNavigator 的index为0 则不处理返回事件
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  _tabNavigator(){
    return createAppContainer(createBottomTabNavigator({
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
    }));
  }


  renderCustomThemeView(){

    const {customThemeViewVisible,onShowCustomThemeView} = this.props;
    return (<CustomTheme
        visible={customThemeViewVisible}
        {...this.props}
        onClose={()=>onShowCustomThemeView(false)}
      />)
  }
  render(){
    NavigationUtil.navigation = this.props.navigation;//此处保存下来的导航栏是为了界面跳转之用
    // if (!this.props.navigation) {
    //   debugger;
    // }
    // const Tab = this._tabNavigator();
    // return <DynamicTabNavigator/>

    return <View style={{flex:1}}>
      <DynamicTabNavigator/>
      {this.renderCustomThemeView()}
    </View>
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
  nav:state.nav,
  customThemeViewVisible:state.theme.customThemeViewVisible,
});

const mapDispatchToProps = dispatch =>  ({
  onShowCustomThemeView:(show)=>dispatch(actions.onShowCustomThemeView(show))
});

export default connect(mapStateToProps,mapDispatchToProps)(HomePage);
