import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { get, merge, isEqual } from 'lodash';

import XLoading from '../XLoading';
import './index.scss';

class ImageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null,
      isImgLoading: true
    };

    this.onLoad = this.onLoad.bind(this);
    this.onError = this.onError.bind(this);
    this.setImageUrl = this.setImageUrl.bind(this);
    this.renderText = this.renderText.bind(this);
  }

  renderText(item) {
    const { text, isHTML = false } = item;

    if (!text) {
      return null;
    }

    return isHTML ? (
      <div
        className="text"
        dangerouslySetInnerHTML={{
          __html: text
        }}
      />
    ) : (
      <div className="text">{text}</div>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      isEqual(this.props.data, nextProps.data) &&
      this.state.imageUrl === nextState.imageUrl &&
      this.state.isImgLoading === nextState.isImgLoading
    ) {
      return false;
    }

    return true;
  }

  onLoad(e) {
    const { actions } = this.props;

    this.setState(
      {
        isImgLoading: false
      },
      () => {
        actions.onImageLoaded && actions.onImageLoaded(e);
      }
    );
  }

  onError() {
    const { actions } = this.props;

    this.setState(
      {
        isImgLoading: false
      },
      () => {
        actions.onImageLoaded && actions.onImageLoaded();
      }
    );
  }

  setImageUrl(url) {
    if (url) {
      this.setState({
        imageUrl: url,
        isImgLoading: true
      });
    } else {
      this.setState({
        imageUrl: '',
        isImgLoading: true
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldUrl = get(this.props, 'data.item.imageUrl');
    const currentUrl = get(nextProps, 'data.item.imageUrl');
    const orientation = get(nextProps, 'data.item.orientation') || 0;
    if (oldUrl !== currentUrl) {
      this.setImageUrl(currentUrl, orientation);
    }
  }

  componentDidMount() {
    const { data } = this.props;
    const { item } = data;
    const { imageUrl, orientation = 0 } = item;
    this.setImageUrl(imageUrl, orientation);
  }

  render() {
    const { data, actions, className } = this.props;
    const { isImgLoading, imageUrl } = this.state;
    const { item, options, columnHeight, columnWidth = 'auto', background } = data;
    const { handleMouseDown, handleMouseOver, handleMouseOut, handleClick } = actions;
    const { customStyle } = options;
    const { guid, url, imgStyle = {} } = item;

    // ImageItem的最大高设置和自定义样式的设置
    const nodeStyle = merge({}, customStyle);

    // 图片容器的active动画添加
    const imgContainerClass = classnames('img-container', {
      active: !!imageUrl && !isImgLoading
    });

    const imgContainerStyle = {
      height: columnHeight,
      width: columnWidth,
      background: background
    };

    return (
      <div className={classnames('image-box', className)} style={nodeStyle}>
        <a
          onMouseOver={handleMouseOver.bind(this, item)}
          onMouseOut={handleMouseOut.bind(this, item)}
          onClick={handleClick.bind(this, item)}
        >
          {imageUrl ? (
            <div data-guid={guid} className={imgContainerClass} style={imgContainerStyle}>
              <img
                style={imgStyle}
                src={imageUrl}
                onMouseDown={handleMouseDown.bind(this, item)}
                onLoad={this.onLoad}
                onError={this.onError}
              />
              <div
                className="imgWrapper"
                style={{ backgroundImage: `url(${imageUrl})` }}
                onMouseDown={handleMouseDown.bind(this, item)}
              />
              {this.renderText(item)}
            </div>
          ) : null}
          <XLoading isShown={isImgLoading} />
        </a>
      </div>
    );
  }
}

ImageBox.propTypes = {
  data: PropTypes.object,
  actions: PropTypes.shape({
    onImageLoaded: PropTypes.func,
    handleMouseDown: PropTypes.func,
    handleMouseOver: PropTypes.func,
    handleMouseOut: PropTypes.func,
    handleClick: PropTypes.func
  })
};

ImageBox.defaultProps = {};

export default ImageBox;
