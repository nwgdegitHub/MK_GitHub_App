import Types from '../../action/types';

const defaultState = {
  showText:'搜索',
  items:[],
  isLoading:false,
  projectModes:[],
  hideLoadingMore:true,
  showBottomButton:false,
};

/*
popular:{
    java:{
    items:[],
    isLoading:false,
  },
  ios:{
  items:[],
  isLoading:false,
}
...
}
*/
export default function onAction(state=defaultState,action){

  switch(action.type){
    case Types.SEARCH_REFRESH://下拉刷新成功
        return {
          ...state,//生成旧state的副本
          isLoading:true,
          hideLoadingMore:true,
          showBottomButton:false,
        };
    case Types.SEARCH_REFRESH_SUCCESS://下拉刷新
        return {
          ...state,//生成旧state的副本
          isLoading:false,
          hideLoadingMore:false,
          showBottomButton:action.showBottomButton,
          items:action.items,
          projectModels:action.projectModels,
          pageIndex:action.pageIndex,
          showText:'搜索',
          inputKey:action.inputKey,

        };
    case Types.SEARCH_FAIL://下拉刷新失败
        return {
          ...state,//生成旧state的副本
          isLoading:false,
          showText:'搜索',
        };

    case Types.SEARCH_CANCEL:
        return {
          ...state,//生成旧state的副本
          isLoading:false,
          showText:'搜索',
        };
    //上拉加载更多成功
    case Types.SEARCH_LOAD_MORE_SUCCESS:
        return {
          ...state,//生成旧state的副本
          hideLoadingMore:false,
          projectModels:action.projectModels,
          pageIndex:action.pageIndex,

        };

    case Types.SEARCH_LOAD_MORE_FAIL://上拉加载更多失败
        return {
          ...state,//生成旧state的副本
          hideLoadingMore:true,
          pageIndex:action.pageIndex,
        };

    default:
      return state;
  }
}
