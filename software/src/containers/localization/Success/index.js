import qs from 'qs';
import React from 'react';

import XLink from '@resource/components/XLink';
import XPureComponent from '@resource/components/XPureComponent';
import icon75CN from '@resource/components/modals/XSaasCheckoutModal/components/Success/icons/cn75.png';
import icon300CN from '@resource/components/modals/XSaasCheckoutModal/components/Success/icons/cn300.png';
import iconXyCN from '@resource/components/modals/XSaasCheckoutModal/components/Success/icons/cnXy.png';

import XImg from '@resource/components/pwa/XImg';

import { convertObjIn } from '@resource/lib/utils/typeConverter';

import { saasProducts } from '@resource/lib/constants/strings';

import { getDeliveryPracticality, getPaymentDetail } from '@resource/pwa/services/subscription';

import main from './handle/main';
import aiIconCN from './icons/aiphoto-cn.jpg';
import designerIconCN from './icons/designer-cn.jpg';
import galleryIconCN from './icons/gallery-cn.jpg';
import liveCN from './icons/livephoto-cn.jpg';
import selectionIconCN from './icons/selection-cn.jpg';
import slideshowIconCN from './icons/slideshow-cn.jpg';

import './index.scss';

export default class Success extends XPureComponent {
  constructor(props) {
    super(props);

    const urlParams = qs.parse(location.search.split('?')[1]);
    const { registered = false, originProduct } = convertObjIn(urlParams);
    this.state = {
      registered,
      product_code: originProduct || '',
      showRights: false,
    };
    this.rightsItems = [
      // {
      //   label: '300元返点',
      //   icon: icon300CN,
      //   manage: {
      //     label: '立即使用',
      //     link: 'products.html'
      //   }
      // },
      // {
      //   label: '产品75折权益',
      //   icon: icon75CN,
      //   manage: {
      //     label: '立即使用',
      //     link: 'products.html'
      //   }
      // },
      // {
      //   label: '材料小样',
      //   icon: iconXyCN,
      //   manage: {
      //     label: '立即使用',
      //     link: 'cailiaoxiaoyang.html'
      //   }
      // }
    ];
  }

  componentDidMount() {
    const urlParams = qs.parse(location.search.split('?')[1]);
    const { orderNumber, originProduct } = urlParams;
    this.setState(
      {
        orderNumber,
      },
      () => {
        if (!originProduct) {
          this.getProductByOrderNumber(orderNumber);
        }
      }
    );
    const { boundGlobalActions } = this.props;

    boundGlobalActions.getMySubscription();
    boundGlobalActions.getProductPlanList(saasProducts.gallery);
    boundGlobalActions.getProductPlanList(saasProducts.slideshow);
    boundGlobalActions.getProductPlanList(saasProducts.designer);
    boundGlobalActions.getProductPlanList(saasProducts.selection);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const urlParams = qs.parse(location.search.split('?')[1]);
    const { originProduct } = urlParams;
    const oldOrderNumber = prevProps.orderNumber;
    const newOrderNumber = this.props.orderNumber;
    if (oldOrderNumber !== newOrderNumber && newOrderNumber && !originProduct) {
      this.getProductByOrderNumber(newOrderNumber);
    }
  }
  getProductByOrderNumber = orderNumber => {
    const { urls } = this.props;
    const galleryBaseUrl = urls.get('galleryBaseUrl');

    getPaymentDetail(galleryBaseUrl, orderNumber).then(res => {
      // console.log('res===>', res)
      if (res && res.length > 0) {
        this.setState({
          product_code: res[0].product_scope || saasProducts.aiphoto,
        });
        this.getShowRights(orderNumber);
      }
    });
  };

  getShowRights = orderNumber => {
    if (!__isCN__ || !orderNumber) {
      return false;
    }

    const { urls } = this.props;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    getDeliveryPracticality(galleryBaseUrl, orderNumber).then(dRes => {
      this.setState({
        showRights: !!dRes,
      });
    });
  };

  onProductClick = product => {
    if (product === 'designer') {
      window.logEvent.addPageEvent({
        name: 'SubSuccess_Click_Designer',
      });
    }
    main.onProductClick(this, product);
  };

  toRightsLink = link => {
    const { urls } = this.props;
    const baseUrl = urls.get('baseUrl');
    window.open(`${baseUrl}${link}`);
  };

  getText = id => {
    let text = '';
    switch (id) {
      case saasProducts.live:
        text = '感谢您的购买';
        break;
      default:
        text = t('PAYMENT_SUCCESS_TITLE');
        break;
    }

    return text;
  };
  getImage = (defaultSrc, id) => {
    let src = defaultSrc;
    if (id === 'live') {
      src = liveCN;
    }
    return src;
  };
  render() {
    const { registered, product_code, showRights } = this.state;
    const urlParams = qs.parse(location.search.split('?')[1]);
    const { skipId } = urlParams;
    let title = this.getText(product_code);
    if (registered) {
      title = t('REGISTER_SUCCESS_TITLE');
    }
    if (showRights) {
      title = t('PAYMENT_SUCCESS_TITLE2');
    }

    return (
      <div className="payment-success-page">
        <div className="payment-success-page-content">
          <div className="payment-success-title">{title}</div>
          {!showRights && !__isCN__ && (
            <div className="payment-success-subtitle">{t('PAYMENT_SUCCESS_SUBTITLE')}</div>
          )}
          {/* {showRights && (
            <div className="payment-success-title-sub">
              {this.rightsItems.map(item => {
                return (
                  <div className="item" key={item.label}>
                    <img src={item.icon} />
                    <span>{item.label}</span>
                    <span className="link-btn" onClick={() => this.toRightsLink(item.manage.link)}>
                      {item.manage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )} */}

          <div className="product-list">
            {product_code === saasProducts.designer && (
              <XLink
                onClick={() => this.onProductClick('designer')}
                href={'/software/designer/projects'}
              >
                <XImg src={designerIconCN} className="mar-right-20" />
              </XLink>
            )}

            {product_code === saasProducts.gallery && (
              <XLink
                onClick={() => this.onProductClick('gallery')}
                href={'/software/gallery/collection'}
              >
                <XImg src={galleryIconCN} className="mar-right-20" />
              </XLink>
            )}
            {product_code === saasProducts.selection && (
              <XLink onClick={() => this.onProductClick('selection')}>
                <XImg src={selectionIconCN} className="mar-right-20" />
              </XLink>
            )}
            {product_code === saasProducts.slideshow && (
              <XLink onClick={() => this.onProductClick('slide-show')}>
                <XImg src={slideshowIconCN} className="mar-right-20" />
              </XLink>
            )}
            {product_code === saasProducts.aiphoto && (
              <XLink onClick={() => this.onProductClick(skipId || 'aiphoto')}>
                <XImg src={this.getImage(aiIconCN, skipId)} className="mar-right-20" />
              </XLink>
            )}
            {product_code === saasProducts.live && (
              <XLink onClick={() => this.onProductClick('live')}>
                <XImg src={liveCN} className="mar-right-20" />
              </XLink>
            )}
          </div>
        </div>
      </div>
    );
  }
}
