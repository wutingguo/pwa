import { Toast } from '@apps/dashboard-mobile/components';
/**
 * 更新 settings
 * @param {*} that
 * @param {*} settingItem
 */
const updateSettings = (that, params, setting, config) => {
  const { boundProjectActions } = that.props;

  boundProjectActions.updateCollectionsSettings(params).then(
    res => {
      if (res.ret_code === 200000) {
        // 更新最新的库
        boundProjectActions.updateCollectionSettings(config?.params || params);
        config?.url &&
          that.props.history.push({
            pathname: config?.url
          });
      }
    },
    error => {
      console.log(error);
      Toast.error({
        message: `${setting} ${t('COLLECTIOIN_SETTINGS_FAILED_TOAST')}`,
        duration: 2000
      });
    }
  );
};

export default {
  updateSettings
};
