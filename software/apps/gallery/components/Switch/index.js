import React, { Component } from 'react';
import classnames from 'classnames';
import Proptypes from 'prop-types';
import { XIcon, XPureComponent } from '@common/components';
import './index.scss';

class Switch extends XPureComponent {
  constructor(props) {
    super(props);
  }

  onSwitch = label_code => {
    const { onSwitch, disabled } = this.props;
    if (disabled) return;
    onSwitch(!this.switch.checked, label_code);
  };

  render() {
    const {
      checked,
      id,
      disabled,
      isShowText = true,
      labelStyle,
      iconProps = {},
      label_code
    } = this.props;

    return (
      <div className={classnames('switch-box', { disabled })} id={id}>
        <div className="switch-wrap">
          <input
            id="switch"
            type="checkbox"
            checked={checked}
            onChange={() => {}}
            className="switch-checkbox"
            ref={input => (this.switch = input)}
          />
          <label
            className="switch-label"
            htmlFor="switch"
            onClick={() => this.onSwitch(label_code)}
            style={labelStyle}
          >
            {checked ? (
              <div className="switch-text">
                <XIcon type="switch-checked" {...iconProps} />
                {isShowText ? <span className="label-text">{__isCN__ ? '开' : 'on'}</span> : null}
                {isShowText ? <XIcon type="switch-on" /> : <span></span>}
              </div>
            ) : (
              <div className="switch-text off">
                <XIcon type="switch-unchecked" {...iconProps} />
                {isShowText ? <span className="label-text">{__isCN__ ? '关' : 'off'}</span> : null}
              </div>
            )}
          </label>
        </div>
      </div>
    );
  }
}

export default Switch;

Switch.propTypes = {
  onSwitch: Proptypes.func.isRequired,
  checked: Proptypes.bool.isRequired,
  key: Proptypes.string
};

Switch.defaultProps = {};
