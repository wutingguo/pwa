import React, { PureComponent } from 'react';
import PageNavigation from '@apps/theme-editor/components/PageNavigation';

import './index.scss';

class Footer extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { ratios, pagination, pageArray, boundProjectActions, boundGlobalActions } = this.props;
    const pageNavProps = {
      ratio: ratios.get('innerWorkspaceRatioForNavPages'),
      pageArray,
      pagination,
      boundGlobalActions,
      boundProjectActions
    };
    return (
      <div className="edit-footer">
        <PageNavigation {...pageNavProps} />
      </div>
    );
  }
}

export default Footer;
