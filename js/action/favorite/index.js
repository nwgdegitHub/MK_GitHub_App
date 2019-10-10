import Types from '../types'
import DataStore,{FLAG_STORAGE} from '../../expand/dao/DataStore'
import {_projectModels,handleData} from '../ActionUtil'
import FavoriteDao from '../../expand/dao/FavoriteDao';
import ProjectModel from '../../model/ProjectModel';

//获取最热数据的异步action
export function onLoadFavoriteData(flag,isShowLoading){
  
  return dispatch=>{
    if(isShowLoading){
      dispatch({type:Types.FAVORITE_LOAD_DATA,storeName:flag});
    }

    new FavoriteDao(flag).getAllItems()
        .then(items=>{
//           console.log('1')
// console.log(items)
//           console.log('2')
          let resultData = [];
          for(let i = 0,len = items.length;i<len;i++){
            resultData.push(new ProjectModel(items[i],true));
          }
          dispatch({type:Types.FAVORITE_LOAD_SUCCESS,projectModes:resultData,storeName:flag});
        })
        .catch(e=>{
          console.log(e);
          dispatch({type:Types.FAVORITE_LOAD_FAIL,error:e,storeName:flag});
        })
  }
}
