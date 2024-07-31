import React, { Fragment } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import renderRoutes from '@resource/lib/utils/routeHelper';

import { XPureComponent } from '@common/components';

import CollectionPreset from '@apps/gallery/components/CollectionPreset';
import WatermarkList from '@apps/gallery/components/WatermarkList';

import Tools from '../Tools';

import './index.scss';

class Settings extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
    };
  }
  setTabIndex = index => {
    this.setState({
      selectedTab: index,
    });
  };
  componentDidMount() {
    const { tab = 0 } = this.props.history.location.state || {};
    this.setState({
      selectedTab: tab,
    });
  }

  render() {
    const routeHtml = renderRoutes({
      isHash: false,
      props: this.props,
    });

    return (
      <Fragment>
        {routeHtml}
        <div className="settings">
          <div className="watermark-wrap">
            <Tabs
              className="tabs"
              selectedIndex={this.state.selectedTab}
              onSelect={index => this.setTabIndex(index)}
            >
              <div className="watermark-header">
                <TabList>
                  <Tab>
                    <span className="watermark-label">{t('SETTINGS_WATERMARK')}</span>
                  </Tab>
                  <Tab>
                    <span className="tools-label">{t('PRESET_RESET')}</span>
                  </Tab>
                  <Tab>
                    <span className="tools-label">{t('GALLERY_TOOLS')}</span>
                  </Tab>
                </TabList>
              </div>
              <TabPanel>
                {/* <span className="watermark-label">
                    {t('SETTINGS_WATERMARK')}
                  </span> */}
                <WatermarkList {...this.props} />
                <div className="watermark-tip">
                  <span className="tip-msg ellipsis" title={t('SETTINGS_WATERMARK_TIP')}>
                    {t('SETTINGS_WATERMARK_TIP')}
                  </span>
                  {/* <a className="more-link">{t('LEARN_MORE')}</a> */}
                </div>
              </TabPanel>
              <TabPanel>
                <CollectionPreset {...this.props} />
              </TabPanel>
              <TabPanel>
                <Tools />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Settings;
