import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isFunction } from 'lodash';

import { XModal, XPureComponent, XInput, XIcon } from '@common/components';
import { NAME_REG, SPACE_REG } from '@resource/lib/constants/reg';
import './index.scss';
import { select } from 'react-cookies';

class GetDirectLinkModal extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hasCopied: false
    };
  }

  onCopyDirectLink = () => {
    const obj = document.querySelector('#getDirectLinkInput');
    obj.select();
    document.execCommand('Copy');
    this.setState({
      hasCopied: true
    });
  };

  render() {
    const { data } = this.props;
    const { hasCopied } = this.state;

    const close = data.get('close');
    const title = data.get('title');
    const topic = data.get('topic');
    const tip = data.get('tip');
    const copyBtnText = data.get('copyBtnText');
    const inputValue = data.get('shareDirectLink');
    const copiedBtnText = data.get('copiedBtnText');
    const wrapClass = classNames('x-get-direct-link-wrap', data.get('className'));

    const sty = data.get('style');
    const style = sty ? sty.toJS() : {};

    const escapeClose = !!data.get('escapeClose');
    const isHideIcon = !!data.get('isHideIcon');

    const inputProps = {
      className: 'get-direct-link-input',
      value: inputValue,
      hasSuffix: false,
      isShowSuffix: false,
      readOnly: 'readonly',
      id: 'getDirectLinkInput',
      onClick: this.onCopyDirectLink
    };

    const linkIconCls = classNames({
      'cn-link-icon': __isCN__
    });

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
          <div className="copy-link-wrap">
            <span className="topic">{topic}</span>
            <div className="input-with-copy">
              <span className="forward-icon">
                <XIcon className={linkIconCls} type="link" iconWidth={16} iconHeight={16} />
              </span>
              <XInput {...inputProps} />
              <span className="copy-btn" onClick={this.onCopyDirectLink}>
                {hasCopied ? copiedBtnText : copyBtnText}
              </span>
            </div>
            <span className="tips">{tip}</span>
          </div>
        </div>
      </XModal>
    );
  }
}

GetDirectLinkModal.propTypes = {
  data: PropTypes.object.isRequired
};

GetDirectLinkModal.defaultProps = {};

export default GetDirectLinkModal;
