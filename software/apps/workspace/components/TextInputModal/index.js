import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XModal from '@resource/websiteCommon/components/dom/modals/XModal';
import XButton from '@resource/websiteCommon/components/dom/XButton';
import './index.scss';

class TextInputModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editText: props.textValue,
      showFormatTip: false
    };

    this.submitText = this.submitText.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  changeText(event) {
    const { target } = event
    this.setState({
      editText: target.value
    })
  }

  submitText() {
    const { editText } = this.state;
    const { onConfirm, Invalidation } = this.props;
    const textToSubmit = editText.trim();
    if (Invalidation && Invalidation.test) {
      const isInvalid = Invalidation.test(textToSubmit);
      if (isInvalid) {
        this.setState({
          showFormatTip: true
        });
        return ;
      } else {
        this.setState({
          showFormatTip: false
        });
      }
    }
    onConfirm(textToSubmit);
  }

  render() {
    const {
      modalTitle,
      textLabel,
      placeholder,
      closeModal,
      showCancel,
      cancelText,
      confirmText,
      formatTip,
      maxLength
    } = this.props;
    const { editText, showFormatTip } = this.state;

    const inputProps = {};
    if (maxLength) {
      inputProps.maxLength = maxLength;
    }

    return (
      <XModal
        className="text-input-modal"
        onClosed={closeModal}
        opened={true}
      >
        <div className="text-input-modal-content">
          <div className="text-input-modal-title">{modalTitle}</div>
          <div className="text-input-out-container">
            <div className="text-input-container">
              <div className="text-input-label">{textLabel}</div>
              <input
                className="text-input"
                placeholder={placeholder}
                value={editText}
                onChange={this.changeText}
                {...inputProps}
              />
            </div>
            {showFormatTip && <div className="format-tip">{formatTip}</div>}
          </div>
          <div className="buttons-container">
            {showCancel && (
              <XButton
                className='white'
                onClicked={closeModal}
              >{cancelText}</XButton>
            )}
            <XButton
              className='black'
              onClicked={this.submitText}
              disabled={!editText.trim()}
            >{confirmText}</XButton>
          </div>
        </div>
      </XModal>
    );
  }
}

TextInputModal.propTypes = {
  modalTitle: PropTypes.string,
  textLabel: PropTypes.string,
  placeholder: PropTypes.string,
  textValue: PropTypes.string,
  showCancel: PropTypes.bool,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  formatTip: PropTypes.string,
  Invalidation: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

TextInputModal.defaultProps = {
  modalTitle: '作品名称',
  textLabel: '名称:',
  placeholder: '未命名',
  textValue: '',
  showCancel: true,
  cancelText: '返回',
  confirmText: '确定',
  // Invalidation: '[^\u4e00-\u9fa5a-zA-Z0-9`\\s-_]',
  Invalidation: /[^\u4e00-\u9fa5a-zA-Z0-9`\s-_]/,
  formatTip: '标题中只允许使用字母、中文、数字、空格、-（连字符）和_（下划线）'
}

export default TextInputModal;