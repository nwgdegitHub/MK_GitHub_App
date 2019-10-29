import AsyncStorage from '@react-native-community/async-storage';

//导入贾老师写的趋势页面接口
import GitHubTrending from 'GitHubTrending';

//定义一个标识 请求最热或者趋势
export const  FLAG_STORAGE = {flag_popular:'popular',flag_trending:'trending'};


export default class DataStore{

  // 保存数据
  saveData(url,data,callback){
    if(!data || !url) return;
    AsyncStorage.setItem(url,JSON.stringify(this._wrapData(data)),callback);
  }
  _wrapData(data){
    return {data:data, timestamp:new Date().getTime()};
  }
  //获取本地数据
  fetchLocalData(url){
    return new Promise((resolve,reject) => {
      AsyncStorage.getItem(url,(error,result) => {
        if(!error){
          try{
            resolve(JSON.parse(result));
          }
          catch(e){
            reject(e);
            console.error(e);
          }
        }
        else {
          reject(error);
          console.error(error);
        }
      })
    })
  }


  //离线缓存的入口
  fetchData(url,flag){

    return new Promise((resolve,reject) => {
      this.fetchLocalData(url)
          .then((wrapData) => {
              if(wrapData && DataStore.chekTimestampValid(wrapData.timestamp)){
                resolve(wrapData);
              }
              else{
                this.fetchNetData(url,flag)
                    .then((data)=>{
                      resolve(this._wrapData(data));
                      })
                    .catch((error)=>{
                      reject(error);
                    })
                  }
          })
          .catch((error)=>{
            this.fetchNetData(url,flag)
                .then((data)=>{
                  resolve(this._wrapData(data));
                })
                .catch((error=>{
                  reject(error);
            }))
          })
      })
  }

  //本地缓存数据有效期检查
  static chekTimestampValid(timestamp){
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    if(currentDate.getMonth() !== targetDate.getMonth()) return false;
    if(currentDate.getDate() !== targetDate.getDate()) return false;
    if(currentDate.getHours() - targetDate.getHours() > 4) return false;

    return true;
  }

  //获取网络数据
  fetchNetData(url,flag){
    return new Promise((resolve,reject)=>{

      if(flag !== FLAG_STORAGE.flag_trending){
        fetch(url)
              .then((response)=>{
                if(response.ok){
                  return response.json();
                }
                throw new Error('Network response not ok');
              })
              .then((responseData)=>{
                this.saveData(url,responseData)
                resolve(responseData);
              })
              .catch((error)=>{
                reject(error);
              })
      }
      else
      {

          new GitHubTrending().fetchTrending(url)

                .then(items=>{
                  console.log(items)
                  if(!items){
                    throw new Error('error');
                  }
                  this.saveData(url,items);
                  resolve(items);//回调数据

                })
                .catch(error=>{
                  console.log('error')
                  console.log(error)
                  reject(error);
                })
      }

    })
  }
}
