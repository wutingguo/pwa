import * as localModalTypes from '@apps/estore/constants/modalTypes';
import React from 'react';
import appActionsService from '@apps/estore/constants/service/appActions';
import { appActionNamesEnum, appActionModuleNamesEnum } from '@apps/estore/constants/strings';

const showProductInfoModal = that => {
  const { boundGlobalActions, urls } = that.props;
  const { rackSpuDetail, uuidOptions } = that.state;
  const { showModal } = boundGlobalActions;
  const baseUrl = urls && urls.get('estoreBaseUrl');
  showModal(localModalTypes.PRODUCT_INFO_MODAL, {
    title: 'Product Info Model',
    rackSpuDetail,
    uuidOptions,
    baseUrl,
    urls,
    close: () => {
      // 关闭弹窗
      boundGlobalActions.hideModal(localModalTypes.PRODUCT_INFO_MODAL);
    }
  });
  window.logEvent.addPageEvent({
    name: 'Estore_Products_CustomizeSPU_Click_ProductInfo'
  });
};

const showManagerOptionModal = that => {
  const { boundGlobalActions } = that.props;
  const { showAttrList, rack_spu_id, saveDisable } = that.state;
  const { showModal, addNotification } = boundGlobalActions;
  showModal(localModalTypes.MANAGER_OPTIONS_MODAL, {
    title: 'Product Options',
    attrList: showAttrList,
    close: () => {
      // 关闭弹窗
      boundGlobalActions.hideModal(localModalTypes.MANAGER_OPTIONS_MODAL);
      window.logEvent.addPageEvent({
        name: 'Estore_Products_CustomizeSPUManageOptionsPop_Click_Cancel'
      });
    },
    confirm: async list => {
      const options = [];
      list.forEach(attr => {
        const option = { key: attr.key_code };
        const values = [];
        attr.values.forEach(item => {
          if (item.selected) {
            values.push(item.value_term_code);
          }
        });
        option.value = values;
        options.push(option);
      });
      const emptyItem = options.find(item => item.value.length == 0);
      // 多选不能为空
      if (emptyItem) {
        addNotification({
          message: 'At least one value should be selected for each option.',
          level: 'error',
          autoDismiss: 2
        });
      } else {
        // 如果价格有更改 先保存
        if (!saveDisable) {
          await that.savePrice();
        }
        const data = await that.managerOption(options);
        if (data) {
          // 关闭弹窗
          boundGlobalActions.hideModal(localModalTypes.MANAGER_OPTIONS_MODAL);
          await that.refreshPageData(rack_spu_id);
          addNotification({
            message: t('SETTINGS_LOGOBRNDING_SAVE_SUCCESS_TOAST', 'Changes successfully saved.'),
            level: 'success',
            autoDismiss: 2
          });
          that.setState({
            saveDisable: true
          });
        }
      }
      window.logEvent.addPageEvent({
        name: 'Estore_Products_CustomizeSPUManageOptionsPop_Click_Confirm'
      });
    }
  });
  window.logEvent.addPageEvent({
    name: 'Estore_Products_CustomizeSPU_Click_ManageOptions'
  });
};

const showAppluBulkMarkupModal = that => {
  const { boundGlobalActions } = that.props;
  const { rack_spu_id, rackSpuDetail } = that.state;
  const { showModal, addNotification } = boundGlobalActions;
  showModal(localModalTypes.APPLY_BULK_MARKUP_MODAL, {
    title: 'Apply Bulk Markup',
    close: () => {
      // 关闭弹窗
      boundGlobalActions.hideModal(localModalTypes.APPLY_BULK_MARKUP_MODAL);
      window.logEvent.addPageEvent({
        name: 'Estore_Products_CustomizeSPUApplyBulkMarkupPop_Click_Cancel'
      });
    },
    confirm: async e => {
      const param = {
        type: 'PERCENT',
        param: {
          percent: e.inputValue,
          rounding_type: e.currentRoundPrice
        }
      };
      const data = await that.applyMarkup(param);
      if (data) {
        // 关闭弹窗
        boundGlobalActions.hideModal(localModalTypes.APPLY_BULK_MARKUP_MODAL);
        await that.refreshPageData(rack_spu_id);
        addNotification({
          message: t('SETTINGS_LOGOBRNDING_SAVE_SUCCESS_TOAST', 'Changes successfully saved.'),
          level: 'success',
          autoDismiss: 2
        });
        that.setState({
          saveDisable: true
        });
      }
      const standard_spu_id = String(rackSpuDetail.spu_uuid)
        .split('_')
        .slice(1)
        .join('_');
      window.logEvent.addPageEvent({
        name: 'Estore_Products_CustomizeSPUApplyBulkMarkupPop_Click_Confirm',
        standard_spu_id,
        markup_percent: e.inputValue + '%',
        rounding: e.label
      });
    }
  });
  window.logEvent.addPageEvent({
    name: 'Estore_Products_CustomizeSPU_Click_ApplyBulkMarkup'
  });
};

/**
 * 更新Product uuid
 * @param {*} that
 * @param {*} e
 */
