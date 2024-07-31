import classNames from 'classnames';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './index.scss';

class XDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: false,
      closeDropdownTimer: null,
      openDropdownTimer: null,
    };

    this.openDropdown = this.openDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
  }
  addEventListenerFn = () => {
    this.setState({
      isOpened: false,
    });
  };
  componentDidMount() {
    window.addEventListener('click', this.addEventListenerFn);
  }
  componentWillUnmount() {
    window.removeEventListener('click', this.addEventListenerFn);
  }
  onDropdownItemClick(action, dropdownItem) {
    this.closeDropdownImmediately();
    window.clearTimeout(this.state.openDropdownTimer);
    action(dropdownItem);
  }

  closeDropdownImmediately = () => {
    this.setState({ isOpened: false });
  };

  openDropdown(e) {
    e.stopPropagation;
    if (this.state.isOpened) {
      this.closeDropdown();
      return;
    }
    const openDropdownTimer = window.setTimeout(() => {
      this.setState({ isOpened: true });
    }, 300);

    window.clearTimeout(this.state.closeDropdownTimer);

    this.setState({ openDropdownTimer });
  }

  closeDropdown() {
    const closeDropdownTimer = window.setTimeout(() => {
      this.setState({ isOpened: false });
    }, 300);
    this.setState({ closeDropdownTimer });
  }

  render() {
    const { isOpened } = this.state;
    const {
      label,
      disabled,
      dropdownList,
      arrow,
      selectedValue,
      customClass,
      renderLable,
      renderOptionItem,
      isShowCaretIcon = true,
    } = this.props;
    const dropdownStyle = classNames('dropdown', customClass, {
      open: isOpened,
      disabled,
    });

    const dropdownMenuStyle = classNames('dropdown-menu', {
      'arrow-center': arrow === 'center',
      'arrow-left': arrow === 'left',
      'arrow-right': arrow === 'right',
      'arrow-down-left': arrow === 'down-left',
    });

    const menuContentTopStyle = {
      top:
        arrow === 'down-left'
          ? `calc(100% - ${42 * dropdownList.length + 32}px)`
          : 'calc(100% + 9px)',
    };

    return (
      <div
        className={dropdownStyle}
        onClick={e => this.openDropdown(e)}
        // onMouseLeave={this.closeDropdown}
      >
        {renderLable ? (
          renderLable(label, selectedValue)
        ) : (
          <button className="btn-white" disabled={disabled}>
            {label}
            {isShowCaretIcon && <span className="icon caret" />}
          </button>
        )}

        <ul className={dropdownMenuStyle} style={menuContentTopStyle}>
          <div className="drop-down-content">
            {!!dropdownList.length &&
              dropdownList.map(dropdownItem => {
                const dropdownItemStyle = classNames({
                  disabled: dropdownItem.disabled,
                  hidden: dropdownItem.hidden,
                  active:
                    typeof dropdownItem.value !== 'undefined' &&
                    isEqual(selectedValue, dropdownItem.value),
                });
                return renderOptionItem ? (
                  renderOptionItem(dropdownItem, this.closeDropdownImmediately)
                ) : (
                  <li key={dropdownItem.id || dropdownItem.label}>
                    <a
                      className={dropdownItemStyle}
                      onClick={e => {
                        e.stopPropagation;
                        this.onDropdownItemClick.call(this, dropdownItem.action, dropdownItem);
                      }}
                    >
                      {dropdownItem.label}
                    </a>
                  </li>
                );
              })}
          </div>
        </ul>
      </div>
    );
  }
}

XDropdown.propTypes = {
  arrow: PropTypes.string,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  selectedValue: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.string]),
  dropdownList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.any.isRequired,
      disabled: PropTypes.bool,
      value: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.string]),
      action: PropTypes.func.isRequired,
    }).isRequired
  ).isRequired,
};

XDropdown.defaultProps = {
  arrow: 'center',
};

export default XDropdown;
