import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import NavigationUtil from '../navigator/NavigationUtil.js'
import {connect} from 'react-redux';
import actions from '../action/index'; //此处导入actions是一种用法 其实在index.js中并没有actions 定义任意对象名都行

class WelcomePage extends Component {

  componentDidMount(){
    this.props.onThemeInit();//初始化主题
    this.timer=setTimeout(()=>{
      NavigationUtil.resetToHomePage({
        navigation:this.props.navigation
      });
    },200);//停留0.2s进入首页
  }

  componentWillMount(){
    this.timer&&clearTimeout(this.timer);
  }

  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.text}>"WelcomePage"</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  text:{

    alignItems: 'center'
  }
});

const mapDispatchToProps = dispatch => ({
    onThemeInit: () => dispatch(actions.onThemeInit()),
});

export default connect(null, mapDispatchToProps)(WelcomePage);
