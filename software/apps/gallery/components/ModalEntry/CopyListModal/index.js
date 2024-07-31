import React, { Component } from 'react';
import classnames from 'classnames';
import { XBaseModal, XInput } from '@common/components';
import {COPY_LIST_MODAL} from '@apps/gallery/constants/modalTypes';
import './index.scss';

class CopyListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSuffix: false,
      names: props.data.get('names') || [],
      inputValue: '',
      copied: false
    }
  }
  onOk = () => {
    this.textAreaRef.focus();
    this.textAreaRef.select();
    document.execCommand('Copy');
    this.setState({copied: true});
  }
  handleChange = e => {
    this.setState({
      inputValue: e.target.value
    });
  }
  handleSuffix = () => {
    this.setState(prevState => {
      const {showSuffix} = prevState;
      return {
        showSuffix: !showSuffix,
        inputValue: ''
      }
    })
  }
  onCancle = () => {
    this.props.boundGlobalActions.hideModal(COPY_LIST_MODAL);
  }
  render() {
    const {showSuffix, names, inputValue, copied} = this.state;
    const suffix = inputValue[0] === '.' ? inputValue.substring(1) : inputValue;
    const newNames = names.map(name => {
      return inputValue ? `${name}.${suffix}` : name;
    });
    
    const inputProps = {
      value: inputValue,
      placeholder: 'E.g.jpg',
      onChange: this.handleChange
    }
    const modalProps = {
      title: t('LIGHTROOM_COPY_LIST'),
      cancelText: t('CLOSE'),
      confirmText: copied ? t('COPIED') : t('COPY'),
      onClosed: this.onCancle,
      onOk: this.onOk
    }
    const iconCls = classnames('copy-list-modal-file-extension-icon', {
      ['transform-45deg']: showSuffix
    })
    return (
      <XBaseModal {...modalProps}>
        <div className="copy-list-modal-cont-wrapper">
          <div className="copy-list-modal-cont-text">
            <span>{t('LIGHTROOM_COPY_MODAL_CONTENT')}</span>
            {/* 一期先隐藏 */}
            {/* <span className="copy-list-modal-lean-more">{t('LEARN_MORE')}</span> */}
          </div>
          <textarea
            className="copy-list-modal-textarea"
            value={newNames.join(', ')} 
            ref={node => this.textAreaRef = node}
            readOnly
          />
          <div className="copy-list-modal-file-extension-wrapper">
            <div className="copy-list-modal-file-extension" onClick={this.handleSuffix}>
              {t('FILE_EXTENSION')} <span className={iconCls}>+</span>
            </div>
            {
              showSuffix && (
                <XInput {...inputProps} />
              )
            }
          </div>
        </div>
      </XBaseModal>
    )
  }
}

export default CopyListModal;