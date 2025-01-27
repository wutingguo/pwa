import classNames from 'classnames';
import { fromJS } from 'immutable';
import { isEqual } from 'lodash';
import moment from 'moment';
import React, { Fragment } from 'react';
import { Sticky } from 'react-sticky';

import XNewImageViewer from '@resource/components/XNewImageViewer';
import XWaterFall from '@resource/components/XWaterFall';

import * as cache from '@resource/lib/utils/cache';

import { CONFIRM_MODAL } from '@resource/lib/constants/modalTypes';
import {
  galleryOrderType,
  orderStatus,
  payScenario,
  paySource,
} from '@resource/lib/constants/strings';

import scrollLoadHOC from '@common/utils/scrollLoadHOC';

import { submitGallery } from '@common/servers';

import { PlayerVideo, XCoverRender, XIcon, XPureComponent } from '@common/components';

import { querySetImages } from '@apps/gallery-client/services/project';
import {
  getEmailCacheKey,
  getIsUnsupportDownload,
  getPhoneCacheKey,
} from '@apps/gallery-client/utils/helper';
import { transformSetImages } from '@apps/gallery-client/utils/mapStateHelper';

import HorizontalWaterFall from '../../components/HorizontalWaterFall';
import ConsumerButton from '../components/ConsumerButton';
import MyProjectsButton from '../components/MyProjectsButton';
import Popup from '../components/Popup';
import ShopCartButton from '../components/ShopCartButton';

import main from './handle/main';
import render from './handle/render';
import face from './img/face.png';
import { shareMediaModalConfig } from './modalConfig';

export const checkIsShowPrintStore = store =>
  Boolean(store.getIn(['fetched', 'status']) && store.get('status'));

