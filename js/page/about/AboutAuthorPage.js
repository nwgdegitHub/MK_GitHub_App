import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,Linking,Clipboard,
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
import Toast from 'react-native-easy-toast';
export default class AboutAuthorPage extends Component {

  constructor(props){
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation:this.props.navigation,
      flagAbout:FLAG_ABOUT.flag_about_me,
    },data=>this.setState({...data}));
    this.state={
      data:github_app_config,
      showTutorial:true,//是否展开教程
      showBlog:false,
      showQQ:false,
      showContact:false,
    }
  }
  //处理item点击事件
  onClick(tab){

    if(!tab)return;
    if(tab.url){
      NavigationUtil.goPage({
        title:tab.title,
        url:tab.url
      },'WebViewPage')
      return;
    }
    if(tab.account&&tab.account.indexOf('@')>-1){
      let url = 'mailto://' + tab.account;
      Linking.canOpenURL(url).then(
        supported=>{
          if(!supported){
            console.log('不能处理');
          }
          else{
            return Linking.openURL(url);
          }

        }
      )
      .catch(
        err=>console.error('错误')
      );
      return;
    }
    if(tab.account){
      Clipboard.setString(tab.account);
      this.toast.show(tab.title + tab.account + '已复制到剪切板')
    }
  }
  //使用封装的item
  getItem(menu){
    return ViewUtil.getMenuItem(()=>this.onClick(menu),menu,THEME_COLOR);
  }

  _item(data,isShow,key){
    return ViewUtil.getSettingItem(()=>{
      this.setState({
        [key]:!this.state[key]
      });
    },data.name,THEME_COLOR,Ionicons,data.icon,isShow?'ios-arrow-up':'ios-arrow-down');
  }

  render(){
    const content = <View>
      {/*教程*/}
      {this._item(this.state.data.aboutMe.Tutorial,this.state.showTutorial,'showTutorial')}
      <View style={GlobalStyles.line}/>
      {this.state.showTutorial?this.renderItems(this.state.data.aboutMe.Tutorial.items):null}

      {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
      <View style={GlobalStyles.line}/>
      {this.state.showBlog ? this.renderItems(this.state.data.aboutMe.Blog.items) : null}

      {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
      <View style={GlobalStyles.line}/>
      {this.state.showQQ ? this.renderItems(this.state.data.aboutMe.QQ.items, true) : null}

      {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
      <View style={GlobalStyles.line}/>
      {this.state.showContact ? this.renderItems(this.state.data.aboutMe.Contact.items, true) : null}

    </View>

    return <View style={{flex: 1}}>
      {this.aboutCommon.render(content,this.state.data.author)}
      <Toast ref={toast=>this.toast=toast} position={'center'}/>
    </View>


  }

  //显示展开列表
  renderItems(dic,isShowAccount){
    if(!dic)return null;
      let views=[];
      for (let i in dic){
        let title=isShowAccount? (dic[i].title + ':' + dic[i].account) : dic[i].title;
        views.push(
          <View key={i}>
            {ViewUtil.getSettingItem(()=>this.onClick(dic[i]),title,THEME_COLOR)}
            <View style={GlobalStyles.line}/>
          </View>
        )
      }
      return views;
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
