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
  Platform,
  TouchableOpacity,
  TextInput
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

import {FLAG_STORAGE} from '../expand/dao/DataStore';

import GlobalStyles from '../res/styles/GlobalStyles';
import Utils from '../util/Utils';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import LanguageDao from '../expand/dao/LanguageDao'
import ViewUtil from '../util/ViewUtil';

import BackPressComponent from '../common/BackPressComponent';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const pageSize = 10;

/* SearchPage+redux */

class SearchPage extends Component {
  constructor(props){
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPressComponent({backPress:(e)=>this.onBackPress()});
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.iskeyChange = false; //在点返回键的时候 判断是否做了收藏操作

  }

  componentDidMount(){
    this.backPress.componentDidMount();
  }

  componentWillUnmount(){
    this.backPress.componentWillUnmount();
  }

  loadData(loadMore){

    const {onSearch,onLoadMoreSearch,search,keys} = this.props;

    if(loadMore){
      debugger
        onLoadMoreSearch(++search.pageIndex,pageSize,search.items,this.favoriteDao,callback=>{
          this.toast.show('没有更多了');
      });
    }
    else
    {
      onSearch(this.inputKey,pageSize,this.searchToken = new Date().getTime(),this.favoriteDao,keys,message=>{
        this.toast.show(message);
      });
    }
  }

  onBackPress(){

    const {onSearchCancel,onLoadLanguage} = this.props;
    onSearchCancel(); //推出时取消搜索
    this.refs.input.blur();
    NavigationUtil.goBack(this.props.navigation);
    if(this.iskeyChange){
      onLoadLanguage(FLAG_LANGUAGE.flag_key);
    }
    return true;
  }

  genIndicator() {
      const {search} = this.props;
      return search.hideLoadingMore ? null :
          <View style={styles.indicatorContainer}>
              <ActivityIndicator
                  style={styles.indicator}
              />
              <Text>正在加载更多</Text>
          </View>
  }


  //添加标签
  saveKey(){
    const {keys} = this.props;
    let key = this.inputKey;
    if(Utils.checkKeyIsExist(keys,key)){
      this.toast.show(key+'已经存在')
    }
    else
    {
      key ={
        "path":key,
        "name":key,
        "checked":true
      };
      keys.unshift(key); //将key添加到数组开头
      this.languageDao.save(keys);
      this.toast.show(key.name + '保存成功')
      this.iskeyChange = true;
    }
  }

  onRightButtonClick(){
    const {onSearchCancel,search} = this.props;
    if(search.showText === '搜索'){
      this.loadData();
    }
    else{
      onSearchCancel(this.searchToken);
    }
  }

  renderNavBar(){
    const {theme} = this.params;
    const {showText,inputKey} = this.props.search;
    const placeholder = inputKey || '请输入';

    let backButton = ViewUtil.getLeftBackButton(()=>this.onBackPress());

    let inputView = <TextInput
      ref = "input"
      placeholder={placeholder}
      onChangeText={text=>this.inputKey = text}
      style={styles.textInput}
    ></TextInput>;

    let rightButton = <TouchableOpacity
      onPress={()=>{
        this.refs.input.blur()//收起键盘
        this.onRightButtonClick();
      }}
    >

      <View style={{marginRight:10}}>
        <Text style={styles.title}>{showText}</Text>
      </View>

    </TouchableOpacity>;
    return <View style={{
      backgroundColor: theme.themeColor,
      flexDirection: 'row',
      alignItems: 'center',

      height: (Platform.OS === 'ios')?GlobalStyles.nav_bar_height_ios:GlobalStyles.nav_bar_height_android,
    }}>
      {backButton}
      {inputView}
      {rightButton}
    </View>
  }

  //复用最热那里代码
  renderItem(data){

    //Alert.alert(data);
    const {theme} = this.props;
    const item = data.item;
    return <PopularItem
    theme = {theme}
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

  render(){

    const {isLoading,projectModels,showBottomButton,hideLoadingMore} = this.props.search;
    // console.log('projectModels')
    // console.log(projectModels)
    const {theme} = this.params;
    let statusBar=null;
    if(Platform.OS === 'ios'){
      statusBar = <View style={[styles.statusBar,{backgroundColor:  theme.themeColor}]}/>
    }

    let listView = !isLoading?<FlatList
      data={projectModels}
      renderItem={data=>this.renderItem(data)}
      keyExtractor={item=>""+item.item.id} //参数item相当于projectModel
      contentInset={
        {
          bottom:45
        }
      }
      refreshControl={
        <RefreshControl
          title={'加载中'}
          // titleColor:{THEME_COLOR}
          colors={[theme.themeColor]}
          refreshing={isLoading}
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
    />:null;
    let bottomButton = showBottomButton?<TouchableOpacity
          style={[styles.bottomButton,{backgroundColor: this.params.theme.themeColor}]}
          onPress={()=>{
            this.saveKey();
          }}
          >
          <View style={{justifyContent: 'center'}}>
            <Text style={styles.title}>收下了</Text>
          </View>
    </TouchableOpacity> : null;

    let indicatorView = isLoading ? <ActivityIndicator
      style = {styles.centering}
      size = 'large'
      animating={isLoading}
    />:null;

    let resultView = <View style={{flex: 1}}>
      {indicatorView}
      {listView}
    </View>
    return (

      <View style={styles.container}>

        {statusBar}
        {this.renderNavBar()}
        {resultView}
        {bottomButton}
        <Toast ref={toast => {this.toast = toast}}/>

      </View>
      );
  }

}

const mapStateToProps = state => ({
  keys:state.language.keys,
  search:state.search,
  theme:state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
  onSearch:(inputKey,pageSize,token,favoriteDao,popularKeys,callback)=>dispatch(actions.onSearch(inputKey,pageSize,token,favoriteDao,popularKeys,callback)),
  onSearchCancel:(token) => dispatch(actions.onSearchCancel(token)),
  onLoadMoreSearch:(pageIndex,pageSize,dataArray,favoriteDao,callback)=>dispatch(actions.onLoadMoreSearch(pageIndex,pageSize,dataArray,favoriteDao,callback)),
  onLoadLanguage:(flag) => dispatch(actions.onLoadLanguage(flag)),

});

export default connect(mapStateToProps,mapDispatchToProps)(SearchPage);

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
  statusBar:{
    height: 20
  },
  bottomButton:{
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    height: 40,
    position: 'absolute',
    left: 10,
    right: 10,
    borderRadius: 3,
    top:GlobalStyles.window_height - 45,
  },
  indicatorContainer: {
      alignItems: "center"
  },
  indicator: {
      color: 'red',
      margin: 10
  },
  textInput: {
      flex: 1,
      height: (Platform.OS === 'ios') ? 26 : 36,
      borderWidth: (Platform.OS === 'ios') ? 1 : 0,
      borderColor: "white",
      alignSelf: 'center',
      paddingLeft: 5,
      marginRight: 10,
      marginLeft: 5,
      borderRadius: 3,
      opacity: 0.7,
      color: 'white',
  },
  title: {
      fontSize: 18,
      color: "white",
      fontWeight: '500'
  },
  centering: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
  },
});
