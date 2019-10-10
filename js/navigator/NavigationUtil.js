
/**
*全局导航跳转工具类  等静态方法
*/

export default class NavigationUtil {

  //去详情
  static goPage(params,page){

    const navigation = NavigationUtil.navigation;

    if (!navigation) {
      debugger;
      return;
    }
    navigation.navigate(
      page,
      {
        ...params
      }
    );
  }

  //提供返回上一页
  static goBack(navigation){
    navigation.goBack();
  }

  //去首页
  static resetToHomePage(params){
    const {navigation}=params;
    navigation.navigate('Main');
  }
}
