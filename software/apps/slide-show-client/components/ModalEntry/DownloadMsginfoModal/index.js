import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ToolTip from 'react-portal-tooltip';
import { isFunction } from 'lodash';

import { XModal, XButton, XInput, XIcon } from '@common/components';
import { emailReg, SPACE_REG } from '@resource/lib/constants/reg';
import './index.scss';

class BindEmailModal extends Component {
  constructor(props) {
    super(props);

    const { data } = props;

    this.state = {
      inputValue: data.get('collectionName') || '',
      isShowTip: false,
      tipContent: '',
      isShowSuffix: false,
      isShowToolTip: false
    };

    this.showToolTip = this.showToolTip.bind(this);
    this.hideToolTip = this.hideToolTip.bind(this);
  }

  showToolTip() {
    window.logEvent.addPageEvent({
      name: 'GalleryFavoritePopup_Click_Why'
    });

    this.setState({
      isShowToolTip: true
    });
  }

  hideToolTip() {
    this.setState({
      isShowToolTip: false
    });
  }

  render() {
    const { data } = this.props;
    const close = data.get('close');
    const title = data.get('title');
    const wrapClass = classNames('download-msg-wrap');
    const contentClass = classNames('desc-content', data.get('className'));
    return (
      <XModal className={wrapClass} opened onClosed={close} escapeClose={false} isHideIcon={false}>
        {/* <div className="modal-title">{title}</div> */}
        <div className="modal-body">
          <div className={contentClass}>{title}</div>
          <div
            className="btn-ok"
            onClick={() => {
              close();
            }}
          >
            OK
          </div>
        </div>
      </XModal>
    );
  }
}

BindEmailModal.propTypes = {
  data: PropTypes.object.isRequired
};

BindEmailModal.defaultProps = {};

export default BindEmailModal;
