import { saveAs } from 'file-saver';
import Immutable from 'immutable';
import { debounce, template } from 'lodash';
import React, { Component } from 'react';

import XCheckBox from '@resource/components/XCheckBox';
import XRadio from '@resource/components/XRadio';

import * as cache from '@resource/lib/utils/cache';
import { fetchImage } from '@resource/lib/utils/image';

import { SAAS_CLIENT_GALLERY_GET_SINGLE_PHOTO_DOWNLOAD_LINK } from '@resource/lib/constants/apiUrl';

import { XButton, XIcon } from '@common/components';

import {
  getEmailCacheKey,
  getPhoneCacheKey,
  getPinCacheKey,
  getResolutionIdCacheKey,
} from '@apps/gallery-client/utils/helper';

import './index.scss';

const emptyList = Immutable.List([]);

export default class extends Component {
  constructor(props) {
    super(props);

    const { setsAndResolution } = props;
    const resolution = Immutable.fromJS(setsAndResolution)
      .get('resolution')
      .filter(item => item.get('status'));

    this.state = {
      isShowInfo: false,
      isShowUnSelectMsg: false,
      resolution,
      selectSets: emptyList,
      unsupportDownloadSets: emptyList,
    };
  }

  componentDidMount() {
    const { setsAndResolution, collection_uid, isDownloadSinglePhoto } = this.props;
    const { resolution } = this.state;

    const resolutionIdCachekey = getResolutionIdCacheKey(collection_uid);
    const cacheResolutionId = cache.get(resolutionIdCachekey);
    // 单张下载时，选择 resolution 需记住上次选中的值
    const defaultResolutionId = isDownloadSinglePhoto
      ? resolution.size === 1
        ? resolution.getIn([0, 'resolution_id'])
        : cacheResolutionId
        ? cacheResolutionId
        : resolution.getIn([0, 'resolution_id'])
      : resolution.getIn([0, 'resolution_id']);

    const sets = Immutable.fromJS(setsAndResolution).get('sets_setting');

    const convertResolution = this.getConvertResolution(resolution, defaultResolutionId);

    const selectSets = sets
      .filter(item =>
        __isCN__
          ? item.get('selected_download_status') === 1
            ? item.get('favoriteSelect')
            : item.get('download_status') && !!item.get('image_num')
          : item.get('download_status') && !!item.get('image_num')
      )
      .map(item => {
        return item.set('checked', true);
      });
    const unsupportDownloadSets = sets.filter(item =>
      __isCN__
        ? item.get('selected_download_status') === 1
          ? !item.get('favoriteSelect')
          : !item.get('download_status') || !item.get('image_num')
        : !item.get('download_status') || !item.get('image_num')
    );

    this.setState({
      resolution: convertResolution,
      selectSets,
      unsupportDownloadSets,
    });
  }

  getDownloadParams = () => {
    const { collectionId, collection_uid, isPinCodeClose, downloadImgListImg } = this.props;
    const { resolution, selectSets } = this.state;

    const pinCacheKey = getPinCacheKey(collection_uid);
    const cacheEmailKey = getEmailCacheKey(collection_uid);
    const phoneKey = getPhoneCacheKey(collection_uid);
    const pin_code = isPinCodeClose ? '' : cache.get(pinCacheKey) || '';
    const email = cache.get(cacheEmailKey) || '';
    const phone = cache.get(phoneKey) || '';
    const set_ids = selectSets.reduce((acc, cur) => {
      if (cur.get('checked')) {
        acc.push(cur.get('set_uid'));
      }
      return acc;
    }, []);

    if (!set_ids.length) {
      this.setState({
        isShowUnSelectMsg: true,
      });
      return null;
    }

    let resolution_id = null;
    let download_photo_size_id = null;
    resolution.forEach(item => {
      item.get('common_download_photo_size').forEach(size => {
        if (size.get('status')) {
          download_photo_size_id = size.get('size_id');
          return false;
        }
      });
      if (item.get('status')) {
        resolution_id = item.get('resolution_id');
        return false;
      }
    });

    let params = {
      set_ids,
      email: email || phone,
      pin_code,
      resolution_id,
      collection_id: collectionId,
      download_photo_size_id,
    };
    if (downloadImgListImg && downloadImgListImg.length) {
      params = {
        image_ids: downloadImgListImg,
        selected_images: true,
        email: email || phone,
        pin_code,
        resolution_id,
        collection_id: collectionId,
        download_photo_size_id,
      };
    }
    return params;
  };

