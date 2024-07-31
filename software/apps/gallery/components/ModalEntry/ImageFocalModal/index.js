import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XPureComponent from '@resource/components/XPureComponent';

import { XModal, XImageFocal } from '@common/components';
import { IMAGE_FOCAL_MODAL } from '@apps/gallery/constants/modalTypes';
import './index.scss';

class ImageFocalModal extends XPureComponent {
  render() {
    const { data } = this.props;

    const close = data.get('close');
    const src = data.get('src');
    const imgRot = data.get('orientation') || data.get('imgRot');
    const onFocalChanged = data.get('onFocalChanged');
    const focalPosition = data.get('focalPosition');

    // 焦点组件的props
    const focalProps = {
      src,
      imgRot,
      onFocalChanged,
      top: focalPosition.get('y'),
      left: focalPosition.get('x')
    };

    return (
      <XModal className="image-focal-modal" opened onClosed={close} escapeClose isHideIcon={false}>
        <div className="modal-title">{t('SET_COVER_FOCAL')}</div>
        <div className="modal-body">
          <XImageFocal {...focalProps} />
        </div>
      </XModal>
    );
  }
}

ImageFocalModal.propTypes = {
  data: {
    src: '',
    close: () => {},
    onFocalChanged: () => {}
  }
};

ImageFocalModal.defaultProps = {};

export default ImageFocalModal;
