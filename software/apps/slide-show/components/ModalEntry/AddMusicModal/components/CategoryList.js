import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {XIcon, XCardList, XPureComponent, XLoading} from '@common/components';
import XSearchInput from '@resource/components/XSearchInput';
import musicHandle from './handle/music';
import MusicList from './MusicList';

class CategoryList extends XPureComponent {
  constructor(props) {
    super(props);
    const { isShowLoading } = props;
    this.state = {
      keywords: '',
      isShowList: false,
      isShowLoading
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.getMusicList = this.getMusicList.bind(this);
    this.calculatorHeight = this.calculatorHeight.bind(this);
  }

  getMusicList() {
    const { boundProjectActions, category } = this.props;
    const { keywords } = this.state;

    const opt = {
      keywords,
      category: category ? category.get('id') : ''
    };
    this.setState({
      isShowLoading: true
    });
    boundProjectActions.getMusicList(opt).then(() => {
      this.setState({
        isShowLoading: false
      })
    });
  }

  handleSearch(val) {
    if(val) {
      this.setState({
        keywords: val,
        isShowList: true,
      }, () => {
        this.getMusicList();
      })
    } else {
      this.setState({
        isShowList: false
      })
    }
  }

  calculatorHeight() {
    let height = 400;

    return `${height}px`
  }

  showFavoriteList = () => {
    const { showFavoriteList } = this.props;
    const { keywords } = this.state;
    showFavoriteList && showFavoriteList({ keywords })
  };

  render() {
    const {
      items,
      musicList,
      renderCard,
      showFavoriteList,
      urls,
      musicTags,
      category,
      musicFavorite,
      isShowUploadBtn,
      isShowFavoriteList,
      isShowMusicTagList,
      boundProjectActions,

      onUploadMusic,
      replaceAudio,
      backToCategory,
      toggleFavorite
    } = this.props;
    const { isShowList, isShowLoading } = this.state;

    const listProps = {
      items,
      renderCard
    };

    const searchInputProps = {
      handleSearch: this.handleSearch
    };


    const musicListProps = {
      urls,
      musicList,
      musicTags,
      isShowLoading,
      musicFavorite,
      isShowUploadBtn,
      isShowFavoriteList,
      isShowMusicTagList,
      boundProjectActions,
      onUploadMusic,
      replaceAudio,
      category,
      isShowHeader: false,

      backToCategory,
      showFavoriteList,
      toggleFavorite
    };

    return <div className="category-wrap">
      <div className="category-header">
        <div className="title">{t('ADD_MUSIC')}</div>
        {!isShowList ? <div className="description">{t('CHOOSE_MUSIC_CATEGORY')}</div> : null}
        
        <div className="music-search-wrap">
          {!__isCN__ ? <XSearchInput {...searchInputProps} /> : null}

          <XIcon type="favorite-v2" title={t('FAVORITE')} onClick={this.showFavoriteList}/>
        </div>
      </div>
      {isShowList ? <MusicList {...musicListProps} /> : <XCardList {...listProps} />}

    </div>
  }
}

export default CategoryList;