import React, { Fragment } from 'react';
import { XPureComponent } from '@common/components';
import equals from '@resource/lib/utils/compare';
import SettingsHeader from '../components/SettingsHeader';
import DefaultWatermark from './default-watermark.jpg'
import './index.scss';

class Watermark extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.willReceiveProps();
  }

  componentWillReceiveProps(nextProps) {
    const isEqual = equals(this.props, nextProps);
    if (!isEqual) {
      // this.willReceiveProps(nextProps);
    }
  }


  render() {
    const {
      history,
      match:{params},
    } = this.props;

    const headerProps = {
      title: t('WATERMARK'),
      hasHandleBtns: false
    }

    return (
      <Fragment>
        <div className="global-settings-watermark">
          <div className="content">
            {/* settings header */}
            <SettingsHeader {...headerProps}/>
            
            <div className="watermark-list">
              <div className="watermark-item">
                <div className="watermark-pic">
                  <img src={DefaultWatermark} />
                </div>
                <div className="watermark-name">{t('SETTINGS_DEFAULT_WATERMARK')}</div>
              </div>
            </div>
            <div className="watermark-tip">
              <span className="tip-msg ellipsis" title={t('SETTINGS_WATERMARK_TIP')}>{t('SETTINGS_WATERMARK_TIP')}</span>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Watermark;
