import {combineReducers} from 'redux'
import theme from './theme'
import popular from './popular' //导入popular reducer
import trending from './trending'
import favorite from './favorite'
import language from './language'
import search from './search'
import {rootCom,RootNavigator} from '../navigator/AppNavigator';

//1.指定默认state
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));

//2.创建自己的navigation reducer
const navReducer = (state = navState,action) => {
  const nextState = RootNavigator.router.getStateForAction(action,state);
  return nextState || state;
};

//3.合并reducer  因为只允许有一个根reducer
const index = combineReducers({
  nav:navReducer,
  theme:theme,
  popular:popular,
  trending:trending,
  favorite:favorite,
  language:language,
  search:search,
});

export default index;
