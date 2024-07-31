import Immutable, { fromJS } from 'immutable';
import React, { Fragment } from 'react';
// import Tooltip from 'rc-tooltip';
import 'swiper/swiper-bundle.css';

// import classNames from 'classnames';
import XPureComponent from '@resource/components/XPureComponent';

import { LIVE_PHOTO_VERIFY_NO_WATERMARK } from '@common/constants/strings';

// import XWaterFall from '@resource/components/XWaterFall';
import Banner from '@apps/live-photo-client/components/Banner';
import Empty from '@apps/live-photo-client/components/Empty';
import { connectSetting } from '@apps/live-photo-client/constants/context';
import { IMAGE_VIEWER_MODAL } from '@apps/live-photo-client/constants/modalTypes';
import { WATERMARK_TIP_MODAL } from '@apps/live-photo-client/constants/modalTypes';
import { getDownloadUrl } from '@apps/live-photo-client/utils/helper';
import FButton from '@apps/live/components/FButton';
import IconMoveTop from '@apps/live/components/Icons/IconMoveTop';
import IconPlay from '@apps/live/components/Icons/IconPlay';
import IconQrCode from '@apps/live/components/Icons/IconQrCode';
import IconRefresh from '@apps/live/components/Icons/IconRefresh';
import request from '@apps/workspace/services';
import baseService from '@apps/workspace/services';

import ActivityDesc from './ActivityDesc';
import Broadcast from './Broadcast';
import HotImages from './HotImages';
// import ngrids from '@apps/live-photo-client/icons/ngrid-s.png';
// import ngrid from '@apps/live-photo-client/icons/ngrid.png';
// import timelines from '@apps/live-photo-client/icons/timeline-s.png';
// import timeline from '@apps/live-photo-client/icons/timeline.png';
// import grids from '@apps/live-photo-client/icons/grid-s.png';
// import grid from '@apps/live-photo-client/icons/grid.png';
import Info from './Info';
import main from './handle/main';
import render from './handle/render';
import service from './handle/service';

@connectSetting
class Home extends XPureComponent {
  constructor(props) {
    super(props);
    this.boxRef = null;
    this.hasUpdateTimer = null;
    this.tabKey = {};
    this.state = {
      urls: props.urls.toJS(),
      qs: props.qs.toJS(),
      sets: props.menuItems.filter(set => set.id !== 'introduce'),
      currentSetId: '', // 设置菜单第一项为默认值broadcast, hots, introduce
      images: [], //图片直播列表
      hasMore: true, //是否可以加载更多图
      hotImages: [], //热门图片列表
      hasHotImageMore: true, //是否可以加载更多热门图
      currentTimeSegmentImages: [],
      isLoadingImageList: false,
      isLoadingHotImageList: false,
      isLoadingTimeSegmentGroup: false,
      isShowNewImages: false,
      lastSearchTime: null,
      pageSize: 50, //分页数
      innerWidth: 0,
      categoryId: '', // 分类id
    };
  }

  componentDidMount() {
    const { urls, broadcastActivity } = this.props;
    if (urls && urls.size) {
      main.didMount(this);
      // 首次加载数据
      service.getContentList(this);
      service.getHotContentList(this);
    }
    this.getIsUpdatePicture();

    window.addEventListener('resize', this.onChangeWidth);
    // document.body.style.height = '100%';
    // document.body.style.overflow = 'hidden';
    if (__isCN__) {
      const title = broadcastActivity.get('activity_name') || t('LPC_DEFAULT_NAME');
      document.title = title;
    }
    this.handleShowWatermarkTip();
    this.onChangeWidth();
  }

  componentWillUnmount() {
    clearInterval(this.hasUpdateTimer);
  }

  componentWillReceiveProps(nextProps) {
    const { broadcastActivity, intl } = nextProps;
    if (__isCN__) {
      const title = broadcastActivity.get('activity_name') || t('LPC_DEFAULT_NAME');
      document.title = title;
    }
  }

  //分类
  onSelectSet = index => {
    this.setState({ currentSetId: index });
  };

  loadData = () => main.loadData(this);
  loadHotImageData = () => main.loadHotImageData(this);
  //显示分享QRCode
  showShareQRCode = () => main.showShareQRCode(this);
  showImageViewer = (index, images, options) => main.showImageViewer(this, index, images, options);
  showFilter = () => main.showFilter(this);

  renderInfoSection = () => render.renderInfoSection(this);
  renderMenuSection = () => render.renderMenuSection(this);
  renderHotImages = () => render.renderHotImages(this);
  renderGridLayout = images => render.renderGridLayout(this, images);

  getContentList = (...arg) => service.getContentList(this, ...arg);
  getHotContentList = (...arg) => service.getHotContentList(this, ...arg);

  moveTop = () => {
    this.boxRef.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  };

