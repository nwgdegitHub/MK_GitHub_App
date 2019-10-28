//因为最热和趋势里面都有数据处理 所以可以抽取到共同的类中
import ProjectModel from '../model/ProjectModel';
import Utils from '../util/Utils';

export function handleData(actionType,dispatch,storeName,data,pageSize,favoriteDao,params){
  let fixItems = [];
  if(data && data.data){
    if(Array.isArray(data.data)){
      fixItems = data.data;
    }else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items;
    }

  }

  let showItems = pageSize>fixItems.length?fixItems:fixItems.slice(0,pageSize);//第一次要显示的数据
     _projectModels(showItems,favoriteDao,projectModels=>{

        dispatch({
          type:actionType,
          items:fixItems,
          projectModes:projectModels,
          storeName, //ES6可以直接这么写
          pageIndex:1,
          ...params,
        })
  });


}

//通过favoriteDao对showItems的处理 得到一个知道收藏状态的projectModels
export async function _projectModels(showItems,favoriteDao,callback){
  // debugger
  let keys=[];
  try{
    keys = await favoriteDao.getFavoriteKeys();//async+await异步调用转同步

  }
  catch(e){
    console.log(e);
  }
  let projectModels = [];
  for(let i = 0,len = showItems.length;i<len;i++){
    projectModels.push(new ProjectModel(showItems[i],Utils.checkFavorite(showItems[i],keys)))
  }
  // console.log(doCallBack);
  //doCallBack(callBack,projectModels);
  callBack(projectModels);
}

// export function doCallBack(callBack,object){
//   if(typeof callBack === 'function'){
//     callBack(object);
//   }
// }


export const doCallBack = (callBack,object) => {

  if(typeof callBack === 'function'){
    callBack(object);
  }
};