  handleStartDownload = debounce(
    async () => {
      const {
        goToStep,
        updateState,
        boundProjectActions,
        isDownloadSinglePhoto,
        enc_image_uid,
        collection_uid,
        set_id,
        // email,
        img_name,
        collectionId,
        galleryBaseUrl,
        onClosed,
        boundGlobalActions,
      } = this.props;
      const params = this.getDownloadParams();
      const phoneKey = getPhoneCacheKey(collection_uid);
      const emailCacheKey = getEmailCacheKey(collection_uid);
      const email = cache.get(emailCacheKey) || '';
      const phone = cache.get(phoneKey) || '';
      const resolutionIdCachekey = getResolutionIdCacheKey(collection_uid);
      cache.set(resolutionIdCachekey, params.resolution_id);

      if (!params) return false;
      if (isDownloadSinglePhoto) {
        const url = template(SAAS_CLIENT_GALLERY_GET_SINGLE_PHOTO_DOWNLOAD_LINK)({
          enc_image_uid,
          set_id,
          email: email || phone,
          pin_code: params.pin_code,
          collection_id: collectionId,
          resolution_id: params.resolution_id,
          download_photo_size_id: params.download_photo_size_id,
          galleryBaseUrl,
        });
        try {
          await fetchImage(url).then(res => {
            saveAs(res.src, img_name);
          });
        } catch (error) {
          boundGlobalActions.addNotification({
            message: 'The download is restricted to specific clients or a select number of photos.',
            level: 'error',
            autoDismiss: 2,
          });
          return false;
        }

        onClosed();
        !__isCN__ && boundProjectActions.getLimitPhotoDownload();
        return false;
      }

      window.logEvent.addPageEvent({
        name: 'ClientGalleryDownloadPopup_Click_StartDownload',
        setIds: params.set_ids ? params.set_ids.join(',') : '',
      });
      const { generateGalleryPhotosZip } = boundProjectActions;
      const { uuid } = await generateGalleryPhotosZip(params);
      !__isCN__ && boundProjectActions.getLimitPhotoDownload();
      boundGlobalActions.hideModal('DOWNLOAD_CHOOSE_IMG_MODAL');

      if (uuid) {
        updateState({ uuid });

        goToStep(4);
      }
    },
    1000,
    {
      leading: true,
      trailing: false,
    }
  );

  handleCheckbox = item => {
    const { value, checked } = item;
    const { selectSets } = this.state;
    const changedSelectSets = selectSets.map(item => {
      if (item.get('set_uid') === value) {
        return item.set('checked', checked);
      }
      return item;
    });

    this.setState({
      isShowUnSelectMsg: false,
      selectSets: changedSelectSets,
    });
  };

  goPreviousStep = () => {
    const { goToStep, initialStep, isHasExistedZip } = this.props;
    if (isHasExistedZip && initialStep === 1) {
      goToStep(2);
      return;
    }
    goToStep(initialStep);
  };

  handleShowInfo = () => {
    const { isShowInfo } = this.state;
    this.setState({ isShowInfo: !isShowInfo });
  };

  getConvertResolution = (resolution, resolutionId) => {
    return resolution.map(item => {
      return item.merge({
        status: +item.get('resolution_id') === +resolutionId ? true : false,
      });
    });
  };

  logEventWrap = (eventName, params = {}) => {
    const { collectionId } = this.props;
    window.logEvent.addPageEvent({
      name: eventName,
      collectionId,
      ...params,
    });
  };

