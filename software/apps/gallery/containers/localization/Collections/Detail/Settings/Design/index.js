import React, { Component, Fragment } from 'react';
import { fromJS } from 'immutable';
import PropsTypes from 'prop-types';
import { XPureComponent } from '@common/components';
import equals from '@resource/lib/utils/compare';

import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';
import DesignTemplate from '@apps/gallery/components/DesignTemplate';
import DesignSettingsbar from '@apps/gallery/components/DesignSettingsbar';
import DesignTplCarousel from '@apps/gallery/components/DesignTplCarousel';
import coverTemplates from '@common/constants/coverTemplate';
import mainHandler from './handle/main';
// import templates from './handle/mock';

import './index.scss';

class SettingsDesign extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeItemIndex: coverTemplates.getIn[(1, 'template')],
      currentTab: 'cover',
      typography: 'sans',
      coverTypography: 'sans',
      designTypography: 'serif',
      focalPosition: {
        x: 0,
        y: 0
      },
      imgRot: 0,
      coverUrl: '',
    };
  }

  willReceiveProps = nextProps => mainHandler.willReceiveProps(this, nextProps);

  onTabChange = e => mainHandler.onTabChange(this, e);
  onSetCoverFocal = () => mainHandler.onSetCoverFocal(this);
  onSelectTypography = id => mainHandler.onSelectTypography(this, id);
  onSetActiveItemIndex = tplIndex =>
    mainHandler.onSetActiveItemIndex(this, tplIndex);
  onClickTplItem = id => mainHandler.onClickTplItem(this, id);

  getDesignTplCarouselProps = () =>
    mainHandler.getDesignTplCarouselProps(this, fromJS(coverTemplates));
  getDesignSettingsbarProps = () => mainHandler.getDesignSettingsbarProps(this);

  getDesignTemplateProps = () => mainHandler.getDesignTemplateProps(this);

  componentWillReceiveProps(nextProps) {
    const isEqual = equals(this.props, nextProps);
    if (!isEqual) {
      this.willReceiveProps(nextProps);
    }
  }

  componentDidMount() {
    this.willReceiveProps();
  }

  render() {
    const {
      history,
      match: { params },
      collectionPreviewUrl
    } = this.props;
    const {
      currentTab,
    } = this.state;

    // settings header
    const { id } = params;
    const headerProps = {
      history,
      collectionId: id,
      collectionPreviewUrl,
      title: t('DESIGN_SETTINGS')
    };

    return (
      <Fragment>
        <div className="gllery-collection-detail-settings-design">
          {/* 主渲染区域. */}
          <div className="content">
            {/* settings header */}
            <CollectionDetailHeader {...headerProps} />

            <div className="collection-design-wrap">
              {/* 设置操作区域 */}
              <DesignSettingsbar {...this.getDesignSettingsbarProps()} />

              {/* 模板展示区域 */}
              <DesignTemplate {...this.getDesignTemplateProps()} />

              {/* cover/gallery tab */}
              <div className="cover-gallery-tabs">
                <div
                  className={`cover-tab ${
                    currentTab === 'cover' ? 'active' : ''
                  }`}
                  id="cover"
                  onClick={this.onTabChange}
                >
                  {t('COVER_TAB')}
                </div>
                <div
                  className={`gallery-tab ${
                    currentTab === 'gallery' ? 'active' : ''
                  }`}
                  id="gallery"
                  onClick={this.onTabChange}
                >
                  {t('GALLERY_TAB')}
                </div>
              </div>

              {/* 模板选择区域 */}
              {currentTab === 'cover' ? (
                <DesignTplCarousel {...this.getDesignTplCarouselProps()} />
              ) : null}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SettingsDesign;
