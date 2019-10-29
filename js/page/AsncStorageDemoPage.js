import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,

} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
const KEY="save_key";
export default class AsncStorageDemoPage extends Component {
  constructor(props){
    super(props);
    this.state={
      showText:''
    }
  }

  render(){
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <Text>'FetchDemoPage'</Text>

        <TextInput
          style={styles.input}
          onChangeText={text => {
            this.value = text;
          }}
          />

        <View style={styles.input_container}>
          <Text onPress={()=>{
            this.doSave();
          }}>存储
          </Text>

          <Text onPress={()=>{
            this.doRemove();
          }}>删除
          </Text>

          <Text onPress={()=>{
            this.getData();
          }}>读取
          </Text>


        </View>

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
