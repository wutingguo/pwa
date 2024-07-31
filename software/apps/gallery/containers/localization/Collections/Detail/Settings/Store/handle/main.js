import storeSettingService from '../service';

/**
 * 更新 settings
 * @param {*} that
 * @param {*} settingItem
 */
const updateSettings = (that, settingName, checked) => {
  return new Promise((resolve, reject) => {
    const {
      collectionsSettings,
      boundProjectActions,
      boundGlobalActions,
      match: {
        params: { id: collectionId },
      },
    } = that.props;
    const { addNotification } = boundGlobalActions;
    const collectionUid = collectionsSettings.get('enc_collection_uid');

    boundProjectActions.switchStoreStatus({ collectionUid, storeStatus: checked }).then(
      res => {
        console.log('res: ', res);
        that.setState({
          storeStatusChecked: checked,
        });
        if (settingName) {
          // addNotification({
          //   message: `${settingName} ${checked ? t('SWITCH_ON') : t('SWITCH_OFF')}`,
          //   level: 'success',
          //   autoDismiss: 2
          // });
        }
        resolve(res);
      },
      error => {
        console.error(error);
        if (settingName) {
          addNotification({
            message: `${settingName} ${checked ? t('SWITCH_ON') : t('SWITCH_OFF')} ${t(
              'COLLECTIOIN_SETTINGS_FAILED_TOAST'
            )}`,
            level: 'error',
            autoDismiss: 2,
          });
        }
        reject();
      }
    );
  });
};

const onStoreStatusSwitch = async (that, checked) => {
  const {
    boundGlobalActions,
    boundProjectActions,
    // estoreInfo,
    urls,
    match: { params },
    presetState,
  } = that.props;
  const { id: collectionId } = params;

  const estoreBaseUrl = urls.get('estoreBaseUrl');
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  that.setState({ switchDisabled: true });

  const { data: estoreInfo } = await boundGlobalActions.getEstoreInfo();

  const { priceSheetOptions, selectedPriceSheetOption } = await that.fetchPriceSheet(estoreInfo);
  console.log('estoreInfo: ', estoreInfo);
  console.log('priceSheetOptions: ', priceSheetOptions);

  window.logEvent.addPageEvent({
    name: 'GalleryStoreSetting_Click_StoreStatus',
    store_status: checked ? 'on' : 'off',
  });

  // 如果是关闭
  if (!checked) {
    if (presetState) {
      that.instantUpdate('store_status', false);
    } else {
      await updateSettings(that, t('STORE_STATUS'), false);
      boundProjectActions.getCollectionsSettings(collectionId);
    }
    that.setState({ switchDisabled: false });
    return;
  }

  // 打开store 自动绑定priceSheet
  const openStore = async () => {
    // 如果collection已经绑定过priceSheet则继续沿用之前的 否则使用最新的
    const willBindId = selectedPriceSheetOption?.value || priceSheetOptions[0].value;
    const err = await storeSettingService.bindPriceSheet({
      galleryBaseUrl,
      collectionId,
      priceSheetId: willBindId,
      storeId: estoreInfo?.id,
    });
    if (!err) {
      if (presetState) {
        const { collectionsSettings } = that.props;
        const store_setting = collectionsSettings.get('store_setting').toJS();
        that.instantUpdate('', {
          ...store_setting,
          store_status: true,
          rack_id: priceSheetOptions[0].value,
          store_id: estoreInfo?.id,
        });
      } else {
        await that.onlyFetchBindPriceSheet();
        await updateSettings(that, t('STORE_STATUS'), true);
        boundProjectActions.getCollectionsSettings(collectionId);
      }
      that.onBindPriceSheetSuccess();
    }
    that.setState({ switchDisabled: false });
  };

  // 存在priceSheet则选中最新的
  if (priceSheetOptions.length > 0) {
    await openStore();
  } else {
    // 没有priceSheet 则提示前往创建
    const data = {
      close: boundGlobalActions.hideConfirm,
      message: presetState && !__isCN__ ? t('EMPTY_PRICE_SHEET_COPY') : t('EMPTY_PRICE_SHEET'),
      className: 'store-status-setting-confirm',
      buttons: [
        {
          className: 'white pwa-btn',
          text: t('CANCEL'),
          onClick: () => {
            boundGlobalActions.hideConfirm();
          },
        },
        {
          className: 'pwa-btn',
          text: t('CONTINUE'),
          onClick: async () => {
            location.href = '/software/e-store/products';
          },
        },
      ],
    };
    boundGlobalActions.showConfirm(data);
  }
};

const getStoreStatusSwitchProps = (that, status) => {
  const { switchDisabled } = that.state;
  const switchProps = {
    id: 'status',
    checked: status,
    onSwitch: checked => onStoreStatusSwitch(that, checked),
    disabled: switchDisabled,
  };
  return switchProps;
};

export default {
  getStoreStatusSwitchProps,
};
