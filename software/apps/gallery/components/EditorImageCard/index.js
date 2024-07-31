import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import LazyLoad from 'react-lazy-load';

import { getImageUrl } from '@resource/lib/saas/image';

import { getOrientationAppliedStyle } from '@resource/lib/utils/exif';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import { XLoading } from '@common/components';

import dragHandle from './handler/drag';
import AI_STATUS_1 from './img/ai-1.png';
import AI_STATUS_2 from './img/ai-2.png';
import BrokenImage from './img/brokenimage.png';
import recommendSrc from './img/recommend.png';

import './index.scss';

class EditorImageCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowLoading: true,
      isHideImage: false,
      isShowErrorImage: false,
    };

    //单击事件延时
    this.clickTime = null;
  }

  componentDidMount() {
    this.cardItemNode.addEventListener('dragstart', this.onDragStarted);
    this.cardItemNode.addEventListener('dragend', this.onDragEnded);
    this.cardItemNode.addEventListener('dragenter', this.onDragEntered);
    this.cardItemNode.addEventListener('dragleave', this.onDragLeaved);
    this.cardItemNode.addEventListener('drop', this.onDroped);
    this.cardItemNode.addEventListener('drag', this.onDraging);
  }

  componentWillUnmount() {
    clearTimeout(this.clickTime);
    this.cardItemNode.removeEventListener('dragstart', this.onDragStarted);
    this.cardItemNode.removeEventListener('dragend', this.onDragEnded);
    this.cardItemNode.removeEventListener('dragenter', this.onDragEntered);
    this.cardItemNode.removeEventListener('dragleave', this.onDragLeaved);
    this.cardItemNode.removeEventListener('drop', this.onDroped);
    this.cardItemNode.addEventListener('drag', this.onDraging);
  }

  onDragStarted = event => dragHandle.onDragStarted(this, event);
  onDragEnded = event => dragHandle.onDragEnded(this, event);
  // 目标释放位置的元素事件.
  onDragEntered = event => dragHandle.onDragEntered(this, event);
  onDragLeaved = event => dragHandle.onDragLeaved(this, event);
  onDroped = event => dragHandle.onDroped(this, event);
  onDraging = event => dragHandle.onDraging(this, event);

  onClick = () => {
    const { item, handleClick, watermarkLoading, oneWaterMarkLoadings } = this.props;
    const loading = item.get('loading') || oneWaterMarkLoadings.get(item.get('enc_image_uid'));
    if (watermarkLoading || loading) {
      return false;
    }
    clearTimeout(this.clickTime);
    this.clickTime = setTimeout(() => {
      handleClick && handleClick(item);
    }, 200);
  };

  doubleClick = () => {
    const { boundProjectActions, item, watermarkLoading, oneWaterMarkLoadings } = this.props;
    const loading = item.get('loading') || oneWaterMarkLoadings.get(item.get('enc_image_uid'));
    if (watermarkLoading || loading) {
      return false;
    }
    clearTimeout(this.clickTime);
    boundProjectActions.showImageViewer({
      imageViewerDefaultId: item.get('enc_image_uid'),
    });
    boundProjectActions.handleClearSelectImg();
    boundProjectActions.changeSelectedImg(item.get('enc_image_uid'));
  };

  // 隐藏 loading
  handleImageLoaded = () => {
    console.log('loaded');
    this.setState({
      isShowLoading: false,
    });
  };

  // 使用默认 cover
  handleImageErrored = e => {
    console.log('erroredImg: ', e.target.src);
    this.setState({
      isShowLoading: false,
      isHideImage: true,
      isShowErrorImage: true,
    });
  };

  getCorrectStatusImg = correctStatus => {
    if (correctStatus === 1) return AI_STATUS_1;
    return AI_STATUS_2;
  };

  applyImg = (state, item) =>
    item.get('apply_original_img') === state && item.get('enc_corrected_image_uid') && __isCN__;

  render() {
    const {
      urls,
      item,
      isShowImgName = false,
      dropEncImgId,
      watermarkLoading,
      oneWaterMarkLoadings,
    } = this.props;
    const { isShowLoading, isHideImage, isShowErrorImage } = this.state;
    const isApplyOriginalImg = this.applyImg(1, item);
    // const isApplyCorrectImg = this.applyImg(0, item);
    const imageUid = isApplyOriginalImg
      ? item.get('enc_image_uid')
      : item.get('enc_corrected_image_uid') || item.get('enc_image_uid');
    const selected = !!item.get('selected');
    const isDragging = item.get('isDragging');
    const timestamp = item.get('imgTimestamp') || item.get('image_version');
    const correctStatus = item.get('correct_status') || 0;
    const recommend = item.get('recommend') || false;
    const orientation = item.get('orientation');
    const imageName = item.get('image_name') + item.get('suffix');
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const loading =
      watermarkLoading ||
      item.get('loading') ||
      oneWaterMarkLoadings.get(item.get('enc_image_uid'));
    const imageUrl = getImageUrl({
      galleryBaseUrl,
      image_uid: imageUid,
      thumbnail_size: thumbnailSizeTypes.SIZE_350,
      isWaterMark: true,
      timestamp,
    });

    const imgCoverCls = classnames('editor-image-cover', {
      selected: selected,
      'selected-move': selected,
      isDragging: isDragging,
      'drag-enter': dropEncImgId === imageUid,
    });

    const imgStyle = {
      ...getOrientationAppliedStyle(orientation),
    };

    const wrapProps = {
      className: classnames(`editor-image-card`),
      ref: node => (this.cardItemNode = node),
      onClick: this.onClick,
      onDoubleClick: this.doubleClick,
      draggable: true,
    };

    return (
      <div {...wrapProps}>
        <div className={imgCoverCls}>
          {correctStatus > 0 && !isApplyOriginalImg && (
            <img className="ai-status" src={this.getCorrectStatusImg(correctStatus)} />
          )}
          {!!recommend && <img className="recommend" src={recommendSrc} />}
          <LazyLoad once className="lazyload-wrap" key={`lazyload-item-${imageUid}`}>
            <Fragment>
              {!isHideImage ? (
                <img
                  src={imageUrl}
                  style={imgStyle}
                  onLoad={this.handleImageLoaded}
                  onError={this.handleImageErrored}
                  draggable={false}
                />
              ) : null}
              {isShowErrorImage ? <img src={BrokenImage} /> : null}
            </Fragment>
          </LazyLoad>
          <XLoading type="imageLoading" size="sm" zIndex={99} isShown={loading || isShowLoading} />
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
  item: PropTypes.object.isRequired,
};

EditorImageCard.defaultProps = {
  item: {},
};

export default EditorImageCard;
