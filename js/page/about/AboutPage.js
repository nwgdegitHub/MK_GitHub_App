import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,Linking,
} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
const THEME_COLOR = '#678';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MORE_MENU} from '../../common/MORE_MENU';

import GlobalStyles from '../../res/styles/GlobalStyles'
import ViewUtil from '../../util/ViewUtil'
import WebViewPage from '../WebViewPage'
import NavigationUtil from '../../navigator/NavigationUtil';
import AboutCommon,{FLAG_ABOUT} from './AboutCommon'
//导入一个本地json文件成一个对象
import github_app_config from '../../res/data/github_app_config'

export default class AboutPage extends Component {

  constructor(props){
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation:this.props.navigation,
      flagAbout:FLAG_ABOUT.flag_about,
    },data=>this.setState({...data}));
    this.state={
      data:github_app_config,
    }
  }
//处理item点击事件
  onClick(menu){
    let RouteName,params = {};
    switch(menu){
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = '教程';
        params.url = 'https://www.imooc.com/u/index/allcourses';
        break;
      case MORE_MENU.Feedback:
        const url = 'liuw_flexi@163.com';
        Linking.canOpenURL(url)
          .then(support=>{ //模拟器中无法打开
            if(!support){
              console.log('Can\'t handle url :' + url);
            }
            else
            {
              Linking.openURL(url);
            }
          })
          .catch(e=>{
            console.log(e);
          })
        break;

      case MORE_MENU.About_Author:
        RouteName = 'AboutAuthorPage';
    
        break;

    }
    if(RouteName){
      NavigationUtil.goPage(params,RouteName);
    }
  }
  //使用封装的item
  getItem(menu){
    return ViewUtil.getMenuItem(()=>this.onClick(menu),menu,THEME_COLOR);
  }

  render(){
    const content = <View>
      {this.getItem(MORE_MENU.Tutorial)}
      <View style={GlobalStyles.line}/>
      {this.getItem(MORE_MENU.About_Author)}
      <View style={GlobalStyles.line}/>
      {this.getItem(MORE_MENU.Feedback)}
    </View>

    return this.aboutCommon.render(content,this.state.data.app);

  }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30
    },
    about_left: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    item: {
        backgroundColor: 'white',
        padding: 10,
        height: 90,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    groupTitle: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 12,
        color: 'gray'
    }
});
// <Text style={styles.welcome}></Text>
//
// <View style={styles.container}>
//   <Text style={styles.text}>'MyPage'</Text>
//   <Button
//     title='改变主题色'
//     onPress={()=>{
//       navigation.setParams({
//         theme:{
//           tintColor:'blue',
//           updateTime: new Date().getTime()
//         }
//       })
//     }}
//   />
//   <Text style={styles.text} onPress={()=>{
//       NavigationUtil.goPage({
//         navigation:this.props.navigation
//       },"DetailPage")
//   }}>'跳转至详情页'</Text>
//   <Button
//     title={"Fetch使用"}
//     onPress={()=>{
//       NavigationUtil.goPage({
//         navigation:this.props.navigation
//       },"FetchDemoPage")
//     }}
//   />
//   <Button
//     title={"AsncStorage使用"}
//     onPress={()=>{
//       NavigationUtil.goPage({
//         navigation:this.props.navigation
//       },"AsncStorageDemoPage")
//     }}
//   />
//   <Button
//     title={"离线缓存使用"}
//     onPress={()=>{
//       NavigationUtil.goPage({
//         navigation:this.props.navigation
//       },"DataStoreDemoPage")
//     }}
//   />
// </View>
