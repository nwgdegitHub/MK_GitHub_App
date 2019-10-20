import { createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createDrawerNavigator,
  createSwitchNavigator,
 } from 'react-navigation';
import {connect} from 'react-redux';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';//
import FetchDemoPage from '../page/FetchDemoPage';//
import AsncStorageDemoPage from '../page/AsncStorageDemoPage';//
import DataStoreDemoPage from '../page/DataStoreDemoPage';//
import WebViewPage from '../page/WebViewPage';//
import AboutPage from '../page/about/AboutPage';//
import AboutAuthorPage from '../page/about/AboutAuthorPage';//CustomKeyPage
import CustomKeyPage from '../page/CustomKeyPage';//
import SortKeyPage from '../page/SortKeyPage';

import {createReactNavigationReduxMiddleware,createReduxContainer} from 'react-navigation-redux-helpers';
export const rootCom = 'Init';//设置根路由

const InitNavigator = createStackNavigator({
  WelcomePage:{
    screen:WelcomePage,
    navigationOptions:{
      header:null,
    }
  }
});

const MainNavigator = createStackNavigator({
  HomePage:{
    screen:HomePage,
    navigationOptions:{
      header:null,
    }
  },
  DetailPage:{
    screen:DetailPage,
    navigationOptions:{
      header:null,
    }
  },
  FetchDemoPage:{
    screen:FetchDemoPage,
    navigationOptions:{
      //header:null,
    }
  },
  AsncStorageDemoPage:{
    screen:AsncStorageDemoPage,
    navigationOptions:{
      //header:null,
    }
  },
  DataStoreDemoPage:{
    screen:DataStoreDemoPage,
    navigationOptions:{
      //header:null,
    }
  },
  //
  WebViewPage:{
    screen:WebViewPage,
    navigationOptions:{
      header:null,
    }
  },//
  AboutPage:{
    screen:AboutPage,
    navigationOptions:{
      header:null,
    }
  },//
  AboutAuthorPage:{
    screen:AboutAuthorPage,
    navigationOptions:{
      header:null,
    }
  },//
  CustomKeyPage:{
    screen:CustomKeyPage,
    navigationOptions:{
      header:null,
    }
  },//
  SortKeyPage:{
    screen:SortKeyPage,
    navigationOptions:{
      header:null,
    }
  },
});

//连接InitNavigator和MainNavigator

export const RootNavigator = createSwitchNavigator({
  Init:InitNavigator,
  Main:MainNavigator

},{
  navigationOptions:{
    //header:null,
  }
});

export const middleware = createReactNavigationReduxMiddleware(

  state => state.nav,
  'root',
);

const AppWithNavigationState = createReduxContainer(RootNavigator,'root');

const mapStateToProps = state => ({
  state: state.nav, // v2
});

export default connect(mapStateToProps)(AppWithNavigationState);