  // 判断是否有新图片，进行自动更新
  handleAutoUpdateImage = (callback, auto = true) => {
    const self = this;

    if (!auto) {
      return self.updateImageList(callback);
    }
    const timer = setInterval(() => {
      const { urls, qs, lastSearchTime } = self.state;
      const enc_broadcast_id = qs.enc_broadcast_id;
      const baseUrl = !__DEVELOPMENT__ && __isCN__ ? urls.cdnBaseUrl : urls.saasBaseUrl;
      // console.log('handleAutoUpdateImage', lastSearchTime);
      request
        .hasUpdate({
          baseUrl,
          enc_broadcast_id,
          begin_time: lastSearchTime,
        })
        .then(res => {
          if (res.ret_code !== 200000 || !res.data) return false;
          self.updateImageList(callback);
        });
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  };
  // 更新图片列表
  updateImageList = async callback => {
    const { urls, qs, images, currentSortAsc, pageSize, categoryId } = this.state;
    const {
      pageSetting: { getImageId },
    } = this.props;
    const enc_broadcast_id = qs.enc_broadcast_id;
    const baseUrl = !__DEVELOPMENT__ && __isCN__ ? urls.cdnBaseUrl : urls.saasBaseUrl;

    let last_enc_album_content_rel_id = '';
    const isMore = images.length > 0 && images.length >= 50;
    if (isMore) {
      last_enc_album_content_rel_id = images[images.length - 1].enc_album_content_rel_id;
    }
    try {
      const queryParams = {
        baseUrl,
        enc_broadcast_id,
        last_enc_album_content_rel_id,
        is_asc: currentSortAsc,
        page_size: pageSize,
        category_id: categoryId, // 分类id
      };
      const qRes = await baseService.getContentList(queryParams);
      if ((qRes && qRes.ret_code !== 200000) || !qRes?.data) return false;
      const { album_content_list, last_search_time } = qRes.data;

      const newContentList = album_content_list.map(item => {
        const imgUrl = getDownloadUrl({
          baseUrl,
          enc_image_uid: getImageId(item),
          size: 3,
        });
        const masterUrl = getDownloadUrl({
          baseUrl,
          enc_image_uid: getImageId(item),
        });
        return {
          ...item,
          imgUrl,
          masterUrl,
        };
      });
      const newImageList = isMore ? [...images, ...newContentList] : [...newContentList];
      const newImages = newImageList.slice();
      callback(newImageList);
      this.setState({
        lastSearchTime: last_search_time,
        images: newImages,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 自动计算盒子宽度
  onChangeWidth = e => {
    const innerWidth = e?.target?.innerWidth || window.innerWidth;
    const num = ~~(innerWidth / 370);
    this.setState({
      innerWidth: num * 370,
    });
  };

  // 自动播放事件
  autoPlay = () => {
    const { boundGlobalActions, urls } = this.props;
    const { showModal, hideModal } = boundGlobalActions;
    const { currentSetId, images, hotImages, last_search_time } = this.state;
    const baseUrl = urls.get('saasBaseUrl');
    let photoList = [];
    if (currentSetId === 'broadcast') {
      photoList = [...images];
    } else if (currentSetId === 'hots') {
      photoList = [...hotImages];
    } else {
      return;
    }
    if (photoList.length === 0) return;
    showModal(IMAGE_VIEWER_MODAL, {
      photoList,
      initalAutoPlay: true,
      initalShowImageList: false,
      initalShowControlList: false,
      logClick: this.logClick,
      autoUpdate: currentSetId === 'broadcast',
      handleClose: () => {
        hideModal(IMAGE_VIEWER_MODAL);
      },
      handleAutoUpdateImage: this.handleAutoUpdateImage,
    });
  };
  // 统计照片pv、uv
  logClick = (enc_target_id, type = '1') => {
    const {
      qs,
      urls,
      userInfo,
      pageSetting: { watermark },
    } = this.props;
    const baseUrl = urls.get('saasBaseUrl');
    const enc_broadcast_id = qs.get('enc_broadcast_id');
    const user_unique_id = userInfo.get('user_id');
    if (watermark === LIVE_PHOTO_VERIFY_NO_WATERMARK && type === '1') return;
    return request.logTargetOperation({
      baseUrl,
      enc_broadcast_id,
      target_type: type,
      action_type: '1',
      enc_target_id: type === '1' ? enc_broadcast_id : enc_target_id,
      user_unique_id,
    });
  };

  // 判断是否有新图片
  getIsUpdatePicture = () => {
    async function getState() {
      const { qs, urls } = this.props;
      const { lastSearchTime } = this.state;
      if (!lastSearchTime) return;

      const baseUrl = urls.get('saasBaseUrl');
      const enc_broadcast_id = qs.get('enc_broadcast_id');
      const params = {
        baseUrl,
        enc_broadcast_id,
        begin_time: lastSearchTime,
      };
      const res = await request.hasUpdate(params);
      if (res.ret_code !== 200000) return;
      this.setState({
        isShowNewImages: res.data,
      });
    }

    this.hasUpdateTimer = setInterval(() => {
      getState.call(this);
    }, 10000);
  };

  refresh = () => {
    this.setState({ hasMore: true, currentSetId: 'broadcast', isShowNewImages: false }, () => {
      service.getContentList(this, true);
    });
  };

  /**
   * 点击分类的事件
   * @param {number} id 分类id
   */
  onChangeCategory = id => {
    this.setState({ hasMore: true, categoryId: id, isLoadingImageList: false }, () => {
      service.getContentList(this, true);
    });
  };

  handleShowWatermarkTip = () => {
    if (!__isCN__) return;

    const { boundGlobalActions, pageSetting } = this.props;
    const { watermark } = pageSetting;
    if (watermark === LIVE_PHOTO_VERIFY_NO_WATERMARK) {
      const { showModal, hideModal } = boundGlobalActions;
      showModal(WATERMARK_TIP_MODAL, {
        handleClose: () => {
          hideModal(WATERMARK_TIP_MODAL);
        },
      });
    }
  };

  render() {
    const {
      images,
      currentSetId,
      isLoadingImageList,
      isShowNewImages,
      hotImages,
      pageSize,
      hasHotImageMore,
    } = this.state;
    const {
      envUrls,
      activityDesc,
      banner,
      isShowBanner,
      broadcastActivity,
      qs,
      urls,
      userInfo,
      broadcastAlbum,
      activityInfo,
    } = this.props;
    const bannerProps = {
      envUrls,
      banner,
      activityInfo,
      style: { border: '1px solid #eee' },
    };
    if (
      broadcastAlbum.get('album_del') === 1 ||
      broadcastAlbum.get('album_Expired') === 1 ||
      broadcastAlbum.get('album_status') === 3
    ) {
      return <Empty />;
    }
    const btns = (
      <div className="btns">
        <FButton size="medium" style={{ marginRight: 20 }} onClick={this.autoPlay}>
          <IconPlay fill="#fff" style={{ verticalAlign: 'medium', marginRight: 5 }} />
          {t('LPC_AUTOPLAY')}
        </FButton>
        {isShowNewImages ? (
          <FButton size="medium" onClick={this.refresh}>
            <IconRefresh
              fill="#fff"
              style={{ verticalAlign: 'medium', width: 18, marginRight: 5 }}
            />
            {t('LPC_NEW_PHOTO')}
          </FButton>
        ) : null}
      </div>
    );
    if (
      broadcastAlbum.get('album_del') === 1 ||
      broadcastAlbum.get('album_expired') === 1 ||
      broadcastAlbum.get('album_status') === 3
    ) {
      return <Empty />;
    }

    // 缓存池
    this.tabKey[currentSetId] = true;
    return (
      <div ref={ref => (this.boxRef = ref)} style={{ paddingBottom: 100 }} className="home">
        <section className="info-container">
          {/* 首部轮播图 */}
          {isShowBanner && (
            <div className="swiper-box">
              <Banner {...bannerProps} />
            </div>
          )}
          <Info
            broadcastActivity={broadcastActivity}
            broadcastAlbum={broadcastAlbum}
            qs={qs}
            urls={urls}
            userInfo={userInfo}
            logClick={this.logClick}
            activityInfo={activityInfo}
          />
        </section>
        <section className="images-container">
          <div className="set-box">
            {this.renderMenuSection()}
            <div className="set-btns-box">
              <div className="btns-box">
                <div
                  className="btn"
                  onClick={() => this.showShareQRCode()}
                  title={__isCN__ ? '' : 'Get QR code.'}
                >
                  <IconQrCode />
                </div>
                <div className="btn" onClick={this.moveTop} title={__isCN__ ? '' : 'Go to top.'}>
                  <IconMoveTop style={{ verticalAlign: 'middle' }} />
                </div>
              </div>
            </div>
          </div>
          {/* 图片直播  */}
          {this.tabKey['broadcast'] ? (
            <Broadcast
              images={images}
              envUrls={envUrls}
              pageSize={pageSize}
              isLoadingImageList={isLoadingImageList}
              getContentList={this.getContentList}
              showImageViewer={this.showImageViewer}
              isShow={currentSetId == 'broadcast'}
              broadcastAlbum={broadcastAlbum}
              onChangeCategory={this.onChangeCategory}
            >
              {images.length > 0 ? btns : null}
            </Broadcast>
          ) : null}
          {/* 热门 */}
          {this.tabKey['hots'] ? (
            <HotImages
              hotImages={hotImages}
              envUrls={envUrls}
              pageSize={pageSize}
              hasHotImageMore={hasHotImageMore}
              getHotContentList={this.getHotContentList}
              showImageViewer={this.showImageViewer}
              isShow={currentSetId == 'hots'}
            >
              {hotImages.length > 0 ? btns : null}
            </HotImages>
          ) : null}
          {/* 活动介绍
          {currentSetId == 'introduce' && activityDesc && (
            <ActivityDesc activityDesc={activityDesc} qs={qs} urls={urls} userInfo={userInfo} />
          )} */}
        </section>
      </div>
    );
  }
}

export default Home;
