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
  DeviceInfo,ScrollView,
  TouchableHighlight,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import TimeSpan from '../model/TimeSpan';
//
//
// //定义弹窗常量
// export const TimeSpans = [
//   new TimeSpan('今天','since=daily'),
//   new TimeSpan('本周','since=weekly'),
//   new TimeSpan('本月','since=monthly')];
//
import ThemeDao from '../expand/dao/ThemeDao'
import GlobalStyles from '../res/styles/GlobalStyles'
import {connect} from 'react-redux';
import actions from '../action/index'; //此处导入actions是一种用法 其实在index.js中并没有actions 定义任意对象名都行

import ThemeFactory,{ThemeFlags} from '../res/styles/ThemeFactory'

class CustomTheme extends Component{
  constructor(props){
    super(props);
    this.themeDao = new ThemeDao();
  }

  // 点击了主题
  onSelectTheme(themeKey){
    this.props.onClose();
    this.themeDao.save(ThemeFlags[themeKey]);

    const {onThemeChange} = this.props;
    onThemeChange(ThemeFactory.createTheme(ThemeFlags[themeKey]));
  }

  getThemeItem(themeKey){
    return <TouchableHighlight style={{flex: 1}} underlayColor='white' onPress={()=>this.onSelectTheme(themeKey)}>
      <View style={{
        backgroundColor: ThemeFlags[themeKey],
        flex: 1,
        height: 120,
        margin: 3,
        padding: 3,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center'

      }}>
        <Text style={{
          color: 'white',
          fontWeight: '400',
          fontSize: 16,
        }}>{themeKey}</Text>
      </View>
    </TouchableHighlight>
  }

  renderThemeItems(){
    const views = [];

    for(let i = 0,keys = Object.keys(ThemeFlags),l = keys.length;i<l;i+=3){
      const key1 = keys[i], key2 = keys[i + 1], key3 = keys[i + 2];
      views.push(<View key={i} style={{flexDirection: 'row'}}>
        {this.getThemeItem(key1)}
        {this.getThemeItem(key2)}
        {this.getThemeItem(key3)}
      </View>)
    }
    return views;
  }

  renderContentView(){
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.props.visible}
        onRequestClose={()=>{
          this.props.onClose()
        }}
      >
          <View style={styles.modalContainer}>
            <ScrollView>
              {this.renderThemeItems()}
            </ScrollView>
          </View>
      </Modal>
    )
  }

  render(){
    let view = this.props.visible ? <View style={GlobalStyles.root_container}>
      {this.renderContentView()}
    </View>:null;
    return view;

  }


}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  onThemeChange:(theme)=>dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps,mapDispatchToProps)(CustomTheme);




const styles = StyleSheet.create({
  modalContainer:{
    flex:1,
    margin:10,marginTop: Platform.OS === 'ios' ? 20:10,
    backgroundColor: 'white',
    borderRadius: 3,
    shadowColor: 'gray',
    shadowOffset: {width: 2,height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    padding: 3,
  }
})