const onChangeUuid = (that, e) => {
  const { value, label } = e;
  const { boundGlobalActions, estoreInfo } = that.props;
  const { rackSpuDetail, rack_spu_id } = that.state;
  const { category_name, spu_uuid } = rackSpuDetail;
  const { hideConfirm, showConfirm, addNotification } = boundGlobalActions;
  // 当前产品不做切换
  if (spu_uuid == value) return;
  const store_id = estoreInfo.id;
  const message = ` Are you sure you want to use “${label}“ from the lab to serve as “${category_name}" in your store?`;

  const closeCustomizeSPUProductFromTheLabPop = () => {
    window.logEvent.addPageEvent({
      name: 'Estore_Products_CustomizeSPUProductFromTheLabPop_Click_Cancel'
    });
    hideConfirm();
  };
  const data = {
    close: closeCustomizeSPUProductFromTheLabPop,
    message: (
      <div style={{ fontSize: 14, textAlign: 'left' }}>
        {message} <br />
        <br /> *Please note that new product options and pricing will replace the current.
      </div>
    ),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: closeCustomizeSPUProductFromTheLabPop
      },
      {
        className: 'pwa-btn',
        text: 'Confirm',
        onClick: async () => {
          const data = await that.changeCarrierSupplierSpu(rack_spu_id, store_id, value);
          if (data) {
            await that.refreshPageData(rack_spu_id);
            addNotification({
              message: t('SETTINGS_LOGOBRNDING_SAVE_SUCCESS_TOAST', 'Changes successfully saved.'),
              level: 'success',
              autoDismiss: 3
            });
            that.setState({
              saveDisable: true
            });
          }
          window.logEvent.addPageEvent({
            name: 'Estore_Products_CustomizeSPUProductFromTheLabPop_Click_Continue',
            supplier_spu_id: value
          });
        }
      }
    ]
  };
  showConfirm(data);
  const standard_spu_id = String(rackSpuDetail.spu_uuid)
    .split('_')
    .slice(1)
    .join('_');
  window.logEvent.addPageEvent({
    name: 'Estore_Products_CustomizeSPU_Click_ProductFromTheLab',
    standard_spu_id
  });
};

const onBack = that => {
  const { boundGlobalActions, history } = that.props;
  const { saveDisable, rack_id, rack_name } = that.state;
  const { hideConfirm, showConfirm } = boundGlobalActions;
  if (!saveDisable) {
    const data = {
      close: hideConfirm,
      message: (
        <div style={{ fontSize: 14 }}>
          {t(
            'LEAVE_TIPS',
            'If you leave this page, all unsaved change will be lost. Are you sure?'
          )}
        </div>
      ),
      buttons: [
        {
          className: 'white pwa-btn',
          text: t('CANCEL'),
          onClick: () => {
            hideConfirm();
          }
        },
        {
          className: 'pwa-btn',
          text: 'Leave',
          onClick: () => {
            hideConfirm();
            history.goBack();
          }
        }
      ]
    };
    showConfirm(data);
  } else {
    // history.goBack页面缓存问题
    // 在price页面保存数据并提示priceSheet列表需要刷新时，products页面刷新数据

    const refreshFlag = appActionsService.getDataValueByKey(
      appActionNamesEnum.SAVE_DATA,
      appActionModuleNamesEnum.PRODUCTS_PRICING,
      'priceListPageWillRefreshData'
    );
    if (refreshFlag) {
      appActionsService.switchDataValueByKey(
        appActionNamesEnum.SAVE_DATA,
        appActionModuleNamesEnum.PRODUCTS_PRICING,
        'priceListPageWillRefreshData'
      );
      // 重新获取price-sheet列表
      history.replace(`/software/e-store/products?rack_id=${rack_id}&rack_name=${rack_name}`);
    } else {
      // 回退页面走缓存
      history.goBack();
    }
  }
  window.logEvent.addPageEvent({
    name: 'Estore_Products_CustomizeSPU_Click_Back'
  });
};

const onSave = async that => {
  const { boundGlobalActions } = that.props;
  const { addNotification } = boundGlobalActions;
  const data = await that.savePrice();
  if (data) {
    addNotification({
      message: 'Successfully saved.',
      level: 'success',
      autoDismiss: 2
    });
    that.setState({
      saveDisable: true
    });

    // 添加标记
    appActionsService.add(appActionNamesEnum.SAVE_DATA, appActionModuleNamesEnum.PRODUCTS_PRICING, {
      priceListPageWillRefreshData: true,
      productPageWillRefreshData: true
    });
  }
  window.logEvent.addPageEvent({
    name: 'Estore_Products_CustomizeSPU_Click_Save'
  });
};

const showCollaspeAllModal = that => {
  const { isAllOpened } = that.state;
  window.logEvent.addPageEvent({
    name: isAllOpened
      ? 'Estore_Products_CustomizeSPU_Click_CollaspeAll'
      : 'Estore_Products_CustomizeSPU_Click_ExpandAll'
  });
  that.setState({
    isAllOpened: !isAllOpened
  });
};

export default {
  onBack,
  onSave,
  showCollaspeAllModal,
  onChangeUuid,
  showProductInfoModal,
  showManagerOptionModal,
  showAppluBulkMarkupModal
};
