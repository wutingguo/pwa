import React from 'react';
import XSelectionClientList from '@resource/components/pwa/collect/XSelectionClient/List';
import { getWWWorigin } from '@resource/lib/utils/url';

class ProductsList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){

  }
 
  render() {
    const { baseUrl, saasBaseUrl } = this.props.urls.toJS();
    const xollectAddProps = {
      baseUrl: window.location.origin + '/',
      saasBaseUrl
    }
    return (
      <XSelectionClientList {...xollectAddProps} />
    );
  }
}

export default ProductsList;
