import { fromJS } from 'immutable';
import { isEqual } from 'lodash';
import Tooltip from 'rc-tooltip';
import React from 'react';
import { Autoplay, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/swiper.scss';

import * as modalTypes from '@resource/lib/constants/modalTypes';
import { saasProducts } from '@resource/lib/constants/strings';

import getQRCodeUrl from '@resource/lib/service/getQrcode';

import {
  getAISubscribeLIST,
  getDesignerIsTry,
  getDesignerStatus,
} from '@resource/pwa/services/subscription';

import hotPng from '@resource/static/icons/mark/hot.png';
import top1Png from '@resource/static/icons/mark/top1.png';

import { XPureComponent } from '@common/components';

import hot from '@apps/dashboard/static/icons/hot.png';

import Notification from '../../../components/Notification';

import mainHandler from './handle/main';
import noticeImg from './images/notice.png';

import './index.scss';

const imgAiphoto = '/clientassets-cunxin-saas/portal/images/pc/dashboard/aiphoto.png';
const arrow = '/clientassets-cunxin-saas/portal/images/pc/dashboard/arrow_right.png';
const banner1 = '/clientassets-cunxin-saas/portal/images/pc/dashboard/image-matting.jpg';
const bitmap = '/clientassets-cunxin-saas/portal/images/pc/dashboard/bitmap.png';
const imgDesigner = '/clientassets-cunxin-saas/portal/images/pc/dashboard/designer.png';
const banner3 = '/clientassets-cunxin-saas/portal/images/pc/dashboard/banner-gallery.jpg';
const imgGallery = '/clientassets-cunxin-saas/portal/images/pc/dashboard/gallery.png';
const hotIcon = '/clientassets-cunxin-saas/portal/images/pc/dashboard/hot.png';
const banner4 = '/clientassets-cunxin-saas/portal/images/pc/dashboard/设计.jpg';
const banner2 = '/clientassets-cunxin-saas/portal/images/pc/dashboard/直播.jpg';
const imgLive = '/clientassets-cunxin-saas/portal/images/pc/dashboard/live.png';
const newIcon = '/clientassets-cunxin-saas/portal/images/pc/dashboard/new.png';
const galleryBanner = '/clientassets-cunxin-saas/portal/images/pc/dashboard/选片.jpg';
const imgSlideShow = '/clientassets-cunxin-saas/portal/images/pc/dashboard/slider.png';
const supportingFilm = '/clientassets-cunxin-saas/portal/images/pc/dashboard/supporting_film.png';
const template = '/clientassets-cunxin-saas/portal/images/pc/dashboard/template.png';
const bg = '/clientassets-cunxin-saas/portal/images/common/imgs/bg.png';
const bgHot = '/clientassets-cunxin-saas/portal/images/common/imgs/bg-hot.png';
const seniorYearBanner =
  '/clientassets-cunxin-saas/portal/images/pc/dashboard/senior-year-banner-1.jpg';
const exhibition = '/clientassets-cunxin-saas/portal/images/pc/dashboard/exhibition.jpg';
const newProducts = [
  {
    src: imgDesigner,
    link: '/software/designer/projects',
    title: '设计软件',
    subTitle: '无需安装，一键成册',
    bg: bgHot,
    mark: top1Png,
    id: '',
    log: 'Dashboard_Click_Designer',
  },
  {
    src: imgGallery,
    link: '/software/gallery/collection',
    title: '选片软件',
    subTitle: '无需安装，多平台选片',
    id: '',
    bg,
    log: 'Dashboard_Click_Gallery',
  },
  {
    src: imgLive,
    link: '/software/live/photo',
    title: '照片直播',
    subTitle: '全新一代照片直播平台',
    bg: bgHot,
    mark: hotPng,
    id: '',
    log: 'Dashboard_Click_Livephoto',
  },
  {
    src: imgAiphoto,
    link: '/software/aiphoto/collection',
    title: '智能修图',
    subTitle: '像素级AI修图，批量初修',
    id: '',
    bg,
    log: 'Dashboard_Click_Retoucher',
  },
  {
    src: imgSlideShow,
    link: '/software/slide-show/collection',
    title: '动感MV',
    subTitle: '照片新玩法，二销利器',
    bg,
    id: '',
    log: 'Dashboard_Click_Slideshow',
  },
];

const banners = [
  {
    src: exhibition,
    // link: '/software/live/photo', // wywtodo
    alt: '展会',
    log: 'Dashboard_Click_Banner',
    banner_id: 0,
  },
  {
    src: banner2,
    link: '/software/live/photo',
    alt: '直播软件',
    log: 'Dashboard_Click_Banner',
    banner_id: 3,
  },
  {
    src: galleryBanner,
    alt: '选片软件',
    log: 'Dashboard_Click_Banner',
    banner_id: 1,
    link: '/software/gallery/collection',
  },
  {
    src: banner4,
    alt: '设计软件',
    log: 'Dashboard_Click_Banner',
    banner_id: 4,
    link: '/software/designer/projects',
  },
  {
    src: banner1,
    // link: '/software/account?tabs=3&level=30&cycle=1&product_id=SAAS_DESIGNER',
    link: 'https://mp.weixin.qq.com/s?__biz=Mzg3NzY3MjEyNg==&mid=2247486346&idx=1&sn=bc50fa323cc11f0da5576eba3acbdcf8&chksm=cf1e285bf869a14d6ce05d66b9a206949867f62cd78a28c63212c6c4744d9f4c5a0ec7b40cc0&token=1867276077&lang=zh_CN#rd',
    alt: '设计软件',
    log: 'Dashboard_Click_Banner',
    banner_id: 2,
    isHref: true,
  },
  // {
  //   src: banner1,
  //   link: '/software/designer/projects',
  //   alt: '设计软件',
  //   log: 'Dashboard_Click_Banner',
  //   banner_id: '31'
  // },
  // {
  //   src: banner1,
  //   link: '/software/designer/projects',
  //   alt: '设计软件',
  //   log: 'Dashboard_Click_Banner',
  //   banner_id: '32'
  // },
];

const noticeList = [
  {
    content: 'AI智能分片重磅上线，千人毕业照秒级分片',
    src: hot,
    link: 'https://mp.weixin.qq.com/s?__biz=Mzg3NzY3MjEyNg==&mid=2247487044&idx=1&sn=3a2f51efcafa1413927bff10122d0803&chksm=cf1e2d95f869a4837c5464a0d8ac0ff71480cc98d90a7cc47a8789cccac4174be5dd98c3e7f4&token=1733793585&lang=zh_CN#rd',
    time: '2024-04-10',
    link_id: '',
    target: '__blank',
  },
  {
    content: '特惠低价！照片直播-AI修图20元/场，无限张数，畅修无压力',
    // src: hot,
    link: 'https://mp.weixin.qq.com/s/SnYLc5IfolnqkdiO8XRICQ',
    time: '2024-01-25',
    link_id: '',
    target: '__blank',
  },
  {
    content: '「照片直播」全新移动端创建相册，轻松实时出片  ',
    link: 'https://mp.weixin.qq.com/s/Wbc9UNXUQvOJXkWB8-ro2w',
    time: '2024-01-25',
    link_id: '',
    target: '__blank',
  },
  {
    content: '「自定义定制商品」功能上线，助力选片二销业绩再翻倍！',
    link: 'https://mp.weixin.qq.com/s?__biz=Mzg3NzY3MjEyNg==&mid=2247486368&idx=2&sn=c59e5a25a06d4179c10acb7a9bbdd50c&chksm=cf1e2871f869a16727b49b09868860b9ebed24d6d6e4ac6504a5c3ceffaa1333dfbeb9857ae7&mpshare=1&scene=1&srcid=0102aWJb4sSlckRgIKqBK4uT&sharer_shareinfo=993510d7b6cf2192e8c29394164cf6dc&sharer_shareinfo_first=993510d7b6cf2192e8c29394164cf6dc&version=4.1.2.70182&platform=mac#rd',
    time: '2023-12-15',
    link_id: '',
  },
  // {
  //   src: hotIcon,
  //   content: '智能抠图功能来了！在线抠图，一键去除背景~  ',
  //   link: 'https://mp.weixin.qq.com/s?__biz=Mzg3NzY3MjEyNg==&mid=2247486346&idx=1&sn=bc50fa323cc11f0da5576eba3acbdcf8&chksm=cf1e285bf869a14d6ce05d66b9a206949867f62cd78a28c63212c6c4744d9f4c5a0ec7b40cc0&token=1867276077&lang=zh_CN#rd',
  //   time: '2023-11-30',
  //   link_id: '',
  // },
  // {
  //   content: '硬核更新！「智能人像识别、防止人脸裁切」 功能已上线！',
  //   link: 'https://mp.weixin.qq.com/s?__biz=Mzg3NzY3MjEyNg==&mid=2247485846&idx=1&sn=2dd84076fa74383c795c07466694838c&chksm=cf1e2a47f869a3516802f09178ac95de4b11f0af84639783f5f696145a1bd1ea341d397bb85b&token=1569867398&lang=zh_CN#rd',
  //   time: '2023-11-15',
  //   link_id: '',
  // },
  // {
  //   content: '重磅发布！PSD文件包上传&自动解析来了！',
  //   link: 'https://mp.weixin.qq.com/s?__biz=Mzg3NzY3MjEyNg==&mid=2247485629&idx=1&sn=eae58e0cd5819c9bf9bdd4b1c0448ec0&chksm=cf1e2b6cf869a27abf2d8a13a7528c8e94531028c517a8aa65483e8c8441c66746054388a7a1&token=1155388007&lang=zh_CN&from=industrynews&version=4.1.9.6012&platform=win#rd',
  //   time: '2023-09-27',
  //   link_id: 'PSDImportAnnouncement',
  // },
];

const sales = [
  {
    src: bitmap,
    link: '/software/designer/projects',
    title: '在线选版',
    subTitle: '版面集成选片，提升加片率',
    id: 0,
    log: 'Dashboard_Click_DesignerLayoutButton',
    text: '升级体验',
    hoverText:
      '在线选版：照片以排版后的相册形式交付用户，营造出整体性和故事感，能够提升用户选片的数量， 帮助摄影师完成更多的二销。',
  },
  {
    src: supportingFilm,
    link: '/software/designer/projects',
    title: '加片二销',
    subTitle: '加片规则设置，在线提升二销',
    id: 1,
    log: 'Dashboard_Click_GalleryAddPhotosButtom',
    text: '立即体验',
    hoverText:
      '二销加片：简单的配置加片规则，摄影师就能让客户在线选片、加片、入框、入册、购买实物产品等；用户可以在线设计产品， 所见即所得。',
  },
];

class Dashboard extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      notice: noticeList,
      isShowText: false,
      bannerShow: false,
    };
  }

  componentDidMount() {
    const { urls, userInfo, boundProjectActions } = this.props;
    const userId = userInfo?.get('uidPk');
    const baseUrl = urls && urls.get('baseUrl');
    this.handelBannderShow();
    if (userId) {
      getDesignerStatus(baseUrl, userId).then(status => {
        boundProjectActions.updateDesignerStatus(status);
        if (status && status.proof_status === 1) {
          boundProjectActions.updateDesignerStatus({
            ...status,
            isFreetry: true,
          });
        }
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { urls, userInfo, boundProjectActions } = this.props;
    const { userInfo: preuserInfo } = prevProps;
    const userId = userInfo?.get('uidPk');
    const preuserId = preuserInfo?.get('uidPk');
    const baseUrl = urls && urls.get('baseUrl');

    if (userId && userId !== preuserId) {
      getDesignerStatus(baseUrl, userId).then(status => {
        boundProjectActions.updateDesignerStatus(status);
        if (status && status.proof_status === 1) {
          boundProjectActions.updateDesignerStatus({
            ...status,
            isFreetry: true,
          });
        }
      });
    }
  }

  componentWillUnmount() {}

  handelBannderShow() {
    // 临时公告， 超过6-16可删除
    let bannerShowClose = localStorage.getItem('bannerShowClose') || false;
    let startDate = localStorage.getItem('bannerStartTime');
    let endDate = localStorage.getItem('bannerEndTime');
    const startTime = new Date(startDate || '2024-06-11T00:00:00+08:00'); // 开始时间
    const endTime = new Date(endDate || '2024-06-19T03:00:00+08:00'); // 结束时间
    const nowTime = new Date(); // 当前时间
    console.log('data111', startDate, startTime);

    // 判断当前时间是否在开始时间和结束时间之间
    const duringTime = nowTime >= startTime && nowTime <= endTime;
    // 判断Banner是否应该显示
    if (!bannerShowClose && duringTime) {
      this.setState({
        bannerShow: true,
      });
    } else {
      this.setState({
        bannerShow: false,
      });
    }
  }

  handleBannerClose() {
    localStorage.setItem('bannerShowClose', true);
    this.setState({
      bannerShow: false,
    });
  }

  handleExperience = item => {
    const { history, boundGlobalActions, urls, designStatus = {}, userInfo } = this.props;
    const { proof_status } = designStatus;
    const { log, id } = item;
    const userId = userInfo.get('uidPk');
    const baseUrl = urls && urls.get('baseUrl');
    if (id === 0) {
      if (proof_status === 1 || proof_status === 2) {
        proof_status === 1 && getDesignerIsTry(baseUrl, userId);
        history.push('/software/designer/projects');
      } else if (proof_status === 0) {
        boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
          product_id: saasProducts.designer,
          level: 40,
          cycle: 1,
          escapeClose: true,
          onClosed: () => {
            boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
            boundGlobalActions.getMySubscription(urls.get('galleryBaseUrl'));
          },
        });
      }
    } else {
      history.push('/software/gallery/collection');
    }
    if (log) {
      logEvent.addPageEvent({
        name: log,
      });
    }
  };

  handleLink = (item, index) => {
    const { userInfo } = this.props;
    const accountInfo = userInfo?.get('accountInfo');
    const { link, log, icon, banner_id, isHref } = item;
    if (!link) return;
    if (log) {
      const logObj = banner_id ? { name: log, banner_id } : { name: log };
      logEvent.addPageEvent(logObj);
    }
    if (isHref) {
      window.open(item.link);
      return;
    }
    this.props.history.push(link);
  };

  renderCutomerService = item => {
    const { fuliQrcode } = this.state;
    return (
      <div className="cutomerService">
        <div className="title">专属顾问</div>
        <div className="text">如您有产品使用/购买的问题 可扫描下方二维码</div>
        <img className="qrcode" src={fuliQrcode}></img>
        <div className="text">微信扫一扫，获取专属顾问</div>
      </div>
    );
  };

  getSales = designStatus => {
    const { proof_status, isFreetry = false } = designStatus;
    if (proof_status === 1 && isFreetry) {
      return sales.map((item, index) => {
        index === 0 ? (item.text = '领取14天试用') : item;
        return item;
      });
    }

    if (proof_status === 2) {
      return sales.map((item, index) => {
        index === 0 ? (item.text = '立即体验') : item;
        return item;
      });
    }

    return sales;
  };

  render() {
    const { designStatus = {} } = this.props;
    const { bannerShow } = this.state;
    const salesInfo = this.getSales(designStatus);
    return (
      <div className="dashboard">
        {bannerShow && (
          <div className="banner">
            <img className="img" src={noticeImg} />
            <span className="cont">
              寸心云服已完成全面升级。升级后如遇无法登录账号、访问工作台，图片显示不全等问题，可通过
              <a
                href="https://yun.cunxin.com/helpcenter/2024/06/16/%e5%a6%82%e4%bd%95%e6%b8%85%e9%99%a4%e6%b5%8f%e8%a7%88%e5%99%a8%e7%bc%93%e5%ad%98/"
                target="_blank"
                rel="noopener noreferrer"
              >
                清理浏览器缓存
              </a>
              或反馈在线客服解决。不便之处，敬请谅解！
            </span>
            <span className="close" onClick={() => this.handleBannerClose()}>
              x
            </span>
          </div>
        )}
        <div className="carousel">
          <Swiper
            style={{
              '--swiper-pagination-color': '#000',
            }}
            navigation
            initialSlide={0}
            spaceBetween={15}
            loop={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
          >
            {banners.map((item, index) => {
              return (
                <SwiperSlide key={item.banner_id}>
                  <div className="swiper-box" onClick={() => this.handleLink(item, index)}>
                    <img className="swiper-bg-image" src={item.src} alt={item.alt}></img>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="content">
          <div className="notice">
            <div className="title">活动公告</div>
            <div className="cont">
              <Notification messages={noticeList} interval={3000} />
            </div>
          </div>
          <div className="publicize">
            <div className="secondary-sales">
              <div className="title">二销利器</div>
              <div className="cont">
                {salesInfo.map((item, index) => {
                  return (
                    <Tooltip
                      overlayClassName="sales-waveform-tooltip"
                      placement="topLeft"
                      overlay={item.hoverText}
                    >
                      <div className="sale-block" style={{ backgroundImage: `url(${item.src})` }}>
                        <div className="sale-name">
                          <div className="sale-title">{item.title}</div>
                          <div className="sale-subtitle">{item.subTitle}</div>
                        </div>
                        <span className="experience" onClick={() => this.handleExperience(item)}>
                          {item.text}
                        </span>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
            <div className="materials">
              <div className="title">套版素材</div>
              <div
                className="cont"
                onClick={() => {
                  logEvent.addPageEvent({
                    name: 'Dashboard_Click_FreeTemplateButton',
                  });
                  this.props.history.push('/software/designer/my-materials');
                }}
              >
                <img className="template" src={template} alt="template" />
              </div>
            </div>
          </div>
        </div>
        <div className="new-product">
          <div className="title">最新产品</div>
          <div className="product-list">
            {newProducts.map(item => {
              return (
                <div className="product-box" style={{ backgroundImage: `url(${item.bg})` }}>
                  {item.mark ? <img className="mark_img" src={item.mark} /> : null}
                  <div className="product-name">
                    <div className="product-title">{item.title}</div>
                    <div className="product-subtitle">{item.subTitle}</div>
                  </div>
                  <img className="product-img" src={item.src}></img>
                  <div className="product-link" onClick={() => this.handleLink(item)}>
                    立即使用 <img className="arrow" src={arrow}></img>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
