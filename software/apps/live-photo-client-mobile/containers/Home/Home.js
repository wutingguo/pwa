import cls from 'classnames';
import Immutable from 'immutable';
import Tooltip from 'rc-tooltip';
import React from 'react';
import 'react-quill/dist/quill.snow.css';
import 'swiper/swiper-bundle.css';

// import classNames from 'classnames';
import XPureComponent from '@resource/components/XPureComponent';

import { LIVE_PHOTO_VERIFY_NO_WATERMARK } from '@common/constants/strings';

import Banner from '@apps/live-photo-client-mobile/components/Banner';
import EndModal from '@apps/live-photo-client-mobile/components/EndModal';
import Puzzle from '@apps/live-photo-client-mobile/components/puzzle';
import { connectSetting } from '@apps/live-photo-client-mobile/constants/context';
import { WATERMARK_TIP_MODAL } from '@apps/live-photo-client-mobile/constants/modalTypes';
import Qrcode from '@apps/live-photo-client-mobile/icons/Qrcode';
import Sort from '@apps/live-photo-client-mobile/icons/Sort';
import flats from '@apps/live-photo-client-mobile/icons/flat-s.png';
import flat from '@apps/live-photo-client-mobile/icons/flat.png';
import grids from '@apps/live-photo-client-mobile/icons/grid-s.png';
import grid from '@apps/live-photo-client-mobile/icons/grid.png';
// import XWaterFall from '@resource/components/XWaterFall';
import loading from '@apps/live-photo-client-mobile/icons/loading.gif';
import ngrids from '@apps/live-photo-client-mobile/icons/ngrid-s.png';
import ngrid from '@apps/live-photo-client-mobile/icons/ngrid.png';
import timelines from '@apps/live-photo-client-mobile/icons/timeline-s.png';
import timeline from '@apps/live-photo-client-mobile/icons/timeline.png';
import { getImageUrl } from '@apps/live-photo-client-mobile/utils/helper';
import { wxShare } from '@apps/live-photo-client-mobile/utils/wxShare';

import AIRecognitionBtn from './AIRecognitionBtn';
import Broadcast from './Broadcast';
import HotImages from './HotImages';
import SideAdvertisingBtn from './SideAdvertisingBtn';
import main from './handle/main';
import render from './handle/render';
import service from './handle/service';

@connectSetting
class Home extends XPureComponent {
  constructor(props) {
    super(props);
    this.infoRef = null;
    this.lockWaterModal = false;
    this.state = {
      urls: props.urls.toJS(),
      qs: props.qs.toJS(),
      sets: props.menuItems,
      currentSetId: '', // 设置菜单第一项为默认值broadcast, hots, introduce
      sortTypes: [
        { id: 1, icon: ngrid, iconSelected: ngrids, name: t('LPCM_MASONRY') },
        { id: 2, icon: timeline, iconSelected: timelines, name: t('LPCM_TIMELINE') },
        { id: 3, icon: grid, iconSelected: grids, name: t('LPCM_GRID') },
        { id: 4, icon: flat, iconSelected: flats, name: t('LPCM_FLAT') }, // 新增平铺式
      ],
      currentSortTypeIndex: 1,
      sort: [
        { asc: true, name: t('LPCM_CHRONO') },
        { asc: false, name: t('LPCM_ANTICHRONO') },
      ],
      currentSortAsc: false,
      images: [], //图片直播列表
      hasMore: true, //是否可以加载更多图
      hotImages: [], //热门图片列表
      hotImageTotal: 0,
      timeSegmentGroup: [], //图片时间线分组
      currentTimeSegment: {}, //当前时间段
      isShowFilterModal: false,
      isLoadingImageList: false,
      isLoadingHotImageList: false,
      isLoadingTimeSegmentGroup: false,
      isLoadingContentListByTimeSegment: false,
      hasMoreImageList: false, //是否有新照片
      pageSize: 50, //每页item数
      albumViewData: {},
      infoHeight: 0,
      selectPuzzleList: [],
      puzzleStep: 0,
      categoryId: '', // 分类id
    };
  }

