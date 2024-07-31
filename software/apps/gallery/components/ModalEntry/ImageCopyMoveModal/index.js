import classNames from 'classnames';
import { fromJS } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import XPureComponent from '@resource/components/XPureComponent';

import { throttle } from '@resource/lib/utils/timeout';

import { XButton, XModal } from '@common/components';

import './index.scss';

class ImageCopyMoveModal extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {
      setUid: '',
      showTip: false,
    };
  }

  onSelectSet = setUid => {
    // console.log('setUid； ', setUid);
    this.setState({
      setUid,
      showTip: false,
    });
  };

  handleConfirm = throttle(() => {
    const { data } = this.props;
    const handleSave = data.get('handleSave');
    const { setUid } = this.state;
    this.setState({
      showTip: !setUid,
    });
    if (!setUid) return;
    throttle(handleSave(setUid));
  }, 3000);

  render() {
    const { setUid, showTip } = this.state;
    const { data } = this.props;

    const close = data.get('close');
    const handleCancel = data.get('handleCancel');
    const title = data.get('title');
    const cancelText = data.get('cancelText') || t('CANCEL');
    const confirmText = data.get('confirmText') || t('SAVE');
    const otherSets = data.get('otherSets') || fromJS([]);
    const wrapClass = classNames('image-copy-move-wrap', data.get('className'));
    const titleDesc = data.get('titleDesc');
    return (
      <XModal className={wrapClass} opened onClosed={close} escapeClose isHideIcon={false}>
        <div className="modal-title">{title}</div>
        {__isCN__ && titleDesc && <div className="desc">{titleDesc}</div>}
        <div className="modal-body">
          <div className="sets-wrap">
            {otherSets && otherSets.size
              ? otherSets.map(set => {
                  return (
                    <span
                      key={set.get('set_uid')}
                      className={`set-item ellipsis ${
                        +setUid === +set.get('set_uid') ? 'actived' : ''
                      }`}
                      onClick={() => this.onSelectSet(set.get('set_uid'))}
                    >
                      {set.get('set_name')}
                    </span>
                  );
                })
              : null}
          </div>
        </div>
        {showTip ? (
          <span className="tips-content">{t('IMAGE_COPY_MOVE_CHANGE_SET_TIP')}</span>
        ) : null}
        <div className="modal-footer">
          <XButton className="white pwa-btn" onClicked={handleCancel}>
            {cancelText}
          </XButton>
          <XButton className="pwa-btn" onClicked={this.handleConfirm}>
            {confirmText}
          </XButton>
        </div>
      </XModal>
    );
  }
}

ImageCopyMoveModal.propTypes = {
  data: PropTypes.object.isRequired,
};

ImageCopyMoveModal.defaultProps = {};

export default ImageCopyMoveModal;