class Home extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentSetIndex: 0,

      // 存储用于放大预览的图片数据.
      viewImageIndex: -1,

      setListWidth: '',

      // 没有下载权限
      isUnsupportDownload: true,

      setsSetting: [],
      favoriteImgIds: fromJS([]),
      images: fromJS({}),
      activeComboUser: -1,
      comboListTag: false,
      isFace: false,
      facePopup: false,
      faceImg: fromJS([]),
      orderConfig: {
        payInfoShow: false,
      },
      continueShow: false,
      payTypeConfigs: null,
      submitGalleryStatus: false,
    };
    this.activeCombo = -1;
    this.sumNum = 0;
    this.selectedNum = 0;
    this.sortComboList = [];

    this.collectionNameWrap = React.createRef();
    this.comboListNode = React.createRef();
  }

  componentDidMount() {
    const {
      boundProjectActions,
      sets,
      downloadSetting,
      guest,
      collectionId,
      favorite,
      urls,
      favoriteSetting,
    } = this.props;
    const { syncGalleryFavList, getFavoriteImageList } = boundProjectActions;
    const galleryBaseUrl = urls.get('galleryBaseUrl');

    const isUnsupportDownload = getIsUnsupportDownload(downloadSetting);
    this.setState({
      setListWidth: `calc(100% - ${this.collectionNameWrap?.current?.offsetWidth || 0}px - 540px ${
        // isShowPrintStore ? '- 350px' : ''
        __isCN__ ? '- 130px' : '- 60px'
      })`,
      isUnsupportDownload,
    });
    if (__isCN__) {
      const uid = `${guest.get('guest_uid')}_${collectionId}`;
      const favorite_uid = favorite.get('favorite_uid');
      const { currentSetIndex } = this.state;
      const id = sets.getIn([currentSetIndex, 'set_uid']);
      const getLocalFavImgs = !localStorage.getItem('favoriteImgs')
        ? {}
        : JSON.parse(decodeURIComponent(localStorage.getItem('favoriteImgs')));
      favorite_uid &&
        boundProjectActions.getTagAmount(id).then(res => {
          const { data } = res;
          if (data) {
            data.forEach(item => {
              if (!item.label_enable) return;
              boundProjectActions.getLableImgList(item.id);
            });
          }
        });
      if (favorite_uid) {
        this.getOrderStatus({
          galleryBaseUrl,
          favorite_id: favorite_uid,
        });
      }
      const save_preview_enabled = __isCN__ ? !!favoriteSetting?.get('save_preview_enabled') : true;
      console.log('save_preview_enabled: ', save_preview_enabled);
      if (!save_preview_enabled) {
        window.oncontextmenu = e => {
          //取消默认的浏览器自带右键 很重要！！
          e.preventDefault();
        };
      }
      const hasFavImgs = getLocalFavImgs[uid] && getLocalFavImgs[uid].length;
      if (hasFavImgs) {
        // sync Fav list
        const sentContent = getLocalFavImgs[uid].map(item => ({
          enc_image_uid: item.enc_image_uid,
          comment: item.comment,
        }));
        syncGalleryFavList(sentContent).then(() => {
          getFavoriteImageList(guest.get('guest_uid'));
        });
      }
      //  智能分片逻辑
      this.onInitFace(this);
    } else if (!__isCN__) {
      boundProjectActions.getLimitPhotoDownload();
    }
    this.onSelectSet(0);
    window.addEventListener('click', () => {
      if (this.state.comboListTag) {
        this.setState({
          comboListTag: false,
        });
      }
    });
  }
  componentDidUpdate(preProps, preState) {
    const { favorite, boundProjectActions, sets, favoriteImageList, detail, urls, guest } =
      this.props;
    const {
      favorite: prefavorite,
      favoriteImageList: prefavoriteImageList,
      guest: preGuest,
    } = preProps;
    const { currentSetIndex, images: imgs } = this.state;
    const id = sets.getIn([currentSetIndex, 'set_uid']);
    const { downloadImgInfo } = detail && detail.toJS();
    const { sets: downloadSets } = downloadImgInfo || {};
    const { enc_image_ids } = (downloadSets && downloadSets.find(item => id === item.set_id)) || {};
    const images = imgs.get(id) || fromJS([]);

    if (__isCN__) {
      const oldfavorite_uid = prefavorite.get('favorite_uid');
      const favorite_uid = favorite.get('favorite_uid');
      if (oldfavorite_uid !== favorite_uid) {
        // 当新老favorite_uid不一样时触发订单状态的校验
        this.getOrderStatus({
          galleryBaseUrl: urls.get('galleryBaseUrl'),
          favorite_id: favorite_uid,
        });
      }
      if (
        oldfavorite_uid !== favorite_uid ||
        preState.currentSetIndex !== currentSetIndex ||
        !isEqual(prefavoriteImageList, favoriteImageList)
      ) {
        // didMount拿不到favorite_uid， favoriteImageList的数量不同会重新触发， so...
        boundProjectActions.getTagAmount(id).then(res => {
          const { data } = res;
          if (data) {
            data.forEach(item => {
              if (!item.label_enable) return;
              boundProjectActions.getLableImgList(item.id);
            });
          }
        });
      }
    }
    if (!isEqual(detail, preProps.detail) || !isEqual(prefavoriteImageList, favoriteImageList)) {
      // this.onSelectSet(currentSetIndex);
      this.getImageList(id, currentSetIndex);
      const imageList = images.map(item => {
        const imgId = item.get('enc_image_uid');
        const findFav = favoriteImageList.find(subItem => subItem.get('enc_image_uid') === imgId);
        const isDownload = enc_image_ids && enc_image_ids.includes(item.get('enc_image_uid'));
        if (findFav && findFav.get('enc_image_uid') === imgId) {
          return item.merge(item, {
            comment: findFav.get('comment'),
            width: item.get('width'),
            height: item.get('height'),
            isDownload,
          });
        }
        return item.merge(item, {
          width: item.get('width'),
          height: item.get('height'),
          isDownload,
        });
      });
      const newImages = imgs.set(id, imageList);
      this.setState({
        images: newImages,
      });
    }
    if (!isEqual(preState.images, this.state.images) && this.state.images.size) {
      this.postImgs();
    }
    if (!__isCN__) {
      const oldfavorite_uid = prefavorite.get('favorite_uid');
      const favorite_uid = favorite.get('favorite_uid');
      if (oldfavorite_uid !== favorite_uid || guest.get('email') !== preGuest.get('email')) {
        boundProjectActions.getLimitPhotoDownload();
      }
    }
  }

  postImgs = () => {
    const { currentSetIndex, images } = this.state;
    const { postData, sets } = this.props;
    const set = sets && sets.get(currentSetIndex);
    const groups = images.get(set.get('set_uid'));
    postData(groups);
  };

  loadData = () => main.loadData(this);
  onFaceUI = () => main.onFaceUI(this);
  onOpenFace = () => main.onOpenFace(this);
  onFaceSelect = list => main.onFaceSelect(this, list);
  onGetFaceInfo = () => main.onGetFaceInfo(this);
  onInitFace = () => main.onInitFace(this);
  getOrderDetails = (...params) => main.getOrderDetails(this, ...params);
  getOrderStatus = (...params) => main.getOrderStatus(this, ...params);
  getQrCodeUrl = (...params) => main.getQrCodeUrl(this, ...params);
  cancelOrder = (...params) => main.cancelOrder(this, ...params);
  continuePaymentModal = (...params) => main.continuePaymentModal(this, ...params);
  handlePay = price => main.handlePay(this, price);
  handleSubmit = () => main.handleSubmit(this);
  hidePayInfo = () => main.hidePayInfo(this);
  renderCard = (...params) => render.renderCard(this, ...params);
  renderSelectionBox = (selectionSetting, selectionSettingSwitch) =>
    render.renderSelectionBox(this, selectionSetting, selectionSettingSwitch);

  onSelectSet = async index => {
    window.logEvent.addPageEvent({
      name: 'Gallery_Click_SetTab',
    });

    const { boundProjectActions, sets } = this.props;

    const id = sets.getIn([index, 'set_uid']);
    this.getImageList(id, index);
    boundProjectActions.getSetVideoInfo({ collection_set_id: id }).then(videoInfo => {
      const { video_source, video_id } = videoInfo;
      if (video_source === 2) {
        boundProjectActions.getSlideshowInfo(video_id);
      }
    });
    this.setState(
      {
        currentSetIndex: index,
      },
      () => {
        this.postImgs();
      }
    );
  };

  // 添加或删除favorite
  toggleFavorite = (item, isFavorite) => main.toggleFavorite(this, item, isFavorite);
  bindUserInfo = cb => main.bindUserInfo(this, cb);
  // 预览图片.
  showImageViewer = (item, index) => main.showImageViewer(this, item, index);
  hideImageViewer = () => main.hideImageViewer(this);
  formatViewerImages = image => main.hideImageViewer(this, image);
  renderFavoriteViewHeader = opt => render.renderFavoriteViewHeader(this, opt);
  verifySubmit = isNotify => main.verifySubmit(this, isNotify);
  // 评论
  addComment = (item, text) => main.addComment(this, item, text);

  // 显示favorite图片列表弹框.
  showFavoriteList = submitStatus => {
    window.logEvent.addPageEvent({
      name: 'Gallery_Click_FavoriteList',
    });

    main.showFavoriteList(this, submitStatus);
  };

  hideViewerAndShowFavoriteList = () => {
    this.hideImageViewer();
    this.showFavoriteList();
  };

  getDropdownProps = () => main.getDropdownProps(this);

  downloadGallery = params => main.downloadGallery(this, params);

  submitGallery = status => {
    if (status) {
      return;
    }
    const {
      urls,
      collectionUid,
      guest,
      boundGlobalActions,
      boundProjectActions,
      qs,
      favoriteImageList,
      selectionSetting,
    } = this.props;
    const { payTypeConfigs } = this.state;
    const { gallery_image_extra, gallery_image_num, gallery_rule_switch, gallery_rule_type } =
      selectionSetting.toJSON();
    const comboList = selectionSetting.get('add_image_packages')?.toJS() || [];
    const tempComboList = [...comboList].sort(
      (a, b) => a['gallery_image_num'] - b['gallery_image_num']
    );

    const { showModal, hideModal } = boundGlobalActions;
    // const { favoriteImgIds } = this.state;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const collection_uid = qs.get('collection_uid');
    const cacheEmailKey = getEmailCacheKey(collection_uid);
    const cachePhoneKey = getPhoneCacheKey(collection_uid);
    const email = cache.get(cacheEmailKey);
    const phone = cache.get(cachePhoneKey);
    const canSubmit = email || phone;
    const sumNum = this.sumNum;
    const selectedNum = this.selectedNum;
    const activeCombo = this.activeCombo;

    // 计算价格
    const imageNum = selectionSetting.get('gallery_image_num');
    const singleCharge = selectionSetting.get('gallery_image_extra');
    const chargeNum = selectedNum - imageNum;
    const imageCharge = Number(singleCharge) * chargeNum;
    const price =
      gallery_rule_type === 0
        ? imageCharge
        : tempComboList[activeCombo] && tempComboList[activeCombo]['price'];
    const add_image_pack_id =
      gallery_rule_type === 0 || activeCombo === -1 ? null : tempComboList[activeCombo]['uidpk'];
    // console.log('selectedNum', this.selectedNum, payTypeConfigs);
    // return;
    const weixinShow =
      payTypeConfigs &&
      payTypeConfigs.find(item => item.pay_type === galleryOrderType.weixin).pay_switch;

    this.setState({
      orderConfig: {
        ...this.state.orderConfig,
        price: price,
      },
    });

    if (!canSubmit) {
      this.bindUserInfo(confrimModal);
      return;
    }
    if (gallery_rule_switch && gallery_rule_type === 1 && selectedNum > sumNum) {
      boundGlobalActions.addNotification({
        message: '已选照片数量大于可选数量，请更换套餐',
        level: 'error',
        autoDismiss: 2,
      });
      return;
    }
    const confrimModal = textObj => {
      const { title, message, btnText1, btnText2 } = textObj;
      showModal(CONFIRM_MODAL, {
        title,
        message,
        close: () => hideModal(CONFIRM_MODAL),
        buttons: [
          {
            text: btnText1,
            className: 'white',
            onClick: () => hideModal(CONFIRM_MODAL),
          },
          {
            text: btnText2,
            onClick: () => {
              if (gallery_rule_switch && __isCN__ && price && Number(price) > 0) {
                this.handlePay({ price, add_image_pack_id, weixinShow });
              } else {
                this.handleSubmit(this);
              }
            },
          },
        ],
      });
    };

    // gallery_rule_type 0 按张数， 1套餐
    if (
      gallery_rule_switch &&
      gallery_rule_type === 1 &&
      selectedNum > gallery_image_num &&
      selectedNum < sumNum
    ) {
      confrimModal({
        title: '重要提示',
        message: '当前套餐可选更多的照片，建议您继续选片或更换更合理的加片套餐',
        btnText1: '继续选片',
        btnText2: '仍要提交',
      });
    } else if (gallery_rule_switch && __isCN__ && price && Number(price) > 0) {
      // 张数符合了， 走支付流程
      this.handlePay({ price, add_image_pack_id, weixinShow });
    } else {
      // 走原来的逻辑
      confrimModal({
        title: t('IMPORT_TIP', '重要提示'),
        message: t('SUBMIT_TIP', '请仔细确认您提交的选片是否正确，一旦您提交后，将不再允许更改！'),
        btnText1: t('CANCEL'),
        btnText2: t('OK'),
      });
    }
  };

  toPrintStore = () => {
    const { pathname, search } = window.location;
    const url = `${pathname}${search}#/printStore/categories`;
    window.location.href = url;
  };

  // 获取图片列表
  getImageList = async (id, currentSetIndex) => {
    const { urls, favoriteImageList, boundProjectActions, detail } = this.props;
    const { downloadImgInfo } = detail && detail.toJS();
    const { sets: downloadSets } = downloadImgInfo || {};
    const { enc_image_ids } = (downloadSets && downloadSets.find(item => id === item.set_id)) || {};
    const { images } = this.state;
    if (!id) return;
    if (images.has(id)) {
      const imageList = images.get(id);
      boundProjectActions.setCurrentSetFavoriteImageCount(
        currentSetIndex,
        imageList,
        favoriteImageList
      );
      return;
    }
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const params = {
      baseUrl: galleryBaseUrl,
      set_uid: id,
    };
    try {
      const res = await querySetImages(params);
      const data = transformSetImages(fromJS({ images: res }), null, urls);
      const imageList = data.map(item => {
        const imgId = item.get('enc_image_uid');
        const findFav = favoriteImageList.find(subItem => subItem.get('enc_image_uid') === imgId);
        const isDownload = enc_image_ids && enc_image_ids.includes(item.get('enc_image_uid'));
        if (findFav && findFav.get('enc_image_uid') === imgId) {
          return item.merge(item, {
            comment: findFav.get('comment'),
            width: item.get('width'),
            height: item.get('height'),
            isDownload,
          });
        }
        return item.merge(item, {
          width: item.get('width'),
          height: item.get('height'),
          isDownload,
        });
      });
      const newImages = images.set(id, imageList);
      boundProjectActions.setCurrentSetFavoriteImageCount(
        currentSetIndex,
        imageList,
        favoriteImageList
      );
      this.setState(
        {
          images: newImages,
        },
        () => {
          this.postImgs();
        }
      );
    } catch (err) {
      console.error(err);
    }
  };
  getHeaderOffsetHeight = () => {
    let h = 0;

    const headerNode = document.querySelector('.owner-tips');
    const coverNode = document.querySelector('.cover-render-box');
    const headerNodeHeight = headerNode ? headerNode.getBoundingClientRect().height : 30;
    const coverNodeHeight = coverNode ? coverNode.getBoundingClientRect().height : 0;
    h = headerNodeHeight + coverNodeHeight + 47;
    return h;
  };
  //分享社交媒体
  showShareMedia = () => {
    const { boundGlobalActions, coverBannerInfo } = this.props;
    const {
      computed: { photo },
    } = coverBannerInfo.toJS();
    boundGlobalActions.showConfirm(shareMediaModalConfig(boundGlobalActions, photo.src));
  };
  render() {
    const {
      currentSetIndex,
      viewImageIndex,
      setListWidth,
      isUnsupportDownload,
      label_list,
      images,
      isFace,
      facePopup,
      faceImg,
      orderConfig,
      submitGalleryStatus,
      // favoriteImgIds
    } = this.state;

    let {
      isOwner,
      sets,
      coverInfo,
      favoriteImageList,
      favorite,
      detail,
      currentSetFavoriteImageCount = 0,
      selectionSetting,
      favoriteSetting,
      collectionSetting,
      guest,
      boundGlobalActions,
      boundProjectActions,
      store,
      designSetting,
      faceImgs,
      urls,
      scrollData,
    } = this.props;
    const galleryStyle = designSetting && designSetting.get('gallery').toJSON();
    const { grid_spacing, grid_style, thumbnail_size } = galleryStyle || {};
    const isShowPrintStore = checkIsShowPrintStore(store);
    const cover = coverInfo;
    const set = sets && sets.get(currentSetIndex);
    const { downloadImgInfo } = detail && detail.toJS();
    const { sets: downloadSets } = downloadImgInfo || {};
    const set_uid = set && set.get('set_uid');
    const { enc_image_ids } =
      (downloadSets && downloadSets.find(item => set_uid === item.set_id)) || {};
    if (!set || !set.size) {
      return null;
    }
    // 封面显示.
    const canRemoveBrand = detail.get('can_remove_zno_branding');
    const event_time = detail.getIn(['collection_setting', 'event_time']);
    const timeText =
      event_time === 946742399000
        ? ''
        : __isCN__
        ? moment(event_time).format('YYYY.MM.DD')
        : moment(event_time).format('MMMM Do, YYYY');
    const coverRenderProps = {
      event_time: timeText,
      cover,
      showBrand: canRemoveBrand !== undefined && !canRemoveBrand,
      scrollCover: __isCN__,
      isFullScreen: true,
      isShowViewButton: true,
      anchorName: 'stickyContent',
    };
    //当开启人像识别时 使用人像识别的数组,
    let totalList = isFace ? faceImg : images.get(set.get('set_uid')) || fromJS([]);
    let waterFallList = isFace
      ? faceImg
      : scrollData || images.get(set.get('set_uid')) || fromJS([]);

    // let waterFallList = set.get('images');

    const commonFormat = arr => {
      return arr.map(item => {
        const imgId = item.get('enc_image_uid');
        const findFav = favoriteImageList.find(subItem => subItem.get('enc_image_uid') === imgId);
        const isDownload = enc_image_ids && enc_image_ids.includes(item.get('enc_image_uid'));
        if (findFav && findFav.get('enc_image_uid') === imgId) {
          return item.merge(item, {
            comment: findFav.get('comment'),
            width: item.get('width'),
            height: item.get('height'),
            isDownload,
          });
        }
        return item.merge(item, {
          width: item.get('width'),
          height: item.get('height'),
          isDownload,
        });
      });
    };

    waterFallList = commonFormat(waterFallList);
    totalList = commonFormat(totalList);

    let submitStatus =
      !this.selectedNum || submitGalleryStatus || favorite.get('submit_status') !== undefined
        ? !!favorite.get('submit_status')
        : 1;
    const guestUser =
      guest.get('password_written') &&
      !(guest.get('phone') || guest.get('email') || guest.get('guest_uid'));
    if (!guest.size || guestUser) {
      submitStatus = 0;
    }
    if (!this.selectedNum) submitStatus = true;
    // set图片列表.
    const waterFallProps = {
      cols: (thumbnail_size || '').toLowerCase() === 'large' ? 4 : 5,
      favoriteImageList,
      list: waterFallList,
      renderCard: (...params) => this.renderCard(...params, submitStatus),
      onScrollToBottom: this.loadData,
      designSetting,
    };
    const horizontalWaterFallProps = {
      favoriteImageList,
      list: waterFallList,
      renderCard: (...params) => this.renderCard(...params, submitStatus),
      onScrollToBottom: this.loadData,
      designSetting,
    };
    // 图片预览.
    const image_name_enabled = __isCN__
      ? favoriteSetting?.get('image_name_enabled')
      : collectionSetting?.get('image_name_enabled');
    const social_sharing_enabled = collectionSetting?.get('social_sharing_enabled');
    const imageViewProps = {
      favoriteImageList,
      hideViewer: this.hideImageViewer,
      images: main.formatViewerImages(totalList, viewImageIndex),
      currentIndex: viewImageIndex,
      imgNameVisible: !!image_name_enabled,
      isShowBackdrop: false,
      isShowHeader: false,
      className: 'favorite-image-viewer',
      renderHeader: params =>
        this.renderFavoriteViewHeader({
          ...params,
          submitStatus,
          imgNameVisible: !!image_name_enabled,
        }),
      renderType: 'canvas',
    };
    const curSetVideo = detail.getIn(['set_video_info', 'video_id']);
    const video_source = detail.getIn(['set_video_info', 'video_source']);
    const showLoding = detail.getIn(['set_video_info', 'showLoding']);
    const playerVideoProps = {
      boundGlobalActions,
      boundProjectActions,
      curSetVideo,
      urls,
      width: '1200px',
      height: '675px',
      video_source,
      showLoding,
    };

    const selectionSettingSwitch = selectionSetting && selectionSetting.get('gallery_rule_switch');
    const isVerifyDownload = set.get('selected_download_status') === 1 && __isCN__;
    const headerOffsetHeight = this.getHeaderOffsetHeight();
    return (
      <div id="homeApp">
        {isOwner ? <div className="owner-tips">{t('VIEW_COLLECTION_AS_OWNER')}</div> : null}
        {/* {cover && cover.get('image_uid') ? <XCoverRender {...coverRenderProps} /> : null} */}
        <XCoverRender {...coverRenderProps} />
        {__isCN__ && orderConfig.payInfoShow && render.renderPayInfo(this)}
        <div className="content" id="waterFallContainer">
          <Sticky topOffset={headerOffsetHeight}>
            {({ style, isSticky }) => {
              const stickyWrapStyle = {
                ...style,
                transform: 'none',
                zIndex: 999,
                backgroundColor: '#f0f0f0',
              };
              const stickyClassNames = classNames('set-wrap', {
                'breadcrumb-sticky-wrap': isSticky,
              });
              return (
                <div id="stickyContent" style={stickyWrapStyle}>
                  <div className={stickyClassNames}>
                    <div className="collection-set-name-wrap">
                      <div
                        className="collection-name ellipsis"
                        ref={this.collectionNameWrap}
                        title={detail.get('collection_name')}
                      >
                        {detail.get('collection_name')}
                      </div>
                      {!isFace && (
                        <ul className="set-list" style={{ width: setListWidth }}>
                          {sets.map((set, index) => {
                            const cName = classNames('set-item', {
                              active: currentSetIndex === index,
                            });

                            return (
                              <li
                                key={set.get('set_uid')}
                                className={cName}
                                onClick={this.onSelectSet.bind(this, index)}
                              >
                                <span>{set.get('set_name')}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    <div className="set-handle-btns">
                      {isShowPrintStore && (
                        <div className="print-store-info">
                          <a
                            className="print-store-info__title"
                            onClick={() => {
                              window.logEvent.addPageEvent({
                                name: 'ClientEstore_Click_PrintStore',
                              });
                              this.toPrintStore();
                            }}
                          >
                            {t('PRINT_STORE')}
                          </a>
                          <span className="print-store-info__split"></span>
                          <span className="print-store-info__buttons">
                            <ShopCartButton
                              className="print-store-info__buttons__item"
                              size="middle"
                              boundGlobalActions={boundGlobalActions}
                              boundProjectActions={boundProjectActions}
                            />
                            <MyProjectsButton
                              className="print-store-info__buttons__item"
                              size="middle"
                              boundGlobalActions={boundGlobalActions}
                              boundProjectActions={boundProjectActions}
                            />
                          </span>
                        </div>
                      )}
                      {faceImgs && faceImgs.length > 0 && (
                        <img
                          style={{ width: '32px', marginRight: '0.7rem', cursor: 'pointer' }}
                          src={face}
                          alt="face"
                          onClick={this.onOpenFace}
                          title="按人像搜索"
                        />
                      )}
                      {waterFallList.size > 0 ? (
                        <XIcon
                          type={`favorite-${isShowPrintStore ? 'middle' : 'big'}`}
                          className="favorite-big-wrap"
                          title={t('VIEW_FAVORITE')}
                          status={
                            currentSetFavoriteImageCount !== 0 ||
                            (favoriteImageList.size && __isCN__)
                              ? 'active'
                              : ''
                          }
                          onClick={() => this.showFavoriteList(submitStatus)}
                        />
                      ) : null}
                      {!__isCN__ && !!social_sharing_enabled && (
                        <XIcon
                          type="share-media"
                          className="favorite-big-wrap"
                          onClick={this.showShareMedia}
                        />
                      )}
                      {isUnsupportDownload ||
                      (!currentSetFavoriteImageCount && !__isCN__ && isVerifyDownload) ? (
                        <span className="favorite-big-wrap">
                          <XIcon
                            type={`download-${isShowPrintStore ? 'middle' : 'big'}`}
                            title={t('PHOTOS_DO_NOT_SUPPORT_DOWNLOADING', '暂时不支持下载')}
                            status="disable"
                            onClick={() => {}}
                          />
                        </span>
                      ) : (
                        // </Tooltip>
                        <span className="favorite-big-wrap">
                          <XIcon
                            title={t('DOWNLOAD_PHOTOS')}
                            type={`download-${isShowPrintStore ? 'middle' : 'big'}`}
                            onClick={() =>
                              this.downloadGallery({ download_type: 1, set_uid: '', submitStatus })
                            }
                          />
                        </span>
                      )}
                      <span className="print-store-consumer__buttons">
                        <ConsumerButton
                          size={isShowPrintStore ? 'middle' : 'big'}
                          isShowPrintStore={isShowPrintStore}
                          className=""
                          boundGlobalActions={boundGlobalActions}
                          boundProjectActions={boundProjectActions}
                        />
                      </span>
                      {__isCN__ && (
                        <span
                          className={`submitGallery ${submitStatus ? 'disable' : ''}`}
                          onClick={() => this.submitGallery(submitStatus)}
                        >
                          {t('submit_gallery', '提交选片')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }}
          </Sticky>
          {!__isCN__ && curSetVideo && (
            <div className="video-content">
              <div className="content-title">VIDEO</div>
              <PlayerVideo {...playerVideoProps} />
            </div>
          )}
          <div className="photo-content">
            {!__isCN__ && curSetVideo && <div className="content-title photo">PHOTOS</div>}
            {waterFallList.size > 0 ? (
              (grid_style || '').toLowerCase() !== 'horizontal' || isFace ? (
                <XWaterFall {...waterFallProps} />
              ) : (
                <HorizontalWaterFall {...horizontalWaterFallProps} />
              )
            ) : null}
          </div>

          {!(waterFallList.size > 0) ? (
            <div className="no-photos">{t('NO_PHOTOS_HERE')}</div>
          ) : null}
        </div>
        {/* 照片放大查看. */}
        {viewImageIndex !== -1 ? <XNewImageViewer {...imageViewProps} /> : null}

        {__isCN__ && this.renderSelectionBox(selectionSetting, selectionSettingSwitch)}
        {__isCN__ && facePopup && (
          <Popup
            onFaceSelect={this.onFaceSelect}
            onFaceUI={this.onFaceUI}
            guest_uid={guest.get('guest_uid')}
            faceImgs={faceImgs}
            galleryBaseUrl={this.props.urls.get('galleryBaseUrl')}
          />
        )}
      </div>
    );
  }
}

export default scrollLoadHOC(Home, {
  scrollContainerId: 'homeApp',
  scrollContentIds: ['waterFallContainer', 'cover_render_box'],
});
