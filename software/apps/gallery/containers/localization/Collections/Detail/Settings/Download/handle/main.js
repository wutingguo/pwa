import { merge, omit } from 'lodash';

import {
  PACKAGE_LIST_ENUM,
  PERMISSION_NAME_ENUM,
  saasProducts,
} from '@resource/lib/constants/strings';

/**
 * 更新 settings
 * @param {*} that
 * @param {*} settingItem
 */
const updateSettings = (that, download_setting, setting, checked) => {
  const { collectionsSettings, boundProjectActions, boundGlobalActions } = that.props;
  const { addNotification } = boundGlobalActions;
  const collectionUid = collectionsSettings.get('enc_collection_uid');
  const settingType = collectionsSettings.getIn(['download_setting', 'setting_type']);
  const params = {
    collection_uid: collectionUid,
    setting_type: settingType,
    download_setting,
  };
  return boundProjectActions.updateCollectionsSettings(params).then(
    res => {
      console.log('res: ', res);
      if (setting) {
        addNotification({
          message: `${setting} ${checked ? t('SWITCH_ON') : t('SWITCH_OFF')}`,
          level: 'success',
          autoDismiss: 2,
        });
      }
      return Promise.resolve(res);
    },
    error => {
      console.log(error);
      if (setting) {
        addNotification({
          message: `${setting} ${checked ? t('SWITCH_ON') : t('SWITCH_OFF')} ${t(
            'COLLECTIOIN_SETTINGS_FAILED_TOAST'
          )}`,
          level: 'error',
          autoDismiss: 2,
        });
      }
    }
  );
};

const resetPin = that => {
  logEventWrap(that, 'GalleryDownloadSetting_Click_ResetPIN');
  const { boundGlobalActions, boundProjectActions, collectionsSettings } = that.props;
  boundGlobalActions.showConfirm({
    close: e => {
      boundGlobalActions.hideConfirm();
      if (e) {
        logEventWrap(that, 'GalleryResetPINPopup_Click_Cross');
      }
    },
    title: t('ARE_YOU_SURE'),
    message: t('RESET_PIN_MESSAGE'),
    buttons: [
      {
        className: 'white',
        text: t('CANCEL'),
        onClick: () => {
          boundGlobalActions.hideConfirm();
          logEventWrap(that, 'GalleryResetPINPopup_Click_Cancel');
        },
      },
      {
        onClick: () => {
          logEventWrap(that, 'GalleryResetPINPopup_Click_ResetPIN');
          const collectionUid = collectionsSettings.get('enc_collection_uid');
          boundProjectActions.resetPin(collectionUid).then(res => {
            boundGlobalActions.addNotification({
              message: '修改成功',
              level: 'success',
              autoDismiss: 2,
            });
            const { getPinSetting } = boundProjectActions;
            getPinSetting(collectionUid);
          });
        },
        text: t('RESET_PIN'),
      },
    ],
  });
};

function changeItemStatus(item, status) {
  const serviceConfig = item && item.serviceConfig;
  if (serviceConfig && serviceConfig.key === 'common_download_photo_size') {
    return;
  }
  if (Object.keys(item).includes('status')) {
    item.status = status;
  }
  if (Object.keys(serviceConfig).includes('status')) {
    serviceConfig.status = status;
  }
}

function changeItemStatusBykey(settingGroups, key, status) {
  const targetItem = findItemByKey(settingGroups, key);
  changeItemStatus(targetItem, status);
}

function findItemByKey(settingGroups, key) {
  let targetItem;
  function findItem(item) {
    if (item.key === key) {
      targetItem = item;
      return true;
    }
    return false;
  }
  function findGroup(group) {
    let finded = findItem(group);
    return finded || (group.items && group.items.length && group.items.some(i => findGroup(i)));
  }
  settingGroups.some(g => findGroup(g));
  return targetItem;
}

