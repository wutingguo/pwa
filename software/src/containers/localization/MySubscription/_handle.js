import moment from 'moment';
import React, { Fragment } from 'react';

import { aiphotoDelicacyInfo, aiphotoInfoFields, soldOut } from '@resource/lib/constants/priceInfo';
import {
  aiphotoInfo,
  livePhotoInfo,
  saasProducts,
  unfiyFormatCodeToCN,
} from '@resource/lib/constants/strings';

// import { getSubscribeOrderDetail } from '@resource/pwa/services/subscription';

const getHandleRender = (isShowHandle, orderNumber, cancelOrder, continuePay) => {
  if (isShowHandle) {
    return (
      <div className="handleWrapper">
        <button className="cancel" onClick={() => cancelOrder(orderNumber)}>
          取消
        </button>
        <button className="conPay" onClick={(...arg) => continuePay(...arg)}>
          去支付
        </button>
      </div>
    );
  }
  return '-';
};

const formatPrice = price => {
  return `￥${(price && price.toFixed(2)) || '0.00'}`;
};

export const getColumns = (isLicense = true, cancelOrder, continuePay) =>
  [
    // 订阅表格
    // {
    //   title: '序号',
    //   dataIndex: 'index',
    //   key: 'index',
    //   render: (item, row, i) => i + 1
    // },
    {
      title: '下单时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 200,
      aiKey: 'createTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '订单编号',
      dataIndex: 'order_number',
      key: 'order_number',
      width: 200,
      aiKey: 'orderNumber',
    },
    {
      title: '产品',
      dataIndex: 'plan_scope',
      width: 100,
      key: 'plan_scope',
      render: (item, row) => {
        if (isLicense) {
          return unfiyFormatCodeToCN[item] || '-';
        }
        const { moduleCode } = row;
        let product_name = '';

        if (moduleCode === 'ALBUM_LIVE') {
          product_name = '照片直播';
        } else {
          product_name = '智能修图';
        }
        return product_name;
      },
    },
    {
      title: '计划',
      dataIndex: 'plan_version',
      key: 'plan_version',
      width: 100,
      aiKey: 'policyCode',
      render: item => {
        return unfiyFormatCodeToCN[item] || '-';
      },
    },
    {
      title: isLicense ? '时长' : '容量',
      dataIndex: 'unit',
      key: 'unit',
      width: 100,
      align: 'right',
      render: (item, row) => {
        if (isLicense) {
          if (item === 2) {
            return '1月';
          }
          return `${item}年`;
        }
        const { policyCode, moduleCode } = row;
        let text = '',
          curCombo,
          unit = '场';
        if (moduleCode === 'ALBUM_LIVE') {
          curCombo = livePhotoInfo.find(info => info.comboCode === policyCode);
        } else if (moduleCode === 'ALBUM_EDIT_IMAGE') {
          curCombo = aiphotoInfoFields.find(info => info.comboCode === policyCode);
        } else if (moduleCode === 'MEITU_EDIT_IMAGE') {
          if (policyCode === 'MEITU_EDIT_IMAGE_100') {
            // 精修活动（运营100张）容量100
            curCombo = { picNum: 100 };
          } else if (policyCode === 'MEITU_EDIT_IMAGE_500') {
            // 精修活动（运营500张）容量500
            curCombo = { picNum: 500 };
          } else {
            curCombo = aiphotoDelicacyInfo.find(info => info.comboCode === policyCode);
          }
          // curCombo = aiphotoDelicacyInfo.find(info => info.comboCode === policyCode);
          unit = '张';
        } else {
          curCombo = aiphotoInfo.find(info => info.comboCode === policyCode);
          unit = '张';
        }

        if (!curCombo) {
          curCombo = soldOut.find(info => info.comboCode === policyCode);
        }

        text = `${curCombo?.picNum}${unit}`;

        return text;
      },
    },
    {
      title: '订单金额',
      dataIndex: 'order_amount',
      width: 100,
      key: 'order_amount',
      aiKey: 'originalAmount',
      align: 'right',
      render: item => formatPrice(item),
    },
    {
      title: '优惠券抵扣',
      dataIndex: 'discount_amount',
      key: 'discount_amount',
      width: 100,
      aiKey: 'discountAmount',
      align: 'right',
      render: item => formatPrice(item),
    },
    {
      title: '实付金额',
      dataIndex: 'actual_amount',
      key: 'actual_amount',
      width: 100,
      aiKey: 'orderAmount',
      align: 'right',
      render: item => formatPrice(item),
    },
    {
      title: '支付方式', // 订阅 => 1：微信， 2：支付宝
      dataIndex: 'pay_type',
      width: 100,
      key: 'pay_type',
      aiKey: 'payChannel',
      render: item => {
        if (item === 1 || item === 'WEIXIN_PAY') {
          return '微信';
        } else if (item === 2 || item === 'ALI_PAY') {
          return '支付宝';
        }
        return '-';
      },
    },
    {
      title: '订单状态',
      dataIndex: 'order_status',
      key: 'order_status',
      width: 100,
      aiKey: 'orderStatus',
      render: item => {
        if (isLicense) {
          // 订阅
          if (item === 3) {
            return '待支付';
          } else if (item === 0) {
            return '支付成功';
          }
        } else {
          if (item === 0 || item === 1) {
            return '待支付';
          } else if (item === 2) {
            return '支付成功';
          }
        }
        return '已取消';
      },
    },
    {
      title: '操作',
      dataIndex: 'handle',
      fixed: 'right',
      width: 150,
      key: 'handle',
      render: (item, row) => {
        let renderHandle = '-';
        if (isLicense) {
          // 订阅 order_status = 3 展示操作
          const { order_status, order_number, plan_scope, plan_version } = row;
          renderHandle = getHandleRender(order_status === 3, order_number, cancelOrder, () =>
            continuePay(plan_scope, plan_version, order_number)
          );
        } else {
          // 修图 orderStatus = 0 || 1 展示操作
          const { orderStatus, orderNumber, policyCode, moduleCode } = row;
          const product_id = moduleCode === 'ALBUM_LIVE' ? saasProducts.live : saasProducts.aiphoto;

          renderHandle = getHandleRender(
            orderStatus === 0 || orderStatus === 1,
            orderNumber,
            cancelOrder,
            () => continuePay(product_id, policyCode, orderNumber)
          );
        }
        return renderHandle;
      },
    },
  ].reduce((res, item) => {
    if (!isLicense && item.aiKey) {
      // 修图cloumns
      res.push({
        ...item,
        dataIndex: item.aiKey,
        key: item.aiKey,
        align: item.align || 'center',
      });
    } else {
      res.push({
        ...item,
        align: item.align || 'center',
      });
    }
    return res;
  }, []);
