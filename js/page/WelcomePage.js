import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import NavigationUtil from '../navigator/NavigationUtil.js'

export default class WelcomePage extends Component {

  componentDidMount(){
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
