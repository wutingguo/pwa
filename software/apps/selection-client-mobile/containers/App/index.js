import React from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import XSelectionClientShare from '@resource/components/pwa/collect/XSelectionClient/Share';
import { getWWWorigin } from '@resource/lib/utils/url';

class App extends XPureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    // console.log('this.props', this.props)
  }

 
  render() {
    const { baseUrl, saasBaseUrl } = this.props.urls.toJS();
    const xollectAddProps = {
      baseUrl: window.location.origin + '/',
      saasBaseUrl
    }
    return (
      <XSelectionClientShare {...xollectAddProps} />
    );
  }
}

export default App;
