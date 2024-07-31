import classNames from 'classnames';
import React, { Component } from 'react';
import './index.scss';

class XRadio extends Component {
  constructor(props) {
    super(props);

    this.onClicked = () => {
      const { onClicked, value } = this.props;

      this.radio.checked = true;

      if (typeof onClicked === 'function') {
        onClicked(value);
      }
    };
  }

  render() {
    const {
      className,
      style,
      text,
      title,
      // radio attribute
      name = '',
      checked = false,
      disabled = false,
      value = '',
      skin = '',
      textClassName,
      children
    } = this.props;

    const xRadioClass = classNames('x-radio', className);
    const xRadioStyle = style;
    const iconSkinClass = classNames('icon', skin);
    const textClass = classNames('text', textClassName);
    return (
      <div
        className={xRadioClass}
        style={xRadioStyle}
        title={title}
        onClick={this.onClicked.bind(this)}
      >
        <input
          className="native-radio"
          ref={node => (this.radio = node)}
          type="radio"
          name={name}
          title={title}
          value={value}
          defaultChecked={checked}
          checked={checked}
          disabled={disabled}
        />
        <span className={iconSkinClass} title={title} />

        {text ? (
          <span className={textClass} title={title}>
            {text}
          </span>
        ) : null}

        {children}
      </div>
    );
  }
}

export default XRadio;
