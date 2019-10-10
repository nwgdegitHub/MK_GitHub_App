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

export default class WebViewPage extends Component {

  //因为导航栏标题是动态的
  constructor(props){
    super(props);
    // 取出必要参数
    this.params = this.props.navigation.state.params;
    const {title,url} = this.params;
    this.state={
      title:title,
      url:url,
      canGoBack:false,
    };
    this.backPress = new BackPressComponent({backPress:()=>this.onBackPress()});
  }

  componentDidMount(){
    this.backPress.componentDidMount();
  }
  componentWillUnmount(){
    this.backPress.componentWillUnmount();
  }


  goBack(){
    if(this.state.canGoBack){//webView里面可以返回倒上一页
      this.webView.goBack();
    }
    else{
       NavigationUtil.goBack(this.props.navigation);
    }
  }


  onNavigationStateChange(navState){
    this.setState({
      canGoBack:navState.canGoBack,
      url:navState.url,
    })
  }

  render(){

    let navigationBar = <NavigationBar
    title={this.state.title}
    style={{backgroundColor: THEME_COLOR}}
    leftButton={ViewUtil.getLeftBackButton(()=>this.goBack())}
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
