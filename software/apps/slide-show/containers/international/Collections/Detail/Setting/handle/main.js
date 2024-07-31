import { assign } from 'lodash';
import { fromJS } from 'immutable';
import { SHARE_SLIDESHOW_MODAL } from '@resource/lib/constants/modalTypes';
import { SELECT_DOWN_SIZE } from '@apps/slide-show/constants/modalTypes';
import { projectProsessMap } from '@apps/slide-show/constants/strings';
import { getCollectionStatus } from '@apps/slide-show/utils/helper';

const closeSwitchAddSaveSettings = (that, { checked }) => {
  const {
    boundGlobalActions,
    boundProjectActions,
    match: {
      params: { id }
    }
  } = that.props;
  const { download_resolution_size, download_status } = that.state;
  const { saveDownloadSettings } = boundProjectActions;
  let params = {
    project_id: id,
    download_status: checked,
    download_resolution_size
  };
  saveDownloadSettings(params).then(res => {
    const { data, ret_code } = res;
    if (ret_code === 200000) {
      that.setState({ emailRegistration: checked });
    }
  });

  // that.setState({
  //   emailRegistration: false
  // });
};

// 保存下载配置信息配置信息
const saveDownloadSetting = (that, definition) => {
  const {
    boundGlobalActions,
    boundProjectActions,
    match: {
      params: { id }
    }
  } = that.props;
  const { saveDownloadSettings } = boundProjectActions;

  let params = {
    project_id: id,
    download_status: true,
    download_resolution_size: definition
  };
  let videoText = {
    1: '720P',
    2: '1080P',
    3: '4K'
  };
  saveDownloadSettings(params).then(res => {
    const { data, ret_code } = res;
    if (ret_code === 200000) {
      window.logEvent.addPageEvent({
        name: 'SlideshowDownloadSizeSelectPop_Click_Confirm',
        size: videoText[definition]
      });
      boundGlobalActions.hideModal(SELECT_DOWN_SIZE);
      that.setState({ emailRegistration: true });
      handleDownloadSettings(that);
      getDownloadPINStatus(that);
    }
  });
};
const handleShowSelectSize = that => {
  const {
    boundGlobalActions,
    boundProjectActions,
    match: {
      params: { id }
    }
  } = that.props;
  const { getResolutionOptions, getDownloadSettings } = boundProjectActions;
  const { download_resolution_size, download_status } = that.state;
  let data = {
    product_id: '',
    escapeClose: true,
    onClosed: () => {
      window.logEvent.addPageEvent({
        name: 'SlideshowDownloadSizeSelectPop_Click_Cancel'
      });
      boundGlobalActions.hideModal(SELECT_DOWN_SIZE);
    },
    save: definition => {
      saveDownloadSetting(that, definition);
    }
  };
  // if(download_resolution_size){

  // }
  Promise.all([getResolutionOptions(), getDownloadSettings({ project_id: id })]).then(responses => {
    let resolutionResponse = responses[0];
    const { data: resolutionData } = resolutionResponse;

    let downLoadSettingResponse = responses[1];
    const { data: downLoadSettingData } = downLoadSettingResponse;

    assign(data, {
      resolutionData: fromJS(resolutionData),
      downLoadSettingData
    });

    boundGlobalActions.showModal(SELECT_DOWN_SIZE, data);
  });
};

//重新选择 视频清晰度
const reselectSize = that => {};

const handleDownloadSettings = that => {
  const {
    boundGlobalActions,
    boundProjectActions,
    match: {
      params: { id }
    }
  } = that.props;
  const { getDownloadSettings } = boundProjectActions;

  getDownloadSettings({ project_id: id }).then(res => {
    const { data, ret_code } = res;
    if (ret_code === 200000) {
      const { download_resolution_size, download_status } = data;
      that.setState({
        download_resolution_size,
        download_status
        // emailRegistration:download_status
      });
      // console.log("downLoadSettingData-----",downLoadSettingData)
    }
  });
};

const onSwitch = (that, checked) => {
  const { download_resolution_size, download_status } = that.state;
  window.logEvent.addPageEvent({
    name: 'SlideshowDownloadSettings_Click_DownloadStatus',
    download_status: checked ? 'On' : 'Off'
  });
  if (checked) {
    if (download_resolution_size) {
      that.setState({ emailRegistration: true });
      closeSwitchAddSaveSettings(that, { checked });
      return;
    }
    handleShowSelectSize(that, { checked });
  } else {
    closeSwitchAddSaveSettings(that, { checked });
  }

  // updateSettings(that, { is_login_email: +checked }, t('EMAIL_REGISTRATION'));
};

