import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { XIcon } from '@common/components';
import { fromJS } from 'immutable';

import EditorPhotoTab from '@apps/slide-show/components/EditorPhotoTab';
import EditorPublishTab from '@apps/slide-show/components/EditorPublishTab';

import { getCoverImageUrl } from '@resource/lib/saas/image';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';
import { photoListKeys, tabsConfig, flattenTabsConfig } from './handle/config';
import { handleRenameCover, getCurrentSidebarKey } from './handle/main';
import { GET_CLCT_DETAIL } from '@resource/lib/constants/loadingType';
import './index.scss';
import { timePerImageMin } from '../../constants/strings';

const panels = {
  [photoListKeys.photos]: EditorPhotoTab,
  [photoListKeys.publish]: EditorPublishTab
};

class SideBar extends Component {
  // 选中左侧 menu item
  handleSideItemSelect = ({ key }) => {
    const {
      history: { push },
      params: { id }
    } = this.props;
    const { path } = flattenTabsConfig.find(item => item.key === key);
    // console.log('-----flattenTabsConfig----', flattenTabsConfig);
    let url = path.replace(':id', id);
    push(url);
  };
  componentDidMount() {
    // console.log('componentDidMount-----', 'EditorPublisgTab');
  }

  /**
   * tab切换.
   */
  onSelect = index => {
    const {
      history: { push },
      params: { id }
    } = this.props;
    const { path } = tabsConfig.find(tab => tab.tabIndex === index);
    const url = path.replace(':id', id);
    // console.log('onSelect---url....', url);
    push(url);
  };

  getTabStatus = (index, currentTabIndex) => {
    const { currentSegment } = this.props;
    const isSegmentDataReady =
      !!currentSegment.get('musicEncId') &&
      currentSegment.get('segmentImages') &&
      !!currentSegment.get('segmentImages').size &&
      currentSegment.get('timePerImage') >= timePerImageMin;
    if (index === 1 && !isSegmentDataReady) {
      return 'disable';
    }
    return index === currentTabIndex ? 'active' : '';
  };

  getPanelProps = (key, selectedKeys, items) => {
    const {
      history,
      params,
      urls,
      loading,
      currentSegment,
      collectionDetail,
      collectionsSettings,
      boundGlobalActions,
      boundProjectActions
    } = this.props;
    // const coverImgId = collectionDetail.getIn(['cover', 'id']);
    const imgUrl = collectionDetail.getIn(['cover', 'imgUrl']);
    const coverProps = {
      isLoading: loading.get(GET_CLCT_DETAIL),
      name: collectionDetail.get('name'),
      imgUrl,
      imgRot: collectionDetail.getIn(['cover', 'orientation']),
      type: imgUrl ? 'background' : 'backgroundColor',
      backgroundColor: '#AAAAAA',
      handleRenameCover: handleRenameCover.bind(this)
    };
    let props = {
      history,
      params,
      name: collectionDetail.get('name'),
      selectedKeys,
      coverProps,
      onSelect: this.handleSideItemSelect
    };

    if (key === photoListKeys.photos) {
      props = {
        ...props,
        boundGlobalActions,
        boundProjectActions
      };
    } else if (key === photoListKeys.publish) {
      // 获取 favoriteEnabled
      let favoriteEnabled = '';
      if (collectionsSettings && collectionsSettings.size) {
        favoriteEnabled = collectionsSettings.getIn(['favorite', 'favorite_enabled']);
      }

      props = {
        ...props,
        items: fromJS(items),
        collectionDetail,
        collectionsSettings,
        boundGlobalActions,
        boundProjectActions
      };
    }
    return props;
  };

  render() {
    const {
      history: {
        location: { pathname }
      }
    } = this.props;
    const { currentTabIndex, selectedKeys } = getCurrentSidebarKey(pathname, flattenTabsConfig);
    return (
      <div className="slideshow-editor-sidebar-wrapper">
        <Tabs onSelect={this.onSelect} selectedIndex={currentTabIndex}>
          <TabList>
            {tabsConfig.map((tab, index) => (
              <Tab key={tab.key} disabled={this.getTabStatus(index, currentTabIndex) === 'disable'}>
                <XIcon
                  type={tab.icon}
                  text={tab.name}
                  status={this.getTabStatus(index, currentTabIndex)}
                />
              </Tab>
            ))}
          </TabList>
          {tabsConfig.map(tab => {
            const { key, items } = tab;
            const Panel = panels[key];
            const panelProps = this.getPanelProps(key, selectedKeys, items);
            return (
              <TabPanel key={key}>
                <Panel {...panelProps} />
              </TabPanel>
            );
          })}
        </Tabs>
      </div>
    );
  }
}

export default withRouter(SideBar);
