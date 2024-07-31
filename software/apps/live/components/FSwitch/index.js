import classnames from 'classnames';
import React from 'react';

import { XIcon, XPureComponent } from '@common/components';

import './index.scss';

class FSwicth extends XPureComponent {
  constructor(props) {
    super(props);
  }

  onChange = label_code => {
    const { onChange, disabled } = this.props;
    if (disabled) return;
    onChange?.(!this.switch.checked, label_code);
  };

  render() {
    const {
      value,
      id,
      disabled,
      isShowText = true,
      labelStyle,
      iconProps = {},
      label_code,
    } = this.props;

    return (
      <div className={classnames('switch-box', { disabled })} id={id}>
        <div className="switch-wrap">
          <input
            id="switch"
            type="checkbox"
            checked={value}
            onChange={() => {}}
            className="switch-checkbox"
            ref={input => (this.switch = input)}
          />
          <label
            className="switch-label"
            htmlFor="switch"
            onClick={() => this.onChange(label_code)}
            style={labelStyle}
          >
            {value ? (
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

export default FSwicth;
