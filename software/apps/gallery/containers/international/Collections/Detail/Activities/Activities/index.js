import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { XPureComponent } from '@common/components';
import renderRoutes from '@resource/lib/utils/routeHelper';

class Activities extends XPureComponent {
  render() {
    const routeHtml = renderRoutes({
      isHash: false,
      props: this.props,
    });

    return (
      <Fragment>
        {routeHtml}
      </Fragment>
    );
  }
}

export default withRouter(Activities);
