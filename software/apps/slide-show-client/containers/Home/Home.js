import React, { Fragment } from 'react';
import classNames from 'classnames';
import { XPureComponent } from '@common/components';
import EditorPublishViewContent from '@common/components/slide-show/EditorPublishViewContent';

import main from './handle/main';
import render from './handle/render';

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
      mySubscription,
      usedPostCardDetail,
      boundGlobalActions,
      boundProjectActions
    } = this.props;
    const viewerProps = {
      urls,
      mySubscription,
      usedPostCardDetail,
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
