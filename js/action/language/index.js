import Types from '../types'
import LanguageDao,{FLAG_STORAGE} from '../../expand/dao/LanguageDao'



//获取最热数据的异步action
export function onLoadLanguage(flagKey){
  return async dispatch => {
    try {

      let languages = await new LanguageDao(flagKey).fetch();

      dispatch({type:Types.LANGUAGE_LOAD_SUCCESS,languages:languages,flag:flagKey});
      
    }
    catch(e){
      console.log(e)
    }
  }
}
