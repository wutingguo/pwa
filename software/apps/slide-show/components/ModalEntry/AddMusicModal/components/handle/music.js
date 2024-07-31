import classNames from 'classnames';
import React from 'react';

import XMediaControllerBar from '@resource/components/pwa/XMediaControllerBar';

import { secondToMinute } from '@resource/lib/utils/timeFormat';

import { musicTags } from '@resource/lib/constants/strings';

import { getAudioUrl } from '@resource/pwa/utils/audio';

import { XIcon } from '@common/components';

import favorite from '../../handle/favorite';

let timer;
const onMouseEnter = (that, item) => {
  clearTimeout(timer);

  timer = setTimeout(() => {
    const enc_id = item.get('enc_id');
    that.setState({ hoverItem: enc_id });
  }, 50);
};

const onMouseLeave = (that, item) => {
  const enc_id = item.get('enc_id');

  if (that.state.hoverItem === enc_id) {
    that.setState({ hoverItem: '' });
  }
};

/**
 * 获取音乐的播放路径
 * @param {*} that
 */
const combineAudioUrl = that => {
  const { currentMusicEncId } = that.state;
  if (!currentMusicEncId) {
    return '';
  }

  const { urls } = that.props;
  const galleryBaseUrl = urls.get('galleryBaseUrl');

  return getAudioUrl(currentMusicEncId, galleryBaseUrl);
};

const getMusicOptions = (that, item) => {
  const {
    // 当前鼠标所在的music id
    hoverItem,

    // 当前正在播放的音乐.
    currentMusicEncId,
    currentTime,
    duration,
    paused,
  } = that.state;
  const enc_id = item.get('enc_id');

  // 当前的音乐是否正在播放.
  const isActiveMusic = enc_id === currentMusicEncId;

  // 当前的音乐是否是hover状态
  const isHoverMusic = enc_id === hoverItem;

  // 播放状态.
  if (isActiveMusic) {
    return {
      currentTime,
      duration,
      paused,
    };
  }

  if (isHoverMusic) {
    // hover, 但非播放状态.
    return {
      currentTime: 0,
      duration: item.get('duration'),
      paused: true,
    };
  }

  // 没有hover, 也不是播放.
  return {};
};

const checkIsFavorite = (musicFavorite, item) => {
  const records = musicFavorite.get('records');

  return records ? !!records.find(v => v.get('enc_id') === item.get('enc_id')) : false;
};

const renderMusicItem = (that, item, isShowTemposColumn) => {
  const { musicFavorite, replaceAudio, toggleFavorite } = that.props;

  const {
    // 当前鼠标所在的music id
    hoverItem,

    // 当前正在播放的音乐.
    currentMusicEncId,
  } = that.state;
  const enc_id = item.get('enc_id');

  // 当前的音乐是否正在播放.
  const isActiveMusic = enc_id === currentMusicEncId;

  // 当前的音乐是否是hover状态
  const isHoverMusic = enc_id === hoverItem;

  const isShowProgress = isActiveMusic;
  const isShowOperationBtns = isHoverMusic;

  const musicOption = getMusicOptions(that, item);
  const progressBarProps = isShowProgress
    ? {
        ...musicOption,
        showPlayIcon: false,
        showThumb: false,
        showTimeCount: false,
        showMuteICon: false,
        progressColor: '#3A3A3A',
        progressHeight: 4,
        progressActionHeight: 4,
        changeTime: that.changeTime,
      }
    : null;
  const playProps = isShowOperationBtns
    ? {
        ...musicOption,
        showThumb: false,
        showTimeCount: false,
        showMuteICon: false,
        showProgressBar: false,
        tooglePlay: () => {
          that.setState(
            {
              currentMusicEncId: enc_id,
              currentTime: 0,
              duration: item.get('duration'),
            },
            that.tooglePlay
          );
        },
        iconStyle: {
          width: 16,
          height: 16,
        },
        buttonTheme: 'black',
      }
    : null;

  const rowProps = {
    onMouseEnter: () => onMouseEnter(that, item),
    onMouseLeave: () => onMouseLeave(that, item),
    className: classNames('row pos-rel', { 'active-row': isHoverMusic }),
    key: enc_id,
  };

  const musicTitleClassName = classNames('music-title text-ellipsis', {
    'none-operation': !isShowOperationBtns,
  });

  const isFavorite = checkIsFavorite(musicFavorite, item);
  const favoriteIconProps = {
    type: 'favorite-v2',
    status: isFavorite ? 'active' : '',
    iconWidth: '12px',
    iconHeight: '12px',
    onClick: () => toggleFavorite(item),
  };

  const tags = item.get('tags') || [];
  const temposItem = tags.find(el => el.get('option_key') === musicTags.tempos);
  const themesItem = tags.find(el => el.get('option_key') === musicTags.themes);
  const columnItem = __isCN__ ? themesItem : temposItem;

  return (
    <>
      <tr {...rowProps}>
        <td className="col bottom-line width-40 music-title-wrap">
          {isShowOperationBtns ? (
            <>
              <XMediaControllerBar {...playProps} />
              <XIcon type="add-black" onClick={() => replaceAudio(item)} />
            </>
          ) : null}

          <div className={musicTitleClassName} title={item.get('music_title')}>
            {item.get('music_title')}
          </div>
        </td>
        <td
          className="col bottom-line music-artist text-ellipsis width-20"
          title={item.get('artist_name')}
        >
          {item.get('artist_name') || t('UNKNOWN')}
        </td>
        {isShowTemposColumn ? (
          <td
            className="col bottom-line music-artist text-ellipsis width-20"
            title={item.get('artist_name')}
          >
            {(columnItem && columnItem.getIn(['values', '0', 'name'])) || t('UNKNOWN')}
          </td>
        ) : null}

        <td className="col bottom-line width-15">{secondToMinute(item.get('duration'))}</td>
        <td className="col col-icon bottom-line favorite-icon width-5">
          <XIcon {...favoriteIconProps} />
        </td>
      </tr>
      {isShowProgress ? (
        <tr className="music-progress">
          <td colSpan="5">
            <XMediaControllerBar {...progressBarProps} />
          </td>
        </tr>
      ) : null}
    </>
  );
};

