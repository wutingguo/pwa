import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XLoading from '../XLoading/index';
import classNames from 'classnames';

import { CDN_PREFIX } from '@common/constants/strings';
import { isBrowserEnv, isProductEnv } from '@resource/lib/utils/env';
import { getWWWorigin } from '@resource/lib/utils/url';

// const isProductEnv=false;
class ImageLazyLoad extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isImgLoading: this.props.isLazyload,
      hasError: false,

      naturalWidth: 0,
      naturalHeight: 0
    };

    this.onError = this.onError.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    let { needAuth, link, linkSource, logEventName, registered } = this.props;

    if (logEventName) {
      logEvent.addPageEvent({
        name: logEventName
      });
    }

    if (linkSource && linkSource === 'baseUrl') {
      link = getWWWorigin() + link;
    }

    if (needAuth) {
      e && e.preventDefault();
      if (window.userInfo && window.userInfo.isSignedIn === 'yes') {
        window.location.href = link;
      } else {
        let passLink = `/passport.html`;
        if (registered) {
          passLink += '?registered=true';
        }
        window.location.href = passLink;
      }
    }
  }

  onError() {
    this.setState({ isImgLoading: false, hasError: true });
  }

  onLoaded(event) {
    const { naturalWidth, naturalHeight } = event.target;

    this.setState({
      isImgLoading: false,
      naturalWidth,
      naturalHeight
    });
  }

  render() {
    let {
      src,
      width,
      height,
      link,
      linkSource,
      // 用于配置懒加载的参数.
      isLazyload,
      rootMargin,
      threshold,
      alt
    } = this.props;
    let { isImgLoading, hasError, naturalWidth, naturalHeight } = this.state;

    if (linkSource && linkSource === 'baseUrl') {
      link = getWWWorigin() + link;
    }

    let imgSrc = src;
    if (imgSrc) {
      // 如果是生产环境，并且src是相对路径，使用CDN前缀。
      if (isProductEnv()) {
        const absolute = /^https?:/.test(imgSrc);
        if (!absolute) {
          imgSrc = `${CDN_PREFIX}${imgSrc}`;
        }
      }
    }

    // 设置占位符信息.
    let style = {};
    let newComponentStyle = {
      width: '100%'
    };

    const newWidth = naturalWidth || width;
    const newHeight = naturalHeight || height;
    if (newWidth && newHeight) {
      style = {
        paddingTop: `${(newHeight / newWidth) * 100}%`,
        position: 'relative'
      };

      newComponentStyle = Object.assign({}, newComponentStyle, {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        visibility: !imgSrc && 'hidden' // 没有src时隐藏，防止IE显示默认错误图片。
      });
    }

    const lazyloadOptions = {
      threshold,
      rootMargin
    };

    return (
      <div className="image-lazy-load">
        <div style={style}>
          {isImgLoading ? <XLoading isShown={true} size="lg" /> : null}
          {link ? (
            <a onClick={this.onClick} href={link} id={link}>
              <img
                src={imgSrc}
                onError={this.onError}
                onLoad={this.onLoaded}
                style={newComponentStyle}
                alt={alt || ''}
              />
            </a>
          ) : (
            <img
              alt={alt || ''}
              src={imgSrc}
              onError={this.onError}
              onLoad={this.onLoaded}
              style={newComponentStyle}
            />
          )}
        </div>
      </div>
    );
  }
}

ImageLazyLoad.defaultProps = {
  src: '',
  width: 0,
  height: 0,
  link: '',
  isLazyload: true
};

ImageLazyLoad.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  link: PropTypes.string,
  isLazyload: PropTypes.boolean
};

export default ImageLazyLoad;
