import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { XIcon, XPureComponent } from '@common/components';

import './index.scss';

class SettingsHeader extends XPureComponent {
  render() {
    const { className, title, actionBtn, hasHandleBtns = true } = this.props;
    const wrapperCls = classnames('global-settings-header-wrapper', {
      [className]: !!className,
    });
    return (
      <div className={wrapperCls}>
        <div className="global-settings-header-left">{title}</div>
        {/* {
          hasHandleBtns ? (
            <div className="global-settings-header-right">
              {actionBtn}
            </div>
          ) : null
        } */}
      </div>
    );
  }
}
SettingsHeader.propTypes = {
  className: PropTypes.string,
  title: PropTypes.any,
  actionBtn: PropTypes.any,
  hasHandleBtns: PropTypes.bool,
};

export default SettingsHeader;
