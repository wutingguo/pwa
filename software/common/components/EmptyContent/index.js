import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { XIcon } from '@common/components';
import emptyPng from '@resource/static/icons/empty.png';
import './index.scss';

class EmptyContent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      desc,
      tip,
      other,
      iconText,
      handleClick,
      style,
      handleButton,
      bottomButton
    } = this.props;

    return (
      <div className="empty-content">
        {__isCN__ && <img src={emptyPng} width="70px" />}
        <span className="desc" style={style}>
          {desc}
        </span>
        {handleButton ? (
          handleButton
        ) : (
          <XIcon
            type="add"
            iconWidth={12}
            iconHeight={12}
            theme={__isCN__ ? 'black_cn' : 'black'}
            title={iconText}
            text={iconText}
            onClick={handleClick}
          />
        )}
        {bottomButton && bottomButton}
        <span className="tip">{tip}</span>
        <span className="other">{other}</span>
      </div>
    );
  }
}

export default EmptyContent;

EmptyContent.propTypes = {
  desc: PropTypes.string,
  tip: PropTypes.string,
  iconText: PropTypes.string,
  style: PropTypes.object,
  handleClick: PropTypes.func,
  handleButton: PropTypes.node
};

EmptyContent.defaultProps = {
  desc: '',
  tip: '',
  iconText: '',
  style: null,
  handleClick: () => {},
  handleButton: null
};
