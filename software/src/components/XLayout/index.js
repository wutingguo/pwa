import * as xhr from 'appsCommon/utils/xhr';
import classNames from 'classnames';
import { isEmpty, template } from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import cookie from 'react-cookies';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import XLoading from '@resource/components/XLoading';
import XPureComponent from '@resource/components/XPureComponent';

import equals from '@resource/lib/utils/compare';
import { getPromotionStatus, getSubstring } from '@resource/lib/utils/promotion';

import { MARK_WORKSPACE } from '@resource/lib/constants/apiUrl';
import { productBundles, saasBundleProducts, saasProducts } from '@resource/lib/constants/strings';

import { setFreeSubscribeProduct, checkAndGiveFreeGifts, subscribeFreeOrder } from '@resource/pwa/services/subscription';

import QcCodeModal from '@apps/workspace/components/QcCodeModal';

import XSiderbar from '../XSiderbar';

import RedirectElement from './RedirectElement';
import promotion from './handle/promotion';
import studioIntro from './handle/studioIntro';

import './index.scss';

class XLayout extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowStudio: false,
      isShowPromotion: false,
      promotionViewed: false,
      isShowLoading: true,
      showQcCode: false,
      activityInfo: {},
      popoutClass: '',
    };
  }

  componentDidMount() {
    const markWorkSpace = localStorage.getItem('isMarkedWorkspace');
    if (__isCN__) {
      studioIntro.showStudioIntro(this);
    } else if (!markWorkSpace && !__isCN__) {
      localStorage.setItem('isMarkedWorkspace', true);
      this.markWorkspace();
    }
    this.subscribFress();
    this.subscribAllFress();
  }

  componentDidUpdate(preProps) {
    const { productSubscriptionStatus, mySubscription } = this.props;
    const { preProductSubscriptionStatus } = preProps;
    const userId = this.props.userInfo.get('id');
    const PreUserId = preProps.userInfo.get('id');

    if (!equals(mySubscription, preProps?.mySubscription)) {
      // const promotionpages = ['/software/slide-show', '/software/gallery', '/software/designer', '/software/e-store']
      // const pageName = getSubstring(location.pathname)
      const statusAndHistory = mySubscription.get('statusAndHistory');
      const { fee_current, fee_history } = statusAndHistory || {};
      const isShowPromotion = getPromotionStatus(statusAndHistory);
      const promotionCookie = cookie.load('promotion');
      if (isShowPromotion && !promotionCookie) {
        window.logEvent.addPageEvent({
          name: 'Workspace_PromoBannerPop_ShowUpEvent',
        });
        this.setState({ isShowPromotion: true });
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        setTimeout(() => {
          cookie.save('promotion', true, {
            expires,
            // https
            secure: true,
          });
        }, 2000);
      }
    }
    if (!equals(preProductSubscriptionStatus, productSubscriptionStatus)) {
      this.redirectUrl();
    }
    if (userId !== PreUserId && userId !== -1 && __isCN__) {
      // 获取优惠弹窗
      this.getBenefitInfo();
    }
  }
  // shouldComponentUpdate() {

  // }

  markWorkspace = () => {
    const { userInfo, baseUrl } = this.props;
    const uidPk = userInfo.get('uidPk');
    const apiUrl = template(MARK_WORKSPACE)({ baseUrl });
    const params = {
      accessWorkspace: true,
      uidPk,
    };
    return xhr.post(apiUrl, params);
  };

  redirectUrl = () => {
    if (__isCN__) return false; //云服不需要跳转
    const { history, productSubscriptionStatus } = this.props;
    const product = this.getSubProduct();
    const isSubscribed = productSubscriptionStatus.get(product);
    //没获取完数据
    if (typeof isSubscribed === 'undefined') {
      return false;
    }
    // const isSubscribedBundle = productSubscriptionStatus.get(saasProducts.bundle);
    // const isBundleEffected = isSubscribedBundle && saasBundleProducts.includes(product); // bundle是否生效
    const productsInBundles = productBundles.reduce((res, item) => {
      const { productId } = item;
      if (productSubscriptionStatus.get(productId)) {
        res = res.concat(item.included);
      }
      return res.reduce((r, i) => {
        const isRepeated = r.find(sub => sub.productId === i.productId);
        if (!isRepeated) {
          r.push(i);
        }
        return r;
      }, []);
    }, []);
    const isBundleEffected = productsInBundles.find(item => item.productId === product);
    if (isSubscribed || isBundleEffected) {
      return false;
    }
    // 中文逻辑不变
    if (__isCN__) {
      history.push(`/software/product/${product.toLowerCase()}/status`);
    }
    // history.push(`/software/product/${product.toLowerCase()}/status`);
  };

  //需要判断订阅的Product
  getSubProduct = () => {
    const { location } = this.props;
    const pathName = location.pathname;
    if (pathName.indexOf('/slide-show') !== -1) {
      return saasProducts.slideshow;
    }

    if (pathName.indexOf('/gallery') !== -1 || pathName.indexOf('/e-store') !== -1) {
      return saasProducts.gallery;
    }

    if (pathName.indexOf('/retoucher') !== -1) {
      return saasProducts.retoucher;
    }
    if (pathName.indexOf('/photo') !== -1) {
      return saasProducts.live;
    }
    if (pathName.indexOf('/website') !== -1) {
      return saasProducts.website;
    }
    return null;
  };

  //在没有拿到当前product订阅数据之前，loading
  getIsLoading = productSubscriptionStatus => {
    const product = this.getSubProduct();
    if (!product) {
      return false;
    }

    return typeof productSubscriptionStatus.get(product) === 'undefined';
  };

   // 全部订阅--张勇--王亚伟
   subscribAllFress = async path => {
    const { urls, boundGlobalActions, productSubscriptionStatus } = this.props;
    if (!urls) return;
    const baseUrl = urls.get('galleryBaseUrl');
    const params = {
      baseUrl,
    };
    this.setState({ isShowLoading: true });
    if (!__isCN__) {
      const orderList = [saasProducts.website, saasProducts.gallery, saasProducts.slideshow, saasProducts.designer]
      const instantList = [saasProducts.instant, saasProducts.retoucher]
      const subscriptionStatus = productSubscriptionStatus.toJS()
      if (!isEmpty(subscriptionStatus)) {
        const orderFreeStatus = orderList.find(item => subscriptionStatus[item] === false)
        const instantFreeStatus = instantList.find(item => subscriptionStatus[item] === false)
        if(orderFreeStatus) {
          subscribeFreeOrder(params).then(res => {
            console.log('res1', res);
          });
        }
        if (instantFreeStatus) {
          checkAndGiveFreeGifts(params).then(res => {
            console.log('res2', res);
          });
          
        }
      } else {
        boundGlobalActions.getMySubscription().then(res => {
          const items = res.data.items;
          const orderFreeStatus = items.find(item =>  !item.plan_level)
          if (orderFreeStatus) {
            subscribeFreeOrder(params).then(res => {
              console.log('res1', res);
            });
            checkAndGiveFreeGifts(params).then(res => {
              console.log('res2', res);
            });
          }
        })
      }
    }
    this.setState({ isShowLoading: false });
  };

  // 路由变更订阅
  subscribFress = async path => {
    const { urls, boundGlobalActions } = this.props;
    if (!urls) return;
    const { location } = this.props;
    const pathName = path || location.pathname;
    const baseUrl = urls.get('galleryBaseUrl');
    const names = pathName.slice(1).split('/');
    const type = names[1];
    const params = {
      baseUrl,
      type,
    };
    this.setState({ isShowLoading: true });
    if (__isCN__) {
      await setFreeSubscribeProduct(params).then(res => boundGlobalActions.getMySubscription());
    }
    this.setState({ isShowLoading: false });
  };
  getBenefitInfo = async () => {
    const {
      boundGlobalActions: { getBenefitActivity, getBenefitCanCode },
      userInfo,
    } = this.props;
    //获取当前正在进行的优惠活动
    const { ret_code, data } = await getBenefitActivity();
    if (ret_code !== 200000 || !data || !data.activity_id) {
      return false;
    }
    //判断当前活动是否弹出过
    const customerId = userInfo.get('uidPk');
    const hasOpend = localStorage.getItem(`opendWelfareCode_${customerId}_${data.activity_id}`);
    if (hasOpend) {
      return false;
    }
    //获取弹窗资格
    const { ret_code: canResCode, data: canResData } = await getBenefitCanCode(
      customerId,
      data.activity_id
    );
    if (canResCode === 200000 && canResData.can_get_code) {
      this.setState({
        showQcCode: true,
        activityInfo: data,
      });
    }
  };
  closeQcCode = () => {
    const { activity_id } = this.state.activityInfo;
    const { userInfo } = this.props;
    const customerId = userInfo.get('uidPk');
    this.setState(
      {
        popoutClass: 'popout',
      },
      () => {
        setTimeout(() => {
          this.setState({
            showQcCode: false,
            activityInfo: {},
          });
          localStorage.setItem(`opendWelfareCode_${customerId}_${activity_id}`, 'true');
        }, 500);
      }
    );
  };

  render() {
    const {
      isShowSiderbar = true,
      history,
      productSubscriptionStatus,
      isFullContainer = false,
      userInfo,
    } = this.props;
    const { isShowPromotion, isShowLoading, showQcCode, popoutClass, activityInfo } = this.state;
    const contentClass = classNames(
      'workspace-content',
      { 'full-page': !isShowSiderbar },
      { 'full-container': isFullContainer }
    );
    const pageclass = 'page' + history.location.pathname.replace(/\//g, '-');
    const loadinged = this.getIsLoading(productSubscriptionStatus) || isShowLoading;
    const isWebsiteEdit = location.pathname.includes('website/editor');
    const qcCodeModalProps = {
      handleClose: this.closeQcCode,
      popoutClass,
      activityInfo,
    };
    return (
      <Fragment>
        <div className="workspace-container" id="workspace-container">
          {isShowSiderbar && <XSiderbar {...this.props} subscribFress={this.subscribFress} />}
          <div
            className={`${contentClass} ${pageclass}`}
            style={{ margin: isWebsiteEdit ? 0 : '8px' }}
          >
            {__isCN__ && (
              <RedirectElement
                userInfo={userInfo.toJS()}
                to={`/software/authority/bypass-account?from=${history.location.pathname}`}
                from={history.location.pathname}
              />
            )}
            {/* 产品编辑区域 */}
            {!isShowLoading ? this.props.children : null}
            {loadinged && <XLoading type="image" isShown={true} size="lg" />}
          </div>
        </div>
        {/* {isShowStudio && studioIntro.renderStudioIntro(this)} */}
        {isShowPromotion && promotion.renderPromotion(this)}
        {showQcCode && __isCN__ && <QcCodeModal {...qcCodeModalProps} />}
      </Fragment>
    );
  }
}

XLayout.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(XLayout);
