import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  DeviceInfo,
  TouchableOpacity
} from 'react-native';


import NavigationBar from '../common/NavigationBar';

import ViewUtil from '../util/ViewUtil';

const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from '../navigator/NavigationUtil';
import { WebView } from 'react-native-webview';
import BackPressComponent from '../common/BackPressComponent';

import FavoriteDao from '../expand/dao/FavoriteDao';

export default class DetailPage extends Component {

  //因为导航栏标题是动态的
  constructor(props){
    super(props);
    // 取出必要参数
    this.params = this.props.navigation.state.params;
    const {projectModel,flag} = this.params;//flag 表示是从哪个模块进来的
    this.favoriteDao = new FavoriteDao(flag);
    this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
    const title = projectModel.item.full_name||projectModel.item.fullName;
    this.state={
      title:title,
      url:this.url,
      canGoBack:false,
      isFavorite:projectModel.isFavorite,
    };
    this.backPress = new BackPressComponent({backPress:()=>this.onBackPress()});
  }

  componentDidMount(){
    this.backPress.componentDidMount();
  }
  componentWillUnmount(){
    this.backPress.componentWillUnmount();
  }
  // onBackPress(){
  //   this.onBack();
  //   return true;
  // }

  goBack(){
    if(this.state.canGoBack){//webView里面可以返回倒上一页
      this.webView.goBack();
    }
    else{
       NavigationUtil.goBack(this.props.navigation);
    }
  }
  onFavoriteButtonClick(){
    const {projectModel,callback}=this.params;
    const isFavorite=projectModel.isFavorite=!projectModel.isFavorite;
    callback(isFavorite);//更新外面列表的收藏状态
    this.setState({
      isFavorite:isFavorite,
    })
    let key = projectModel.item.fullName?projectModel.item.fullName:projectModel.item.id.toString();
    if(projectModel.isFavorite){
      this.favoriteDao.saveFavoriteItem(key,JSON.stringify(projectModel.item));
    }
    else{
      this.favoriteDao.removeFavoriteItem(key);
    }
  }

  renderRightButton(){
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={()=>this.onFavoriteButtonClick()}>
          <FontAwesome
            name={this.state.isFavorite?'star':'star-o'}
            size={20}
            style={{color: 'white',padding: 8,paddingLeft: 12}}
          />
        </TouchableOpacity>
        {ViewUtil.getShareButton(()=>{})}
      </View>
    )
  }

  onNavigationStateChange(navState){
    this.setState({
      canGoBack:navState.canGoBack,
      url:navState.url,
    })
  }

  render(){

    let statusBar={
      barStyle:'default',
      backgroundColor:THEME_COLOR,
    };
    //标题如果过长 需要设置右边的内边距
    const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight : 30} : null;
    let navigationBar = <NavigationBar
    leftButton={ViewUtil.getLeftBackButton(()=>this.goBack())}
    title={this.state.title}
    statusBar={statusBar}
    style={{backgroundColor: THEME_COLOR}}
    rightButton={this.renderRightButton()}
    titleLayoutStyle={titleLayoutStyle}
    />;

    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView=>this.webView=webView}
          startInLoadingState={true}
          onNavigationStateChange={e=>this.onNavigationStateChange(e)}
          source={{uri:this.state.url}}
        />
      </View>
      );
  }
}
const styles = StyleSheet.create({
  container:{
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor:'#F5FCFF',
    marginTop: DeviceInfo.isIPhoneX_deprecated?30:0,

  },
  text:{
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
