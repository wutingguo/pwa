import React, { useEffect, useState } from 'react';

import { Input } from '@resource/components/XInput';
import { RcRadioGroup } from '@resource/components/XRadio';
import Select from '@resource/components/XSelect';

import { NAME_CN_REG, NAME_REG } from '@resource/lib/constants/reg';

import loadingIcon from '@resource/static/icons/loading.gif';

import estoreService from '../../../constants/service';
import CommonModal from '../commonModal/index';

import './index.scss';

const modalField = ({ onChange, printLabList = [], params: { fulfill_type, supplier_id } }) => [
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
    label: t('PRINT_FULFILLMENT1'),
    key: 'fulfill_type',
    description:
      fulfill_type === 1 ? t('ESTORE_PRODUCT_MODAL_AUTO') : t('ESTORE_PRODUCT_MODAL_SELF'),
    component: v => (
      <RcRadioGroup
        wrapperClass="znoRadio"
        onChange={v => onChange('fulfill_type', v.target.value)}
        value={v}
        options={[
          {
            value: 1,
            label: t('AUTOMATIC_FULFILLMENT'),
          },
          {
            value: 2,
            label: t('SELF_FULFILLMENT'),
          },
        ]}
      />
    ),
  },
  {
    label: t('PRINT_LAB'),
    key: 'supplier_id',
    description:
      fulfill_type === 2 && !__isCN__
        ? supplier_id === 0
          ? t('CUSTOMIZE_PRODUCTS')
          : t('ESTORE_PRODUCT_MODAL_LABS')
        : ``,
    component: v => (
      <Select options={printLabList} value={v} onChange={v => onChange('supplier_id', v.value)} />
    ),
  },
];

const AddPriceSheetModal = props => {
  const [params, setParams] = useState({
    rack_name: '',
    fulfill_type: 1,
    supplier_id: __isCN__ ? 0 : '',
  });
  const [loading, setLoading] = useState(false);
  const [errInfo, setErrInfo] = useState({
    key: '',
    errMsg: t('CREATE_COLLECTION_ILLEGAL_TIP'),
  });
  const [printLabList, setPrintLabList] = useState([]);
  const { urls, data, boundGlobalActions } = props;
  const baseUrl = urls.get('estoreBaseUrl');
  const close = data.get('close');
  const open = data.get('open');
  const estoreInfo = data.get('estoreInfo');
  const getSheetList = data.get('getSheetList');

  useEffect(() => {
    estoreService.estoreGetFulfillType({ baseUrl, fulfill_type: params.fulfill_type }).then(res => {
      const { data = [] } = res;
      const printLabs = data.map(item => ({
        ...item,
        label: item.supplier_name,
        value: item.id,
      }));
      // TODO 添加customfulfillment
      if (params.fulfill_type === 2) {
        printLabs.push({
          currency_code: 'USD',
          label: t('CUSTOM_LAB_WITH_TIP', 'Custom'),
          sequence_no: 0,
          value: 0,
          id: 0,
          supplier_code: 'CUSTOM_LAB',
          supplier_name: __isCN__ ? '自定义厂商' : 'Custom Product',
          supported_fulfill_type: 2,
          supplier_logo: '',
        });
      }
      setPrintLabList(printLabs);
      setParams({
        ...params,
        supplier_id: data.length ? data[0].id : 0,
      });
      console.log('data: ', data);
    });
  }, [params.fulfill_type]);

  const onChange = (key, val, extraInfo = {}) => {
    const { rule, errMsg } = extraInfo;
    if (rule && (!rule.test(val) || !val || /^\s*$/.test(val))) {
      setErrInfo({
        key,
        errMsg,
      });
      return;
    }
    if (key === 'rack_name') {
      setErrInfo(null);
    }
    setParams({
      ...params,
      [key]: val,
    });
  };

  const onOk = () => {
    setLoading(true);
    const store_id = estoreInfo.get('id');
    estoreService
      .estoreAddRack({
        ...params,
        store_id,
        baseUrl,
      })
      .then(res => {
        const { ret_code, ret_msg, data } = res;
        if (ret_code === 200000) {
          getSheetList();
          close();
          open({
            rack_id: data.id,
            rack_name: data.rack_name,
            store_id,
            supplier_id: data.supplier_id,
          });
          setLoading(false);
        } else if (ret_code === 400740) {
          setLoading(false);
          setErrInfo({
            key: 'rack_name',
            errMsg: t('NAME_EXIST'),
          });
          boundGlobalActions.addNotification({
            message: t('NAME_EXIST'),
            level: 'error',
            autoDismiss: 2,
          });
        } else {
          setLoading(false);
        }
      });
    const print_fulfillment = params.fulfill_type === 1 ? 'auto' : 'self';
    const print_lab = printLabList.find(l => l.value === params.supplier_id)?.label;
    window.logEvent.addPageEvent({
      name: 'Estore_Products_AddPriceSheetPop_Click_Create',
      print_fulfillment,
      print_lab,
    });
  };

  const fieldList = modalField({ onChange, printLabList, params });
  const modalProps = {
    errInfo: errInfo || !params.rack_name,
    okText: t('CREATE'),
    onOk,
  };

  return (
    <CommonModal className="addPriceSheetModal" {...props} {...modalProps}>
      {fieldList.map(item => (
        <div className="priceSheetModalContent" key={item.key}>
          <div className="contentLabel">{item.label}</div>
          <div className="componentWrapper">{item.component(params[item.key])}</div>
          {errInfo && errInfo.key === item.key && <div className="errMsg">{errInfo.errMsg}</div>}
          {item.description && <div className="description">{item.description}</div>}
        </div>
      ))}
      {loading && (
        <div className="loading">
          <img src={loadingIcon} />
        </div>
      )}
    </CommonModal>
  );
};

export default AddPriceSheetModal;
