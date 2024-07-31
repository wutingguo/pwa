import React, { memo, useEffect, useRef, useState } from 'react';

import Form, { useForm, useWatch } from '@common/components/Form';

import { XButton, XIcon } from '@common/components';

import estoreService from '@apps/estore/constants/service';

import {
  ActiveDates,
  AppliesTo,
  CouponField,
  DiscountType,
  SpecificPricesheet,
} from './components';
// import CouponField from "./components/CouponField";
import CouponInputField from './components/CouponInputField';
import { formatApiData, transFormData } from './main';

import './index.scss';

const CouponFormInfo = props => {
  const {
    closeModal,
    setIsEdit,
    isEdit,
    setLoading,
    baseUrl,
    boundGlobalActions,
    rackList,
    imgBaseUrl,
    customer_id,
    coupon_id,
    currency_symbol,
  } = props;
  const [form] = useForm();
  const [creatNewCoupon_id, setCreatNewCoupon_id] = useState(null);
  const [init_rack_id, setInit_rack_id] = useState(null);
  const [feRacks, setFeRacks] = useState([]); //前端配置的数组
  const [edRacks, setEdRacks] = useState([]); //后端返回数据的数组
  const [initRocks, setInitRocks] = useState([]);
  const formRef = useRef(null);
  const { rack_type } = useWatch(['rack_type'], form);
  useEffect(() => {
    if (coupon_id) {
      setLoading(true);
      estoreService
        .getCouponDetail({
          baseUrl,
          coupon_id,
        })
        .then(res => {
          transFormData(res.data, form, setEdRacks);
          setLoading(false);
        });
    }
  }, [coupon_id]);
  useEffect(() => {
    if (rackList && rack_type === 1) {
      const res = rackList.map((item, index) => {
        return {
          rack_id: item.id,
          sku_scope_type: index === 0 ? 0 : 1, //初始化时 第一个定为0（默认选择第一个） 其他全部定为1  (0-该货架下的所有sku 1-指定部分sku）
          spu_list: [],
        };
      });
      setFeRacks(res);
      // if (!coupon_id) {
      setInit_rack_id(res[0]?.rack_id);
      setInitRocks(res);
      // }
    }
  }, [rackList, rack_type]);
  useEffect(() => {
    // 当首次渲染
    if (feRacks.length > 0 && edRacks.length > 0) {
      const contactRes = feRacks.map(item => {
        const findItem = edRacks.find(vItem => vItem.rack_id === item.rack_id);
        if (findItem) {
          return {
            ...item,
            ...findItem,
            spu_list: findItem.spu_list.map(item => ({ ...item, rack_id: findItem.rack_id })),
          };
        }
        return { ...item, ...findItem };
      });
      setInit_rack_id(edRacks[0]['rack_id']);
      // const findsku_scope_typeItem = edRacks.find(vItem => vItem.sku_scope_type === 0);
      // if (findsku_scope_typeItem) {
      //   setInit_rack_id(findsku_scope_typeItem['rack_id']);
      // } else {
      //   setInit_rack_id(feRacks[0]?.rack_id);
      // }
      // form.setFieldsValue('racks', contactRes);
      setInitRocks(contactRes);
    }
  }, [feRacks, edRacks, rack_type]);
  async function onFinish(values) {
    const submitObj = formatApiData(values, customer_id);
    setLoading(true);
    // 当直接编辑或者新建后编辑
    if (coupon_id || creatNewCoupon_id) {
      estoreService
        .editCoupon({
          baseUrl,
          params: {
            ...submitObj,
            coupon_id: coupon_id || creatNewCoupon_id,
          },
        })
        .then(res => {
          setLoading(false);
          if (res.ret_code === 429000) {
            boundGlobalActions.addNotification({
              message: 'The coupon code has been taken.',
              level: 'error',
              autoDismiss: 3,
            });
          } else if (res.ret_code === 200000) {
            setIsEdit(false);
            boundGlobalActions.addNotification({
              message: 'Changes successfully saved.',
              level: 'success',
              autoDismiss: 3,
            });
          } else {
            boundGlobalActions.addNotification({
              message: 'Changes fail saved.',
              level: 'error',
              autoDismiss: 3,
            });
          }
        });
    } else {
      estoreService
        .addCoupon({
          baseUrl,
          params: submitObj,
        })
        .then(res => {
          if (res.ret_code === 429000) {
            boundGlobalActions.addNotification({
              message: 'The coupon code has been taken.',
              level: 'error',
              autoDismiss: 3,
            });
          } else if (res.ret_code === 200000) {
            setCreatNewCoupon_id(res.data);
            setIsEdit(false);
            boundGlobalActions.addNotification({
              message: 'Changes successfully saved.',
              level: 'success',
              autoDismiss: 3,
            });
          } else {
            boundGlobalActions.addNotification({
              message: 'Changes fail saved.',
              level: 'error',
              autoDismiss: 3,
            });
          }
          setLoading(false);
        });
    }
  }

  function handleSubmit() {
    form.submit();
  }
  const formStateChange = () => {
    setIsEdit(true);
  };
  const validitorFn = value => {
    if (!!value) {
      return /^(?!\.)([^\.]*\.?[^\.]+)$/.test(value);
    }
    return true;
  };
  return (
    <div className="CouponFormInfo">
      <div className="commonFlex header">
        <div className="commonFlex back" onClick={closeModal}>
          <XIcon type="back-2" />
          Back
        </div>
        <div className="title">Add Coupon</div>
        <XButton className="commonFlex SaveBtn" onClick={handleSubmit} disabled={!isEdit}>
          Save
        </XButton>
      </div>
      <div className="formContent">
        <Form
          ref={formRef}
          form={form}
          onFinish={onFinish}
          // wrapCol={defaultwrapCol}
          formStateChange={formStateChange}
        >
          <section>
            <div className="sectionTitle">Discount</div>
            <CouponInputField
              rules={[{ required: true, message: 'Coupon Name is required.' }]}
              name="name"
              placeholder="New Year Special"
              label="Name"
              valueFn={value => {
                if (value.length > 50) {
                  throw '';
                }
                return value;
              }}
              maxLength={50}
            />
            <CouponInputField
              rules={[
                { required: true, message: 'Coupon Code is required.' },
                { pattern: /^[A-Za-z0-9]{3,15}$/, message: '3-15 characters are suggested.' },
              ]}
              maxLength={15}
              name="code"
              placeholder="HI2024"
              label="Coupon Code"
              valueFn={value => value.toUpperCase().replace(/[^a-zA-Z0-9]/g, '')}
              desc={['This is the code your client has to enter at checkout to use this coupon.']}
            />
            <CouponField
              rules={[{ required: true, message: 'Discount Type is required.' }]}
              name="type"
              label="Discount Type"
              defaultValue={0}
            >
              <DiscountType />
            </CouponField>
            <CouponInputField
              rules={[{ required: true, message: 'Discount Amount is required.' }]}
              name="decrease_amount"
              valueFn={value => {
                if (!!value) {
                  if (value < 1 || value > 99) {
                    throw '';
                  }
                  if (value.length > 2) {
                    throw '';
                  }
                }
                return value.replace(/[^0-9]/g, '');
              }}
              ontherDom={`<div style='position:absolute;left:550px;top:10px;color:#3A3A3A;font-size:14px;'>%</div>`}
              placeholder="e.g.25"
              label="Discount Amount"
              // desc={['This is the code your client has to enter at checkout to use this coupon.']}
            />
          </section>
          <section>
            <div className="sectionTitle">Options</div>
            <CouponField
              rules={[{ required: true, message: 'Coupon Code is required.' }]}
              name="rack_type"
              label="Applies to"
              desc={[
                'Apply discount to all pricesheets or a selected pricesheet. Discount applies to all products<br/>from these pricesheets.',
              ]}
              defaultValue={0}
            >
              <AppliesTo rackList={rackList} boundGlobalActions={boundGlobalActions} />
            </CouponField>
            {rack_type === 1 && (
              <CouponField
                name="racks"
                // label="Applies to"
              >
                <SpecificPricesheet
                  boundGlobalActions={boundGlobalActions}
                  baseUrl={baseUrl}
                  rackList={rackList}
                  imgBaseUrl={imgBaseUrl}
                  init_rack_id={init_rack_id}
                  initRocks={initRocks}
                  currency_symbol={currency_symbol}
                />
              </CouponField>
            )}
            <CouponInputField
              // rules={[{ required: true, message: 'Coupon Code is required.' }]}
              name="minimum_amount"
              // type="number"
              rules={[{ validitor: validitorFn, message: 'The amount is invalid.' }]}
              valueFn={value => {
                return value.replace(/[^\d.]/g, '');
              }}
              placeholder="(Optional) e.g. 100.00"
              label="Minimum Order Amount"
              desc={[
                'Minimum order amount required for discount (taxes and shipping excluded). Leave blank<br/>to disable.',
              ]}
            />
            <ActiveDates form={form} />
          </section>
        </Form>
      </div>
    </div>
  );
};

export default memo(CouponFormInfo);
