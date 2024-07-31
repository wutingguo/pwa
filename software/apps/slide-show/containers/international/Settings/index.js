import React, { Fragment } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import renderRoutes from '@resource/lib/utils/routeHelper';

import { XPureComponent } from '@common/components';

import EmailList from '@apps/slide-show/components/EmailList';
import Preference from '@apps/slide-show/components/Preference';

// import WatermarkList from '@apps/gallery/components/WatermarkList';
import './index.scss';

class Settings extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowPreference: false,
    };
  }
  componentDidMount() {
    const { grayInfo } = this.props;
    const isShowPreference = grayInfo.some(item => item.grayTag === 'SharpeningLevel');
    this.setState({
      isShowPreference,
    });
  }
  render() {
    const { isShowPreference } = this.state;

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
            <Tabs>
              <div className="watermark-header">
                <TabList>
                  {/* <Tab>
                    <span className="watermark-label">{t('SETTINGS_WATERMARK')}</span>
                  </Tab> */}
                  <Tab>
                    <span className="email-label">{t('SETTINGS_EMAIL')}</span>
                  </Tab>
                  {/* {isShowPreference && (
                    <Tab>
                      <span className="email-label">{t('SETTINGS_PREFERENCE', 'Preference')}</span>
                    </Tab>
                  )} */}
                </TabList>
              </div>
              {/* <TabPanel>
                <WatermarkList {...this.props} />
                <div className="watermark-tip">
                  <span className="tip-msg ellipsis" title={t('SETTINGS_WATERMARK_TIP')}>
                    {t('SETTINGS_WATERMARK_TIP')}
                  </span>
                </div>
              </TabPanel> */}
              <TabPanel>
                <EmailList {...this.props} />
              </TabPanel>
              {/* {isShowPreference && (
                <TabPanel>
                  <Preference {...this.props} />
                </TabPanel>
              )} */}
            </Tabs>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Settings;
