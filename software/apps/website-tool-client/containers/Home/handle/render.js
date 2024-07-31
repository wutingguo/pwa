import React, { Fragment } from 'react';
import XComment from '@resource/components/XComment';
import XIcon from '@resource/components/icons/XIcon';
import { getIsUnsupportDownload } from '@apps/gallery-client/utils/helper';
import * as stateHelper from '@apps/gallery-client/utils/mapStateHelper';
import recommendSrc from '../img/recommend.png';
import XImageCanvas from '@resource/components/XImageCanvas';
import { checkIsShowPrintStore } from '../Home';
import ImageTag from '@apps/gallery-client/containers/components/ImageTag';
/**
 * 渲染瀑布流中的item
 * @param {*} that
 * @param {*} item
 */
const renderCard = (that, item, index, option, submitStatus) => {
  const {
    favoriteImageList,
    favoriteSetting,
    downloadSetting,
    boundGlobalActions,
    store,
    favorite
  } = that.props;
  const isShowPrintStore = checkIsShowPrintStore(store);
  const isFavorited = favoriteImageList.find(
    // const isFavorited = favoriteImageList.find(
    m => m.get('enc_image_uid') === item.get('enc_image_uid')
  );
  const label_list = favorite.get('list_label_count') || [];
  const set_uid = item.get('set_uid');
  const enc_image_uid = item.get('enc_image_uid');
  const enc_corrected_image_uid = item.get('enc_corrected_image_uid');
  const suffix = item.get('suffix');
  const image_name = item.get('image_name');
  const img_name = `${image_name}${suffix}`;
  const isUnsupportSingleDownload = getIsUnsupportDownload(downloadSetting, set_uid, isFavorited);
  // 是否允许选片.
  const favorite_enabled = favoriteSetting && favoriteSetting.get('favorite_enabled');
  const favorite_comment_enabled = favoriteSetting.get('favorite_comment_enabled');
  const imgProps = {
    src: item.get('src'),
    imgRot: item.get('orientation'),
    actions: {
      onContextMenu: e => e.preventDefault(),
      onClick: () => that.showImageViewer(item, index)
    }
  };
  const isShowTag = __isCN__ && favorite_enabled && label_list.size && isFavorited;

  return (
    <Fragment>
      <XImageCanvas {...imgProps} />
      <div>{item.get('title')}</div>

      <div className="icon-list">
        {favorite_enabled ? (
          <XIcon
            type="favorite-white"
            className="favorite-small-wrapper"
            status={isFavorited ? 'active' : ''}
            title={t('FAVORITE')}
            onClick={() => that.toggleFavorite(item, isFavorited)}
          />
        ) : null}

        {isUnsupportSingleDownload ? (
          <span>
            <XIcon
              type="download-small-white"
              title={t('UNSUPPORT_DOWNLOAD_SINGLE_PHOTO')}
              status="disable"
              onClick={() => {}}
            />
          </span>
        ) : (
          <XIcon
            type="download-small-white"
            title={t('DOWNLOAD')}
            onClick={() => {
              const isApplyCorrectImg = stateHelper.applyImg(0, item);
              const encImg = isApplyCorrectImg ? enc_corrected_image_uid : enc_image_uid;
              that.downloadGallery({
                download_type: 2,
                set_uid,
                enc_image_uid: encImg,
                img_name,
                submitStatus
              });
            }}
          />
        )}
        {isFavorited && favorite_comment_enabled ? (
          <XComment
            iconType="comment-white"
            iconClassName="favorite-small-comment"
            text={item.get('comment')}
            maxLength={50}
            verifyPass={that.verifySubmit(false)}
            verifyCallback={() => {
              boundGlobalActions.addNotification({
                message: t('BAN_COLLECT', '您已提交过选片，如需更改，请联系摄影师或工作室~'),
                level: 'error',
                autoDismiss: 2
              });
            }}
            ok={text => that.addComment(item, text)}
          />
        ) : null}
        {isShowTag ? (
          <ImageTag
            image_uid={item.get('image_uid')}
            isLableActive={isFavorited.get('label_mark')}
            {...that.props}
            label_list={label_list}
          />
        ) : null}
      </div>

      <div className="right-top-icons">
        {isShowPrintStore && (
          <XIcon
            onClick={() => {
              window.logEvent.addPageEvent({
                name: 'ClientEstore_Click_QuickBuy'
              });
              that.toPrintStore();
            }}
            type={`shop-cart-white-small`}
            className="shop-cart-icon-wrap"
            title=""
          />
        )}
      </div>
      {!!item.get('recommend') && <img className="recommend" src={recommendSrc} />}
    </Fragment>
  );
};

