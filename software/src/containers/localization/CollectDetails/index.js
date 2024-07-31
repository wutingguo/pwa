import React from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import SaasDetails from '@resource/components/pwa/collect/XSelectionClient/SaasDetails';
import './index.scss';

export default class CollectDetails extends XPureComponent {
  constructor(props) {
    super(props);
    this.iframeId = 'collectDetailsPage';
    this.iframeStyle = {
      width: '100%',
      border: 'none'
    };
    this.state = {
      goodsDetails: null
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.onMessage);
    const query = this.props.location.state || {};

    if (query.uidpk) {
      const { url, goods_attribute, ...res } = query;

      const pageType = url.replace('.html', '').replace('/', '');
      const iframe = document.getElementById(this.iframeId);
      iframe.src = `${this.props.baseUrl}prod-assets/app/saas-store/product-page.html?page=${pageType}`;

      this.setState({
        goodsDetails: {
          ...res,
          goods_attribute: JSON.parse(goods_attribute)
        }
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  onMessage = event => {
    if (event.origin + '/' !== this.props.baseUrl) {
      return false;
    }
    if (event.data && typeof event.data === 'number') {
      const iframe = document.getElementById(this.iframeId);
      iframe.height = `${event.data + 100}px`;
    }
  };

  render() {
    const { baseUrl, history, boundGlobalActions, urls } = this.props;
    const saasDetailsProps = {
      goodsDetails: this.state.goodsDetails,
      baseUrl,
      history,
      boundGlobalActions,
      saasBaseUrl: urls.toJS().saasBaseUrl
    };

    return (
      <div className="collect-details-container">
        <div className="calculator-container">
          <SaasDetails {...saasDetailsProps} />
        </div>
        <iframe height="5000px" id={this.iframeId} style={this.iframeStyle} />
      </div>
    );
  }
}
