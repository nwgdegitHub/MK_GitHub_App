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
  TouchableHighlight
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SortableListView from 'react-native-sortable-listview'


class SortKeyPage extends Component {
  constructor(props) {
      super(props);
      this.params = this.props.navigation.state.params;
      this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
      this.languageDao = new LanguageDao(this.params.flag);
      this.state = {
          checkedArray: SortKeyPage._keys(this.props),
      }
      console.log('constructor')

  }

  onBackPress(e){
    this.onBack();
    return true;
  }



  static getDerivedStateFromProps(nextProps, prevState) {
      const checkedArray = SortKeyPage._keys(nextProps, prevState);
      if (prevState.checkedArray !== checkedArray) {
          return {
              checkedArray: checkedArray,
          };
      }
      return null;
  }


  componentDidMount(){
    console.log('componentDidMount')
    this.backPress.componentDidMount();
    //console.log(this.state)
    if(SortKeyPage._keys(this.props).length === 0){
      //console.log('重新dispatch a action')
      //console.log(this.props)
      //console.log('this.params = ' + this.params)
      //console.log(this.params) //{isRemoveKey: false, flag: "language_dao_language"}
      const {onLoadLanguage} = this.props;
      onLoadLanguage(this.params.flag);
    }

  }

  componentWillUnmount(){
    this.backPress.componentWillUnmount();
  }

  //否则从原始数据中获取
  static _flag(props) {
      const {flag} = props.navigation.state.params;
      return flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages";
  }

  /**
   * 获取标签
   * @param props
   * @param state
   * @returns {*}
   * @private
   */
  static _keys(props, state) {

      //如果state中有checkedArray则使用state中的checkedArray
      if (state && state.checkedArray && state.checkedArray.length) {
          return state.checkedArray;
      }
      //否则从原始数据中获取checkedArray
      const flag = SortKeyPage._flag(props);
      let dataArray = props.language[flag] || [];
      let keys = [];
      for (let i = 0, j = dataArray.length; i < j; i++) {
          let data = dataArray[i];
          if (data.checked) keys.push(data);
      }

      return keys;
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
  onSave(hasChecked){
    if(!hasChecked){ //如果没有排序 直接返回
      if(ArrayUtil.isEqual(SortKeyPage._keys(this.props),this.state.checkedArray)){
        NavigationUtil.goBack(this.props.navigation);
        return;
      }

      // todo 保存排序后的数组
      this.languageDao.save(this.getSortResult());
      const {onLoadLanguage} = this.props;
      //更新store
      onLoadLanguage(this.params.flag);
      NavigationUtil.goBack(this.props.navigation);

    }


  }


  //获取排序后的标签结果
  getSortResult(){
    const flag = SortKeyPage._flag(this.props);

    //从原始数据中复制一份数据 以便对这份数据进行排序
    let sortResultArray = ArrayUtil.clone(this.props.language[flag]);

    //获取排序之前的数据
    const originalCheckedArray = SortKeyPage._keys(this.props);

    for(let i =0,j=originalCheckedArray.length;i<j;i++){
      let item = originalCheckedArray[i];
      let index = this.props.language[flag].indexOf(item);
      sortResultArray.splice(index,1,this.state.checkedArray[i]);
    }

    return sortResultArray;

  }

  //点击导航栏返回按钮
  onBack() {
      if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props),this.state.checkedArray)) {
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

    let title=this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序':'标签排序';


    let navigationBar = <NavigationBar
    title={title}
    style={{backgroundColor: THEME_COLOR}}
    rightButton={ViewUtil.getRightButton('保存',()=>this.onSave())}
    leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
    />;
    return <View
        style={{flex: 1}}

    >
        {navigationBar}
        <SortableListView
        style={{ flex: 1 }}
        data={this.state.checkedArray}
        order={Object.keys(this.state.checkedArray)}
        onRowMoved={e => {

          this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
          this.forceUpdate()
        }}
        renderRow={row => <SortCell data={row} {...this.params}/>}
      />
    </View>

  }
}

//
class SortCell extends Component{
  render (){
    const {theme}=this.props;
    return <TouchableHighlight underlayColor={'#eee'}
    style={this.props.data.checked ? styles.item : styles.hidden}
    {...this.props.sortHandlers}
    >


      <View style={{marginLeft: 10,flexDirection: 'row'}}>
        <MaterialCommunityIcons
          name={'sort'}
          size={16}
          style={{marginRight: 10,color: THEME_COLOR}}
        />
        <Text>{this.props.data.name}</Text>
      </View>
    </TouchableHighlight>
  }
}

const mapCustomKeyStateToProps = state => ({
  language:state.language, //直接取最外面的节点
});

const mapCustomKeyDispatchToProps = dispatch => ({
  onLoadLanguage:(flag)=>dispatch(actions.onLoadLanguage(flag)),
});

export default connect(mapCustomKeyStateToProps,mapCustomKeyDispatchToProps)(SortKeyPage);



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
  },
  hidden:{
    height: 0
  },
  item:{
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center'
  }
});
