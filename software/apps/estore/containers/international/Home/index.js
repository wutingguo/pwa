import { isEqual } from 'lodash';
import React, { Component, Fragment, memo, useCallback, useEffect, useRef, useState } from 'react';
import cookie from 'react-cookies';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import Popover from '@resource/components/Popover';
import UpgradeInfo from '@resource/components/UpgradeInfo';
import XPureComponent from '@resource/components/XPureComponent';

import { getPromotionStatus, getSubstring } from '@resource/lib/utils/promotion';

import { PACKAGE_LIST_BOX_MODAL, VIDEO_MODAL_STATUS } from '@resource/lib/constants/modalTypes';
import { productBundles, saasProducts } from '@resource/lib/constants/strings';

import { tutorialVideos } from '@apps/estore/constants/strings';
import { galleryTutorialVideos } from '@apps/gallery/constants/strings';

import { estoreModule, getEsModule } from '../../../constants/estoreModule';

import * as introHandle from './handle/intro';

import './index.scss';

// 教程
const Tutorial = memo(({ boundGlobalActions, showIntroModal }) => {
  const [popVisible, setPopVisible] = useState(false);

  const handleClick = useCallback(() => {
    setPopVisible(v => !v);
  }, []);

  const handlePopVisible = useCallback(v => {
    setPopVisible(!!v);
  }, []);

  const handleClickArticles = useCallback(() => {
    setPopVisible(false);
    window.logEvent.addPageEvent({
      name: `Estore_Click_SupportArticles`,
    });
    window.open('https://support.zno.com/hc/en-us/sections/10021350372503-Zno-Estore', '_blank');
  }, [boundGlobalActions]);

  const handleClickVideos = useCallback(() => {
    setPopVisible(false);
    window.logEvent.addPageEvent({
      name: `Estore_Click_TutorialVideos`,
    });

    const { showModal } = boundGlobalActions;

    showModal(VIDEO_MODAL_STATUS, {
      className: 'estore-tutorial-videos-wrapper',
      groupVideos: tutorialVideos,
    });
  }, [boundGlobalActions]);
  const IntroModal = () => {
    window.logEvent.addPageEvent({
      name: `Estore_Click_QuickStart`,
    });
    setPopVisible(false);
    showIntroModal();
  };
  return (
    <Popover
      className="estore-tutorial-popover"
      visible={popVisible}
      onVisibleChange={handlePopVisible}
      offsetTop={6}
      rectToEdge={30}
      theme="white"
      Target={
        <div className="estore-tutorial" onClick={handleClick}>
          Tutorial
        </div>
      }
    >
      <div className="estore-tutorial-menu">
        <div className="estore-tutorial-menu-item" onClick={handleClickArticles}>
          Support Articles
        </div>
        <div className="estore-tutorial-menu-item" onClick={handleClickVideos}>
          Tutorial Videos
        </div>
        <div className="estore-tutorial-menu-item" onClick={IntroModal}>
          Quick Start
        </div>
      </div>
    </Popover>
  );
});

class Home extends XPureComponent {
  constructor(props) {
    super(props);
    // 新手指引
    this.onIntroSkip = () => introHandle.onSkip(this);
    this.onIntroDone = () => introHandle.onDone(this);
    this.onIntroOrderStep = () => introHandle.onOrderStep(this);
    this.onIntroNext = () => introHandle.onNext(this);
    this.onIntroPrevious = () => introHandle.onPrevious(this);
    this.onIntroGoto = stepIndex => introHandle.onGoto(this, stepIndex);
    this.showIntroModal = () => introHandle.showIntroModal(this);
  }
  state = {
    data: [],
    selectedIndex: 0,
    initEsModules: [],
  };

  _initEsModules() {
    const pathSplit = location.pathname.split('e-store');
    const moduleArr = pathSplit[pathSplit.length - 1].split('/');
    const moduleName = moduleArr && moduleArr[1];
    const moduleId = moduleArr && moduleArr[2];
    const idx = estoreModule.findIndex(item => `${item.key}` === moduleName);
    const initEsModules = getEsModule(idx, moduleId);
    this.setState({
      selectedIndex: idx === -1 ? 0 : idx,
      initEsModules,
    });
  }

  componentDidMount() {
    const { boundGlobalActions } = this.props;
    boundGlobalActions.getEstoreInfo().then(async () => {
      await this._initEsModules();
      introHandle.showIntro(this);
    });
    boundGlobalActions.getCustomerCurrency();
  }
  componentWillReceiveProps() {
    this._initEsModules();
  }

