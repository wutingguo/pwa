import React, { memo, useEffect, useRef, useState } from 'react';

import { applyStatus, paySettingList, updatePaySetting } from '@common/servers/payWeChat';

import { XIcon } from '@common/components';

import Switch from '@apps/gallery/components/Switch';

import * as localModalTypes from '@src/constants/modalTypes';

import { applymentStateCode } from '../PayFormInfo/config';

import './index.scss';

const PayInfo = props => {
  const { baseUrl, boundGlobalActions, userInfo } = props;
  const [offline, setOffline] = useState(true);
  const [online, setOnline] = useState(false);
  const [authenticateUrl, setAuthenticateUrl] = useState('');
  const [applystate, setApplyState] = useState(''); //APPLYMENT_STATE_REJECTED

  const getSetting = () => {
    paySettingList({
      baseUrl,
      customer_id: userInfo.get('uidPk'),
    }).then(res => {
      res && setOffline(!!res.filter(item => !item.pay_type)[0]['pay_switch']); //线下
      res && setOnline(!!res.filter(item => !!item.pay_type)[0]['pay_switch']); //微信
    });
  };
  const updateSetting = (pay_type, pay_switch, tipObj) => {
    updatePaySetting({
      baseUrl,
      params: {
        customer_id: userInfo.get('uidPk'),
        pay_type,
        pay_switch,
      },
    }).then(res => {
      if (res.ret_code === 200000) {
        boundGlobalActions.addNotification(tipObj);
        getSetting();
      }
    });
  };
  useEffect(() => {
    getSetting();
    applyStatus({ baseUrl }).then(data => {
      if (data && data.applyment_state) {
        setApplyState(data.applyment_state);
        // setApplyState('APPLYMENT_STATE_REJECTED');
        if ([applymentStateCode[3], applymentStateCode[4]].includes(data.applyment_state)) {
          setAuthenticateUrl(data.sign_url);
        }
      }
    });
  }, []);
  // const openPayForm = () => {
  //     boundGlobalActions.showModal(localModalTypes.PAY_FORM_MODAL, {
  //         baseUrl,
  //         boundGlobalActions,
  //     });
  // }
  const onPaySwitch = (type, value) => {
    if (type === 0) {
      if (!value && !online) {
        boundGlobalActions.addNotification({
          message: '请至少保留一种支付方式',
          level: 'error',
          autoDismiss: 2,
        });
        return;
      }
      const tipObj = {
        message: !!value ? '线下支付已开启' : '线下支付已关闭',
        level: 'success',
        autoDismiss: 2,
      };
      updateSetting(0, +value, tipObj);
    } else {
      if (!value && !offline) {
        boundGlobalActions.addNotification({
          message: '请至少保留一种支付方式',
          level: 'error',
          autoDismiss: 2,
        });
        return;
      }
      if (!applystate || applystate !== applymentStateCode[6]) {
        // 当状态为空或者不是完成状态时 打开信弹窗
        onCheckApply();
        return;
      }
      const tipObj = {
        message: !!value ? '微信支付已开启' : '微信支付已关闭',
        level: 'success',
        autoDismiss: 2,
      };
      updateSetting(1, +value, tipObj);
    }
  };
  const onCheckApply = () => {
    boundGlobalActions.showModal(localModalTypes.PAY_FORM_MODAL, {
      baseUrl,
      applystate,
      authenticateUrl,
      boundGlobalActions,
      setApplyState,
    });
  };
  return (
    <div className="payInfo">
      <div className="payFlex payInfoTitle">
        <div>您期望的客户付款方式：</div>
        <div>
          {/* 没有测试环境的链接 写死成生成环境的链接 */}
          <a
            target="_blank"
            href="https://yun.cunxin.com/helpcenter/2024/06/25/%e5%a6%82%e4%bd%95%e6%ad%a3%e7%a1%ae%e9%85%8d%e7%bd%ae%e6%94%b6%e6%ac%be%e6%96%b9%e5%bc%8f/"
          >
            如何正确配置收款方式？
          </a>
        </div>
      </div>
      <div className="switchList">
        <div className="payFlex switchBox">
          <div className="payFlex switchBoxLeft">
            <XIcon type="off-line-pay" />
            <div>线下支付</div>
          </div>
          <Switch onSwitch={checked => onPaySwitch(0, checked)} checked={offline} />
        </div>
        <div className="swithDesc">
          *客户产生待支付订单时，可以选择线下付款方式，正常完成商品下单。客户线下付款后，您再手动进行后续产品交付
        </div>
      </div>
      <div className="switchList">
        <div className="payFlex switchBox">
          <div className="payFlex switchBoxLeft">
            <XIcon type="on-line-pay" />
            <div>微信支付</div>
          </div>
          {!applystate || applystate === applymentStateCode[6] ? (
            <Switch onSwitch={checked => onPaySwitch(1, checked)} checked={online} />
          ) : (
            <div className="progressBtn" onClick={onCheckApply}>
              查看进度
            </div>
          )}
        </div>
        <div className="swithDesc">
          <div>
            * 每笔客户付款微信官方将收取交易金额0.6%
            的手续费，客户付款资金将由微信直接汇入您的微信商户账号（资金不经过寸心云服）
          </div>
          <div>
            *
            您可使用超管账号登录“微信商家助手”小程序完成提现，提现金额将于T+1个工作日，入账您的结算账户（提现到账时间以微信最新政策为准）
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PayInfo);
