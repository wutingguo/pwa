import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import XPureComponent from '@resource/components/XPureComponent';

import equals from '@resource/lib/utils/compare';

import main from './handle/main';

import './index.scss';

class ProductStatus extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      productName: '',
      html: null,
    };
  }

  isValidProduct = productName => main.isValidProduct(productName);
  parseUrlParams = nextProps => main.parseUrlParams(this, nextProps);
  getPageData = serverProductName => main.getPageData(this, serverProductName);
  createFreeOrder = id => main.createFreeOrder(this, id);
  getRedirectUrl = isPwa => main.getRedirectUrl(this, isPwa);
  getStarted = () => main.getStarted(this);
  buyNow = () => main.buyNow(this);
  onClickHere = opt => main.onClickHere(this);
  renderHtml = data => main.renderHtml(this, data);

  componentWillReceiveProps(nextProps) {
    const isEqual = equals(this.props, nextProps);
    if (!isEqual) {
      this.parseUrlParams(nextProps);
    }
  }

  componentDidMount() {
    this.parseUrlParams();
  }

  render() {
    const { html } = this.state;
    return (
      <div className="product-status-page">
        <div className="product-status-page-content">{html}</div>
      </div>
    );
  }
}
const withParams = Comp => {
  return props => {
    const params = useParams();

    const newProps = {
      ...props,
      params: {
        ...params,
        product: params.product.toUpperCase(),
      },
    };
    return <Comp {...newProps} />;
  };
};

export default withParams(ProductStatus);
