import { cloneDeep, isArray } from 'lodash';
import React, { Fragment } from 'react';

import XComment from '@resource/components/XComment';
import XImageCanvas from '@resource/components/XImageCanvas';
import XIcon from '@resource/components/icons/XIcon';

import { CONFIRM_MODAL } from '@resource/lib/constants/modalTypes';

import ImageTag from '@apps/gallery-client/containers/components/ImageTag';
import { getIsUnsupportDownload } from '@apps/gallery-client/utils/helper';
import * as stateHelper from '@apps/gallery-client/utils/mapStateHelper';

const unmark = (that, item, index) => {
  window.logEvent.addPageEvent({
    name: 'GalleryFavoriteList_Click_Favorite',
  });

  const { data, boundProjectActions, boundGlobalActions } = that.props;
  const { showModal, hideModal } = boundGlobalActions;
  const { favoriteSubmit } = that.state;
  if (favoriteSubmit && !__isCN__) {
    showModal(CONFIRM_MODAL, {
      message: (
        <div style={{ fontSize: '15px' }}>
          You‘ve submitted favorites. Navigate to{' '}
          <span
            style={{ color: '#0077cc', cursor: 'pointer' }}
            onClick={() => hideModal(CONFIRM_MODAL)}
          >
            My Favorites
          </span>{' '}
          to regain access to modifying your choice.
        </div>
      ),
      close: () => hideModal(CONFIRM_MODAL),
      buttons: [
        {
          text: 'OK',
          onClick: () => {
            hideModal(CONFIRM_MODAL);
          },
        },
      ],
    });
    return;
  }
  const unMarkFavorite = data.get('unmark');
  const set = data.get('set');
  unMarkFavorite(item).then(() => {
    const { sets: oldSets } = that.state;
    const sets = cloneDeep(oldSets);
    sets.map((set, index) => {
      const { images } = set;
      images.forEach((image, i) => {
        if (image.get('enc_image_uid') === item.get('enc_image_uid')) {
          images.splice(i, 1);
        }
      });
      sets[index].images = images;
    });
    that.setState({ sets });
    if (__isCN__) {
      boundProjectActions.getTagAmount(set.get('set_uid')).then(res => {
        const { data } = res;
        if (data) {
          data.forEach(item => {
            if (!item.label_enable) return;
            boundProjectActions.getLableImgList(item.id);
          });
        }
      });
    }
  });
};

const getText = (item, list) => {
  let text = '';
  const current =
    isArray(list) && list.find(img => img.enc_image_uid === item.get('enc_image_uid'));
  if (current) {
    text = current.comment;
  }
  return text;
};

/**
 * 渲染瀑布流中的item
 * @param {*} that
 * @param {*} item
 */
const renderCard = (that, item, index) => {
  const { data, boundGlobalActions, label_list = [], favorite } = that.props;
  // const favorite = item.get('favorite');
  // const comment = favorite.get('comment');
  const comment = item.get('comment');
  const addComment = data.get('addComment');
  const showImageViewer = data.get('showImageViewer');
  const downloadSetting = data.get('downloadSetting');
  const downloadGallery = data.get('downloadGallery');
  const verifySubmit = data.get('verifySubmit');
  const enc_corrected_image_uid = item.get('enc_corrected_image_uid');

  const { records } = favorite.get('favorite_image_list').toJS();
  const text = getText(item, records);
  const set_uid = item.get('set_uid');
  const enc_image_uid = item.get('enc_image_uid');
  const suffix = item.get('suffix');
  const image_name = item.get('image_name');
  const img_name = `${image_name}${suffix}`;
  const download_limited = downloadSetting.get('download_limited');
  const isDownload = item.get('isDownload');

  const isUnsupportSingleDownload = getIsUnsupportDownload(downloadSetting, set_uid, item);

  const { favoriteSetting } = that.state;

  // 是否允许选片.
  const favorite_enabled = favoriteSetting && favoriteSetting.get('favorite_enabled');
  const favorite_comment_enabled = favoriteSetting.get('favorite_comment_enabled');
  const isShowTag = __isCN__ && favorite_enabled && label_list.length;
  const isShowDownloadmark = !__isCN__ && download_limited && isDownload;
  const imgProps = {
    src: item.get('src'),
    imgRot: item.get('orientation'),
    actions: {
      onContextMenu: e => e.preventDefault(),
      onClick: () => that.showImageViewer(item, index),
    },
  };

  return (
    <Fragment>
      <XImageCanvas {...imgProps} />
      <div>{item.get('title')}</div>

      <div className="icon-list">
        {isUnsupportSingleDownload ? (
          <span>
            <XIcon
              title={t('UNSUPPORT_DOWNLOAD_SINGLE_PHOTO')}
              type="download-small-white"
              status="disable"
              onClick={() => {}}
            />
          </span>
        ) : (
          <span className={isShowDownloadmark ? 'download-mark' : ''}>
            <XIcon
              type="download-small-white"
              title={
                isShowDownloadmark
                  ? 'Re-downloading this photo will not be counted for the download limit.'
                  : t('DOWNLOAD')
              }
              onClick={() => {
                const isApplyCorrectImg = stateHelper.applyImg(0, item);
                const encImg = isApplyCorrectImg ? enc_corrected_image_uid : enc_image_uid;
                downloadGallery({
                  download_type: 2,
                  set_uid,
                  enc_image_uid: encImg,
                  img_name,
                  isDownload,
                });
              }}
            />
          </span>
        )}
        {favorite_enabled ? (
          <XIcon
            type="favorite-white"
            status="active"
            title={t('FAVORITE')}
            onClick={() => unmark(that, item, index)}
          />
        ) : null}

        {favorite_comment_enabled ? (
          <XComment
            iconType="comment-white"
            text={text}
            popLeft={1}
            arrowLeft={5}
            verifyPass={verifySubmit && typeof verifySubmit === 'function' && verifySubmit(false)}
            verifyCallback={errorText => {
              boundGlobalActions.addNotification({
                message:
                  errorText || t('BAN_COLLECT', '您已提交过选片，如需更改，请联系摄影师或工作室~'),
                level: 'error',
                autoDismiss: 2,
              });
            }}
            ok={text => {
              addComment(item, text);
              that.modalHandle(item, text);
            }}
          />
        ) : null}
        {isShowTag ? (
          <ImageTag
            image_uid={item.get('enc_image_uid')}
            isLableActive={item.get('label_mark')}
            {...that.props}
            label_list={label_list}
            iconStyle={{ marginLeft: '-8px' }}
            tagEl={'.content.view-favorite-list-modal'}
            set_uid={set_uid}
          />
        ) : null}
      </div>
    </Fragment>
  );
};
/**
 * 显示单张图片的预览图.
 * @param {*} that
 * @param {*} item
 */
const showImageViewer = (that, item, index) => {
  const { favoriteList } = that.state;
  let clickItemIndex = favoriteList.findIndex(
    i => i?.get('enc_image_uid') === item?.get('enc_image_uid')
  );
  if (item) {
    that.setState({
      viewImageIndex: clickItemIndex,
    });
  }
};

const hideImageViewer = that => {
  that.setState({ viewImageIndex: -1 });
};

/**
 * 格式化成XImageViewer中可以使用的数据.
 * @param {*} item
 */
const formatViewerImages = images => {
  if (!images || !images.size) {
    return images;
  }
  // 使用previewSrc作为预览图.
  return images.map(m => m.merge({ src: m.get('previewSrc') }));
};

export default {
  formatViewerImages,
  renderCard,
  showImageViewer,
  hideImageViewer,
};
