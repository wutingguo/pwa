import React, { Fragment } from 'react';
import { Route, HashRouter, Redirect } from 'react-router-dom';
import { XPureComponent, XIcon, XWithRoute } from '@common/components';
import renderRoutes from '@resource/lib/utils/routeHelper';

import main from './handle/main';

class Settings extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  componentDidMount() {
    this.getCollectionsSettings();
  }

  getCollectionsSettings = () => main.getCollectionsSettings(this);

  render() {
    const routeHtml = renderRoutes({
      isHash: false,
      props: this.props
    });

    return (
      <Fragment>
        {routeHtml}
      </Fragment>
    );
  }
}

export default Settings;
