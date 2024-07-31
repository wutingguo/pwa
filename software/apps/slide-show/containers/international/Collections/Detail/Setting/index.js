import React from 'react';
import { fromJS } from 'immutable';
import { XPureComponent } from '@common/components';
import equals from '@resource/lib/utils/compare';
import CollectionDetailHeader from '@apps/slide-show/components/CollectionDetailHeader';
import EditorPublishcontent from '@apps/slide-show/components/EditorPublishcontent';
import Switch from '@apps/gallery/components/Switch';
import { saasProducts } from '@resource/lib/constants/strings';
import './index.scss';
import main from './handle/main';

class DownloadSetting extends XPureComponent {
  state = {
    isPublishing: false,

    disableShare: true,
    disableDownload: true,
    disablePublish: true,
    showRevert: true,
    publishText: t('PUBLISH'),
    emailRegistration: false,
    download_resolution_size: 0,
    download_status: false,
    showTips: false,
    downLoadPinStatus: false, // pin 开关 状态
    pin: '',
    isLoadDownState: false
  };

  getSwitchProps = () => main.getSwitchProps(this);

  reselectSize = () => main.reselectSize(this);
  handleShowSelectSize = () => main.handleShowSelectSize(this);

  getSwitchPropsFromPin = () => main.getSwitchPropsFromPin(this);
  handleResetPin = () => main.handleResetPin(this);

  componentDidMount() {
    const {
      boundGlobalActions,
      boundProjectActions,
      match: {
        params: { id }
      }
    } = this.props;
    // console.log("proosss....",this.props)
    const { getDownloadSettings, getDownloadPin } = boundProjectActions;
    getDownloadSettings({ project_id: id }).then(res => {
      const { data, ret_code } = res;
      if (ret_code === 200000) {
        const { download_resolution_size, download_status } = data;
        this.setState({
          download_resolution_size,
          download_status,
          emailRegistration: download_status
        });
        getDownloadPin({ project_id: id }).then(res => {
          const { data, ret_code } = res;
          if (ret_code === 200000) {
            const { download_pin_status, pin } = data;
            this.setState({
              download_pin_status,
              pin,
              downLoadPinStatus: download_pin_status,
              isLoadDownState: true
            });
          }
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {}

  renderDownloadStatusHtml = () => {
    const {
      download_status,
      download_resolution_size,
      emailRegistration,
      pin,
      downLoadPinStatus
    } = this.state;
    let videoText = {
      1: 'HD-720P',
      2: 'HD-1080P',
      3: '4K'
    };

    return (
      <div className="selceted-wrap">
        <div className="selceted-wrap-top">
          <div className="size-text">Downloadable Size</div>
          <div className="select-content">
            <div className="select-content-left">
              <div className="icon">{/* <i className="fa fa-switch-on"></i> */}</div>
              <div className="name">{videoText[download_resolution_size]}</div>
            </div>
            <div
              className="select-content-right"
              onClick={() => {
                window.logEvent.addPageEvent({
                  name: 'SlideshowDownloadSettings_Click_ReselectSize'
                });
                this.handleShowSelectSize();
              }}
            >
              Reselect
            </div>
          </div>
        </div>
        <div className="selceted-wrap-bot">
          Select a size your clients are allowed to download. The playback of your selected size
          will automatically start being generated
          <br /> when you publish or update the slideshow so that the playback will have been ready
          by the time your clients download it.
        </div>
      </div>
    );
  };
  renderPinHtml = () => {
    const { pin, downLoadPinStatus } = this.state;
    let { mySubscription } = this.props;
    mySubscription = mySubscription.toJS();
    // console.log('mySubscription.....', mySubscription);
    let showSetPin = false;
    if (mySubscription && mySubscription.items && mySubscription.items.length) {
      const curInfo = mySubscription.items.find(i => i.product_id === saasProducts.slideshow);
      if (curInfo) {
        const { plan_level, trial_plan_level } = curInfo;
        showSetPin =
          plan_level === 20 || plan_level === 30 || plan_level === 40 || trial_plan_level === 40;
        // showUpgrade = true
      }
    }
    return (
      <div className="selceted-wrap-pin">
        <div className="selceted-wrap-top">
          {showSetPin ? (
            <>
              <div className="size-text">Download PIN</div>
              <div className="trun-on-off">
                <Switch {...this.getSwitchPropsFromPin()} />
              </div>
            </>
          ) : null}

          {showSetPin && downLoadPinStatus ? (
            <>
              <div className="select-content">
                <div className="select-content-left">
                  {/* <div className="icon"></div> */}
                  <div className="name pin" style={{ marginLeft: '10px' }}>
                    PIN: {pin}
                  </div>
                </div>
                <div
                  className="select-content-right"
                  onClick={() => {
                    window.logEvent.addPageEvent({
                      name: 'SlideshowDownloadSettings_Click_ReselectSize'
                    });
                    this.handleResetPin();
                  }}
                >
                  Reset PIN
                </div>
              </div>
              <div className="selceted-wrap-bot">
                Your clients will be required to enter this 4-digit PIN to download the slideshow.
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  };

  render() {
    const {
      match: { params },
      mySubscription
    } = this.props;
    // console.log("this.props....", this.props)
    const {
      download_status,
      download_resolution_size,
      emailRegistration,
      pin,
      downLoadPinStatus,
      isLoadDownState
    } = this.state;
    let videoText = {
      1: 'HD-720P',
      2: 'HD-1080P',
      3: '4K'
    };

    return (
      <div className="slide-show-editor-content-wrapper slide-show-collection-detail-setting">
        {/* 主渲染区域.  {...this.getSwitchProps()} */}
        <div className="content">
          <div className="setting-head">Download Settings</div>
          {isLoadDownState ? (
            <div className="download-status">
              <div className="download-status-text">Download Status</div>

              <div className="trun-on-off">
                <Switch {...this.getSwitchProps()} />
              </div>
              <div className="down-tips-info">
                Turn on to allow your clients to download the slideshow.
              </div>
              <div className="download-about-wrap">
                {download_resolution_size && emailRegistration ? (
                  <>
                    {this.renderDownloadStatusHtml()}
                    {this.renderPinHtml()}
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default DownloadSetting;
