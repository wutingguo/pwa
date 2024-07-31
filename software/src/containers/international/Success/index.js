import qs from 'qs';
import React from 'react';

import XLink from '@resource/components/XLink';
import XPureComponent from '@resource/components/XPureComponent';

import XImg from '@resource/components/pwa/XImg';

import { convertObjIn } from '@resource/lib/utils/typeConverter';

import { productBundles, saasProducts } from '@resource/lib/constants/strings';

import main from './handle/main';
import designerIconCN from './icons/designer-cn.jpg';
import designerIcon from './icons/designer.jpg';
import galleryIconCN from './icons/gallery-cn.jpg';
import galleryIcon from './icons/gallery.jpg';
import selectionIconCN from './icons/selection-cn.jpg';
import slideshowIconCN from './icons/slideshow-cn.jpg';
import slideshowIcon from './icons/slideshow.jpg';

import './index.scss';

export default class Success extends XPureComponent {
  constructor(props) {
    super(props);

    const urlParams = qs.parse(location.search.split('?')[1]);
    const { registered = false } = convertObjIn(urlParams);
    this.state = { registered };
  }

  componentDidMount() {
    const { boundGlobalActions } = this.props;

    boundGlobalActions.getMySubscription();
    boundGlobalActions.getProductPlanList(saasProducts.gallery),
      boundGlobalActions.getProductPlanList(saasProducts.slideshow),
      boundGlobalActions.getProductPlanList(saasProducts.designer);
    boundGlobalActions.getProductPlanList(saasProducts.selection);
    productBundles.forEach(item => {
      boundGlobalActions.getProductPlanList(item.productId);
    });
  }

  onProductClick = product => {
    if (product === 'designer') {
      window.logEvent.addPageEvent({
        name: 'SubSuccess_Click_Designer',
      });
    }
    main.onProductClick(this, product);
  };

  render() {
    const { registered } = this.state;

    return (
      <div className="payment-success-page">
        <div className="payment-success-page-content">
          <div className="payment-success-title">
            {registered ? t('REGISTER_SUCCESS_TITLE') : t('PAYMENT_SUCCESS_TITLE')}
          </div>
          <div className="payment-success-subtitle">{t('PAYMENT_SUCCESS_SUBTITLE')}</div>

          <div className="product-list">
            <XLink
              onClick={() => this.onProductClick('designer')}
              href={'/software/designer/projects'}
            >
              <XImg src={__isCN__ ? designerIconCN : designerIcon} className="mar-right-20" />
            </XLink>
            <XLink
              onClick={() => this.onProductClick('gallery')}
              href={'/software/gallery/collection'}
            >
              <XImg src={__isCN__ ? galleryIconCN : galleryIcon} className="mar-right-20" />
            </XLink>
            {__isCN__ ? (
              <XLink onClick={() => this.onProductClick('selection')}>
                <XImg src={__isCN__ ? selectionIconCN : selectionIconCN} className="mar-right-20" />
              </XLink>
            ) : null}
            {!__isCN__ ? (
              <XLink
                onClick={() => this.onProductClick('slide-show')}
                href={'/software/slide-show/collection'}
              >
                <XImg src={__isCN__ ? slideshowIconCN : slideshowIcon} />
              </XLink>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