const getSwitchProps = that => {
  const { emailRegistration } = that.state;

  const switchProps = {
    onSwitch: checked => onSwitch(that, checked),
    checked: emailRegistration
  };
  return switchProps;
};

const handleResetPin = that => {
  const { boundGlobalActions, boundProjectActions, collectionsSettings } = that.props;
  boundGlobalActions.showConfirm({
    close: e => {
      boundGlobalActions.hideConfirm();
      if (e) {
        window.logEvent.addPageEvent({
          name: 'SlideshowDownloadPINResetPop_Click_Cancel'
        });
      }
    },
    title: t('ARE_YOU_SURE'),
    message: t('RESET_PIN_MESSAGE'),
    buttons: [
      {
        className: 'white',
        text: t('CANCEL'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'SlideshowDownloadPINResetPop_Click_Cancel'
          });
          boundGlobalActions.hideConfirm();
        }
      },
      {
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'SlideshowDownloadPINResetPop_Click_Reset'
          });
          resetPin(that);
        },
        text: t('RESET_PIN')
      }
    ]
  });
};

//  pin  状态 开关
const onSwitchPin = (that, checked) => {
  const { download_resolution_size, download_status } = that.state;
  const { boundGlobalActions } = that.props;
  window.logEvent.addPageEvent({
    name: 'SlideshowDownloadSettings_Click_DownloadPIN',
    download_pin: checked ? 'On' : 'Off'
  });
  if (checked) {
    openOrClosePin(that, { checked });
  } else {
    boundGlobalActions.showConfirm({
      close: e => {
        boundGlobalActions.hideConfirm();
        if (e) {
          // logEventWrap(that, 'GalleryDisablePINPopup_Click_Cross');
        }
      },
      title: t('ARE_YOU_SURE'),
      message: t('CLOSE_DOWNLOAD_PIN_MESSAGE_SLIDE_SHOW'),
      buttons: [
        {
          className: 'white',
          text: t('CANCEL'),
          onClick: () => {
            boundGlobalActions.hideConfirm();
            window.logEvent.addPageEvent({
              name: 'SlideshowDownloadPINPop_Click_Cancel'
            });
          }
        },
        {
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'SlideshowDownloadPINPop_Click_DisablePIN'
            });
            openOrClosePin(that, { checked });
          },
          text: t('DISABLE_PIN')
        }
      ]
    });
  }
  // openOrClosePin(that,{checked})

  // that.setState({
  //   downLoadPinStatus:checked
  // })
};

const getSwitchPropsFromPin = that => {
  const { downLoadPinStatus } = that.state;

  const switchProps = {
    onSwitch: checked => onSwitchPin(that, checked),
    checked: downLoadPinStatus
  };
  return switchProps;
};

// open  or close pin switch
const openOrClosePin = (that, { checked }) => {
  const {
    boundGlobalActions,
    boundProjectActions,
    match: {
      params: { id }
    }
  } = that.props;
  const { saveDownloadSettings } = boundProjectActions;

  let params = {
    project_id: id,
    download_pin_status: checked
  };

  saveDownloadSettings(params).then(res => {
    const { data, ret_code } = res;
    if (ret_code === 200000) {
      // window.logEvent.addPageEvent({
      //   name: 'SlideshowDownloadSizeSelectPop_Click_Confirm',
      //   size: videoText[definition]
      // });
      // boundGlobalActions.hideModal(SELECT_DOWN_SIZE);
      that.setState({ downLoadPinStatus: checked });
      // handleDownloadSettings(that);
    }
  });
};

//重置pin  code
const resetPin = that => {
  const {
    boundGlobalActions,
    boundProjectActions,
    match: {
      params: { id }
    }
  } = that.props;
  const { getDownloadResetPin } = boundProjectActions;

  getDownloadResetPin({ project_id: id }).then(res => {
    if (res.ret_code === 200000) {
      // console.log("rss....",res)
      const { pin } = res.data;

      that.setState({ pin });
    }
  });
};

const getDownloadPINStatus = that => {
  const {
    boundGlobalActions,
    boundProjectActions,
    match: {
      params: { id }
    }
  } = that.props;

  const { getDownloadPin } = boundProjectActions;
  getDownloadPin({ project_id: id }).then(res => {
    const { data, ret_code } = res;
    if (ret_code === 200000) {
      const { download_pin_status, pin } = data;
      that.setState({
        download_pin_status,
        pin,
        downLoadPinStatus: download_pin_status
      });
    }
  });
};

export default {
  getSwitchProps,
  reselectSize,
  handleShowSelectSize,
  handleDownloadSettings,
  getSwitchPropsFromPin,
  handleResetPin,
  getDownloadPINStatus
};
