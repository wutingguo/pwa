import QRCode from 'qrcode.react';
import React, { Fragment } from 'react';

import XComment from '@resource/components/XComment';
import XImageCanvas from '@resource/components/XImageCanvas';
import XIcon from '@resource/components/icons/XIcon';

import ImageTag from '@apps/gallery-client-mobile/components/ImageTag';
import { getIsUnsupportDownload } from '@apps/gallery-client-mobile/utils/helper';
import * as stateHelper from '@apps/gallery-client-mobile/utils/mapStateHelper';

import { checkIsShowPrintStore } from '../Home';
import cutoverSrc from '../img/cutover.png';
import recommendSrc from '../img/recommend.png';

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
    favorite,
    store,
    detail,
  } = that.props;
  const isFavorited = favoriteImageList.find(
    // const isFavorited = favoriteImageList.find(
    m => m.get('enc_image_uid') === item.get('enc_image_uid')
  );
  const enc_corrected_image_uid = item.get('enc_corrected_image_uid');
  const isShowPrintStore = checkIsShowPrintStore(store);

  const set_uid = item.get('set_uid');
  const enc_image_uid = item.get('enc_image_uid');
  const suffix = item.get('suffix');
  const image_name = item.get('image_name');
  const img_name = `${image_name}${suffix}`;

  const isUnsupportSingleDownload = getIsUnsupportDownload(downloadSetting, set_uid, isFavorited);

  // 是否允许选片.
  const favorite_enabled = favoriteSetting && favoriteSetting.get('favorite_enabled');
  const favorite_comment_enabled = favoriteSetting.get('favorite_comment_enabled');
  const download_limited = downloadSetting.get('download_limited');
  const isDownload = item.get('isDownload');
  const email = favorite.get('email');
  const downloadImgInfo = detail.get('downloadImgInfo') || {};
  const limited_download_White_list = downloadImgInfo?.limited_download_permissions || [];
  const client_restricted = downloadSetting.get('client_restricted');
  const canDownloadClient = limited_download_White_list.find(i => i.client_email === email);
  const imgProps = {
    src: item.get('src'),
    imgRot: item.get('orientation'),
    actions: {
      onContextMenu: e => e.preventDefault(),
      onClick: () => that.showImageViewer(item, index),
    },
  };

  const label_list = favorite.get('list_label_count') || [];
  const isShowTag = __isCN__ && favorite_enabled && label_list.size && isFavorited;
  const isShowGreen = !__isCN__ && download_limited && isDownload;
  const isShowDownloadmark = client_restricted ? canDownloadClient && isShowGreen : isShowGreen;
  return (
    <Fragment>
      <XImageCanvas {...imgProps} />

      <div>{item.get('title')}</div>

      <div className="icon-list">
        {favorite_enabled ? (
          <XIcon
            type="favorite-white"
            status={isFavorited ? 'active' : ''}
            title={t('FAVORITE')}
            iconWidth={32}
            iconHeight={32}
            onClick={() => that.toggleFavorite(item, isFavorited)}
          />
        ) : null}
        {!isUnsupportSingleDownload && (
          <span className={isShowDownloadmark ? 'download-mark' : ''} style={{ fontSize: ' 14px' }}>
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
                  submitStatus,
                  isDownload,
                });
              }}
            />
          </span>
        )}
        {isFavorited && favorite_comment_enabled ? (
          <XComment
            text={item.get('comment')}
            isMobile={true}
            iconType="comment-white"
            maxLength={__isCN__ ? 500 : null}
            verifyPass={that.verifySubmit(false)}
            verifyCallback={errorText => {
              boundGlobalActions.addNotification({
                message:
                  errorText || t('BAN_COLLECT', '您已提交过选片，如需更改，请联系摄影师或工作室~'),
                level: 'error',
                autoDismiss: 2,
              });
            }}
            ok={text => that.addComment(item, text)}
          />
        ) : null}
        {isShowTag ? (
          <ImageTag
            image_uid={item.get('enc_image_uid')}
            isLableActive={isFavorited?.get('label_mark')}
            {...that.props}
            label_list={label_list}
            set_uid={set_uid}
          />
        ) : null}
      </div>
      <div className="right-top-icons">
        {isShowPrintStore && (
          <XIcon
            onClick={() => {
              window.logEvent.addPageEvent({
                name: 'ClientEstore_Click_QuickBuy',
              });
              that.toPrintStore();
            }}
            type={`shop-cart-white-small`}
            className="shop-cart-icon-wrap"
            iconWidth={32}
            iconHeight={32}
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
  const { currentIndex, images, total, submitStatus } = opt;
  const {
    favoriteImageList,
    favoriteSetting,
    downloadSetting,
    boundGlobalActions,
    favorite,
    detail,
  } = that.props;
  const item = images.get(currentIndex);
  const isFavorited = favoriteImageList.find(
    m => m.get('enc_image_uid') === item.get('enc_image_uid')
  );
  const enc_corrected_image_uid = item.get('enc_corrected_image_uid');

  const set_uid = item.get('set_uid');
  const enc_image_uid = item.get('enc_image_uid');
  const suffix = item.get('suffix');
  const image_name = item.get('image_name');
  const img_name = `${image_name}${suffix}`;

  const isUnsupportSingleDownload = getIsUnsupportDownload(downloadSetting, set_uid, isFavorited);

  // 是否允许选片.
  const favorite_enabled = favoriteSetting && favoriteSetting.get('favorite_enabled');
  const favorite_comment_enabled = favoriteSetting.get('favorite_comment_enabled');

  const label_list = favorite.get('list_label_count') || [];
  const isShowTag = __isCN__ && favorite_enabled && label_list.size && isFavorited;
  const download_limited = downloadSetting.get('download_limited');
  const isDownload = item.get('isDownload');
  const email = favorite.get('email');
  const downloadImgInfo = detail.get('downloadImgInfo') || {};
  const limited_download_White_list = downloadImgInfo?.limited_download_permissions || [];
  const client_restricted = downloadSetting.get('client_restricted');
  const canDownloadClient = limited_download_White_list.find(i => i.client_email === email);
  const isShowGreen = !__isCN__ && download_limited && isDownload;
  const isShowDownloadmark = client_restricted ? canDownloadClient && isShowGreen : isShowGreen;

  return (
    <div className="favorite-view-header">
      <XIcon type="back" iconWidth={32} iconHeight={32} onClick={that.hideImageViewer} />

      {total ? (
        <div className="pagination-info">
          {currentIndex + 1}/{total}
        </div>
      ) : null}

      <div className="pull-right">
        {favorite_enabled ? (
          <XIcon
            type="favorite"
            status={isFavorited ? 'active' : ''}
            title={t('FAVORITE')}
            iconWidth={32}
            iconHeight={32}
            onClick={() => that.toggleFavorite(item, isFavorited)}
          />
        ) : null}
        {!isUnsupportSingleDownload && (
          <span className={isShowDownloadmark ? 'download-mark' : ''} style={{ fontSize: ' 14px' }}>
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
                  submitStatus,
                  isDownload,
                });
              }}
            />
          </span>
        )}
        {favorite_comment_enabled && isFavorited ? (
          <XComment
            text={isFavorited.get('comment')}
            maxLength={__isCN__ ? 500 : null}
            isMobile={true}
            verifyPass={that.verifySubmit(false)}
            verifyCallback={errorText => {
              boundGlobalActions.addNotification({
                message:
                  errorText || t('BAN_COLLECT', '您已提交过选片，如需更改，请联系摄影师或工作室~'),
                level: 'error',
                autoDismiss: 2,
              });
            }}
            ok={text => that.addComment(item, text)}
          />
        ) : null}
        {isShowTag ? (
          <ImageTag
            image_uid={item.get('enc_image_uid')}
            {...that.props}
            label_list={label_list}
            isLableActive={isFavorited.get('label_mark')}
            rectPosition={20}
            activeWhite={false}
            tagEl={'.x-image-viewer-container-mobile.favorite-image-viewer'}
            set_uid={set_uid}
          />
        ) : null}
      </div>
    </div>
  );
};

