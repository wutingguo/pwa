import React, { useEffect, useRef, useState } from 'react';

import XButton from '@resource/components/XButton';

import { getQs } from '@resource/logevent/util/qs';
import backPng from '@resource/static/icons/handleIcon/back.png';
import loadingPng from '@resource/static/icons/loading2.gif';

import estoreService from '@apps/estore/constants/service';

import './index.scss';

const CustomPricingHeader = props => {
  const [loading, setLoading] = useState(false);
  const {
    spu_detail,
    spu_attrs,
    sku_list,
    baseUrl,
    saveStatus,
    setSaveStatus,
    boundGlobalActions,
    history,
    syncInfoAfterSave,
    effectSku,
  } = props;
  const saveDisable = useRef(saveStatus);

  useEffect(() => {
    saveDisable.current = saveStatus;
    boundGlobalActions.getEstoreInfo().then(() => {
      const beforeunload = ev => {
        console.log('saveDisable:======== ', saveDisable.current);
        if (ev && saveDisable.current) {
          ev.preventDefault();
          ev.returnValue = '';
        }
      };
      window.addEventListener('beforeunload', beforeunload);
    });
  }, [saveStatus]);

  const onSave = () => {
    let new_skuList = [];
    setLoading(true);
    console.log('sku_list:----- ', sku_list);
    if (!spu_attrs.length) {
      new_skuList = sku_list.filter(item => item.no_product_options);
    } else {
      new_skuList = sku_list.filter(item => !item.no_product_options);
      new_skuList = sku_list.reduce((res, item) => {
        const findSku = effectSku.find(
          sub => JSON.stringify(sub) === JSON.stringify(item.sku_attrs)
        );
        if (findSku) {
          res.push(item);
        }
        return res;
      }, []);
    }
    window.logEvent.addPageEvent({
      name: 'Estore_Products_CustomizeSPU_Click_Save',
    });
    estoreService
      .addCustomerSpu({
        baseUrl,
        params: {
          spu_detail,
          spu_attrs,
          sku_list: new_skuList,
        },
      })
      // 保存成功，返回 rack_spu_id
      .then(async res => {
        setSaveStatus(false);
        setLoading(false);
        boundGlobalActions.addNotification({
          message: 'Successfully saved.',
          level: 'success',
          autoDismiss: 2,
        });
        // 如果是新建的状态需要 重新定向到编辑状态的 pricing
        const __rack_spu_id = getQs('rack_spu_id');
        const __spu_uuid = getQs('spu_uuid');
        if (!__spu_uuid || !__rack_spu_id) {
          const currentSearch = location.search;
          const { spu_uuid } = await estoreService.getCustomerSpuDetail({
            baseUrl,
            rack_spu_id: res,
          });
          const url = `${currentSearch}&rack_spu_id=${res}&spu_uuid=${spu_uuid}`;
          console.log('url: ', url);
          history.push(url);
        }
        syncInfoAfterSave();
      })
      .catch(err => {
        setLoading(false);
        boundGlobalActions.addNotification({
          message: err,
          level: 'error',
          autoDismiss: 2,
        });
      });
  };

  const goBack = () => {
    const rack_id = getQs('rack_id');
    const rack_name = getQs('rack_name');
    if (saveStatus) {
      const data = {
        close: boundGlobalActions.hideConfirm,
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
              boundGlobalActions.hideConfirm();
            },
          },
          {
            className: 'pwa-btn',
            text: 'Leave',
            onClick: () => {
              saveDisable.current = false;
              boundGlobalActions.hideConfirm();
              history.goBack();
              // window.location.href = `/software/e-store/products?rack_id=${rack_id}&rack_name=${rack_name}`;
            },
          },
        ],
      };
      boundGlobalActions.showConfirm(data);
    } else {
      window.logEvent.addPageEvent({
        name: 'Estore_Products_CustomizeSPU_Click_Back',
      });
      history.goBack();
      // window.location.href = `/software/e-store/products?rack_id=${rack_id}&rack_name=${rack_name}`;
    }
  };

  return (
    <div className={`CustomPricingHeader ${loading ? 'loadingWrapper' : 'hideLoading'}`}>
      <div className="loading">
        <img src={loadingPng} />
      </div>
      <div className="back" onClick={goBack}>
        <img src={backPng} />
        Back
      </div>
      <XButton
        className="saveBtn"
        onClick={onSave}
        disabled={!saveStatus || loading}
        isWithLoading={true}
        isShowLoading={loading}
      >
        {loading ? 'Saving' : 'Save'}
      </XButton>
    </div>
  );
};

export default CustomPricingHeader;
