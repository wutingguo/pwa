import React, { Fragment } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import renderRoutes from '@resource/lib/utils/routeHelper';

import { XPureComponent } from '@common/components';

import CollectionPreset from '@apps/gallery/components/CollectionPreset';
import EmailList from '@apps/gallery/components/EmailList';
import Portfolio from '@apps/gallery/components/Portfolio';
import Preference from '@apps/gallery/components/Preference';
import WatermarkList from '@apps/gallery/components/WatermarkList';
import Tools from '@apps/gallery/containers/international/Tools';
import { getBrand } from '@apps/gallery/utils/services';

import './index.scss';

class Settings extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      brand: '',
      isShowPreference: false,
    };
  }

  componentDidMount() {
    const { tab = 0 } = this.props.history.location.state || {};
    const { urls, grayInfo } = this.props;
    const isShowPreference = grayInfo.some(item => item.grayTag === 'SharpeningLevel');
    this.setState({
      selectedTab: tab,
      isShowPreference,
    });
    getBrand({ galleryBaseUrl: urls.get('galleryBaseUrl') }).then(res => {
      this.setState({
        brand: res.sub_domain_prefix,
      });
    });
  }
  setTabIndex = index => {
    this.setState({
      selectedTab: index,
    });
  };

  goBrand = () => {
    this.props.history.push('/software/settings/my-brand');
  };

  render() {
    const { brand, isShowPreference } = this.state;
    const routeHtml = renderRoutes({
      isHash: false,
      props: this.props,
    });

    // console.log("setting--this.props....",this.props)

    return (
      <Fragment>
        {routeHtml}
        <div className="settings">
          {/* <div className="settings-menu">
            <div className="scroll-nav">
              <ul className="nav-list">
                <li className="nva-link active">
                  {t('SETTINGS_WATERMARK')}
                </li>
              </ul>
            </div>
          </div> */}
          <div className="watermark-wrap">
            <Tabs
              selectedIndex={this.state.selectedTab}
              onSelect={index => this.setTabIndex(index)}
            >
              <div className="watermark-header">
                <TabList>
                  <Tab>
                    <span className="watermark-label">{t('SETTINGS_PORTFOLIO')}</span>
                  </Tab>
                  {/* {isShowPreference && (
                    <Tab>
                      <span className="domain-label">{t('SETTINGS_PREFERENCE', 'Preference')}</span>
                    </Tab>
                  )} */}
                  <Tab>
                    <span className="domain-label">{t('SETTINGS_DOMAIN')}</span>
                  </Tab>
                  <Tab>
                    <span className="watermark-label">{t('SETTINGS_WATERMARK')}</span>
                  </Tab>
                  <Tab>
                    <span className="email-label">{t('SETTINGS_EMAIL')}</span>
                  </Tab>
                  <Tab>
                    <span className="tools-label">{t('COLLECTION_PRESET')}</span>
                  </Tab>
                  <Tab>
                    <span className="tools-label">{t('GALLERY_TOOLS')}</span>
                  </Tab>
                </TabList>
              </div>
              <TabPanel>
                <Portfolio {...this.props} />
              </TabPanel>
              {/* {isShowPreference && (
                <TabPanel>
                  <Preference {...this.props} />
                </TabPanel>
              )} */}
              <TabPanel>
                <div className="domain_container">
                  <div className="title">Default Domain</div>
                  <div className="sub_content">{`${brand}.mypixhome.com`}</div>
                  <div className="tips">
                    Collection url slugs are appended to this domain as your client gallery links.
                    To change prefix of your default domain, edit Brand Subdomain under
                    <span style={{ color: '#058DD5', cursor: 'pointer' }} onClick={this.goBrand}>
                      {' '}
                      My Stuff {`>`} My Brand
                    </span>
                    .
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <WatermarkList {...this.props} />
                <div className="watermark-tip">
                  <span className="tip-msg ellipsis" title={t('SETTINGS_WATERMARK_TIP')}>
                    {t('SETTINGS_WATERMARK_TIP')}
                  </span>
                </div>
              </TabPanel>
              <TabPanel>
                <EmailList {...this.props} />
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