/**
 * 渲染音乐列表.
 * @param {*} list
 */
const renderMusicList = (that, list) => {
  const { hoverItem, currentMusicEncId } = that.state;
  const { isShowUploadBtn, category, isShowFavoriteList } = that.props;
  const height = that.calculatorHeight();

  const tableMusicClassName = classNames('music-table', { 'none-upload': !isShowUploadBtn });
  const categoryId = category ? category.get('id') : null;
  const isShowTemposColumn =
    !categoryId ||
    (categoryId && categoryId !== 1) ||
    (isShowFavoriteList && !categoryId) ||
    (isShowFavoriteList && categoryId && categoryId !== 1);

  return (
    <>
      <table className="table-header">
        <thead>
          <tr>
            <td className="col bottom-line width-40">{t('MUSIC_TITLE')}</td>
            <td className="col bottom-line width-20">{t('ARTIST')}</td>
            {isShowTemposColumn ? (
              <td className="col bottom-line width-20">{t('SLIDE_SHOW_MUSIC_Tempos')}</td>
            ) : null}

            <td className="col bottom-line width-15">{t('LENGTH')}</td>
            <td className="col col-icon bottom-line favorite-icon width-5">
              {/* <XIcon type="favorite-v2" iconWidth="12px" iconHeight="12px" /> */}
            </td>
          </tr>
        </thead>
      </table>
      <div className={tableMusicClassName} style={{ height }}>
        <table className={'table-list'}>
          <tbody> {list.map(item => renderMusicItem(that, item, isShowTemposColumn))}</tbody>
        </table>
      </div>
    </>
  );
};

const renderEmptyList = that => {
  const { isShowList, isShowFavoriteList, isShowMusicTagList, isShowUploadBtn, category } =
    that.props;
  const emptyClassList = classNames('music-empty-list', {
    'with-upload': isShowUploadBtn,
  });
  const height = that.calculatorHeight();

  const categoryId = category ? category.get('id') : null;
  const isShowTemposColumn =
    (categoryId && categoryId !== 1) ||
    (isShowFavoriteList && !categoryId) ||
    (isShowFavoriteList && categoryId && categoryId !== 1);

  return (
    <>
      <table className="table-header">
        <thead>
          <tr>
            <td className="col bottom-line width-40">{t('MUSIC_TITLE')}</td>
            <td className="col bottom-line width-20">{t('ARTIST')}</td>
            {isShowTemposColumn ? (
              <td className="col bottom-line width-20">{t('SLIDE_SHOW_MUSIC_Tempos')}</td>
            ) : null}

            <td className="col bottom-line width-15">{t('LENGTH')}</td>
            <td className="col col-icon bottom-line favorite-icon width-5">
              {/* <XIcon type="favorite-v2" iconWidth="12px" iconHeight="12px" /> */}
            </td>
          </tr>
        </thead>
      </table>
      <div className={emptyClassList} style={{ height }}>
        {isShowFavoriteList ? (
          <>
            <div className="main-title">{t('YOUR_FAVORITE_HAVE_NO_SONGS')}</div>
            <div className="description">{t('TAP_FAVORITE_ICON_TO_ADD')}</div>
          </>
        ) : isShowMusicTagList ? (
          <div className="description">{t('YOU_HAVE_NO_TERMS_SONGS')}</div>
        ) : (
          <div className="description">{t('YOU_HAVE_NO_SONGS')}</div>
        )}
      </div>
    </>
  );
};

export default {
  combineAudioUrl,
  renderMusicList,
  renderEmptyList,
};
