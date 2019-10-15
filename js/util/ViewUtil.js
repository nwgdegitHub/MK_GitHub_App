import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  Text,
  ViewPropTypes,
  StatusBar,
  Platform,
  Alert,
  Modal,
  TouchableOpacity,
  DeviceInfo,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ViewUtil{

  //获取设置页item
  static getSettingItem(callBack,text,color,Icons,icon,expandableIco){
    return (<TouchableOpacity
    onPress={callBack}
    style={{
      backgroundColor: 'white',
      padding: 10,
      height: 60,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
    }}>
    <View style={{alignItems: 'center',flexDirection: 'row'}}>
      {
        Icons&&icon?<Icons
          name={icon}
          size={16}
          style={{color:color,marginRight: 10}}
        />:<View style={{
          opacity: 1,width: 16,height: 16,marginRight: 10,
        }}/>

      }
      <Text>{text}</Text>
    </View>
    <Ionicons
      name={expandableIco?expandableIco:'ios-arrow-forward'}
      size={16}
      style={{marginRight: 10,color: color || 'color',alignSelf: 'center'}}
    />
    </TouchableOpacity>);
  }

  //获取设置页item
  static getMenuItem(callBack,menu,color,expandableIco){
    return ViewUtil.getSettingItem(callBack,menu.name,color,menu.Icons,menu.icon);
  }

  //获取左侧返回按钮
  static getLeftBackButton(callback){
    return <TouchableOpacity
      style={{padding: 8,paddingLeft: 12}}
      onPress={callback}
    >
    <Ionicons
      name={'ios-arrow-back'}
      size={26}
      style={{color:'white'}}
    />

    </TouchableOpacity>
  }

  //获取分享按钮getShareButton
  static getShareButton(callback){
    return <TouchableOpacity
      style={{padding: 8,paddingLeft: 12}}
      onPress={callback}
    >
    <Ionicons
      name={'md-share'}
      size={20}
      style={{color:'white',opacity: 0.9,marginRight: 10}}
    />

    </TouchableOpacity>
  }

  //获取右侧文字按钮
  static getRightButton(title,callBack){
    return <TouchableOpacity
      style={{alignItems: 'center'}}
      onPress={callback}
    >
    <Text style={{fontSize: 20,color: '#FFFFFF',marginRight: 10}}>{title}</Text>
    </TouchableOpacity>
  }
}