const renderSelectionBox = (that, selectionSetting, selectionSettingSwitch) => {
  const { favoriteImageList, favorite } = that.props;
  const label_list = favorite.get('list_label_count')?.toJS() || [];

  const selectedNum = favoriteImageList.size || 0;
  const imageNum = selectionSetting.get('gallery_image_num');
  const singleCharge = selectionSetting.get('gallery_image_extra');
  const comboList = selectionSetting.get('add_image_packages')?.toJS() || [];
  const { gallery_image_extra, gallery_image_num, gallery_rule_switch, gallery_rule_type } =
    selectionSetting.toJSON();
  const _int = __isCN__ ? '￥' : '$';

  let chargeNum = selectedNum - imageNum;
  const imageCharge = Number(singleCharge) * chargeNum;
  const { comboListTag, activeComboUser } = that.state;
  let activeCombo = -1;
  const tempComboList = [...comboList].sort(
    (a, b) => a['gallery_image_num'] - b['gallery_image_num']
  );

  let currentSelectCombo = {};
  let willSelectCombo = {};
  let sumNum = 0;
  let currentComboIndex = -1;
  let combomMax = {};
  if (gallery_rule_type === 1) {
    // 查找最小大于收费张数的序号
    currentComboIndex = tempComboList.findIndex(item => item['gallery_image_num'] >= chargeNum);

    if (chargeNum <= 0) {
      activeCombo = -1;
      sumNum = imageNum;
    } else {
      if (currentComboIndex === -1) {
        activeCombo = tempComboList.length - 1;
      } else {
        activeCombo = currentComboIndex;
      }
      sumNum =
        imageNum +
        (tempComboList[activeCombo] ? tempComboList[activeCombo]['gallery_image_num'] : 0);
    }
    // combomMax = useComponentSize(that.comboListNode);
  }

  if (selectedNum === sumNum) {
    // 此时触发套餐营销
    // 此时触发套餐营销
    if (gallery_rule_type === 1) {
      if (chargeNum < 0) {
        currentSelectCombo = {};
        willSelectCombo = {};
      } else {
        currentSelectCombo = tempComboList[activeCombo] || {};
        willSelectCombo = tempComboList[activeCombo + 1] ? tempComboList[activeCombo + 1] : null;
      }
    }
  } else {
    willSelectCombo = null;
  }
  if (chargeNum < 0) {
    chargeNum = 0;
  }
  if (activeComboUser > -1) {
    activeCombo = activeComboUser;
    sumNum = tempComboList[activeCombo]['gallery_image_num'] + imageNum;
  }
  localStorage.setItem('activeCombo', activeCombo);
  localStorage.setItem('sumNum', sumNum);
  localStorage.setItem('selectedNum', selectedNum);
  that.activeCombo = activeCombo;
  that.sumNum = sumNum;
  that.selectedNum = selectedNum;
  that.sortComboList = tempComboList;
  const showAddPrice =
    !!willSelectCombo &&
    Number(willSelectCombo['price']) - (Number(currentSelectCombo['price']) || 0);
  return (
    <div className="selectionsContainer">
      {selectionSettingSwitch &&
        gallery_rule_type === 1 &&
        selectedNum === sumNum &&
        !!willSelectCombo && (
          <div className="sbCommonFlex promotion">
            再加{showAddPrice.toFixed(2)}元，可额外再选
            {willSelectCombo['gallery_image_num'] - chargeNum}张
          </div>
        )}
      <div className="selectionsBox">
        <div className="sbCommonFlex sbTop">
          {label_list[0] && (
            <span>
              {label_list[0]['label_name']}: {label_list[0]['label_count']}
            </span>
          )}
          {label_list[1] && (
            <span>
              {label_list[1]['label_name']}: {label_list[1]['label_count']}
            </span>
          )}
          {label_list[2] && (
            <span>
              {label_list[2]['label_name']}: {label_list[2]['label_count']}
            </span>
          )}
        </div>

        <div className="sbCommonFlex sbBottom">
          <div className="sbCommonFlex sbbLeft">
            已选：
            <span style={{ color: selectedNum > sumNum ? '#CC0200' : '' }}>{selectedNum}</span>
            {!selectionSettingSwitch
              ? ''
              : gallery_rule_type == 0
              ? imageNum > 0
                ? `/${imageNum}`
                : ''
              : sumNum > 0
              ? `/${sumNum}`
              : ''}
          </div>
          {selectionSettingSwitch && chargeNum > 0 && (
            <div className="sbCommonFlex sbbMiddle">
              加片费：
              <span>
                {_int}
                {gallery_rule_type === 0 ? imageCharge : tempComboList[activeCombo]['price']}
              </span>
            </div>
          )}
          {selectionSettingSwitch && gallery_rule_type === 1 && chargeNum > 0 && (
            <div
              className="sbCommonFlex sbbRight"
              onClick={e => {
                that.setState({ comboListTag: !comboListTag });
                e.stopPropagation();
              }}
            >
              <img src={cutoverSrc} alt="icon" />
            </div>
          )}
        </div>
      </div>
      {comboListTag && (
        <div className="sbCommonFlex comboBox">
          {tempComboList.map((item, index) => (
            <div
              className="sbCommonFlex comboList"
              style={{ borderColor: activeCombo === index ? '#CBA47C' : 'transparent' }}
              key={item.uidpk}
              onClick={e => {
                e.stopPropagation();
                that.setState({ activeComboUser: index });
              }}
            >
              <div className="sbCommonFlex">加片: {item.gallery_image_num}</div>
              <div className="sbCommonFlex">
                ￥<span>{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 渲染图片预览时的自定义header.
 * @param {*} that
 * @param {*} opt
 */
const renderPayInfo = that => {
  const { orderConfig } = that.state;
  const { qrCodeData = '', enc_image_ids, price, order_number } = orderConfig || {};
  return (
    <div className="favorite-pay-info">
      <XIcon type="back" onClick={that.hidePayInfo} text={t('BACK')} />
      <div className="pay-cont">
        <div className="title">请及时支付，以便我们更快处理您的订单</div>
        <div className="info">订单编号：{order_number}</div>
        <div className="info">订单信息: 照片 {enc_image_ids.length} 张</div>
        <div className="info pay-limit">
          请在 <span className="warning">24小时</span> 内付款，否则交易会被取消
        </div>
        <div className="divide"></div>
        <div className="qrcode">
          {qrCodeData && <QRCode value={qrCodeData} size={128} />}
          <div className="info">微信扫一扫支付</div>
        </div>
        <div className="amount">
          <span className="info">总金额：</span>
          <span className="money">￥{Number(price).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default {
  renderCard,
  renderFavoriteViewHeader,
  renderSelectionBox,
  renderPayInfo,
};
