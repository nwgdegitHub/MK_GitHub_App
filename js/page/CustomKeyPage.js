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
  ScrollView,
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
import ViewUtil from '../util/ViewUtil';
import ArrayUtil from '../util/ArrayUtil';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';

import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

import BackPressComponent from '../common/BackPressComponent'
import CheckBox from 'react-native-check-box'
import Ionicons from 'react-native-vector-icons/Ionicons'

class CustomKeyPage extends Component {
  constructor(props){
    super(props);
    this.params = this.props.navigation.state.params;
    this.changeValues = [];//保存点击chexbox后触发的变化数组
    this.isRemoveKey = !!this.params.isRemoveKey;//是不是标签移除的功能
    this.languageDao = new LanguageDao(this.params.flag);
    this.state = {
        keys: []
    }
    this.backPress = new BackPressComponent({backPress: (e)=>this.onBackPress(e)})


  }
  onBackPress(e){
    this.onBack();
    return true;
  }

  static getDerivedStateFromProps(nextProps,prevState){
     if(prevState.keys !== CustomKeyPage._keys(nextProps,null,prevState)){
       return {
         keys:CustomKeyPage._keys(nextProps,null,prevState),
       }
     }
     return null;
  }

  componentDidMount(){
    this.backPress.componentDidMount();
    //console.log(this.state)
    if(CustomKeyPage._keys(this.props).length === 0){
      //console.log('重新dispatch a action')
      //console.log(this.props)
      //console.log('this.params = ' + this.params)
      //console.log(this.params) //{isRemoveKey: false, flag: "language_dao_language"}
      const {onLoadLanguage} = this.props;
      onLoadLanguage(this.params.flag);
    }
    this.setState({
        keys: CustomKeyPage._keys(this.props),
    })
  }

  componentWillUnmount(){
    this.backPress.componentWillUnmount();
  }

  //获取标签
  static _keys(props,original,state){
    const {flag,isRemoveKey} = props.navigation.state.params;
     let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';//languages报错

     if(isRemoveKey&&!original){ // 是否是移除标签 是否需要使用原始数据
       //如果state中的keys为空则从props中取
       return state && state.keys && state.keys.length !== 0 && state.keys || props.language[key].map(val => {
         return { //注意 不要直接修改props copy一份
           ...val,
           checked:false
         }
       })

     }
     else
     {
       // console.log('key=' + key)//languages
       // console.log(props)//{screenProps: undefined, navigation: {…}, language: {…}, onLoadLanguage: ƒ}
       // lanuage:{keys:[...],languages:[...]}
       return props.language[key];
     }
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

  //导航栏保存按钮被点击
  onSave(){

    if(this.changeValues.length === 0){
      NavigationUtil.goBack(this.props.navigation);
      return;
    }

    //如果是标签移除 要做特殊处理
    let keys;
    if(this.isRemoveKey){
      for(let i =0 ,l= this.changeValues.length; i<l;i++){
        ArrayUtil.remove(keys = CustomKeyPage._keys(this.props,true),this.changeValues[i],"name");
      }
    }

    //更新本地数据
    this.languageDao.save(keys || this.state.keys);

    //更新store 因为最热和趋势都订阅了相关数据
    const {onLoadLanguage} = this.props;
    onLoadLanguage(this.params.flag);
    NavigationUtil.goBack(this.props.navigation);
  }

  //点击chexkbox
  onClick(data,index){
    data.checked = !data.checked;
    ArrayUtil.updateArray(this.changeValues,data);
    this.state.keys[index]=data;//更新state以便显示选中状态
    this.setState({
      keys:this.state.keys
    })
  }

  _checkedImage(checked){
    const {theme} = this.params;
    return <Ionicons
      name={checked?'ios-checkbox':'md-square-outline'}
      size={20}
      style={{color: THEME_COLOR}}
    />
  }
  //生成复选框
  renderCheckBox(data,index){
    return <CheckBox
              style={{flex: 1, padding: 10}}
              onClick={()=>this.onClick(data,index)}
              isChecked={data.checked}
              leftText={data.name}
              checkedImage={this._checkedImage(true)}
              unCheckedImage={this._checkedImage(false)}
            />

  }

  renderView() {
      let dataArray = this.state.keys;
      if (!dataArray || dataArray.length === 0) return;
      let len = dataArray.length;
      let views = [];
      for (let i = 0, l = len; i < l; i += 2) {
          views.push(
              <View key={i}>
                  <View style={{flexDirection: 'row'}}>
                      {this.renderCheckBox(dataArray[i], i)}
                      {i + 1 < len && this.renderCheckBox(dataArray[i + 1], i + 1)}
                  </View>
                  <View style={{flex: 1,height:0.3,backgroundColor: 'darkgray'}}/>
              </View>
          )
      }

      return views;
  }

  //点击导航栏返回按钮
  onBack() {
      if (this.changeValues.length > 0) {
          Alert.alert('提示', '要保存修改吗？',
              [
                  {
                      text: '否', onPress: () => {
                          NavigationUtil.goBack(this.props.navigation)
                      }
                  },
                  {
                      text: '是', onPress: () => {
                        this.onSave();
                      }
                  }
              ])
      } else {
          NavigationUtil.goBack(this.props.navigation)
      }

  }

  render(){
    //console.log(this.state) //{keys:数据}
    let title = this.isRemoveKey? '标签移除':'自定义标签';
    title=this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言':title;

    let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
    let navigationBar = <NavigationBar
    title={title}
    style={{backgroundColor: THEME_COLOR}}
    rightButton={ViewUtil.getRightButton(rightButtonTitle,()=>this.onSave())}
    leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
    />;
    return <View
        style={{flex: 1}}

    >
        {navigationBar}
        <ScrollView>
            {this.renderView()}
        </ScrollView>
    </View>

  }
}

const mapCustomKeyStateToProps = state => ({
  language:state.language, //直接取最外面的节点
});

const mapCustomKeyDispatchToProps = dispatch => ({
  onLoadLanguage:(flag)=>dispatch(actions.onLoadLanguage(flag)),
});

export default connect(mapCustomKeyStateToProps,mapCustomKeyDispatchToProps)(CustomKeyPage);



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
