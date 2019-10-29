import Types from '../types'
import DataStore,{FLAG_STORAGE} from '../../expand/dao/DataStore'
import {_projectModels,handleData} from '../ActionUtil'

//获取最热数据的异步action
export function onLoadTrendingData(storeName,url,pageSize,favoriteDao){
  return dispatch=>{
    dispatch({type:Types.TRENDING_REFRESH,storeName:storeName});
    let dataStore = new DataStore();
    dataStore.fetchData(url,FLAG_STORAGE.flag_trending)//异步action与数据流
            .then(data=>{

              handleData(Types.TRENDING_REFRESH_SUCCESS,dispatch,storeName,data,pageSize,favoriteDao)
            })
            .catch(error=>{
              console.log(error);
              dispatch({
                type: Types.TRENDING_REFRESH_FAIL,
                storeName,
                error,
              });
            })

  }
}

//上啦加载跟多 模拟分页
export function onLoadMoreTrendingData(storeName,pageIndex,pageSize,dataArray=[],favoriteDao,callback){
  return dispatch => {
    setTimeout(()=>{ //模拟网络请求
      if((pageIndex-1)*pageSize>=dataArray.length){//已加载完全部数据
        if(typeof callback === 'function'){
          callback('no more')
        }
        dispatch({
          type:Types.TRENDING_REFRESH_FAIL,
          error:'no more',
          storeName:storeName,
          pageIndex:--pageIndex,
          //projectModes:dataArray
        })
      }
      else
      {
        //本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max),favoriteDao,data=>{
            dispatch({
                type: Types.TRENDING_LOAD_MORE_SUCCESS,
                storeName,
                pageIndex,
                projectModels: data, //此处不要改成projectModels 上拉更多有问题 对应page中从store中取出data={store.projectModes}
            })
        })
      }
    },2000);
  }
}
//刷新收藏状态
export function onFlushTrendingFavorite(storeName,pageIndex,pageSize,dataArray = [],favoriteDao){
  return dispatch => {
    //本次和载入的最大数量
    let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
    _projectModels(dataArray.slice(0, max),favoriteDao,data=>{
        dispatch({
            type: Types.TRENDING_FLUSH_FAVORITE,
            storeName,
            pageIndex,
            projectModels: data, //此处不要改成projectModels 上拉更多有问题 对应page中从store中取出data={store.projectModes}
        })
    })


  }
}
