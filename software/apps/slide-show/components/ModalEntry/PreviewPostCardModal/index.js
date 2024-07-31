import React, { Component } from 'react';
// import PostCardPreview from "@apps/slide-show/components/PostCardPreview";
import PostCardViewer from "@common/components/slide-show/PostCardViewer";
import {XModal} from "@common/components";

import './index.scss';

class PreviewPostCardModal extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() {
    const { collectionDetail, urls, data } = this.props;
    const postCardDetail = data.get('postCardDetail');
    const postCardPreviewPrps = {
      ...postCardDetail.toJS(),
      width: 800,
      height: 450,
      isFullScreen: false,
      isShowPlayButton: false,
      isUseDefaultBackground: true,
      galleryBaseUrl: data.get('galleryBaseUrl')
    };
    return (
      <XModal
        className="preview-card-modal"
        opened
        onClosed={data.get('close')}
        escapeClose
        closeByBackDropClick
        isHideIcon={false}
      >
        <div className="modal-body">
          {/*<PostCardPreview {...postCardPreviewPrps} />*/}
          <PostCardViewer {...postCardPreviewPrps} />
        </div>
      </XModal>
    );
  }
}
 
export default PreviewPostCardModal;