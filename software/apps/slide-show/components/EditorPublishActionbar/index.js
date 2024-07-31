import React, { Fragment } from 'react';
import Tooltip from 'rc-tooltip';
import { XPureComponent, XIcon, XFileUpload } from '@common/components';
import CollectionDetailHeader from '../CollectionDetailHeader';

import './index.scss';

class EditorPublishActionbar extends XPureComponent {
  render() {
    const {
      history,
      params = {},      
      uploadParams,
      collectionPreviewUrl,
      boundGlobalActions,
      preCheckUploadCondition
    } = this.props;
    const { id } = params;

    const headerProps = {
      className: 'slideshow-editor-publish-action-bar',
      history,
      collectionPreviewUrl,
      collectionId: id,
      title: t("SLIDESHOW_CONFIG_PUBLISH")
    }
    return <CollectionDetailHeader {...headerProps} />
  }
}

export default EditorPublishActionbar;
