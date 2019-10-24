import Types from '../types'
import DataStore,{FLAG_STORAGE} from '../../expand/dao/DataStore'
import {_projectModels,handleData} from '../ActionUtil'

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const CANCEL_TOKENS = [];

//搜索
export function onSearch(inputKey,pageSize,token,favoriteDao,popularKeys,callBack){
  return dispatch=>{
    dispatch({type:Types.SEARCH_REFRESH});
    fetch(genFetchUrl(inputKey)).then(response=>{
      return hasCancel(token,true)?null:response.json();
    })
    .then(responseData=>{
      if(hasCancel(token)){
        console.log('用户取消')
        return;
      }
      if(!responseData||!responseData.items||responseData.items.length===0){
        dispatch({type:Types.SEARCH_FAIL,message:`没找到关于${inputKey}的信息`});
        doCallBack(callBack,`没找到关于${inputKey}的信息`);
        return;
      }
      let items=responseData.items;
      handleData(Types.SEARCH_REFRESH_SUCCESS,dispatch,"",{data:item},pageSize,favoriteDao,
      {
        showBottomButton:!checkKeyIsExist(popularKeys,inputKey),
        inputKey,
      });
    })
    .catch(e=>{
      console.log(e);
      dispatch({type:Types.SEARCH_FAIL,error:e});
    })

  }
}


//生成搜索url
function genFetchUrl(key){
  return API_URL + key + QUERY_STR;
}

//是否取消（取消并不是取消请求 而是取消对请求结果的处理）
function hasCancel(token,isRemove){
  if(CANCEL_TOKENS.includes(token)){
    isRemove&&ArrayUtil.remove(CANCEL_TOKENS,token);
    return true;
  }
  return false;
}

//检查key是否存在于keys中
function checkKeyIsExist(keys,key){
  for(let i = 0,l=keys.length;i<l;i++){
    if(key.toLowerCase() === keys[i].name.toLowerCase())return true;
  }
  return false;
}


//取消搜索
export function onSearchCancel(token){
  return dispatch=>{
    CANCEL_TOKENS.push(token);
    dispatch({types:Types.SEARCH_CANCEL});
  }
}

//上拉加载更多
function onLoadMoreSearch(pageIndex,pageSize,dataArray = [],favoriteDao,callBack){
  return dispatch => {
    setTimeout(()=>{
      if((pageIndex-1)*pageSize>=dataArray.length){
        if(typeof callBack === 'function'){
          callBack('没有更多了')
        }
        dispatch({
          type:Types.POPULAR_LOAD_MORE_FAIL,
          error:'没有更多了'，
          pageIndex:--pageIndex,
        })
      }
      else{
        //本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max),favoriteDao,data=>{
            dispatch({
                type: Types.POPULAR_LOAD_MORE_SUCCESS,
                storeName,
                pageIndex,
                projectModes: data, //此处不要改成projectModels 上拉更多有问题 对应page中从store中取出data={store.projectModes}
            })
        })
      }
    },500)
  }
}