  handleSizeChanged = resolutionId => {
    const { isDownloadSinglePhoto } = this.props;
    const { resolution } = this.state;

    //添加埋点
    let eventKey;
    const resolutionType = `resolutionType_${resolutionId}`;
    switch (resolutionType) {
      case 'resolutionType_1':
        eventKey = 'ClientGalleryDownloadPopup_Click_HighRes';
        if (isDownloadSinglePhoto) eventKey = 'ClientGallerySingleDownloadPopup_Click_HighRes';
        break;
      case 'resolutionType_2':
        eventKey = 'ClientGalleryDownloadPopup_Click_WebSize';
        if (isDownloadSinglePhoto) eventKey = 'ClientGallerySingleDownloadPopup_Click_WebSize';
        break;
    }
    if (eventKey) {
      this.logEventWrap(eventKey);
    }

    this.setState({ resolution: this.getConvertResolution(resolution, resolutionId) });
  };

  render() {
    const {
      initialStep,
      isDownloadSinglePhoto,
      isSelectPhotoed = false,
      downloadSetting,
      downloadImgInfo,
    } = this.props;
    const { download_limited } = downloadSetting;
    const { limited_num, remaining } = downloadImgInfo || {};
    const { isShowInfo, isShowUnSelectMsg, resolution, selectSets, unsupportDownloadSets } =
      this.state;

    return (
      <div className="select-sets-container">
        {initialStep !== 3 && (
          <div className="page-back-header">
            <XIcon
              className="back"
              type="back"
              onClick={this.goPreviousStep}
              iconWidth={16}
              iconHeight={16}
              fontSize={16}
              fontColor="#3A3A3A"
              text=""
            />
          </div>
        )}
        {!isDownloadSinglePhoto && !isSelectPhotoed && !download_limited && (
          <div className="select-sets-choose-photos">
            <div className="select-sets-choose-photos-title">{t('CHOOSE_PHOTOS')}</div>
            <div className="select-sets-wrapper">
              {selectSets.map((item, index) => {
                if (!item.get('download_status') && !__isCN__) return null;
                if (!item.get('download_status') && item.get('selected_download_status') === 0)
                  return null;
                return (
                  <div className="checkout-item">
                    <XCheckBox
                      styles={{ display: 'block' }}
                      checked={item.get('checked')}
                      text={item.get('set_name')}
                      value={item.get('set_uid')}
                      isShowChecked
                      className="custom-checkout black-theme"
                      onClicked={this.handleCheckbox}
                    />
                  </div>
                );
              })}
            </div>

            {!!unsupportDownloadSets.size && (
              <div className="select-sets-choose-photos-desc">
                <span className="select-sets-choose-photos-tip">
                  {t('SELECT_SETS_CHOOSE_PHOTOS_TIP')}
                </span>
                <span className="select-sets-choose-photos-info" onClick={this.handleShowInfo}>
                  {!isShowInfo || !__isCN__ ? t('SHOW_INFO') : t('HIDE_INFO', '隐藏信息')}
                </span>
              </div>
            )}

            {isShowInfo && (
              <div className="select-sets-unchoose-sets-wrapper">
                {unsupportDownloadSets.map(item => {
                  return (
                    <div className="checkout--disable-item">
                      <XCheckBox
                        styles={{ display: 'block' }}
                        checked={false}
                        text={item.get('set_name')}
                        value={item.get('set_uid')}
                        disabled={true}
                        className="custom-checkout black-theme"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {isShowUnSelectMsg && (
              <span className="select-sets-msg">{t('NO_PICTURES_SELECTED')}</span>
            )}
          </div>
        )}
        {isDownloadSinglePhoto && download_limited && (
          <div className="download_limited-info">
            <div className="download_limited-info-title">{t('Available Downloads')}</div>
            <div className="download_limited-info-content">
              {remaining}/{limited_num} photos remaining for download.
            </div>
          </div>
        )}

        <div className="select-sets-download-size">
          <div className="select-sets-download-title">{t('CHOOSE_DOWNLOAD_SIZE')}</div>

          <div className="select-resolution-wrapper">
            {resolution.map(item => {
              return (
                <div className="select-resolution-item">
                  <XRadio
                    skin="black-theme"
                    text={__isCN__ ? item.get('name_cn') : item.get('name')}
                    value={item.get('resolution_id')}
                    checked={item.get('status')}
                    onClicked={this.handleSizeChanged}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="download-btn-wrapper">
          <XButton className="black start-download-btn" onClicked={this.handleStartDownload}>
            {t('START_DOWNLOAD')}
          </XButton>
        </div>
      </div>
    );
  }
}
