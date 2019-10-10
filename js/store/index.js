import {applyMiddleware,createStore} from 'redux'
import thunk from 'redux-thunk'
import reducers from '../reducer'
import {middleware} from '../navigator/AppNavigator'

// 如何自定义中间件
const logger = store => next => action => {
  if(typeof action === 'function'){
    console.log('dispatch a function');
  }
  else{
    console.log('dispatching',action);
  }
  const result = next(action);
  console.log('nextState',store.getState());

}

const middlewares = [
  middleware,
  logger,
  thunk,//暂时没用到
];

export default createStore(reducers,applyMiddleware(...middlewares));
