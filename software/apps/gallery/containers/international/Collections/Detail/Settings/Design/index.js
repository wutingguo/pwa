import classnames from 'classnames';
import { fromJS } from 'immutable';
import PropsTypes from 'prop-types';
import React, { Component, Fragment } from 'react';

import equals from '@resource/lib/utils/compare';

import coverTemplates from '@common/constants/coverTemplate';

import { XPureComponent } from '@common/components';

import DesignSettingsbar from '@apps/gallery/components/DesignSettingsbar';
import DesignTemplate from '@apps/gallery/components/DesignTemplate';
import DesignTplCarousel from '@apps/gallery/components/DesignTplCarousel';

import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';

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
        y: 0,
      },
      imgRot: 0,
      coverUrl: '',
      gallery_spec: [],
      cover_spec: null,
      gridSpacing: 'regular',
      grid_style: 'vertical',
      thumbnail_size: 'regular',
    };
  }

  willReceiveProps = nextProps => mainHandler.willReceiveProps(this, nextProps);

  onTabChange = e => mainHandler.onTabChange(this, e);
  onSetCoverFocal = () => mainHandler.onSetCoverFocal(this);
  onSelectTypography = id => mainHandler.onSelectTypography(this, id);
  onSetActiveItemIndex = tplIndex => mainHandler.onSetActiveItemIndex(this, tplIndex);
  onClickTplItem = id => mainHandler.onClickTplItem(this, id);

  getDesignTplCarouselProps = () =>
    mainHandler.getDesignTplCarouselProps(this, fromJS(coverTemplates));
  getDesignSettingsbarProps = () => mainHandler.getDesignSettingsbarProps(this);

  getDesignTemplateProps = () => mainHandler.getDesignTemplateProps(this);
  commonOnSelect = (type, key) => mainHandler.commonOnSelect(this, type, key);

  componentWillReceiveProps(nextProps) {
    const isEqual = equals(this.props, nextProps);
    if (!isEqual) {
      this.willReceiveProps(nextProps);
    }
  }

  componentDidMount() {
    const { boundProjectActions } = this.props;
    this.willReceiveProps();
    const formatData = gallery_spec => {
      // Design Settings设置项
      // let result = [];
      let result = [];
      // 处理接口返回的配置
      Object.keys(gallery_spec).forEach(item => {
        result.push({
          key: item,
          itemName: item
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          element: gallery_spec[item].map(ele => {
            return {
              label: ele.charAt(0).toUpperCase() + ele.slice(1),
              img: `/clientassets/portal/v2/images/saas/${item}${
                ele.charAt(0).toUpperCase() + ele.slice(1)
              }.svg`,
            };
          }),
        });
      });
      // 前端新增配置
      return [
        ...result,
        // {
        //   key: 'thumbnail_size',
        //   itemName: 'Thumbnail Size',
        //   element: [
        //     {
        //       label: 'Regular',
        //       img: '/clientassets/portal/v2/images/saas/thumbnailRegular.svg',
        //     },
        //     {
        //       label: 'Large',
        //       img: '/clientassets/portal/v2/images/saas/thumbnailLarge.svg',
        //     },
        //   ],
        // },
      ];
    };
    boundProjectActions.getDesignSpec().then(resolve => {
      const {
        ret_code,
        data: { gallery_spec, cover_spec },
      } = resolve || {};
      if (ret_code === 200000) {
        this.setState({
          gallery_spec: formatData(gallery_spec),
          cover_spec: fromJS(cover_spec),
        });
      }
    });
  }
  randerCombination = gallery_spec => {
    const {
      gridSpacing = 'regular',
      grid_style = 'vertical',
      thumbnail_size = 'regular',
    } = this.state;
    const actives = [gridSpacing, grid_style, thumbnail_size];
    let html = [];
    if (gallery_spec) {
      gallery_spec.forEach((itm, index) => {
        const key = itm.key;
        html.push(
          <div className="permutation-and-combination-wrap" key={key}>
            {itm.itemName}
            <div className="permutation-and-combination-wrap-container">
              {itm.element &&
                itm.element.map(item => {
                  return (
                    <div className="combination-icon-content-container">
                      <div
                        className={classnames('combination-icon-content', {
                          active: actives[index].toLowerCase() === item.label.toLowerCase(),
                        })}
                        onClick={() => this.commonOnSelect(item.label.toLowerCase(), key)}
                      >
                        <img src={item.img} className="combination-icon" />
                      </div>
                      <div
                        className={classnames('combination-icon-name', {
                          active: actives[index].toLowerCase() === item.label.toLowerCase(),
                        })}
                      >
                        {item.label}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      });
    }
    return html;
  };

  render() {
    const {
      history,
      match: { params },
      collectionPreviewUrl,
      presetState,
    } = this.props;
    const { currentTab, gallery_spec, cover_spec } = this.state;

    // settings header
    const { id } = params;
    const headerProps = {
      history,
      collectionId: id,
      collectionPreviewUrl,
      title: t('DESIGN_SETTINGS'),
      hasHandleBtns: false,
    };

    return (
      <Fragment>
        <div className="gllery-collection-detail-settings-design">
          {/* 主渲染区域. */}
          <div className="settings-design-content">
            {/* settings header */}
            {!presetState && <CollectionDetailHeader {...headerProps} />}

            <div className="collection-design-wrap">
              <div className="permutation-and-combination">
                {this.randerCombination(gallery_spec)}
              </div>
              <div className="collection-design-wrap-container">
                {/* 设置操作区域 */}
                {!presetState && <DesignSettingsbar {...this.getDesignSettingsbarProps()} />}

                {/* cover/gallery tab */}
                <div className="cover-gallery-tabs">
                  <div
                    className={`cover-tab ${currentTab === 'cover' ? 'active' : ''}`}
                    id="cover"
                    onClick={this.onTabChange}
                  >
                    {t('COVER_TAB')}
                  </div>
                  <div
                    className={`gallery-tab ${currentTab === 'gallery' ? 'active' : ''}`}
                    id="gallery"
                    onClick={this.onTabChange}
                  >
                    {t('GALLERY_TAB')}
                  </div>
                </div>
                {/* 模板展示区域 */}
                <DesignTemplate {...this.getDesignTemplateProps()} />

                {/* 模板选择区域 */}
                {currentTab === 'cover' ? (
                  <DesignTplCarousel {...this.getDesignTplCarouselProps()} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SettingsDesign;
