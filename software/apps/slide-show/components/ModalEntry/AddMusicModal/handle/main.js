
import equals from '@resource/lib/utils/compare';

/**
 * 
 * @param {*} that 
 */
const getData = that => {
  // musicCategories, musicFavorite, musicList, 
  const { 
    musicCategories, 
    musicFavorite, 
    boundProjectActions 
  } = that.props;
  const { currentCategoryId } = that.state;
  // 获取music的categories.
  if(!musicCategories.size){
    boundProjectActions.getMusicCategories();    
  }

  // 获取已收藏的音乐列表.
  const favoriteRecords = musicFavorite.get('records');
  if(!favoriteRecords || !favoriteRecords.size){
    boundProjectActions.getFavoriteList({
      category: currentCategoryId,
    });
  }
};

const willReceiveProps = (that, nextProps) => {
  const {
    musicCategories,
    musicFavorite,
    musicList,
    musicTags
  } = that.props;
  const {
    musicCategories: nextMusicCategories,
    musicFavorite: nextMusicFavorite,
    musicList: nextMusicList,
    musicTags: nextMusicTags
  } = nextProps;
  if (!equals(musicCategories, nextMusicCategories)) {
    that.setState({ musicCategories: nextMusicCategories });
  }

  if (!equals(musicFavorite, nextMusicFavorite)) {
    that.setState({ musicFavorite: nextMusicFavorite });
  }

  if (!equals(musicList, nextMusicList)) {
    that.setState({ musicList: nextMusicList });
  }
  if (!equals(musicTags, nextMusicList)) {
    that.setState({ musicTags: nextMusicTags });
  }
};

export default {
  getData,
  willReceiveProps
};