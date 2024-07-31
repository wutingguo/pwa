import React, { Fragment } from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import XDebossingCN from '@resource/components/XDebossingCN';
import XStickersCN from '../../../components/XStickersCN';
import XThemeListCN from '@resource/components/XThemeListCN';

import './index.scss';

export default class MyMaterials extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0
    };

    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(tabIndex) {
    const eventName = [
      'DesignerMaterialMT_Click_Theme',
      'MaterialManager_Click_DebossingTab',
      'MaterialManager_Click_StickerTab'
    ];
    window.logEvent.addPageEvent({
      name: eventName[tabIndex]
    });
    this.setState({
      tabIndex
    });
  }

  componentDidMount() {}

  render() {
    const { userInfo, urls, boundGlobalActions } = this.props;
    const { tabIndex } = this.state;
    const itemProps = {
      userInfo: userInfo.toJS(),
      baseUrl: urls.get('baseUrl'),
      uploadBaseUrl: urls.get('uploadBaseUrl'),
      calendarBaseUrl: urls.get('calendarBaseUrl'),
      boundGlobalActions
    };

    return (
      <Fragment>
        <h2 className="page-title">设计软件{'>'}素材管理</h2>
        <div className="my-materials-container">
          <Tabs selectedIndex={tabIndex} onSelect={this.onTabChange}>
            <TabList>
              <Tab>主题</Tab>
              <Tab>贴纸</Tab>
              <Tab>烫印LOGO</Tab>
            </TabList>
            <TabPanel>
              <XThemeListCN {...itemProps} />
            </TabPanel>
            <TabPanel>
              <XStickersCN {...itemProps} />
            </TabPanel>
            <TabPanel>
              <XDebossingCN {...itemProps} />
            </TabPanel>
          </Tabs>
        </div>
      </Fragment>
    );
  }
}
