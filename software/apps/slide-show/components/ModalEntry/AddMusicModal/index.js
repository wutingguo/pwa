import React from 'react';
import { fromJS } from 'immutable';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { XModal, XCardList, XPureComponent } from '@common/components';
import MusicList from './components/MusicList';
import CategoryList from './components/CategoryList';

import './index.scss';
import main from './handle/main';
import categoryHandle from './handle/category';
import favoriteHandle from './handle/favorite';
import musicHandle from './handle/music';

class AddMusicModal extends XPureComponent {
  constructor(props) {
    super(props);
    const {
      musicCategories,
      musicFavorite,
      musicList,
      musicTags
    } = props;

    this.state = {
      musicCategories,
      musicFavorite,
      musicList,
      musicTags,

      isShowList: false,
      isShowUploadBtn: false,
      isShowFavoriteList: false,
      isShowMusicTagList: false,

      // 存放hover时, 当前项的id.
      hoverItem: '',
      currentCategoryId: '',
      isShowLoading: false,
      keywords: ''
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.getMusicList = this.getMusicList.bind(this);
  }

  getData = () => main.getData(this);

  // 返回到category界面.
  backToCategory = () => {
    const { boundProjectActions } = this.props;
    const { isShowFavoriteList, isShowUploadBtn, currentCategoryId = '' , musicCategories} = this.state;
    const currentCategory = musicCategories ? musicCategories.find(v => v.get('id') === currentCategoryId) : null;
    const coverImgName = currentCategory ? currentCategory.get('cover_img') : '';
    const isUploadCategory = coverImgName === 'my-uploads';
    const isTSMCategory = coverImgName === 'Triple-scoop-music';
    window.logEvent.addPageEvent({
      name: 'SlideshowsSongList_Click_Back',
      category: isShowFavoriteList ? 'MyFavoriteSongsList' : ''
    });

    if(isShowFavoriteList) {
      this.setState({
        isShowList: !!currentCategoryId,
        isShowFavoriteList: false,
        isShowUploadBtn: currentCategoryId ? isUploadCategory : false,
        isShowMusicTagList: __isCN__ ? false :  isTSMCategory
      });
    } else {
      boundProjectActions.deleteMusicList();
      boundProjectActions.deleteFavoriteList();
      this.setState({
        currentCategoryId: '',
        isShowList: false,
        isShowFavoriteList: false,
        isShowUploadBtn: false,
        isShowMusicTagList: false
      });
    }
  };

  showFavoriteList = (opt) => favoriteHandle.showFavoriteList(this, opt);
  getFavoriteList = () => favoriteHandle.getFavoriteList(this);
  toggleFavorite = item => favoriteHandle.toggleFavorite(this, item);

  renderCategoryItem = item => categoryHandle.renderCategoryItem(this, item);

  onUploadMusic = music => musicHandle.onUploadMusic(this, music);
  replaceAudio = music => musicHandle.replaceAudio(this, music);

  componentWillReceiveProps(nextProps) {
    main.willReceiveProps(this, nextProps);
  }

  componentDidMount() {
    this.getData();
  }

  getMusicList() {
    const { boundProjectActions } = this.props;
    const { currentCategoryId, keywords } = this.state;

    const opt = {
      keywords,
      category: currentCategoryId
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

  handleSearch(v) {
    if(v) {
      this.setState({
        keywords: v,
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

  render() {
    const { data, urls, boundProjectActions } = this.props;
    const {
      musicCategories,
      musicFavorite,
      musicList,
      musicTags,
      isShowList,
      isShowUploadBtn,
      isShowFavoriteList,
      isShowMusicTagList,
      hoverItem,
      currentCategoryId,
      isShowLoading,
      keywords
    } = this.state;
    const close = data.get('close');
    const currentCategory = musicCategories ? musicCategories.find(v => v.get('id') === currentCategoryId) : null;
    const categoriesProps = {
      urls,
      musicList,
      hoverItem,
      musicTags,
      isShowLoading,
      musicFavorite,
      category: currentCategory,
      boundProjectActions,
      isShowUploadBtn,
      isShowFavoriteList,
      isShowMusicTagList,
      items: categoryHandle.formatCategories(musicCategories),
      renderCard: this.renderCategoryItem,

      showFavoriteList: this.showFavoriteList,
      onUploadMusic: this.onUploadMusic,
      replaceAudio: this.replaceAudio,
      backToCategory: this.backToCategory,
      toggleFavorite: this.toggleFavorite
    };

    // 音乐列表.
    const musicListProps = {
      urls,
      musicList,
      musicTags,
      keywords,
      isShowLoading,
      musicFavorite,
      isShowUploadBtn,
      isShowFavoriteList,
      isShowMusicTagList,
      boundProjectActions,
      onUploadMusic: this.onUploadMusic,
      replaceAudio: this.replaceAudio,
      category: currentCategory,

      backToCategory: this.backToCategory,
      showFavoriteList: this.showFavoriteList,
      toggleFavorite: this.toggleFavorite
    };


    return (
      <XModal
        className="add-music-modal"
        opened
        onClosed={close}
        escapeClose
        isHideIcon={false}
      >
        <div className="modal-title"></div>
        <div className="modal-body">
          {
            isShowList || isShowFavoriteList ? <MusicList {...musicListProps} /> : <CategoryList {...categoriesProps} />
          }
        </div>
      </XModal>
    );
  }
}

AddMusicModal.propTypes = {
};

AddMusicModal.defaultProps = {};

export default AddMusicModal;
