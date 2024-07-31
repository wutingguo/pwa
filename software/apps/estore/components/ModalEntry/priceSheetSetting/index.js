import { fromJS } from 'immutable';
import React, { useEffect, useState } from 'react';

import { Input } from '@resource/components/XInput';

import { NAME_CN_REG, NAME_REG } from '@resource/lib/constants/reg';

import estoreService from '../../../constants/service';
import CommonModal from '../commonModal/index';

import './index.scss';

const modalField = ({ onChange, updateNumber }) => [
  {
    label: t('PRICE_SHEET_NAME'),
    key: 'rack_name',
    component: v => (
      <Input
        value={v}
        max={50}
        onChange={v =>
          onChange('rack_name', v, {
            rule: __isCN__ ? NAME_CN_REG : NAME_REG,
            errMsg: t('CREATE_COLLECTION_ILLEGAL_TIP'),
          })
        }
      />
    ),
  },
  {
    label: t('PRINT_FULFILLMENT'),
    key: 'fulfillment',
    component: v => <Input disabled value={v} />,
  },
  // {
  //   label: t('MINIMUN_ORDER_AMOUNT'),
  //   key: 'minimun_order_amount',
  //   description: t('ESTORE_SHEET_PAGE_MODAL_TIP'),
  //   component: v => (
  //     <Input
  //       value={v}
  //       type="number"
  //       onBlur={updateNumber}
  //       onChange={v => onChange('minimun_order_amount', v)}
  //     />
  //   )
  // }
];

const PriceSheetSetting = props => {
  const { urls, data, boundGlobalActions } = props;
  const baseUrl = urls.get('estoreBaseUrl');
  const sheetInfo = data.get('sheetInfo') || fromJS({});
  const callback = data.get('callback');
  const close = data.get('close');

  const [params, setParams] = useState({
    rack_name: '',
    fulfillment: '',
    minimun_order_amount: '0.00',
  });
  const [errInfo, setErrInfo] = useState([]);

  useEffect(() => {
    const fulfillType = sheetInfo.get('default_fulfill_type');
    const supplier_name = sheetInfo.get('supplier_name');
    const fulfillText =
      fulfillType === 1
        ? `${supplier_name} (${t('AUTOMATIC_FULFILLMENT', 'Automatic')})`
        : `${!!supplier_name ? supplier_name : `${__isCN__ ? '手动履约' : 'Custom'}`} ${
            __isCN__ ? '' : '(Self)'
          }`;

    setParams({
      rack_name: sheetInfo.get('rack_name'),
      fulfillment: fulfillText,
      minimun_order_amount: (+sheetInfo.get('mini_mum_order_value')).toFixed(2),
    });
  }, [sheetInfo.get('id')]);

  const onChange = (key, val, extraInfo = {}) => {
    console.log('key, val: ', key, val, extraInfo);
    const { rule, errMsg } = extraInfo;
    if (rule && (!rule.test(val) || !val || /^\s*$/.test(val))) {
      const tempErrInfo = errInfo.concat({
        key,
        errMsg,
      });
      setErrInfo(tempErrInfo);
      return;
    }
    const extraErr = errInfo.filter(item => item.key !== key);
    setErrInfo(extraErr);
    setParams({
      ...params,
      [key]: val,
    });
  };

  const updateNumber = () => {
    setParams({
      ...params,
      minimun_order_amount: (+params.minimun_order_amount).toFixed(2),
    });
  };

  const onOk = () => {
    window.logEvent.addPageEvent({
      name: 'Estore_Products_SPUListSettingPop_Click_Save',
    });
    estoreService
      .estoreSaveSetting({
        baseUrl,
        rack_id: sheetInfo.get('id'),
        store_id: sheetInfo.get('store_id'),
        rack_name: params.rack_name,
        settingArray: [
          {
            setting_key: 'MINIMUM_ORDER_VALUE',
            setting_value: params.minimun_order_amount,
          },
        ],
      })
      .then(res => {
        const { ret_code } = res;
        if (ret_code === 200000) {
          if (callback && typeof callback === 'function') {
            callback(params.rack_name);
          }
          close({ noLogEvent: true });
        } else if (ret_code === 400740) {
          const tempErrInfo = errInfo.concat({
            key: 'rack_name',
            errMsg: t('NAME_EXIST'),
          });
          setErrInfo(tempErrInfo);
          boundGlobalActions.addNotification({
            message: t('NAME_EXIST'),
            level: 'error',
            autoDismiss: 2,
          });
        }
      });
  };

  const fieldList = modalField({ onChange, updateNumber });
  const modalProps = {
    errInfo: errInfo.length,
    okText: t('SAVE'),
    onOk,
  };

  return (
    <CommonModal className="priceSheetSettingModal" {...props} {...modalProps}>
      {fieldList.map(item => {
        const err = errInfo.length && errInfo.find(errItem => errItem.key === item.key);
        return (
          <div className="priceSheetSettingModalContent" key={item.key}>
            <div className="contentLabel">{item.label}</div>
            <div className="componentWrapper">{item.component(params[item.key])}</div>
            {!!err && <div className="errMsg">{err.errMsg}</div>}
            {item.description && <div className="description">{item.description}</div>}
          </div>
        );
      })}
    </CommonModal>
  );
};

export default PriceSheetSetting;