  componentDidMount() {
    const { urls, share, broadcastAlbum, broadcastActivity } = this.props;
    if (urls && urls.size) {
      const baseUrl = urls.get('saasBaseUrl');
      main.didMount(this);
      this.hasUpdate();

      // 首次加载数据
      this.getView();
      service.getHotContentList(this);

      service.getTimeSegmentGroup(this);
      service.getContentList(this);

      this.setTheme();
      // 设置微信分享
      wxShare(baseUrl, share, broadcastAlbum, broadcastActivity);
    }
    if (__isCN__) {
      const title = broadcastActivity.get('activity_name') || t('LPC_DEFAULT_NAME');
      document.title = title;
    }
    const { height } = this.infoRef.getBoundingClientRect();
    this.setState({ infoHeight: height });
  }
  getView = async () => {
    const {
      pageSetting: { watermark },
    } = this.props;
    if (watermark !== LIVE_PHOTO_VERIFY_NO_WATERMARK) {
      await service.albumViewOperation(this);
    }
    service.getAlbumView(this);
  };
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  hasUpdate = () => {
    this.timer = setInterval(() => {
      const { lastSearchTime } = this.state;
      if (lastSearchTime) {
        service.hasUpdate(this);
      }
    }, 5000);
  };

  //菜单栏
  onSelectSet = index => {
    const { activityDesc } = this.props;
    if (activityDesc.get('menu_type') == 'LINK' && index == 'introduce') {
      window.location.href = activityDesc.get('activity_desc');
    } else {
      this.setState({ currentSetId: index });
    }
  };

  //布局方式
  onSelectSortType = index => {
    this.setState({ currentSortTypeIndex: index });
    this.onVisibleChange(false);
    this.reloadImages();
  };

  componentDidUpdate() {}
  //排序方式
  onSelectSort = asc => {
    this.setState(
      {
        currentSortAsc: asc,
        images: [],
      },
      () => {
        service.getContentList(this, true);
        this.timeLineImageAsc();
        this.onVisibleChange(false);
      }
    );
  };

  loadData = () => main.loadData(this);
  loadTimeLineImageData = () => main.loadTimeLineImageData(this);
  loadHotImageData = () => main.loadHotImageData(this);

  //显示分享QRCode
  showShareQRCode = () => main.showShareQRCode(this);
  showImageViewer = (index, images, options) => main.showImageViewer(this, index, images, options);
  timeLineImageAsc = () => main.timeLineImageAsc(this);
  showFilter = () => main.showFilter(this);
  getMoreImageData = () => main.getMoreImageData(this);
  reloadImages = () => main.reloadImages(this);

  renderInfoSection = () => render.renderInfoSection(this);
  renderMenuSection = () => render.renderMenuSection(this);
  renderCard = (...params) => render.renderCard(this, ...params);
  // renderHotImages = () => render.renderHotImages(this);
  // renderTimeLineLayout = () => render.renderTimeLineLayout(this);
  // renderGridLayout = images => render.renderGridLayout(this, images);
  renderSortModal = () => render.renderSortModal(this);
  // 展开当前图片列表
  showCollapsePhotosGroup = element => {
    this.setState(
      {
        currentTimeSegment: element,
      },
      () => {
        const { images = [] } = element;
        if (images && images.length == 0) {
          service.getContentListByTimeSegment(this);
        }
      }
    );
  };