function getItemServiceParams(settingGroups, key) {
  let params = null;
  const item = findItemByKey(settingGroups, key);
  const serviceConfig = item && item.serviceConfig;
  if (!serviceConfig) return params;
  params = {};
  const { isGroup, parentItemKey } = serviceConfig;
  if (isGroup) {
    params[serviceConfig.key] = [omit(serviceConfig, ['key', 'isGroup', 'parentItemKey'])];
    if (parentItemKey) {
      const parentItem = findItemByKey(settingGroups, parentItemKey);
      const parentServiceConfig = parentItem && parentItem.serviceConfig;
      if (parentServiceConfig) {
        if (parentServiceConfig.isGroup) {
          params[parentServiceConfig.key] = [
            merge(omit(parentServiceConfig, ['key', 'isGroup', 'parentItemKey']), params),
          ];
        }
      }
    }
  } else {
    params[serviceConfig.key] = serviceConfig.status;
  }
  return params;
}

const onDownloadStatusSwitch = (that, key, checked) => {
  logEventWrap(that, 'GalleryDownloadSetting_Click_DownloadStatus', {
    status: checked ? 'On' : 'Off',
  });
  const { presetState } = that.props;
  const { settingGroups } = that.state;
  let downloadSetting = {};
  changeItemStatus(settingGroups[0], checked);
  downloadSetting = getItemServiceParams(settingGroups, key);
  that.setState({
    settingGroups,
  });
  if (presetState) {
    const msg = `${t('DOWNLOAD_STATUS')} ${t(checked ? 'SWITCH_ON' : 'SWITCH_OFF')}`;
    that.instantUpdate('common_download_status', !!checked, msg);
  } else {
    updateSettings(that, downloadSetting, t('DOWNLOAD_STATUS'), checked);
  }
};

const onDownloadPinStatusSwitch = (that, key, checked) => {
  logEventWrap(that, 'GalleryDownloadSetting_Click_DownloadPIN', {
    status: checked ? 'On' : 'Off',
  });
  const { boundGlobalActions } = that.props;
  if (!checked) {
    boundGlobalActions.showConfirm({
      close: e => {
        boundGlobalActions.hideConfirm();
        if (e) {
          logEventWrap(that, 'GalleryDisablePINPopup_Click_Cross');
        }
      },
      title: t('ARE_YOU_SURE'),
      message: t('CLOSE_DOWNLOAD_PIN_MESSAGE'),
      buttons: [
        {
          className: 'white',
          text: t('CANCEL', '取消'),
          onClick: () => {
            boundGlobalActions.hideConfirm();
            logEventWrap(that, 'GalleryDisablePINPopup_Click_Cancel');
          },
        },
        {
          onClick: () => {
            logEventWrap(that, 'GalleryDisablePINPopup_Click_DisablePIN');
            onStatusSwitch(that, key, checked);
          },
          text: t('DISABLE_PIN'),
        },
      ],
    });
  } else {
    onStatusSwitch(that, key, checked);
  }
};

const logEventWrap = (that, eventName, params = {}) => {
  const { collectionsSettings } = that.props;
  const collectionId = collectionsSettings.get('collection_uid');
  window.logEvent.addPageEvent({
    name: eventName,
    collectionId,
    ...params,
  });
};

const onStatusSwitch = (that, key, checked) => {
  console.log('key: ', key);
  const { settingGroups } = that.state;
  const { boundGlobalActions, presetState } = that.props;
  let presetKey = '';
  //添加埋点
  let eventKey;
  switch (key) {
    case 'DOWNLOAD_GALLERY':
      eventKey = 'GalleryDownloadSetting_Click_GalleryDownload';
      presetKey = 'common_gallery_download_status';
      break;
    case 'DOWNLOAD_SINGLE_PHOTO':
      eventKey = 'GalleryDownloadSetting_Click_SinglePhotoDownload';
      presetKey = 'common_single_photo_download_status';
      break;
    case 'DOWNLOAD_PIN':
      eventKey = 'GalleryDownloadSetting_Click_DownloadPin';
      presetKey = 'common_pin_status';
      break;
  }
  if (eventKey) {
    logEventWrap(that, eventKey, { status: checked ? 'On' : 'Off' });
  }
  const downloadControlKeys = ['DOWNLOAD_GALLERY', 'DOWNLOAD_SINGLE_PHOTO'];
  if (downloadControlKeys.includes(key)) {
    if (!checked) {
      const openControlKeys = downloadControlKeys.filter(key => {
        const item = findItemByKey(settingGroups, key);
        return item && item.status;
      });
      if (openControlKeys.length === 1) {
        boundGlobalActions.addNotification({
          message: t('AT_LEAST_ONE_DOWNLOAD_TIPS'),
          level: 'success',
          autoDismiss: 2,
        });
        return;
      }
    }
  }
  changeItemStatusBykey(settingGroups, key, checked);
  that.setState({
    settingGroups,
  });
  if (presetState) {
    const msg = `${t(key)} ${t(checked ? 'SWITCH_ON' : 'SWITCH_OFF')}`;
    that.instantUpdate(presetKey, !!checked, msg);
  } else {
    const serviceParams = getItemServiceParams(settingGroups, key);
    updateSettings(that, serviceParams, t(key), checked);
  }
};

