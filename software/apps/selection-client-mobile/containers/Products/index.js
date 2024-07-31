import React from 'react';
import XSelectionClientDetails from '@resource/components/pwa/collect/XSelectionClient/Details';

class ProductsDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { saasBaseUrl, wwwBaseUrl } = this.props.urls.toJS();
    const xollectAddProps = {
      baseUrl: window.location.origin + '/',
      wwwBaseUrl,
      saasBaseUrl,
      boundGlobalActions: this.props.boundGlobalActions
    };
    return <XSelectionClientDetails {...xollectAddProps} />;
  }
}

export default ProductsDetails;
