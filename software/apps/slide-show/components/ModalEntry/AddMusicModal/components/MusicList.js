import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { XIcon, XCardList, XPureComponent, XLoading } from '@common/components';
import XSearchInput from '@resource/components/XSearchInput';
import UploadMusic from './UploadMusic';
import MusicTagList from './MusicTagList';

import musicHandle from './handle/music';
import * as audioEvents from './handle/audio';

class MusicList extends XPureComponent {
  constructor(props) {
    super(props);
    const { isShowLoading, keywords = '' } = props;
    this.state = {
      hoverItem: '',
      expand: false,

      themes: '',
      tempos: '',
      instruments: '',
      styles: '',
      moods: '',
      keywords,

      // 音乐.
      currentMusicEncId: '',
      currentTime: 0,
      duration: 10,
      paused: true,
      muted: false,
      isShowLoading
    };

    this.toggleExpand = this.toggleExpand.bind(this);
    this.getMusicList = this.getMusicList.bind(this);
    this.getFavoriteList = this.getFavoriteList.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.setStateAsync = this.setStateAsync.bind(this);
  }

  startRenderLoop = () => audioEvents.startRenderLoop(this);
  cancelRenderLop = () => audioEvents.cancelRenderLop(this);

  onAudioPlay = () => audioEvents.onAudioPlay(this);
  onAudioPause = () => audioEvents.onAudioPause(this);
  tooglePlay = () => audioEvents.tooglePlay(this);
  toogleMuted = () => audioEvents.toogleMuted(this);
  changeTime = time => audioEvents.changeTime(this, time);
  bindAudioEvents = () => audioEvents.bindAudioEvents(this);
  removeAudioEvents = () => audioEvents.removeAudioEvents(this);
  setAudioStatusToState = () => audioEvents.setAudioStatusToState(this);

  componentDidMount() {
    this.bindAudioEvents();
  }

  componentWillUnmount() {
    this.removeAudioEvents();
  }

  componentWillReceiveProps(nextProps) {
    const oldLoading = this.props.isShowLoading;
    const newLoading = nextProps.isShowLoading;
    if (oldLoading !== newLoading) {
      this.setState({
        isShowLoading: newLoading
      });
    }
  }

  calculatorHeight() {
    const { isShowUploadBtn, isShowMusicTagList } = this.props;
    const { expand } = this.state;
    let height = 240;
    if (isShowUploadBtn) {
      height = 240;
    } else if (isShowMusicTagList) {
      if (expand) {
        height = 245;
      } else {
        height = 350;
      }
    } else {
      height = 400;
    }
    return `${height}px`;
  }

  toggleExpand() {
    const { expand } = this.state;
    this.setState({
      expand: !expand
    });
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  async handleTagChange(field, v) {
    await this.setStateAsync({
      [field]: v.value
    });
    this.getMusicList();
  }

  getMusicList() {
    const { boundProjectActions, category } = this.props;
    const { themes, tempos, instruments, styles, moods, keywords } = this.state;
    const fields = {
      themes,
      tempos,
      instruments,
      styles,
      moods,
      keywords
    };

    Object.keys(fields).forEach(item => {
      if (fields[item] === '-1') {
        fields[item] = '';
      }
    });
    const opt = {
      ...fields,
      // category: category ? category.get('id') : ''
    };
    this.setState({
      isShowLoading: true
    });
    boundProjectActions.getMusicListNew(opt).then(() => {
      this.setState({
        isShowLoading: false
      });
    });
  }

  getFavoriteList() {
    const { boundProjectActions, category } = this.props;
    const { keywords } = this.state;
    boundProjectActions.getFavoriteList({
      category: category ? category.get('id') : '',
      keywords
    });
  }

  handleSearch(val) {
    const { isShowFavoriteList } = this.props;
    this.setState(
      {
        keywords: val
      },
      () => {
        if (isShowFavoriteList) {
          this.getFavoriteList();
        } else {
          this.getMusicList();
        }
      }
    );
  }

  showFavoriteList = () => {
    const { showFavoriteList } = this.props;
    const { keywords } = this.state;
    showFavoriteList && showFavoriteList({ keywords });
  };

  backToCategory = () => {
    const { backToCategory } = this.props;
    // this.getMusicList();
    backToCategory && backToCategory();
  };

  render() {
    const {
      musicTags,
      musicList,
      isShowUploadBtn,

      musicFavorite,
      isShowFavoriteList,
      isShowMusicTagList,

      category,

      backToCategory,
      onUploadMusic,
      isShowHeader = true
    } = this.props;

    const {
      expand,
      isShowLoading,

      themes,
      tempos,
      instruments,
      styles,
      moods,
      keywords
    } = this.state;
    const fields = {
      themes,
      tempos,
      instruments,
      styles,
      moods,
      keywords
    };
    const uploadMusicProps = {
      onUploadMusic
    };
    const musicTagListProps = {
      fields,
      expand,
      musicTags,
      toggleExpand: this.toggleExpand,
      handleTagChange: this.handleTagChange
    };
    const total = isShowFavoriteList ? musicFavorite.get('total') : musicList.get('total');
    const records = isShowFavoriteList ? musicFavorite.get('records') : musicList.get('records');

    const musicListClass = classNames('music-list');
    const searchInputProps = {
      handleSearch: this.handleSearch,
      open: !!keywords,
      keywords
    };

    const title = category ? category.get('category_name') : 'Add Music';

    return (
      <div className="music-list-wrap">
        <audio ref={node => (this.audioNode = node)} />
        {isShowHeader ? (
          <div className="music-header">
            <XIcon
              className="back"
              type="back"
              text={t('BACK_TO_CATEGORIES')}
              onClick={this.backToCategory}
            />
            <div className="title">{isShowFavoriteList ? t('MY_FAVORITE_SONGS') : title}</div>
            <div className="music-search-wrap">
              {!__isCN__ ? <XSearchInput {...searchInputProps} /> : null}
              
              <XIcon
                className="favorite"
                type="favorite"
                title={t('FAVORITE')}
                onClick={this.showFavoriteList}
              />
            </div>
          </div>
        ) : null}

        {isShowUploadBtn ? <UploadMusic {...uploadMusicProps} /> : null}

        {isShowMusicTagList ? <MusicTagList {...musicTagListProps} /> : null}

        <div className={musicListClass}>
          <XLoading
            type="imageLoading"
            size="lg"
            zIndex={99}
            backgroundColor="rgba(255,255,255,0.6)"
            isShown={isShowLoading}
          />

          {total && !isShowLoading ? musicHandle.renderMusicList(this, records) : null}
          {!total && !isShowLoading ? musicHandle.renderEmptyList(this) : null}
        </div>
      </div>
    );
  }
}

export default MusicList;