const showUpgradeModal = that => {
  const {
    boundGlobalActions: { showConfirm, hideConfirm },
  } = that.props;
  const data = {
    message: t('UPGRADE_TO_USE_HIGH_RESOLUTION'),
    close: e => {
      hideConfirm();
      if (e) {
        window.logEvent.addPageEvent({
          name: 'GalleryDownloadResolutionPopup_Click_Cross',
        });
      }
    },
    buttons: [
      {
        text: t('UPGRADE'),
        className: 'pwa-btn',
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'GalleryDownloadResolutionPopup_Click_Upgrade',
          });

          location.href = `/saascheckout.html?from=saas&product_id=${saasProducts.gallery}&level=${PACKAGE_LIST_ENUM.basic}`;
        },
      },
    ],
  };
  showConfirm(data);
};

const onResolutionTypeChanged = (that, key, checked) => {
  const { collectionsSettings, boundGlobalActions, presetState } = that.props;
  const downloadSettings = collectionsSettings.get('download_setting');
  const resolution = downloadSettings.get('resolution');
  //判断是否有高分辨率下载权限
  const hignResolutionAbility = collectionsSettings.get('can_download_with_high_resolution');
  if (checked && !hignResolutionAbility && key === 'resolution_type_1' && !__isCN__) {
    showUpgradeModal(that);
    that.forceUpdate();
    return;
  }
  let presetKey = '';
  //添加埋点
  let eventKey;
  switch (key) {
    case 'resolution_type_1':
      presetKey = 'high_resolution';
      eventKey = 'GalleryDownloadResolution_Click_High';
      break;
    case 'resolution_type_2':
      presetKey = 'web_size';
      eventKey = 'GalleryDownloadResolution_Click_Web';
      break;
  }
  if (eventKey) {
    logEventWrap(that, eventKey, { status: checked ? 'On' : 'Off' });
  }

  let isShowSingleTips = false;
  const checkedResolution = resolution.toJS().filter(item => item['status']);
  if (checkedResolution.length === 1) {
    isShowSingleTips = checkedResolution.some(
      item => `resolution_type_${item['resolution_id']}` === key
    );
    if (isShowSingleTips) {
      boundGlobalActions.addNotification({
        message: t('AT_LEAST_ONE_DOWNLOAD_SIZE_TIPS'),
        level: 'success',
        autoDismiss: 2,
      });
    }
  }

  const convertResolution = resolution.map(item => {
    const type = `resolution_type_${item.get('resolution_id')}`;
    if (type === key) {
      return item.merge({
        status: isShowSingleTips ? true : checked,
      });
    }
    return item;
  });
  if (presetState) {
    const tempResoultion = convertResolution.toJS().map(item => {
      const type = `resolution_type_${item.resolution_id}`;
      if (item.code === presetKey && type === key) {
        return {
          ...item,
          status: isShowSingleTips ? true : checked,
        };
      }
      return item;
    });
    that.instantUpdate('resolution', tempResoultion, '', () => {
      if (isShowSingleTips) that.forceUpdate();
    });
    return;
  }
  updateSettings(that, { resolution: convertResolution.toJS() }).then(() => {
    if (isShowSingleTips) that.forceUpdate();
  });
};

