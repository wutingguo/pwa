import React, { Fragment } from 'react';
import classNames from 'classnames';
import { XPureComponent } from '@common/components';
import EditorPublishViewContent from '@common/components/slide-show/EditorPublishViewContent';

import main from './handle/main';

class Home extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.collectionNameWrap = React.createRef();
  }
  
  loadData = () => main.loadData(this);

  render() {
    const {
      urls,
      detail,
      usedPostCardDetail,
      boundGlobalActions,
      boundProjectActions
    } = this.props;
    
    const viewerProps = {
      urls,
      usedPostCardDetail,
      isMobile: true,
      showShare: false,
      collectionDetail: detail,
      boundGlobalActions,
      boundProjectActions
    };
    return (
      <Fragment>
        <EditorPublishViewContent {...viewerProps} />
      </Fragment>
    );
  }
}

export default Home;