  onVisibleChange(val) {
    this.setState({
      isShowFilterModal: val,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { activityInfo, isShow, isLoading } = this.props;
    const { activityInfo: preInfo, isShow: preIsShow, isLoading: preLoading } = prevProps;
    const { skin_vo: theme } = activityInfo.toJS();
    const { skin_vo: prevTheme } = preInfo.toJS();
    if (theme && prevTheme && theme.album_skin_id !== prevTheme.album_skin_id) {
      this.setTheme();
    }
    if (!isLoading && isShow) {
      this.handleShowWatermarkTip();
    }
  }
  setTheme = () => {
    const { activityInfo } = this.props;
    const { skin_vo } = activityInfo.toJS();
    const direction = document.documentElement.style;
    if (skin_vo.bg_color) {
      direction.setProperty('--bg_color', skin_vo.bg_color);
    }
    if (skin_vo.decorate_color) {
      direction.setProperty('--decorate_color', skin_vo.decorate_color);
    }
    if (skin_vo.primary_font_color) {
      direction.setProperty('--primary_font_color', skin_vo.primary_font_color);
    }
    if (skin_vo.other_font_color) {
      direction.setProperty('--other_font_color', skin_vo.other_font_color);
    }
  };
  getBackground = () => {
    const { activityInfo, envUrls } = this.props;
    const { skin_vo } = activityInfo.toJS();
    const baseUrl = envUrls.get('saasBaseUrl');
    const bgSrc = skin_vo.bg_image_id ? getImageUrl(baseUrl, skin_vo.bg_image_id) : '';
    const deSrc = skin_vo.decorate_image_id ? getImageUrl(baseUrl, skin_vo.decorate_image_id) : '';

    return {
      bgSrc,
      deSrc,
    };
  };
  userSelectPuzzle = (index, info) => {
    if (index > -1) {
      const tempArr = [...this.state.selectPuzzleList];
      tempArr.splice(index, 1);
      this.setState({
        selectPuzzleList: tempArr,
      });
    } else {
      if (this.state.selectPuzzleList.length >= 10) {
        return;
      }
      this.setState({
        selectPuzzleList: [...this.state.selectPuzzleList, info],
      });
    }
  };
  puzzleStepFn = step => this.setState({ puzzleStep: step });
  resetSelectPuzzleListFn = () => this.setState({ selectPuzzleList: [] });

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
    if (!__isCN__ || this.lockWaterModal) return;

    const { boundGlobalActions, pageSetting } = this.props;
    const { watermark } = pageSetting;
    if (watermark === LIVE_PHOTO_VERIFY_NO_WATERMARK) {
      const { showModal, hideModal } = boundGlobalActions;

      setTimeout(() => {
        showModal(WATERMARK_TIP_MODAL, {
          handleClose: () => {
            hideModal(WATERMARK_TIP_MODAL);
          },
        });
      }, 500);
    }
    this.lockWaterModal = true;
  };

  render() {
    const {
      images,
      isShowFilterModal,
      currentSetId,
      currentSortTypeIndex,
      sortTypes,
      hasMoreImageList,
      timeSegmentGroup,
      hasMore,
      pageSize,
      hotImages,
      isLoadingImageList,
      isLoadingHotImageList,
      infoHeight,
      total,
      puzzleStep,
      selectPuzzleList,
      hotImageTotal,
      // favoriteImgIds
    } = this.state;
    const {
      envUrls,
      activityDesc,
      banner,
      isShowBanner,
      isShow,
      style,
      isLoading,
      broadcastAlbum,
      activityInfo,
      loadingUrl,
      boundGlobalActions,
      pageSetting,
    } = this.props;

    const setImages = Immutable.fromJS(images);
    // const selectPuzleList = Immutable.fromJS(selectPuzzleList);
    const bannerProps = {
      envUrls,
      banner,
      activityInfo,
    };
    let content = '';
    if (activityDesc) {
      content = activityDesc.get('activity_desc');
    }
    const sortImgSrc = sortTypes.find(item => item.id == currentSortTypeIndex).iconSelected;

    const { bgSrc, deSrc } = this.getBackground();

    const fillColor = activityInfo.get('skin_vo').get('other_font_color');
    return (
      <>
        {isLoading ? (
          <div className="loading-box">
            <img src={loadingUrl} />
          </div>
        ) : null}
        <div className="home" style={{ opacity: isShow ? 1 : 0, ...style }}>
          <section className="info-container" ref={ref => (this.infoRef = ref)}>
            {/* 首部轮播图 */}
            {isShowBanner && (
              <div className="swiper-box">
                <Banner {...bannerProps} />
              </div>
            )}
            {hasMoreImageList && (
              <div className="new-image-btn" onClick={() => this.getMoreImageData()}>
                {t('LPC_NEW_PHOTO')}
              </div>
            )}
            <div className="card" style={{ backgroundImage: `url(${bgSrc})` }}>
              {this.renderInfoSection()}
              <div className="set-box">
                {this.renderMenuSection()}
                <div className="set-btns-box">
                  <div className="line" />
                  <div className="btns-box">
                    <Qrcode
                      className={cls({ 'qr-img': __isCN__, 'qr-img-en': !__isCN__ })}
                      onClick={() => this.showShareQRCode()}
                      fill={fillColor}
                    ></Qrcode>
                    <Tooltip
                      trigger="click"
                      overlayClassName="home-tool-container"
                      overlayInnerStyle={{ background: 'white', opacity: '1', padding: '0px' }}
                      placement="bottomRight"
                      visible={isShowFilterModal}
                      onVisibleChange={val => this.onVisibleChange(val)}
                      overlay={this.renderSortModal()}
                    >
                      <Sort
                        fill={fillColor}
                        className={cls({ 'sort-img': __isCN__, 'sort-img-en': !__isCN__ })}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section
            className="images-container"
            style={{ backgroundImage: `url(${deSrc})`, minHeight: `calc(100% - ${infoHeight}px)` }}
          >
            {/* 图片直播  */}
            <Broadcast
              isShow={currentSetId == 'broadcast'}
              // isShow
              timeSegmentGroup={timeSegmentGroup}
              currentSortTypeIndex={currentSortTypeIndex}
              list={setImages}
              puzzle={{
                fn: this.userSelectPuzzle,
                list: selectPuzzleList,
                puzzleStep,
              }}
              loadData={this.loadData}
              renderCard={this.renderCard}
              hasMore={hasMore}
              pageSize={pageSize}
              loadTimeLineImageData={this.loadTimeLineImageData}
              envUrls={envUrls}
              showImageViewer={this.showImageViewer}
              showCollapsePhotosGroup={this.showCollapsePhotosGroup}
              isLoadingImageList={isLoadingImageList}
              total={total}
              broadcastAlbum={broadcastAlbum}
              activityInfo={activityInfo}
              onChangeCategory={this.onChangeCategory}
            />
            {/* 热门 */}
            <HotImages
              isShow={currentSetId == 'hots'}
              envUrls={envUrls}
              hotImages={hotImages}
              hotImageTotal={hotImageTotal}
              puzzle={{
                fn: this.userSelectPuzzle,
                list: selectPuzzleList,
                puzzleStep,
              }}
              showImageViewer={this.showImageViewer}
              isLoadingHotImageList={isLoadingHotImageList}
            />
            {/* 活动介绍 */}
            {currentSetId == 'introduce' && activityDesc && (
              <div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }}></div>
            )}
          </section>
          {isLoadingImageList || isLoadingHotImageList ? (
            <div className="loading-line-box">
              <div className="loading-line">
                <div className="loading-lineText">{t('LPCM_BOTTOM_LOADING')}</div>
              </div>
            </div>
          ) : null}
          {isShowFilterModal && <div className="mask" />}
        </div>
        {__isCN__ && currentSetId !== 'introduce' && (
          <Puzzle
            puzzleTitle={broadcastAlbum.get('album_name')}
            puzzleStep={puzzleStep}
            selectPuzzleList={selectPuzzleList}
            puzzleStepFn={this.puzzleStepFn}
            resetSelectPuzzleListFn={this.resetSelectPuzzleListFn}
          />
        )}
        {__isCN__ && activityInfo.toJS().ending_advertise.status == 1 && (
          <EndModal activityInfo={activityInfo.toJS()} envUrls={envUrls} />
        )}
        <AIRecognitionBtn envUrls={envUrls} boundGlobalActions={boundGlobalActions} />
        {/* 在loading动画结束后展示侧边广告效果 */}
        {__isCN__ && isShow ? (
          <SideAdvertisingBtn envUrls={envUrls} boundGlobalActions={boundGlobalActions} />
        ) : null}
      </>
    );
  }
}

export default Home;