const onPhotoSizeChanged = (that, key, checked) => {
  const { collectionsSettings, boundGlobalActions, presetState } = that.props;
  const { settingGroups } = that.state;
  const item = findItemByKey(settingGroups, key);
  if (item.status) {
    return;
  }
  if (key.startsWith('photo_size_') && presetState) {
    const downloadSettings = collectionsSettings.get('download_setting');
    const resolution = downloadSettings.get('resolution');
    const tempResoultion = resolution.map((item, index) => {
      if (index > 0) {
        const common_download_photo_size = item.get('common_download_photo_size');
        const tempSize = common_download_photo_size.map(inner => {
          const type = `photo_size_${inner.get('size_id')}`;
          if (type === key) {
            return inner.merge({
              status: true,
            });
          }
          return inner.merge({
            status: false,
          });
        });
        return item.merge({
          common_download_photo_size: tempSize,
        });
      }
      return item;
    });
    that.instantUpdate('resolution', tempResoultion, '', () => {
      that.forceUpdate();
    });
  } else {
    onStatusSwitch(that, key, checked);
  }
};

const willReceiveProps = (that, nextProps) => {
  updateSettingGroups(that, nextProps);
  updateAdvanceOptions(that, nextProps);
};

/**
 * 表单组件类型定义
 */
const formCompTypes = {
  SWITCH: 'switch',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  TEXT: 'text',
};

const updateSettingGroups = (that, nextProps) => {
  const { collectionsSettings, presetState } = nextProps || that.props;
  const downloadSettings = collectionsSettings.get('download_setting');
  if (downloadSettings && downloadSettings.size) {
    const {
      common_download_status,
      common_pin_status,
      pin,
      common_gallery_download_status,
      common_single_photo_download_status,
      resolution,
    } = downloadSettings.toJS();
    const settingGroups = [
      {
        key: 'DOWNLOAD_STATUS',
        type: formCompTypes.SWITCH,
        title: t('DOWNLOAD_STATUS'),
        desc: t(
          presetState ? 'DOWNLOAD_STATUS_DESC_1' : 'DOWNLOAD_STATUS_DESC',
          '打开以允许您的客户下载此图库中的照片。'
        ),
        serviceConfig: {
          key: 'common_download_status',
          status: !!common_download_status,
        },
        status: !!common_download_status,
        onChanged: (that, checked) => onDownloadStatusSwitch(that, 'DOWNLOAD_STATUS', checked),
        items: [
          {
            key: 'DOWNLOAD_PIN',
            type: formCompTypes.SWITCH,
            title: t('DOWNLOAD_PIN', '下载密码'),
            desc: t(
              presetState ? 'DOWNLOAD_PIN_DESC_1' : 'DOWNLOAD_PIN_DESC',
              '您的客户需要输入这个 4 位数的密码才能下载照片。'
            ),
            serviceConfig: {
              key: 'common_pin_status',
              status: !!common_pin_status,
            },
            pin,
            status: !!common_pin_status,
            onChanged: (that, checked) => onDownloadPinStatusSwitch(that, 'DOWNLOAD_PIN', checked),
          },
          {
            key: 'DOWNLOAD_GALLERY',
            type: formCompTypes.SWITCH,
            title: t('DOWNLOAD_GALLERY', '图库下载'),
            desc: '',
            serviceConfig: {
              key: 'common_gallery_download_status',
              status: !!common_gallery_download_status,
            },
            status: !!common_gallery_download_status,
            onChanged: (that, checked) => onStatusSwitch(that, 'DOWNLOAD_GALLERY', checked),
          },
          {
            key: 'DOWNLOAD_SINGLE_PHOTO',
            type: formCompTypes.SWITCH,
            title: t('DOWNLOAD_SINGLE_PHOTO', '单张照片下载'),
            desc: '',
            serviceConfig: {
              key: 'common_single_photo_download_status',
              status: !!common_single_photo_download_status,
            },
            status: !!common_single_photo_download_status,
            onChanged: (that, checked) => onStatusSwitch(that, 'DOWNLOAD_SINGLE_PHOTO', checked),
          },
        ],
      },
    ];
    if (resolution && resolution.length) {
      const downloadbleSizeGroup = {
        key: 'DOWNLOADABLE_SIZES',
        type: formCompTypes.TEXT,
        text: t('DOWNLOADABLE_SIZES', '可下载尺寸'),
        groupDesc: t('DOWNLOAD_SIZES_TIPS'),
      };
      const downloadbleSizeItems = resolution.map(res => {
        const resolutionKey = `resolution_type_${res.resolution_id}`;
        const resolutionGroupItem = {
          key: resolutionKey,
          className: 'resolution-container',
          serviceConfig: {
            key: 'resolution',
            isGroup: true,
            resolution_id: res.resolution_id,
            name: __isCN__ ? res.name_cn : res.name,
            status: res.status,
          },
          text: __isCN__ ? res.name_cn : res.name,
          type: formCompTypes.CHECKBOX,
          status: res.status,
          onChanged: (that, checked) => onResolutionTypeChanged(that, resolutionKey, checked),
        };

        const isShowResolutionItem = res.status;
        const resolutionItems = res.common_download_photo_size.map(size => {
          const photoSizeKey = `photo_size_${size.size_id}`;
          return {
            key: photoSizeKey,
            text: __isCN__ ? size.photo_size_name_cn : size.photo_size_name,
            type: formCompTypes.RADIO,
            isShow: isShowResolutionItem,
            serviceConfig: {
              key: 'common_download_photo_size',
              isGroup: true,
              parentItemKey: resolutionGroupItem.key,
              size_id: size.size_id,
              photo_size_name: __isCN__ ? size.photo_size_name_cn : size.photo_size_name,
              status: size.status,
            },
            status: size.status,
            onChanged: (that, checked) => onPhotoSizeChanged(that, photoSizeKey, checked),
          };
        });
        resolutionGroupItem.items = resolutionItems;
        return resolutionGroupItem;
      });
      downloadbleSizeGroup.items = downloadbleSizeItems;
      settingGroups[0].items.push(downloadbleSizeGroup);
    }
    that.setState({
      settingGroups,
    });
  }
};

