import React from 'react';
import EditorPublishTopAction from '../EditorPublishTopAction';
import EditorPublishViewContent from '@common/components/slide-show/EditorPublishViewContent';
import { XPureComponent, XLoading, EmptyContent } from '@common/components';
import './index.scss';

class EditorPublishcontent extends XPureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      urls,
      mySubscription,
      usedPostCardDetail,
      collectionDetail,
      isShowEmptyContent,
      boundGlobalActions,
      boundProjectActions,
      history
    } = this.props;
    const frameList = collectionDetail.get('frameList');

    const topActionProps = {
      urls,
      collectionDetail,
      boundGlobalActions,
      boundProjectActions,
      history
    };

    const viewerProps = {
      urls,
      mySubscription,
      usedPostCardDetail,
      showShare: false,
      collectionDetail,
      boundGlobalActions,
      boundProjectActions
    };

    return (
      <div className="slide-show-publish-container">
        
        {
          frameList && !!frameList.size && (
            <>
              <EditorPublishTopAction {...topActionProps} />
              <div className="slide-show-video-container">
                <EditorPublishViewContent {...viewerProps} />
              </div>
            </>
          )
        }

        {/* {
          isShowEmptyContent ? <EmptyContent {...emptyContentProps} /> : null
        } */}
      </div>
    );
  }

}

export default EditorPublishcontent;