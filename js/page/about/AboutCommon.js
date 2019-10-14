import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
const window = Dimensions.get('window');


import BackPressComponent from '../../common/BackPressComponent'
import NavigationUtil from '../../navigator/NavigationUtil'
//导入一个本地json文件成一个对象
import github_app_config from '../../res/data/github_app_config'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
const THEME_COLOR = '#678'
import GlobalStyles from '../../res/styles/GlobalStyles'

export const FLAG_ABOUT = {flag_about:'about',flag_about_me:'about_me'};
import ViewUtil from '../../util/ViewUtil'

export default class AboutCommon{
  constructor(props,updateState){//updateState是一个函数对象
    this.props=props;
    this.updateState = updateState;
    this.backPress = new BackPressComponent({});
  }
  onBackPress(){
    NavigationUtil.goBack(this.props.navigation);
    return true;
  }

  componentDidMount(){
    this.backPress.componentDidMount();
    //
    fetch('http://www.devio.org/io/GitHubPopular/json/github_app_config.json')
      .then(
        response=>{
          if(response.ok){
            return response.json();
          }
          throw new Error('Net Error');
        }
      )
      .then(
        config=>{
          console.log(config)
          if(config){
            this.updateState({
              data:config
            })
          }
        }
      )
      .catch(e=>{
        console.log(e);
      })
  }

  componentWillUnmount(){
    this.backPress.componentWillUnmount();
  }

  getParallaxRenderConfig(params){

    let config = {};
    let avtar = typeof(params.avtar)=== 'string' ? {uri: params.avtar} : params.avtar
    config.renderBackground=()=>(
      <View key="background">
          <Image source={{uri: params.backgroundImg,width: window.width,height: PARALLAX_HEADER_HEIGHT}}/>
          <View style={{position: 'absolute',
                        top: 0,
                        width: window.width,
                        backgroundColor: 'rgba(0,0,0,.3)',
                        height: PARALLAX_HEADER_HEIGHT}}/>
      </View>
    );
    config.renderForeground = ()=>(
      <View key="parallax-header" style={ styles.parallaxHeader }>
                <Image style={ styles.avatar }
                  source={avtar}

                />
                <Text style={ styles.sectionSpeakerText }>
                  {params.name}
                </Text>
                <Text style={ styles.sectionTitleText }>
                  {params.description}
                </Text>
              </View>
    );


    config.renderFixedHeader=() => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtil.getLeftBackButton(()=>NavigationUtil.goBack(this.props.navigation))}
        {ViewUtil.getShareButton(()=>this.onShare())}
      </View>
    );

    return config;
  }

  onShare(){

  }

  render(contentView,params){
    const renderConfig = this.getParallaxRenderConfig(params);
    return (<ParallaxScrollView
      backgroundColor={THEME_COLOR}
      contentBackgroundColor={GlobalStyles.backgroundColor}
      parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
      stickyHeaderHeight={STICKY_HEADER_HEIGHT}
      backgroundScrollSpeed={10}
      {...renderConfig}
      >
      {contentView}
    </ParallaxScrollView>);

    }

}

const PARALLAX_HEADER_HEIGHT = 270;
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios')?GlobalStyles.nav_bar_height_ios + 20 : GlobalStyles.nav_bar_height_android;
const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    width: 300,
    justifyContent: 'flex-end'
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10
  },
  fixedSection: {
    position: 'absolute',
    left:0,
    right: 0,
    top:0,
    bottom:0,
    paddingRight: 8,
    paddingTop: (Platform.OS === 'ios'?20:0),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20,
    alignItems: 'center',
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
    marginBottom: 10,
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10,
  },

});
