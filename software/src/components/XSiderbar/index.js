import classNames from 'classnames';
import { isImmutable } from 'immutable';
import React, { Fragment } from 'react';
import { withRouter } from 'react-router';

import XPureComponent from '@resource/components/XPureComponent';

import { productBundles, saasBundleProducts, saasProducts } from '@resource/lib/constants/strings';

import { filterByRole } from '@resource/pwa/utils';

import { setFreeSubscribeProduct } from '@resource/pwa/services/subscription';

import cloudAiphoto from '@resource/static/icons/aiphoto.png';
import photoPNG from '@resource/static/icons/btnIcon/photo.png';
import cloudLive from '@resource/static/icons/live.png';

import { siderbarConfig } from '../../constants/siderbarConfig';
import { siderbarConfigCN } from '../../constants/siderbarConfigCN';

import cloudDesign from './image/cloud_design.png';
import cloudGallery from './image/cloud_gallery.png';
import cloudSelection from './image/cloud_selection.png';
import cloudSlideshow from './image/cloud_slide_show.png';
import home from './image/home.png';
import liveDownload from './image/live_download.png';
import liveRetoucher from './image/live_retoucher.png';
import liveSetting from './image/live_setting.png';
import liveShare from './image/live_share.png';
import marketing from './image/marketing.png';
import website from './image/website.png';

import './index.scss';

class XSiderbar extends XPureComponent {
  constructor(props) {
    super(props);
    this.iconMap = {
      home: home,
      cloud_design: cloudDesign,
      cloud_selection: cloudSelection,
      cloud_slide_show: cloudSlideshow,
      cloud_gallery: cloudGallery,
      cloud_aiphoto: cloudAiphoto,
      cloud_live: cloudLive,
      live_setting: liveSetting,
      live_download: liveDownload,
      live_share: liveShare,
      live_retoucher: liveRetoucher,
      live_picture: photoPNG,
      website: website,
      live_marketing: marketing,
    };
  }

  toPage = async (product, { path, logEventName, type, click }) => {
    const { productSubscriptionStatus, replacePath, liveId, menuCallback, subscribFress } =
      this.props;
    if (type === 'link') {
      click();
      return;
    }
    if (liveId === 'create') {
      menuCallback && menuCallback();
      return;
    }

    if (subscribFress) {
      await subscribFress(path);
    }
    const needVerifySubscribeProducts = [
      saasProducts.gallery,
      saasProducts.slideshow,

      saasProducts.retoucher,
      saasProducts.live,
      saasProducts.website,
    ];
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
    // bundle是否生效
    // const isSubscribedBundle = productSubscriptionStatus.get(saasProducts.bundle);
    // const isBundleEffected = isSubscribedBundle && saasBundleProducts.includes(product);
    const isBundleEffected = productsInBundles.find(item => item.productId === product);
    if (product && needVerifySubscribeProducts.includes(product)) {
      const isSubscribed = productSubscriptionStatus.get(product) || isBundleEffected;
      // 跳转到未订阅产品界面.

      // 中文逻辑不变 && __isCN__
      if (!isSubscribed && __isCN__) {
        return this.props.history.push(`/software/product/${product.toLowerCase()}/status`);
      }
    }

    if (logEventName) {
      logEvent.addPageEvent({
        name: logEventName,
      });
    }
    if (replacePath) {
      path = replacePath(path);
    }
    this.props.history.push(path);
  };

  menuToPage = menu => {
    const { path, logEventName, icon, userId = '' } = menu;
    const { userInfo } = this.props;
    const id = userInfo?.get('id');
    if (logEventName) {
      logEvent.addPageEvent({
        name: logEventName,
        [userId]: userId && id ? id : '',
      });
    }
    if (icon === 'home') {
      this.props.history.push(path);
    }
  };

  creatSubMenu = (product = '', subMenu) => {
    const { replacePath, userInfo } = this.props;
    const userWebsiteRole = userInfo && isImmutable(userInfo) ? userInfo.get('userWebsiteRole') : 0;
    return (
      <div className="sub-menu">
        {filterByRole(subMenu, { userWebsiteRole })?.map((subItem, subIndex) => {
          let { path } = subItem;
          if (replacePath) {
            path = replacePath(path);
          }
          const itemClass = classNames('sub-menu-item', {
            active: window.location.pathname.indexOf(path) !== -1,
          });
          return (
            <div className={itemClass} key={subIndex} onClick={() => this.toPage(product, subItem)}>
              <p style={{ textIndent: 0, margin: 0, padding: 0 }}>{subItem.displayName}</p>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { className, preferentialConfig } = this.props;
    let siderbarConfigMap = __isCN__ ? siderbarConfigCN : siderbarConfig;
    if (preferentialConfig) {
      siderbarConfigMap = preferentialConfig;
    }

    return (
      <div className={`workspace-siderbar ${className}`}>
        {siderbarConfigMap.map((item, index) => {
          const icon = this.iconMap[item.icon];
          // const product = item.product || '';
          const { product = '', hidden = false } = item;
          if (hidden) return null;
          return (
            <div
              className={classNames('menu-item', item.icon === 'home' && 'dashboard-menu', {
                active: window.location.pathname.indexOf(item.path) !== -1,
              })}
              key={index}
              onClick={() => this.menuToPage(item)}
            >
              <div className="title">
                <img src={icon} />
                <span style={{ textIndent: 0 }}>{item.displayName}</span>
              </div>
              {item.subMenu && this.creatSubMenu(product, item.subMenu)}
            </div>
          );
        })}
      </div>
    );
  }
}

export default withRouter(XSiderbar);
