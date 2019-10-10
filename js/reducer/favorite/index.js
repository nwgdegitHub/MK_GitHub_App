import Types from '../../action/types';

const defaultState = {};

/*
favorite:{
    popular:{
    projectModels:[],
    isLoading:false,
  },
  trending:{
  projectModels:[],
  isLoading:false,
}
...
}
*/
export default function onAction(state=defaultState,action){
  switch(action.type){
    case Types.FAVORITE_LOAD_DATA://下拉刷新成功
        return {
          ...state,//生成旧state的副本
          [action.storeName]:{
            ...state[action.storeName],
            isLoading:true,

          },
        };
    case Types.FAVORITE_LOAD_SUCCESS://下拉刷新
        return {
          ...state,//生成旧state的副本
          [action.storeName]:{
            ...state[action.storeName],
            isLoading:false,
            projectModes:action.projectModes,
          },
        };
    case Types.FAVORITE_LOAD_FAIL://下拉刷新失败
        return {
          ...state,//生成旧state的副本
          [action.storeName]:{
            ...state[action.storeName],
            isLoading:false,

          },
        };

    default:
      return state;
  }
}
