import React from 'react';
import {XPureComponent} from "@common/components";
import renderRoutes from '@resource/lib/utils/routeHelper';

class PostCard extends XPureComponent {
  constructor(props) {
    super(props);

  }

  render() {
    const routeHtml = renderRoutes({
      isHash: false,
      props: {...this.props}
    });
    return (
      <div>
        {routeHtml}
      </div>
    );
  }

}

export default PostCard;