  componentDidUpdate(preProps) {
    const { mySubscription, boundGlobalActions } = this.props;
    if (!isEqual(mySubscription, preProps?.mySubscription)) {
      const statusAndHistory = mySubscription.get('statusAndHistory');
      if (!!statusAndHistory) {
        const { fee_current, fee_history } = statusAndHistory || {};
        const isShowPromotion = getPromotionStatus(statusAndHistory);
        const promotionCookie = cookie.load('promotion');
        if (!(isShowPromotion && promotionCookie)) {
          this.getEstoreInfoActions();
        }
      }
    }
  }

  getEstoreInfoActions = () => {
    const { boundGlobalActions } = this.props;
    boundGlobalActions.getEstoreInfo().then(async () => {
      await this._initEsModules();
      introHandle.showIntro(this);
    });
  };

  onSelect = idx => {
    const module = estoreModule[idx];
    window.logEvent.addPageEvent({
      name: module.logEventName,
    });
    this.props.history.push(estoreModule[idx].path);
    this.setState({
      selectedIndex: idx,
    });
  };
  showPriceModal = (that, data) => {
    const { boundGlobalActions } = that.props;
    const { showModal } = boundGlobalActions;
    const { priceData, tableTitle = '', product_id = '' } = data;
    showModal(PACKAGE_LIST_BOX_MODAL, {
      className: 'gallery-tutorial-wrapper',
      groupVideos: galleryTutorialVideos,
      priceData,
      tableTitle,
      product_id,
    });
  };
  openTablePriceModal = () => {
    const { boundProjectActions, boundGlobalActions } = this.props;
    let data = {
      tableTitle: 'Gallery Plan Comparison',
      product_id: saasProducts.gallery,
    };
    boundGlobalActions
      .getTablePriceList({ product_id: saasProducts.gallery })
      .then(res => {
        // console.log("res....",res)
        if (res.ret_code === 200000) {
          data.priceData = res.data;
          this.showPriceModal(this, data);
        }
        this.setState({ isRequestCompleted: true });
      })
      .catch(err => this.setState({ isRequestCompleted: true }));
  };
  renderUpgradeInfo = () => {
    const { mySubscription } = this.props;
    const { activityInformation, statusAndHistory } = mySubscription.toJS();
    if (!activityInformation || !statusAndHistory) return;
    const information = activityInformation.find(i => i.product_id === saasProducts.gallery);
    let showUpgrade = false;
    const { activity_desc, code, code_status, expired_time_display } = information || {};
    const { fee_current, fee_history } = statusAndHistory || {};
    if (fee_current) {
      showUpgrade = !fee_current.SAAS_BUNDLE && !fee_current.SAAS_GALLERY;
      productBundles.forEach(item => {
        if (fee_current[item.productId]) {
          const productsInBundle = item.included;
          const isSubscribed = productsInBundle.find(
            prod => prod.productId === saasProducts.gallery
          );
          showUpgrade = !isSubscribed;
        }
      });
    }
    let showCode = false;
    if (code && fee_current) {
      showCode = code_status === 0 && !fee_current.SAAS_BUNDLE && !fee_history.SAAS_GALLERY;
    }
    if (localStorage.getItem('hide_zg_banner')) {
      showCode = false;
    }
    const param = {
      id: saasProducts.gallery,
      showUpgrade,
      text: 'Upgrade to Gallery Paid Plans for advanced features such as Unlimited Storage, Remove Zno Branding From Client Gallery, Full Resolution Download and',
      url: '/saascheckout.html?level=20&cycle=1&product_id=SAAS_GALLERY',
      eventName: 'EstoreUpgradeBanner_Click_Upgrade',
      showCode,
      code,
      expired_time: expired_time_display,
      codeDesc: `${activity_desc}, Ends`,
      onClick: id => {
        this.openTablePriceModal();
      },
    };

    // console.log("gallery-param...",param)
    return <UpgradeInfo {...param} />;
  };

  render() {
    const { boundGlobalActions } = this.props;
    const { selectedIndex, initEsModules } = this.state;
    return (
      <div className="estore-wrapper" id="estore-wrapper">
        {/* <h1>This is estore dashboard, everything starts from here!</h1> */}
        {this.renderUpgradeInfo()}
        <Tabs onSelect={this.onSelect} selectedIndex={selectedIndex}>
          <div className="estore-header">
            <TabList>
              {initEsModules.length > 0 &&
                initEsModules.map(item => (
                  <Tab key={item.key}>
                    <span className="estore-label" id={`${item.key}`}>
                      {item.label}
                    </span>
                  </Tab>
                ))}
            </TabList>
            <Tutorial
              boundGlobalActions={boundGlobalActions}
              showIntroModal={this.showIntroModal}
            />
          </div>
          {initEsModules.length > 0 &&
            initEsModules.map(item => {
              const EstoreModule = item.module;
              return (
                <TabPanel key={`${item.key}_TabPanel`}>
                  <EstoreModule {...this.props} />
                </TabPanel>
              );
            })}
        </Tabs>
      </div>
    );
  }
}

export default Home;
