import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import LazyLoad from 'react-lazy-load';
import { XLoading, XDrag, XDrop } from '@common/components';
import { getOrientationAppliedStyle } from '@resource/lib/utils/exif';
import { getSlideShowImageUrl } from '@resource/lib/saas/image';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';
import BrokenImage from './brokenimage.png';

import dragHandle from './handler/drag';

import './index.scss';

class EditorImageCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowLoading: true,
      isHideImage: false,
      isShowErrorImage: false,
      // imageUrl: '',

      isDragEnter: false
    };
  }

  onClick = () => {
    const { item, handleClick } = this.props;
    handleClick && handleClick(item);
  };

  onDragStarted = event => dragHandle.onDragStarted(this, event);
  onDragEnded = event => dragHandle.onDragEnded(this, event);

  // 目标释放位置的元素事件.
  onDragEntered = event => dragHandle.onDragEntered(this, event);
  onDragLeaved = event => dragHandle.onDragLeaved(this, event);
  onDroped = event => dragHandle.onDroped(this, event);

  // 隐藏 loading
  handleImageLoaded = () => {
    this.setState({
      isShowLoading: false
    });
  };

  // 使用默认 cover
  handleImageErrored = e => {
    console.log('erroredImg: ', e.target.src);
    this.setState({
      isShowLoading: false,
      isHideImage: true,
      isShowErrorImage: true
    });
  };

  componentDidMount() {
    this.cardItemNode.addEventListener('dragstart', this.onDragStarted);
    this.cardItemNode.addEventListener('dragend', this.onDragEnded);
    this.cardItemNode.addEventListener('dragenter', this.onDragEntered);
    this.cardItemNode.addEventListener('dragleave', this.onDragLeaved);
    this.cardItemNode.addEventListener('drop', this.onDroped);
  }

  componentWillUnmount() {
    this.cardItemNode.removeEventListener('dragstart', this.onDragStarted);
    this.cardItemNode.removeEventListener('dragend', this.onDragEnded);
    this.cardItemNode.removeEventListener('dragenter', this.onDragEntered);
    this.cardItemNode.removeEventListener('dragleave', this.onDragLeaved);
    this.cardItemNode.removeEventListener('drop', this.onDroped);
  }

  render() {
    const { urls, item, isShowImgName = false, className } = this.props;
    const { isShowLoading, isHideImage, isShowErrorImage, isDragEnter } = this.state;
    const itemImage = item.get('image');
    const enc_image_uid = itemImage.get('enc_image_uid');
    const selected = !!item.get('selected');
    const isDragging = item.get('isDragging');
    const timestamp = itemImage.get('imgTimestamp') || itemImage.get('image_version');

    const imageName = itemImage.get('image_name');
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const imageUrl = getSlideShowImageUrl({
      galleryBaseUrl,
      enc_image_uid: enc_image_uid,
      thumbnail_size: thumbnailSizeTypes.SIZE_350,
      isWaterMark: true,
      timestamp
    });
    const imgCoverCls = classnames('editor-image-cover', {
      selected: selected,
      isDragging: isDragging,
      'drag-enter': isDragEnter
    });

    const imgStyle = {
      ...getOrientationAppliedStyle(itemImage.get('orientation'))
    };

    const wrapProps = {
      className: classnames(`slide-show-image-card ${className}`),
      ref: node => (this.cardItemNode = node),
      onClick: this.onClick,

      draggable: true
    };

    return (
      <div {...wrapProps}>
        <div className={imgCoverCls}>
          {!isDragging && (
            <LazyLoad once className="lazyload-wrap" key={`lazyload-item-${enc_image_uid}`}>
              <Fragment>
                {!isHideImage ? (
                  <img
                    src={imageUrl}
                    style={imgStyle}
                    draggable={false}
                    onLoad={this.handleImageLoaded}
                    onError={this.handleImageErrored}
                  />
                ) : null}
                {isShowErrorImage ? <img src={BrokenImage} /> : null}
              </Fragment>
            </LazyLoad>
          )}
          <XLoading type="imageLoading" size="sm" zIndex={99} isShown={isShowLoading} />
        </div>
        {!!isShowImgName ? (
          <div className="editor-image-detail">
            <div className="image-name ellipsis" title={imageName}>
              {imageName}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

EditorImageCard.propTypes = {
  item: PropTypes.object.isRequired
};

EditorImageCard.defaultProps = {
  item: {}
};

export default EditorImageCard;
