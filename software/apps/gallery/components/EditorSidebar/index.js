import { fromJS } from 'immutable';
import { isString } from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { getCoverImageUrl } from '@resource/lib/saas/image';

import { GET_CLCT_DETAIL } from '@resource/lib/constants/loadingType';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import { XIcon } from '@common/components';

import EditorActivitiesTab from '@apps/gallery/components/EditorActivitiesTab';
import EditorPhotoTab from '@apps/gallery/components/EditorPhotoTab';
import EditorSettingsTab from '@apps/gallery/components/EditorSettingsTab';

import { flattenTabsConfig, photoListKeys, tabsConfig } from './handle/config';
import { getCurrentSidebarKey, handleRenameCover } from './handle/main';

import './index.scss';

const panels = {
  [photoListKeys.photos]: EditorPhotoTab,
  [photoListKeys.settings]: EditorSettingsTab,
  [photoListKeys.activities]: EditorActivitiesTab,
};

class SideBar extends Component {
  componentDidMount() {
    window.onGalleryTabSelect = this.onSelect;
  }
  // 选中左侧 menu item
  handleSideItemSelect = ({ key }) => {
    const {
      history: { push },
      params: { id },
    } = this.props;
    const item = flattenTabsConfig.find(item => item.key === key);
    const { path, logEventName } = item;
    logEventName &&
      window.logEvent.addPageEvent({
        name: logEventName,
      });
    let url = path.replace(':id', id);
    push(url);
  };

  /**
   * tab切换.
   */
  onSelect = (index, toPath) => {
    const {
      history: { push },
      params: { id },
    } = this.props;
    let { path } = tabsConfig.find((tab, tabIndex) => tabIndex === index);
    if (isString(toPath)) path = toPath;
    const url = path.replace(':id', id);
    push(url);
  };
  handleChangeCover = () => {
    this.onSelect(1, '/software/gallery/collection/:id/settings/design');
    window.logEvent.addPageEvent({
      name: 'GalleryLeftPanel_Click_ChangeCover',
    });
  };

  getPanelProps = (key, selectedKeys, items) => {
    const {
      history,
      params,
      urls,
      loading,
      defaultImgs,
      collectionDetail,
      collectionDetailSets,
      collectionsSettings,
      boundGlobalActions,
      boundProjectActions,
    } = this.props;

    const coverProps = {
      isLoading: loading.get(GET_CLCT_DETAIL),
      name: collectionDetail.get('collection_name'),
      imgUrl: collectionDetail.getIn(['cover', 'imgUrl']),
      imgRot: collectionDetail.getIn(['cover', 'orientation']),
      handleRenameCover: handleRenameCover.bind(this),
      showChangeCover: !__isCN__,
      handleChangeCover: this.handleChangeCover,
    };
    let props = {
      history,
      params,
      selectedKeys,
      coverProps,
      collectionDetail,
      onSelect: this.handleSideItemSelect,
    };

    if (key === photoListKeys.photos) {
      props = {
        ...props,
        items: collectionDetailSets,
        currentSetUid: collectionDetail.get('currentSetUid'),
        boundGlobalActions,
        boundProjectActions,
      };
    } else if (key === photoListKeys.settings) {
      // 获取 favoriteEnabled
      let favoriteEnabled = '';
      if (collectionsSettings && collectionsSettings.size) {
        favoriteEnabled = collectionsSettings.getIn(['favorite', 'favorite_enabled']);
      }

      props = {
        ...props,
        items: fromJS(items).setIn([2, 'favoriteEnabled'], favoriteEnabled),
        collectionDetail,
        collectionsSettings,
        boundGlobalActions,
        boundProjectActions,
      };
    } else if (key === photoListKeys.activities) {
      props = {
        ...props,
        items: fromJS(items),
      };
    }
    return props;
  };

  render() {
    const {
      history: {
        location: { pathname },
      },
    } = this.props;
    const { currentTabIndex, selectedKeys } = getCurrentSidebarKey(pathname, flattenTabsConfig);
    return (
      <div className="gllery-editor-sidebar-wrapper">
        <Tabs onSelect={this.onSelect} selectedIndex={currentTabIndex}>
          <TabList>
            {tabsConfig.map((tab, index) => (
              <Tab key={tab.key}>
                <XIcon
                  type={tab.icon}
                  text={tab.name}
                  status={index === currentTabIndex ? 'active' : ''}
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