/**
 * 渲染图片预览时的自定义header.
 * @param {*} that
 * @param {*} opt
 */
const renderFavoriteViewHeader = (that, opt) => {
  const { currentIndex, images, submitStatus } = opt;
  const {
    favoriteImageList,
    favoriteSetting,
    downloadSetting,
    boundGlobalActions,
    favorite
  } = that.props;
  const label_list = favorite.get('list_label_count') || [];
  const item = images.get(currentIndex);
  const enc_corrected_image_uid = item.get('enc_corrected_image_uid');
  const set_uid = item.get('set_uid');
  const enc_image_uid = item.get('enc_image_uid');
  const suffix = item.get('suffix');
  const image_name = item.get('image_name');
  const img_name = `${image_name}${suffix}`;
  const isFavorited = favoriteImageList.find(
    m => m.get('enc_image_uid') === item.get('enc_image_uid')
  );
  const isUnsupportSingleDownload = getIsUnsupportDownload(downloadSetting, set_uid, isFavorited);
  // 是否允许选片.
  const favorite_enabled = favoriteSetting && favoriteSetting.get('favorite_enabled');
  const favorite_comment_enabled = favoriteSetting.get('favorite_comment_enabled');
  const isShowTag = __isCN__ && favorite_enabled && label_list.size && isFavorited;
  return (
    <div className="favorite-view-header">
      <XIcon type="back" onClick={that.hideImageViewer} text={t('BACK')} />

      <div className="pull-right">
        {isUnsupportSingleDownload ? (
          <span>
            <XIcon
              type="download-small"
              title={t('UNSUPPORT_DOWNLOAD_SINGLE_PHOTO')}
              status="disable"
              onClick={() => {}}
            />
          </span>
        ) : (
          <XIcon
            type="download-small"
            title={t('DOWNLOAD')}
            onClick={() => {
              const isApplyCorrectImg = stateHelper.applyImg(0, item);
              const encImg = isApplyCorrectImg ? enc_corrected_image_uid : enc_image_uid;
              that.downloadGallery({
                download_type: 2,
                set_uid,
                enc_image_uid: encImg,
                img_name,
                submitStatus
              });
            }}
          />
        )}
        {favorite_enabled ? (
          <XIcon
            type="favorite"
            className="favorite-view-icon"
            status={isFavorited ? 'active' : ''}
            title={t('FAVORITE')}
            onClick={() => that.toggleFavorite(item, isFavorited)}
          />
        ) : null}

        {favorite_comment_enabled && isFavorited ? (
          <XComment
            text={isFavorited.get('comment')}
            maxLength={50}
            verifyPass={that.verifySubmit(false)}
            verifyCallback={() => {
              boundGlobalActions.addNotification({
                message: t('BAN_COLLECT', '您已提交过选片，如需更改，请联系摄影师或工作室~'),
                level: 'error',
                autoDismiss: 2
              });
            }}
            ok={text => that.addComment(item, text)}
          />
        ) : null}
        {isShowTag ? (
          <ImageTag
            image_uid={item.get('image_uid')}
            {...that.props}
            label_list={label_list}
            isLableActive={isFavorited.get('label_mark')}
            rectPosition={20}
            activeWhite={false}
            tagEl={'.x-image-viewer-container.favorite-image-viewer'}
          />
        ) : null}
      </div>
    </div>
  );
};

const renderSelectionBox = (that, selectionSetting) => {
  const { favoriteImageList } = that.props;

  const selectedNum = favoriteImageList.size || 0;
  const imageNum = selectionSetting.get('gallery_image_num');
  const singleCharge = selectionSetting.get('gallery_image_extra');
  const _int = __isCN__ ? '￥' : '$';

  let chargeNum = selectedNum - imageNum;
  if (chargeNum < 0) {
    chargeNum = 0;
  }
  const imageCharge = Number(singleCharge) * chargeNum;

  return (
    <div className="selections-box">
      <div>
        已选：<span>{selectedNum}</span>/{imageNum}
      </div>
      <div>
        加片费：
        <span>
          {_int}
          {imageCharge}
        </span>
      </div>
    </div>
  );
};

export default {
  renderCard,
  renderFavoriteViewHeader,
  renderSelectionBox
};
