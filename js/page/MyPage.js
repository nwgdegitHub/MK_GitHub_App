import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
const THEME_COLOR = '#678';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MORE_MENU} from '../common/MORE_MENU';

import GlobalStyles from '../res/styles/GlobalStyles'
import ViewUtil from '../util/ViewUtil'
import WebViewPage from './WebViewPage'
import NavigationUtil from '../navigator/NavigationUtil';
import AboutAuthorPage from './about/AboutAuthorPage'
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import {connect} from 'react-redux';
import actions from '../action/index'; //此处导入actions是一种用法 其实在index.js中并没有actions 定义任意对象名都行

class MyPage extends Component {


//处理item点击事件
  onClick(menu){
    let RouteName,params = {};
    switch(menu){

      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = '教程';
        params.url = 'https://www.imooc.com/u/index/allcourses';
        break;

      case MORE_MENU.About:
        RouteName = 'AboutPage';
        break;

      case MORE_MENU.About_Author:
        RouteName = 'AboutAuthorPage';
        break;

      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
          RouteName = 'CustomKeyPage';
          RouteName = 'CustomKeyPage';
          params.isRemoveKey = menu === MORE_MENU.Remove_Key;
          params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language;
          break;

      case MORE_MENU.Sort_Key:
        RouteName = 'SortKeyPage';
        params.flag=FLAG_LANGUAGE.flag_key;
        break;

      case MORE_MENU.Sort_Language:
        RouteName = 'SortKeyPage';
        params.flag=FLAG_LANGUAGE.flag_language;
        break;

      case MORE_MENU.Custom_Theme:
        RouteName = 'CustomTheme';
        const {onShowCustomThemeView}=this.props;
        onShowCustomThemeView(true);
        break;

    }
    if(RouteName){
      NavigationUtil.goPage(params,RouteName);
    }
  }

  //使用封装的item
  getItem(menu){
    const {theme} = this.props;
    return ViewUtil.getMenuItem(()=>this.onClick(menu),menu,theme.themeColor);
  }

  render(){
    //const {navigation} = this.props;
    const {theme} = this.props;
    let statusBar={
      barStyle:'default',
      backgroundColor:THEME_COLOR,
    };
    let navigationBar = <NavigationBar title={'我的'}
    statusBar={statusBar}
    style={theme.styles.navBar}

    />;

    return (
      <View style={GlobalStyles.root_container}>

        {navigationBar}
        <ScrollView>
          <TouchableOpacity
          onPress={()=>this.onClick(MORE_MENU.About)}
          style={{
            backgroundColor: 'white',
            padding: 10,
            height:90,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
          >
            <View style={{alignItems: 'center',flexDirection: 'row'}}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{marginRight: 10,color: theme.themeColor}}
              />
              <Text>GitHub Popular</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{marginRight: 10,color: theme.themeColor,alignSelf: 'center'}}
            />
          </TouchableOpacity>

          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Tutorial)}

          {/*趋势管理*/}
          <Text style={{
            marginLeft: 10,
            marginTop:10,
            marginBottom: 5,
            fontSize: 12,
            color: 'gray',
          }}>趋势管理</Text>

          {/*自定义语言*/}
          {this.getItem(MORE_MENU.Custom_Language)}

          {/*语言排序*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*最热管理*/}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/*自定义标签*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          {/*标签排序*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Sort_Key)}
          {/*标签移除*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          {/*自定义主题*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          {/*关于作者*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line}/>
          {/*反馈*/}
          {this.getItem(MORE_MENU.Feedback)}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.CodePush)}
        </ScrollView>

      </View>
      );

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

const mapStateToProps = state => ({

  theme:state.theme.theme,
});

const mapDispatchToProps = dispatch =>  ({
  onShowCustomThemeView:(show)=>dispatch(actions.onShowCustomThemeView(show))
});

export default connect(mapStateToProps,mapDispatchToProps)(MyPage);

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