const updateAdvanceOptions = (that, nextProps) => {
  const { collectionsSettings } = nextProps || that.props;
  const downloadSettings = collectionsSettings.get('download_setting');
  if (downloadSettings && downloadSettings.size) {
    that.setState({
      advancedOptions: {
        setsSettings: downloadSettings.toJS().sets_setting,
      },
    });
  }
};

const onSetDownloadStatusSwitch = (that, setId, checked = {}, key) => {
  logEventWrap(that, 'GalleryDownloadSetting_Click_RestrictSet', {
    setId,
    status:
      checked.download_status || checked.selected_download_status ? 'Available' : 'Unavailable',
  });
  const { advancedOptions } = that.state;
  let currentSetting = advancedOptions.setsSettings.find(set => set.set_uid === setId);
  currentSetting = {
    ...currentSetting,
    ...checked,
  };
  const settings = JSON.parse(JSON.stringify(advancedOptions.setsSettings))
  settings.map((item, index) => {
    if(index === key) {
      settings[index] = {
        ...settings[index],
        ...checked,
      }
    }
  })
  that.setState({
    advancedOptions: {
      ...advancedOptions,
      setsSettings: settings
    },
  });
  const updatedSetsSettings = {
    sets_setting: [currentSetting],
  };
  if (that.props?.presetState) {
    that.instantUpdate('sets_setting', settings);
  } else {
    updateSettings(that, updatedSetsSettings);
  }
};

function jumpToDownloadActivity(that) {
  logEventWrap(that, 'GalleryCollectionSetting_Click_DownloadActivities');
  const {
    history,
    match: { params },
  } = that.props;
  const { id: encCollectionId } = params;
  history.push(`/software/gallery/collection/${encCollectionId}/activities/download`);
}

export default {
  willReceiveProps,
  formCompTypes,
  onSetDownloadStatusSwitch,
  resetPin,
  jumpToDownloadActivity,
};
