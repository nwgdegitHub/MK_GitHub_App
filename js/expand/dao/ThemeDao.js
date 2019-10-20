import {AsyncStorage,} from 'react-native';
import ThemeFactory,{ThemeFlags} from '../../res/styles/ThemeFactory'
const THEME_KEY = 'theme_key'
export default class ThemeDao {

    /**
     * 获取当前主题
     * @returns {Promise<any> | Promise}
     */
    getTheme() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.flag, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    this.save(ThemeFlags.Default);
                    result = ThemeFlags.Default;
                }
                resolve(ThemeFactory.createTheme(result));
            });
        });
    }

    /**
     * 保存主题标识
     * @param objectData
     */
    save(themeFlags) {

        AsyncStorage.setItem(THEME_KEY, themeFlags, (error, result) => {

        });
    }
}
