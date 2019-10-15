import {onThemeChange} from './theme';
import {onLoadPopularData,onLoadMorePopularData,onFlushPopularFavorite} from './popular';
import {onLoadTrendingData,onLoadMoreTrendingData,onFlushTrendingFavorite} from './trending';
import {onLoadFavoriteData} from './favorite';
import {onLoadLanguage} from './language';

export default {
  onThemeChange,
  onLoadPopularData,
  onLoadMorePopularData,
  onFlushPopularFavorite,
  onLoadTrendingData,
  onFlushTrendingFavorite,
  onLoadMoreTrendingData,
  onLoadFavoriteData,
  onLoadLanguage,
}
