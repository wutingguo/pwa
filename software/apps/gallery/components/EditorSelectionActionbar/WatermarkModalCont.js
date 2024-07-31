import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XPureComponent from '@resource/components/XPureComponent';
import { XSelect, XCheckBox } from '@common/components';
import { BASE_MODAL, SHOW_WATER_MARK_UPGRADE } from '@apps/gallery/constants/modalTypes';
import './index.scss';

class WatermarkModalCont extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showError: false,
      value: undefined,
      checked: false
    };
  }

  showUpgradeModal = () => {
    const { boundGlobalActions } = this.props;
    const { showModal } = boundGlobalActions;
    let params = {
      url: '/saascheckout.html?level=20&cycle=1&product_id=SAAS_GALLERY',
      upgradeContent:
        'Custom Watermark feature is included in Zno Gallery Basic Plan and above. Upgrade your plan to use this feature.',
      btnText: 'Upgrade'
    };
    showModal(SHOW_WATER_MARK_UPGRADE, {
      id: 12312312333,
      params,
      close: () => {
        // 关闭弹窗
        boundGlobalActions.hideModal('SHOW_WATER_MARK_UPGRADE');
      }
    });
  };
  changeWarkmark = ({ value }) => {
    const { collectionDetail, boundGlobalActions } = this.props;
    const watermarkList = collectionDetail.get('watermarkList').toJS();
    // console.log("watermarkList.toJS()/////",watermarkList.toJS())
    const curWaterMark = watermarkList.find(i => i.value === value);
    if (!curWaterMark.can_use && !__isCN__) {
      boundGlobalActions.hideModal(BASE_MODAL);
      this.showUpgradeModal();
      return;
    }
    this.setState(() => ({
      value,
      showError: false
    }));
  };
  onCheckedChange = ({ checked }) => {
    this.setState(() => ({ checked }));
  };
  check() {
    const { value } = this.state;
    const checkPass = value !== undefined;
    if (!checkPass) {
      this.setState({ showError: true });
    }
    return checkPass;
  }
  onOk() {
    const { collectionDetail, boundGlobalActions, boundProjectActions } = this.props;
    const {
      setWatermark,
      applyWaterMark,
      updateWatermarkLoading,
      updateImgList,
      handleClearSelectImg
    } = boundProjectActions;
    const { hideModal, addNotification } = boundGlobalActions;
    const { checked: apply_all, value: watermark_uid } = this.state;

    window.logEvent.addPageEvent({
      name: __isCN__ ? 'GalleryChooseWatermark_Click_Ok' : 'GalleryChooseWatermark_Click_Save',
      WatermarkUid: watermark_uid,
      ApplyToAll: apply_all
    });

    const check = this.check();
    // todotodo modal.all应该是根据apply_all， 是否全部加loading
    if (check) {
      const images = collectionDetail.get('images');
      const collection_uid = collectionDetail.get('enc_collection_uid');
      const current_uid = collectionDetail.get('currentSetUid');
      const set_uid = collectionDetail.getIn(['default_set', 'set_uid']);
      const image_uids = collectionDetail.getIn(['photos', 'selectedImgUidList']);
      const bodyParams = {
        collection_uid,
        set_uid,
        image_uids,
        watermark_uid,
        apply_all: +apply_all
      };
      updateWatermarkLoading({
        loading: true,
        apply_all: +apply_all
      });
      const imageUids = image_uids.toJS();
      updateImgList(imageUids, true, current_uid);
      handleClearSelectImg();
      setWatermark({
        bodyParams
        // showLoading: boundGlobalActions.showGlobalLoading,
        // hideLoading: boundGlobalActions.hideGlobalLoading
      }).then(
        res => {
          updateImgList(imageUids, false, current_uid);
          updateWatermarkLoading({
            loading: false,
            apply_all: +apply_all
          });
          applyWaterMark(res.data);
          addNotification({
            message: !!watermark_uid
              ? t('WATERMARK_ADDED_SUCCESSFULLY')
              : t('WATERMARK_CANCEL_SUCCESSFULLY'),
            level: 'success',
            autoDismiss: 2
          });
          // hideModal(BASE_MODAL);
        },
        err => {
          console.log(err);
          addNotification({
            message: t('ADD_WATERMARK_FAILED'),
            level: 'error',
            autoDismiss: 2
          });
        }
      );
      hideModal(BASE_MODAL);
    }
  }
  render() {
    const { collectionDetail } = this.props;
    const watermarkList = collectionDetail.get('watermarkList');
    const { showError, value } = this.state;
    const selectProps = {
      className: 'watermark-select-wrapper',
      placeholder: t('SELECT_WATERMARK'),
      value,
      searchable: false,
      options: watermarkList.toJS(),
      onChanged: this.changeWarkmark
    };
    const checkboxProps = {
      className: 'watermark-apply-all-checkbox theme-1',
      text: t('WATERMARK_CHECKE_TEXT'),
      onClicked: this.onCheckedChange
    };
    return (
      <div className="watermark-modal-cont-wrapper">
        <div className="watermark-cont">
          <span className="watermark-important">{t('IMPORTANT')}</span>
          <span>{t('WATERMARK_CONTENT_TEXT')}</span>
        </div>
        <XSelect {...selectProps} />
        {!!showError && <div className="watermark-error-tip">{t('VALID_WATERMARK_TIP')}</div>}
        <XCheckBox {...checkboxProps} />
      </div>
    );
  }
}

export default WatermarkModalCont;
