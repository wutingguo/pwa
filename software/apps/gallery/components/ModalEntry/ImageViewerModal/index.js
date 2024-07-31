import classnames from 'classnames';
import { fromJS } from 'immutable';
import { isEqual } from 'lodash';
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import XImg from '@resource/components/pwa/XImg';

import { getImageUrl } from '@resource/lib/saas/image';

import { getOrientationAppliedImage } from '@resource/lib/utils/exif';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';
import { saasProducts } from '@resource/lib/constants/strings';

import { XButton, XModal } from '@common/components';

import './index.scss';

const tabsBtn = [
  {
    label: '原图',
  },
  {
    label: '修图',
  },
];

class ImageViewerModal extends Component {
  constructor(props) {
    super(props);
    const { images = fromJS([]), defaultId } = props;
    let current = 0;
    const imagesList = images.toJS();
    const total = images.size;

    if (defaultId) {
      current = imagesList.findIndex(i => i['encImgId'] === defaultId);
    }

    this.state = {
      tab: 1,
      imagesList,
      current,
      total,
      prev: -1,
    };
  }

  componentDidMount() {
    this.setImageObj();
  }

  componentDidUpdate(prevProps, prevState) {
    const { current, tab } = prevState;
    const { current: newCurrent, tab: newTab } = this.state;
    if (current !== newCurrent || tab !== newTab) {
      this.setImageObj();
    }
  }

  onChangeTab = index => {
    this.setState({ tab: index });
  };

  onSwitchImage = step => {
    const { current, total } = this.state;

    let newCurrent = current + step;

    if (newCurrent < 0) {
      newCurrent = 0;
    } else if (newCurrent >= total) {
      newCurrent = total - 1;
    }

    this.setState({
      prev: this.state.current,
      current: newCurrent,
      tab: 1,
    });
  };

  getImageSrc = obj => {
    const galleryBaseUrl = this.props.urls.get('galleryBaseUrl');
    return getImageUrl({
      galleryBaseUrl,
      thumbnail_size: thumbnailSizeTypes.SIZE_1000,
      isWaterMark: true,
      ...obj,
    });
  };

  setImageObj = async () => {
    const { from } = this.props;
    const { current, imagesList } = this.state;
    const newList = imagesList.slice();

    let imageObj = newList[current] || {};

    if (from === saasProducts.gallery) {
      if (!imageObj.originalSrc) {
        imageObj.originalSrc = await getOrientationAppliedImage(imageObj.src, imageObj.orientation);
      }

      if (!imageObj.correctSrc && imageObj.correct_status && imageObj.enc_corrected_image_uid) {
        imageObj.correctSrc = this.getImageSrc({
          image_uid: imageObj.enc_corrected_image_uid,
          timestamp: imageObj.imgTimestamp || imageObj.image_version,
        });
        imageObj.showTab = true;
      }
    }

    if (from === saasProducts.aiphoto) {
      if (!imageObj.originalSrc && imageObj.collection_id && imageObj.collection_image_id) {
        const {
          boundGlobalActions: { getImageCorrentOrigin },
        } = this.props;
        const imageRes = await getImageCorrentOrigin(
          imageObj.collection_id,
          imageObj.collection_image_id
        );
        const originalImage = imageRes[0].original_image || {};
        const correctImage = imageRes[0].correct_image || {};

        if (originalImage.enc_image_id) {
          imageObj.originalSrc = this.getImageSrc({
            image_uid: originalImage.enc_image_id,
          });
          imageObj.original_enc_image_id = originalImage.enc_image_id;
        }
        if (correctImage.enc_image_id) {
          imageObj.correctSrc = this.getImageSrc({
            image_uid: correctImage.enc_image_id,
          });
          imageObj.correct_enc_image_id = correctImage.enc_image_id;
          imageObj.showTab = true;
        }
      }
    }

    newList[current] = imageObj;
    if (isEqual(imagesList, newList)) {
      this.setState({
        imagesList: newList,
      });
    }
  };

  downImage = () => {
    const { downViewImage } = this.props;
    const { current, tab, imagesList } = this.state;
    const selectedImg = imagesList[current];
    downViewImage(fromJS(selectedImg), tab);
  };

  onAiClick = () => {
    const { current, imagesList } = this.state;
    const selectedImg = imagesList[current];
    this.props.close();
    this.props.toAiClick({
      selectedImageId: selectedImg['encImgId'],
    });
  };

  render() {
    const softwareDom = document.getElementById('software');
    const { tab, total, current, imagesList } = this.state;
    const {
      originalSrc,
      correctSrc,
      fileName = '',
      showTab = false,
      orientation,
    } = imagesList[current];

    const imgProps = {
      draggable: 'false',
      imgRot: 0,
      orientation,
      src: tab && showTab ? correctSrc : originalSrc,
      className: 'viewer-image',
    };

    const leftClassName = classnames('pagination-icon left-icon', {
      hide: current <= 0,
    });
    const rightClassName = classnames('pagination-icon right-icon', {
      hide: current >= total - 1,
    });

    return ReactDOM.createPortal(
      <XModal
        className="gallery-image-viewer-modal"
        opened={true}
        onClosed={this.props.close}
        isHideIcon={false}
      >
        <div className="header">
          {!!showTab && (
            <div className="tabs">
              {tabsBtn.map((item, index) => {
                const itemClass = classnames('item', { active: tab === index });
                return (
                  <div
                    key={item.label}
                    className={itemClass}
                    onClick={() => this.onChangeTab(index)}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
          )}
          <div className="extra">
            <div className="down" onClick={this.downImage}>
              下载
            </div>
            <XButton onClick={this.onAiClick}>智能修图</XButton>
          </div>
        </div>

        <div className="image-content">
          <div className="image-viewer-body">
            {!!imgProps.src ? <XImg {...imgProps} /> : null}
            {fileName ? <div className="viewer-image-name">{fileName}</div> : null}
          </div>
          {/* 翻页. */}
          {total >= 1 ? (
            <Fragment>
              <span className={leftClassName} onClick={() => this.onSwitchImage(-1)} />
              <span className={rightClassName} onClick={() => this.onSwitchImage(1)} />
            </Fragment>
          ) : null}
        </div>
      </XModal>,
      softwareDom
    );
  }
}

export default ImageViewerModal;
