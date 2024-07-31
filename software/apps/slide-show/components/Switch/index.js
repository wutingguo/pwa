import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { XIcon, XPureComponent } from '@common/components';
import './index.scss';

class Switch extends XPureComponent {
  constructor(props) {
    super(props);
  }

  onSwitch = () => {
    const { onSwitch } = this.props;
    onSwitch(!this.switch.checked);
  }

  render() {
    const { checked, id } = this.props;
    return (
      <div className="switch-box" id={id}>
        <div className="switch-wrap">
          <input id="switch" type="checkbox" checked={checked} onChange={() => {}} className="switch-checkbox" ref={input => this.switch = input} />
          <label className="switch-label" htmlFor="switch" onClick={this.onSwitch}>
            {
              checked ? (
                <div className="switch-text">
                  <XIcon type='switch-checked' />
                  <span className="label-text">on</span>
                  <XIcon type='switch-on' />
                </div>
              ) : (
                <div className="switch-text off">
                  <XIcon type='switch-unchecked' />
                  <span className="label-text">off</span>
                </div>
              )
            }
          </label>
        </div>
      </div>
    )
  }
}

export default Switch;

Switch.propTypes = {
  onSwitch: Proptypes.func.isRequired,
  checked: Proptypes.bool.isRequired,
  key: Proptypes.string
};

Switch.defaultProps = {};
