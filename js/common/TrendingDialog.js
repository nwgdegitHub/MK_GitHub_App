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
  Modal,
  TouchableOpacity,
  DeviceInfo,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSpan from '../model/TimeSpan';


//定义弹窗常量
export const TimeSpans = [
  new TimeSpan('今天','since=daily'),
  new TimeSpan('本周','since=weekly'),
  new TimeSpan('本月','since=monthly')];



export default class TrendingDialog extends Component{
  //初始化state也可以这么写
  state={
    visible:false,
  };

  // constructor(props){
  //   super(props);
  //   this.state={
  //     visible:false,
  //   }
  // }

  //TrendingDialog 组件显示
  show(){
    this.setState({
      visible:true,
    })
  };

  //TrendingDialog 组件关闭
  dismiss(){
    this.setState({
      visible:false,
    })
  };

  render(){
    const {onClose,onSelect} = this.props;
    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        onRequestClose={()=>onClose}>

        <TouchableOpacity
          style={{backgroundColor: 'rgba(0,0,0,0.6)',
                  flex: 1,
                  alignItems: 'center',
                  paddingTop: DeviceInfo.isIPhoneX_deprecated?30:0,
                }}
          onPress={()=>this.dismiss()}>
          <MaterialIcons
            name={'arrow-drop-up'}
            size={36}
            style={{marginTop: 40,
                    color: 'white',
                    padding: 0,
                    margin: -15,
            }}
          />
          {/*今天 本周 本月*/}
          <View style={{backgroundColor: 'white',
                        borderRadius: 3,
                        paddingTop: 3,
                        paddingBottom: 3,
                        marginRight: 3,
                      }}>
            {TimeSpans.map((result,i,arr)=>{
                return <TouchableOpacity
                          key={i}
                          onPress={()=>onSelect(arr[i])}
                          underlayColor='transparent'>
                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                              <Text style={{
                                fontSize: 16,
                                color:'black',
                                fontWeight: '400',
                                padding: 8,
                                paddingLeft: 26,
                                paddingRight: 26,
                              }}>{arr[i].showText}</Text>
                            </View>
                            {/* 下划线*/}
                            {i!==TimeSpans.length-1?<View style={{height: 1,backgroundColor: 'black'}}></View>:null}
                </TouchableOpacity>

            })}

          </View>
        </TouchableOpacity>

      </Modal>
    )

  }

}
