import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  AsyncStorage,
} from 'react-native';

import DataStore from '../expand/dao/DataStore'

const KEY="save_key";
export default class DataStoreDemoPage extends Component {
  constructor(props){
    super(props);
    this.state={
      showText:''
    }
    this.dataDStore=new DataStore();
  }

  loadData(){
    let url = `https://api.github.com/search/repositories?q=${this.value}`;
    this.dataDStore.fetchData(url)
        .then(data=>{
          let showData=`初次数据加载时间:${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`;
          this.setState({
            showText:showData
          })
        })
        .catch(error=>{
          error && console.log(error.toString());
        })
  }

  render(){
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <Text>'离线缓存框架设计'</Text>

        <TextInput
          style={styles.input}
          onChangeText={text => {
            this.value = text;
          }}
          />

          <Text onPress={()=>{
            this.loadData();
          }}>'loadData'
          </Text>

        <Text>
        {this.state.showText}
        </Text>

      </View>
      );
  }

  doSave(){
    //方式1
    AsyncStorage.setItem(KEY,this.value,error=>{
      error && console.log(error.toString());
    });
    // //方式2
    // AsyncStorage.setItem(KEY,this.value)
    //             .catch(error=>{
    //               error && console.log(error.toString());
    //             });
    // //方式3
    // try{
    //   await AsyncStorage.setItem(KEY,this.value);
    // }
    // catch(error){
    //   error && console.log(error.toString());
    // }
  }

  doRemove(){
    //方式1
    AsyncStorage.removeItem(KEY,error=>{
      error && console.log(error.toString());
    });

    // //方式2
    // AsyncStorage.removeItem(KEY)
    //             .catch(error=>{
    //               error && console.log(error.toString());
    //             });
    // //方式3
    // try{
    //   await AsyncStorage.removeItem(KEY);
    // }
    // catch (error){
    //   error && console.log(error.toString());
    // }

  }

  getData(){
    //方式1
    AsyncStorage.getItem(KEY,(error,value)=>{
      this.setState({
        showText:value
      });
      console.log(value);
      error && console.log(error.toString);
    });

    // //方式2
    // AsyncStorage.getItem(KEY)
    //         .then(value=>{
    //           this.setState({
    //             showText:value
    //           });
    //           console.log(value);
    //         })
    //         .catch(error=>{
    //           error && console.log(error.toString);
    //         })
    // //方式3
    // try{
    //   const value = await AsyncStorage.getItem(KEY);
    //   this.setState({
    //     showText:value
    //   });
    //   console.log(value);
    // }
    // catch(error){
    //   error && console.log(error.toString());
    // }

  }

}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor:'#F5FCFF',

  },
  text:{
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input:{
    height: 30,
    //flex: 1,
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 10,
  },
  input_container:{
    flexDirection: 'row',
    justifyContent: 'center',
    justifyContent: 'space-around',
  }
});
0
