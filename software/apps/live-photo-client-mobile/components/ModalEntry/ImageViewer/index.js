import { Image } from 'antd-mobile';
import classNames from 'classnames';
import { isFunction } from 'lodash';
import React, { Component, lazy } from 'react';
import LazyLoad from 'react-lazy-load';
import ToolTip from 'react-portal-tooltip';
import { Lazy, Zoom } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import XImg from '@resource/components/pwa/XImg';

import { formatDateTime } from '@resource/lib/utils/dateFormat';
import { formatFileSize } from '@resource/lib/utils/math';

import { LIVE_PHOTO_VERIFY_NO_WATERMARK } from '@common/constants/strings';

import { XModal } from '@common/components';

import { connectSetting } from '@apps/live-photo-client-mobile/constants/context';
import like from '@apps/live-photo-client-mobile/icons/like-e.png';
import unlike from '@apps/live-photo-client-mobile/icons/like.png';
import { getRotateImageUrl } from '@apps/live-photo-client-mobile/utils/helper';
import { trimFileName } from '@apps/live-photo-client-mobile/utils/utils';

import AvatarView from './AvatarView';
import InfoTip from './InfoTip';
import ZoomImage from './ZoomImage';
import service from './handle/service';
import lSrc from './img/loading.gif';

import './index.scss';

@connectSetting
class ImageViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialSlide: props.data.get('index'),
      photoList: props.data.get('photoList').toJS(),
    };
  }

  componentDidMount() {
    this.loadImageService();
  }

  componentWillReceiveProps(o, n) {}

  onCloseBtn = () => {
    const { data } = this.props;
    const handleClose = data.get('handleClose');
    if (isFunction(handleClose)) {
      handleClose();
    }
  };

  // onShowTip = () => {
  //   const { isShowTip } = this.state;
  //   this.setState({
  //     isShowTip: !isShowTip
  //   });
  // };

  onLikeImage = () => {
    const { data } = this.props;
    service.contentLike(this);
  };

  onDownloadImage = () => {
    const { initialSlide, photoList } = this.state;
    const currentItem = photoList[initialSlide];
    if (currentItem.isShowOriginal) return;
    currentItem.isShowOriginal = true;
    currentItem.isOriginalLoading = true;
    this.setState({
      photoList,
    });
  };

  onLoadImage = item => {
    const { initialSlide, photoList } = this.state;
    // 缩略图手动获取图片大小
    // if (!item.isShowOriginal && !item.fetchImgContentSize) {
    //   this.fetchImage(item);
    // }

    if (item.isShowOriginal && item.isOriginalLoading) {
      item.isOriginalLoading = false;
    }
    item.loadImage = true;
    this.forceUpdate();
  };

  changeSlideImg = async val => {
    const { loadData } = this.props.data.toJS();
    const { photoList } = this.state;
    if (val === photoList.length - 1 && loadData) {
      const res = await loadData();
      res && photoList.push(...res);
    }
    this.setState(
      {
        initialSlide: val,
        photoList: [...photoList],
      },
      () => {
        this.loadImageService();
      }
    );
  };

  async loadImageService() {
    const { pageSetting } = this.props;
    const { watermark } = pageSetting;
    if (watermark !== LIVE_PHOTO_VERIFY_NO_WATERMARK) {
      await service.contentViewOperation(this);
    }
    service.getContentLike(this);
  }

  render() {
    const { initialSlide, photoList } = this.state;
    const { envUrls, data, boundGlobalActions, pageSetting } = this.props;
    const { getImageId } = pageSetting;
    const { total } = data.toJS();
    const modalProps = {
      className: 'live-photo-image-viewer',
      isHideIcon: true,
      escapeClose: false,
    };
    const currentItem = photoList[initialSlide];
    const isOriginalLoading = currentItem.isOriginalLoading;
    const likeCount = `${currentItem.like_count} ${t('LPCM_NUMBER_LIKE')}`;
    const imageCount = `${initialSlide + 1}/${total}`;
    // let contentSize = '';
    // if (currentItem.fetchImgContentSize && (!currentItem.isShowOriginal || isOriginalLoading)) {
    //   contentSize = formatFileSize(currentItem.fetchImgContentSize, 1000);
    // } else if (currentItem.isShowOriginal) {
    //   contentSize = formatFileSize(currentItem.content_size);
    // }
    const date = formatDateTime(currentItem.shot_time);
    let downloadOriginalImageText = `${t('LPCM_LOOK_BIGPIC')} \n (${formatFileSize(
      currentItem.content_size
    )})`;
    if (isOriginalLoading) {
      downloadOriginalImageText = `${t('LOADING')}...`;
    } else if (currentItem.isShowOriginal) {
      downloadOriginalImageText = t('LPCM_LOADED');
    }
    const baseUrl =
      !__DEVELOPMENT__ && __isCN__ ? envUrls.get('cdnBaseUrl') : envUrls.get('saasBaseUrl');
    // const baseUrl = envUrls.get('saasBaseUrl'); // dd环境调试用，上线需删除
    // console.log('isOriginalLoading', isOriginalLoading, currentItem.isShowOriginal);
    return (
      <XModal {...modalProps} opened>
        <InfoTip
          onCloseBtn={this.onCloseBtn}
          imageCount={imageCount}
          show_enc_content_id={currentItem.show_enc_content_id}
          date={date}
          content_name={currentItem.content_name}
          isShowContentSize={currentItem.isShowOriginal && !isOriginalLoading}
          record={currentItem}
          envUrls={envUrls}
        />

        <Swiper
          style={{
            '--swiper-pagination-color': '#000',
          }}
          lazy={true}
          spaceBetween={15}
          loop={false}
          zoom={true}
          modules={[Lazy, Zoom]}
          className="swiper-items"
          initialSlide={initialSlide}
          onSlideChange={v => this.changeSlideImg(v.activeIndex)}
        >
          {photoList &&
            photoList.map(item => {
              const enc_image_uid = getImageId(item);
              let imgUrl = getRotateImageUrl({ baseUrl, enc_image_uid, thumbnail_size: 5 });
              if (item.isShowOriginal) {
                imgUrl = getRotateImageUrl({ baseUrl, enc_image_uid, thumbnail_size: 1 });
              }
              return (
                <SwiperSlide>
                  <div className="swiper-zoom-container">
                    <ZoomImage src={imgUrl} onLoadImage={this.onLoadImage} item={item} />
                    {!item.loadImage && (
                      <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
        </Swiper>

        {isOriginalLoading ? (
          <div className="loading">
            <img src={lSrc} />
          </div>
        ) : null}

        <AvatarView
          boundGlobalActions={boundGlobalActions}
          envUrls={envUrls}
          currentItem={currentItem}
          handleClose={this.onCloseBtn}
        />

        <div className="bottom-bar-warp">
          <div className="like-image-warp" onClick={() => this.onLikeImage()}>
            <img className="icon" src={currentItem.liked ? like : unlike}></img>
            <div className="count">{likeCount}</div>
          </div>
          <div className="original-image" onClick={() => this.onDownloadImage()}>
            {downloadOriginalImageText}
          </div>
        </div>
      </XModal>
    );
  }
}

export default ImageViewer;
