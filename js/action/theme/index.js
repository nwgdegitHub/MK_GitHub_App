import Types from '../types'
import ThemeDao from '../../expand/dao/ThemeDao'

// 主题变更
export function onThemeChange(theme){
  return {
    type: Types.THEME_CHANGE,
    theme:theme
  }
}


//初始化主题
export function onThemeInit(){
  
  return dispatch => {
    new ThemeDao().getTheme()
    .then((data)=>{
      dispatch(onThemeChange(data))
    })
  }
}

//弹出主题框创建函数
export function onShowCustomThemeView(show){
  return {type:Types.SHOW_THEME_VIEW,customThemeViewVisible:show};
}
