import React, {Component} from 'react';
// import {PropTypes} from 'prop-types';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  ViewPropTypes,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';

//自定高度
const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = 20;


//设置状态栏所接受的属性
const StatusBarShape = {
  barStyle:PropTypes.oneOf(['light-content','default']),
  hidden:PropTypes.bool,
  backgroundColor:PropTypes.string,
}

export default class NavigationBar extends Component{

  static propTypes = {
    style: ViewPropTypes.style,
    title:PropTypes.string,
    titleView:PropTypes.element,
    titleLayoutStyle:ViewPropTypes.style,
    hide:PropTypes.bool,
    statusBar:PropTypes.shape(StatusBarShape),
    rightButton:PropTypes.element,
    leftButton:PropTypes.element,
  };

  //设置状态栏默认属性
  static defaultProps = {
    statusBar:{
      barStyle:'light-content',
      hidden:false,
    }
  };

  render(){

    let statusBar = !this.props.statusBar.hidden ?
      <View style={{height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT:0}}>
        <StatusBar {...this.props.statusBar}/>
      </View> : null;{/*传递自定义属性*/}

    let titleView = this.props.titleView ? this.props.titleView:
      <Text ellipsizeMode="head"
      numberOfLines={1}
      style={{fontSize: 20,color: 'white'}}>{this.props.title}</Text>;
      //如果没有设置就返回一个<Text>
      //ellipsizeMode是省略号的显示样式

    let content = this.props.hide ? null :
      <View style={{flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID}}>
        {this.getButtonElement(this.props.leftButton)}
        <View style={{alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      left: 40,
                      right: 40,
                      top: 0,
                      bottom: 0,
                    }}>
          {titleView}
        </View>
        {this.getButtonElement(this.props.rightButton)}
      </View>;

      return(
        <View style={[{backgroundColor: '#678'},this.props.style]}>
          {statusBar}
          {content}
        </View>
      )
  };

  getButtonElement(data){
    return(
      <View>
        {data?data:null}
      </View>
    )
  };


}
const styles = StyleSheet.create({

});
