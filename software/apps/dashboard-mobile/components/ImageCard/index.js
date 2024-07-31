import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import LazyLoad from 'react-lazy-load';

import XLoading from '@resource/components/XLoading';

import { getImageUrl } from '@resource/lib/saas/image';

import { getOrientationAppliedStyle } from '@resource/lib/utils/exif';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import Popover from '@apps/dashboard-mobile/components/Popover';

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

  componentDidMount() {}

  componentWillUnmount() {
    clearTimeout(this.clickTime);
  }

  onClick = () => {
    const { item, handleClick } = this.props;
    clearTimeout(this.clickTime);
    this.clickTime = setTimeout(() => {
      handleClick && handleClick(item);
    }, 200);
  };
  // 隐藏 loading
  handleImageLoaded = () => {
    this.setState({
      isShowLoading: false,
    });
  };

  // 使用默认 cover
  handleImageErrored = e => {
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
    item?.apply_original_img === state && item?.enc_corrected_image_uid && __isCN__;

  render() {
    const {
      urls,
      item,
      isShowImgName = false,
      dropEncImgId,
      watermarkLoading,
      oneWaterMarkLoadings,
      actions = null,
      actionChildren,
      handleSelect,
    } = this.props;
    const { isShowLoading, isHideImage, isShowErrorImage } = this.state;
    const isApplyOriginalImg = this.applyImg(1, item);
    // const isApplyCorrectImg = this.applyImg(0, item);
    const imageUid = isApplyOriginalImg
      ? item?.enc_image_uid
      : item?.enc_corrected_image_uid || item?.enc_image_uid;
    const selected = !!item?.selected;
    const isDragging = item?.isDragging;
    const timestamp = item?.imgTimestamp || item?.image_version;
    const correctStatus = item?.correct_status || 0;
    const recommend = item?.recommend || false;
    const orientation = item?.orientation;
    const imageName = item?.watermark_name;
    const galleryBaseUrl = urls?.get('galleryBaseUrl');
    const loading = watermarkLoading || item?.loading;
    // oneWaterMarkLoadings.get(item?.enc_image_uid);
    const imageUrl = item?.image_url || getImageUrl({
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
    };

    return (
      <div {...wrapProps}>
        <div className={imgCoverCls}>
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
            <div className="actions">
              {!actions ? actionChildren : <Popover item={item} dropdownList={actions}></Popover>}
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
