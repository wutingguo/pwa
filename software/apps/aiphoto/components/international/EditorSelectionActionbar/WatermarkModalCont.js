import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XPureComponent from '@resource/components/XPureComponent';
import { XSelect, XCheckBox } from '@common/components';
import { BASE_MODAL } from '@apps/gallery/constants/modalTypes';

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
  changeWarkmark = ({ value }) => {
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
    const { setWatermark, applyWaterMark } = boundProjectActions;
    const { hideModal, addNotification } = boundGlobalActions;
    const { checked: apply_all, value: watermark_uid } = this.state;

    const check = this.check();
    if (check) {
      const collection_uid = collectionDetail.get('enc_collection_uid');
      const set_uid = collectionDetail.getIn(['default_set', 'set_uid']);
      const image_uids = collectionDetail.getIn(['photos', 'selectedImgUidList']);
      const bodyParams = {
        collection_uid,
        set_uid,
        image_uids,
        watermark_uid,
        apply_all: +apply_all
      };
      setWatermark({
        bodyParams,
        showLoading: boundGlobalActions.showGlobalLoading,
        hideLoading: boundGlobalActions.hideGlobalLoading
      }).then(
        res => {
          applyWaterMark(res.data);
          addNotification({
            message: t('WATERMARK_ADDED_SUCCESSFULLY'),
            level: 'success',
            autoDismiss: 2
          });
          hideModal(BASE_MODAL);
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
