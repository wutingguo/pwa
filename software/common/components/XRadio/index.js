import classNames from 'classnames';
import React, { Component } from 'react';
import './index.scss';

class XRadio extends Component {
  constructor(props) {
    super(props);

    this.onClicked = () => {
      const { onClicked, value, disabled, type = 'radio' } = this.props;

      if (!disabled) {
        if (type === 'checkbox') {
          if (typeof onClicked === 'function') {
            onClicked(!this.radio.checked, value);
          }
        } else {
          this.radio.checked = true;
          if (typeof onClicked === 'function') {
            onClicked(value);
          }
        }
      }
    };
  }

  render() {
    const {
      className,
      style,
      text,

      // radio attribute
      name = '',
      checked = false,
      disabled = false,
      value = '',
      skin = '',
      textClassName,
      children,
      type = 'radio'
    } = this.props;

    const xRadioClass = classNames('x-radio', className);
    const xRadioStyle = style;
    const iconSkinClass = classNames('icon', skin);
    const textClass = classNames('text', textClassName);
    return (
      <div className={xRadioClass} style={xRadioStyle} onClick={this.onClicked.bind(this)}>
        <input
          className="native-radio"
          ref={node => (this.radio = node)}
          type={type}
          name={name}
          value={value}
          defaultChecked={checked}
          checked={checked}
          disabled={disabled}
        />
        <span className={iconSkinClass} />

        {text ? (
          <span className={textClass} title={text}>
            {text}
          </span>
        ) : null}

        {children}
      </div>
    );
  }
}

export default XRadio;
