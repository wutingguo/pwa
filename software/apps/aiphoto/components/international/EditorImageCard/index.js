import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import LazyLoad from 'react-lazy-load';
import { XLoading } from '@common/components';
import { getOrientationAppliedStyle } from '@resource/lib/utils/exif';
import { getImageUrl } from '@resource/lib/saas/image';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';
import BrokenImage from './img/brokenimage.png';
import AI_STATUS_1 from './img/ai-1.png';
import AI_STATUS_2 from './img/ai-2.png';
import './index.scss';

class EditorImageCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowLoading: true,
      isHideImage: false,
      isShowErrorImage: false
    };

    //单击事件延时
    this.clickTime = null;
  }

  componentWillUnmount() {
    clearTimeout(this.clickTime);
  }

  onClick = () => {
    clearTimeout(this.clickTime);
    this.clickTime = setTimeout(() => {
      const { item, handleClick } = this.props;
      handleClick && handleClick(item);
    }, 200);
  };

  doubleClick = () => {
    clearTimeout(this.clickTime);
    const { boundProjectActions, item, toAiClick, boundGlobalActions } = this.props;
    if (item.get('correct_status') === 1) {
      boundGlobalActions.addNotification({
        message: t('AIPHOTO_STATUS_1_TIP'),
        level: 'success',
        autoDismiss: 3
      });
      return false;
    }
    toAiClick(
      {
        selectedImageId: item.get('enc_image_id')
      },
      () => {
        boundProjectActions.handleClearSelectImg();
      }
    );
  };

  // 隐藏 loading
  handleImageLoaded = () => {
    console.log('loaded');
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

  getCorrectStatusImg = correctStatus => {
    if (correctStatus === 1) return AI_STATUS_1;
    return AI_STATUS_2;
  };

  render() {
    const { urls, item, isShowImgName = true } = this.props;
    const { isShowLoading, isHideImage, isShowErrorImage } = this.state;
    const imageUid = item.get('enc_image_id');
    const selected = !!item.get('selected');
    const orientation = item.get('orientation');
    const correctStatus = item.get('correct_status');

    let imageName = item.get('image_name');
    if (imageName.indexOf(item.get('suffix')) < 0) {
      imageName += item.get('suffix');
    }

    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const imageUrl = getImageUrl({
      galleryBaseUrl,
      image_uid: imageUid,
      thumbnail_size: thumbnailSizeTypes.SIZE_350,
      isWaterMark: false
    });

    const imgCoverCls = classnames('editor-image-cover', {
      selected: selected
    });

    const imgStyle = {
      ...getOrientationAppliedStyle(orientation)
    };

    return (
      <div className="editor-image-card">
        <div className={imgCoverCls} onClick={this.onClick} onDoubleClick={this.doubleClick}>
          {correctStatus === 1 && (
            <img className="ai-status" src={this.getCorrectStatusImg(correctStatus)} />
          )}
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
