import { template } from 'lodash';
import PropTypes from 'prop-types';
import React, { createRef } from 'react';

import { XCoverRender, XPureComponent } from '@common/components';

import {
  COLLECTION_GALLERY_STYLE_URL_M,
  COLLECTION_GALLERY_STYLE_URL_PC,
} from '@apps/gallery/constants/imageUrl';

import main from './handle/main';

import './index.scss';

class DesignTemplate extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getPcViewerProps = () => main.getPcViewerProps(this);
  getPcCoverRenderProps = () => main.getPcCoverRenderProps(this);
  getMViewerProps = () => main.getMViewerProps(this);
  getMCoverRenderProps = () => main.getMCoverRenderProps(this);

  render() {
    const { coverInfo, currentTab, galleryStyleUrlPC, galleryStyleUrlM } = this.props;

    return (
      <div className="cover-gallery-template-wrap">
        <div className="template-content">
          <div {...this.getPcViewerProps()}>
            {currentTab === 'cover' ? (
              coverInfo && coverInfo.size ? (
                <XCoverRender key="pc" {...this.getPcCoverRenderProps()} />
              ) : null
            ) : (
              <div
                className="gallery-photo"
                style={{ backgroundImage: `url(${galleryStyleUrlPC})` }}
              />
            )}
          </div>
          <div {...this.getMViewerProps()}>
            {currentTab === 'cover' ? (
              coverInfo && coverInfo.size ? (
                <XCoverRender key="m" {...this.getMCoverRenderProps()} />
              ) : null
            ) : (
              <div
                className="gallery-photo"
                style={{ backgroundImage: `url(${galleryStyleUrlM})` }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

DesignTemplate.defaultProps = {
  coverInfo: {},
};

DesignTemplate.propTypes = {
  coverInfo: PropTypes.object.isRequired,
};

export default DesignTemplate;
