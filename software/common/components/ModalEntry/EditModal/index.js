import classNames from 'classnames';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { throttle } from '@resource/lib/utils/timeout';

import { NAME_CN_REG, NAME_REG, SPACE_REG } from '@resource/lib/constants/reg';

import { XButton, XIcon, XInput, XModal, XPureComponent } from '@common/components';

import { EDIT_MODAL } from '@apps/gallery/constants/modalTypes';

import './index.scss';

class EditModal extends XPureComponent {
  constructor(props) {
    super(props);

    const { data } = props;
    this.state = {
      inputValue: data.get('initialValue') || '',
      isShowTip: false,
      tipContent: '',
      isShowSuffix: false,
    };
  }

  onClickBtn = cb => {
    const { data } = this.props;
    const close = data.get('close');

    if (isFunction(close)) {
      close();
    }

    if (isFunction(cb)) {
      cb();
    }
  };

  onInputFocus = e => {
    const inputValue = e.target.value;
    this.setState({
      isShowSuffix: !!inputValue ? true : false,
    });
  };

  onInputChange = e => {
    const inputValue = e.target.value;
    const { data } = this.props;
    const requiredTip = data.get('requiredTip');
    this.setState({
      inputValue,
      isShowTip: !!inputValue ? false : true,
      tipContent: !!inputValue ? '' : requiredTip,
      isShowSuffix: !!inputValue ? true : false,
    });
  };

  onInputClear = () => {
    const { data } = this.props;
    const tipContent = data.get('requiredTip');
    this.setState({
      inputValue: '',
      isShowSuffix: false,
      isShowTip: true,
      tipContent,
    });
  };

  onCreate = throttle(() => {
    const { data } = this.props;
    const { inputValue } = this.state;

    const handleSave = data.get('handleSave');
    const requiredTip = data.get('requiredTip');
    const illegalTip = data.get('illegalTip');

    // const nameReg = __isCN__ ? NAME_CN_REG : NAME_REG;
    // const isLegal = nameReg.test(inputValue);
    // http://zentao.xiatekeji.com:99/execution-storyView-1279-189.html  【新增】【公共】【Gallery&Slideshow】Gallery + Slideshow 命名放开特殊字符限制与重复命名限制
    const isLegal = true;
    const isEmptyStr = SPACE_REG.test(inputValue);
    let tipContent = '';
    let isShowTip = false;
    if (!inputValue || isEmptyStr) {
      isShowTip = true;
      tipContent = requiredTip;
    } else if (!isLegal) {
      isShowTip = true;
      tipContent = illegalTip;
    }

    this.setState({
      isShowTip,
      tipContent,
    });

    if (inputValue && isLegal && !isEmptyStr) {
      handleSave(inputValue.trim());
    }
  }, 1500);

  // 关闭弹框
  hideModal = () => this.props.boundGlobalActions.hideModal(EDIT_MODAL);
  render() {
    const { data } = this.props;
    const { inputValue, isShowTip, isShowSuffix, tipContent } = this.state;

    const close = data.get('close') || this.hideModal;
    const title = data.get('title');
    const cancelText = data.get('cancelText') || t('CANCEL');
    const confirmText = data.get('confirmText') || t('SAVE');
    const wrapClass = classNames('x-edit-wrap', data.get('className'));
    const maxLength = data.get('maxLength');
    const sty = data.get('style');
    const style = sty ? sty.toJS() : {};

    const escapeClose = !!data.get('escapeClose');
    const isHideIcon = !!data.get('isHideIcon');

    const messageDom = data.get('message');
    const message = messageDom.toJS ? messageDom.toJS() : messageDom;

    const handleCancel = data.get('handleCancel') || this.hideModal;

    const inputProps = {
      className: 'edit',
      value: inputValue,
      placeholder: t('COLLECTION_NAME_PLACEHOLDER'),
      onFocus: this.onInputFocus,
      onChange: this.onInputChange,
      hasSuffix: true,
      isShowSuffix: isShowSuffix,
      maxLength: maxLength,
      isShowTip: isShowTip,
      tipContent: tipContent,
      suffixIcon: (
        <XIcon type="input-clear" iconWidth={12} iconHeight={12} onClick={this.onInputClear} />
      ),
    };

    return (
      <XModal
        className={wrapClass}
        styles={style}
        opened={true}
        onClosed={close}
        escapeClose={escapeClose}
        isHideIcon={isHideIcon}
      >
        <div className="modal-title">{title}</div>
        <div className="modal-body">
          <div className="edit-name-wrap">
            <span className="msg">{message}</span>
            <div className="input-with-clear">
              <XInput {...inputProps} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <XButton className="white pwa-btn" onClicked={handleCancel}>
            {cancelText}
          </XButton>
          <XButton className="pwa-btn" onClicked={this.onCreate}>
            {confirmText}
          </XButton>
        </div>
      </XModal>
    );
  }
}

EditModal.propTypes = {
  data: PropTypes.object.isRequired,
};

EditModal.defaultProps = {
  data: {
    title: '',
    cancelText: '',
    confirmText: '',
    initialValue: '',
    message: '',
    requiredTip: '',
    illegalTip: '',
    handleSave: () => {},
    handleCancel: () => {},
    close: () => {},
  },
};

export default EditModal;
