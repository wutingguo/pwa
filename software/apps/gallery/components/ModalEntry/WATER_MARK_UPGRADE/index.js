import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isFunction } from 'lodash';

import { XModal, XPureComponent, XInput, XTextarea } from '@common/components';
import { NAME_REG, SPACE_REG } from '@resource/lib/constants/reg';
import './index.scss';
import { select } from 'react-cookies';

class WATER_MARK_UPGRADE extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  handleUpgrade = () => {
    window.logEvent.addPageEvent({
      name: 'GalleryWatermarkPopup_Click_Upgrade'
    });
    const { data } = this.props;
    const { url } = data.get('params').toJS();
    const close = data.get('close');
    close();
    window.location.href = url;
  };

  handleClose = () => {
    window.logEvent.addPageEvent({
      name: 'GalleryWatermarkPopup_Click_Cross'
    });
    const { data } = this.props;
    const close = data.get('close');
    close();
  };

  render() {
    const { data } = this.props;
    const close = data.get('close');
    const wrapClass = classNames('water-mark-wrap', data.get('className'));
    const { url, upgradeContent, btnText } = data.get('params').toJS();
    return (
      <XModal className={wrapClass} opened={true} onClosed={this.handleClose}>
        <div className="upgrade-content">{upgradeContent}</div>
        <div className="upgrade-btn" onClick={this.handleUpgrade}>
          {btnText}
        </div>
      </XModal>
    );
  }
}

WATER_MARK_UPGRADE.propTypes = {
  data: PropTypes.object.isRequired
};

WATER_MARK_UPGRADE.defaultProps = {};

export default WATER_MARK_UPGRADE;
