import React, { Fragment } from 'react';
import { XPureComponent } from '@common/components';
import renderRoutes from '@resource/lib/utils/routeHelper';
import Watermark from './default-watermark.jpg';

import './index.scss';

class Settings extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { clock } = this.props;

    const routeHtml = renderRoutes({
      isHash: false,
      props: this.props
    });

    return (
      <Fragment>
        {routeHtml}
        <div className="settings">
          <div className="settings-menu">
            <div className="scroll-nav">
              <ul className="nav-list">
                <li className="nva-link active">{t('SETTINGS_WATERMARK')}</li>
              </ul>
            </div>
          </div>
          <div className="watermark-wrap">
            <div className="watermark-header">
              <span className="watermark-label">{t('SETTINGS_WATERMARK')}</span>
            </div>
            <div className="watermark-list">
              <div className="watermark-item">
                <div className="watermark-pic">
                  <img src={Watermark} />
                </div>
                <div className="watermark-name">Default Watermark</div>
              </div>
            </div>
            <div className="watermark-tip">
              <span className="tip-msg ellipsis" title={t('SETTINGS_WATERMARK_TIP')}>
                {t('SETTINGS_WATERMARK_TIP')}
              </span>
              {/* <a className="more-link">{t('LEARN_MORE')}</a> */}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Settings;
