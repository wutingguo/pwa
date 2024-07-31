import React, { memo, useEffect, useMemo, useRef, useState } from 'react';

import { paySettingList } from '@common/servers/payWeChat';

import { XIcon } from '@common/components';

import * as localModalTypes from '@apps/gallery/constants/modalTypes';

import { ComboLine, Line, RuleLine } from '../../layout';

import './index.scss';

function Rule(props) {
  const { boundProjectActions, boundGlobalActions, settings, userInfo, envUrls, userAuth, presetState, onPresetSave } = props;
  const comboLastNode = useRef({});
  const [offline, setOffline] = useState(false);
  const [online, setOnline] = useState(false);
  useEffect(() => {
    if (settings.get('gallery_rule_type') === 0) {
      !settings.get('gallery_image_extra') && editModal();
    }
    getSetting();
  }, []);
  const editModal = () => {
    boundGlobalActions.showModal(localModalTypes.ADD_PIC_RULE, {
      ...props,
      settings,
      onPresetSave,
      onClosed: callback => {
        callback && callback();
        boundGlobalActions.hideModal(localModalTypes.ADD_PIC_RULE);
      },
    });
  };

  const comboList = settings.get('add_image_packages')
    ? settings.get('add_image_packages').toJS()
    : [{}];
  const gallery_rule_type = settings.get('gallery_rule_type');
  const initComboList = useMemo(() => {
    return comboList.sort((a, b) => a['gallery_image_num'] - b['gallery_image_num']);
  }, comboList);
  const getSetting = () => {
    paySettingList({
      baseUrl: envUrls.get('galleryBaseUrl'),
      customer_id: userInfo ? userInfo.get('uidPk') : userAuth.customerId, //预设和设置props内容不同这里做兼容
    }).then(res => {
      res && setOffline(!!res.filter(item => !item.pay_type)[0]['pay_switch']); //线下
      res && setOnline(!!res.filter(item => !!item.pay_type)[0]['pay_switch']); //微信
    });
  };
  return (
    <div className="addRule">
      <RuleLine>
        <div className="ruleTitle">加片规则</div>
        <div className="ruleContainer">
          <Line style={{ justifyContent: 'space-between' }}>
            <p className="p1">{gallery_rule_type === 0 ? '按张计费' : '套餐模式'}</p>
            <p className="p2" onClick={editModal}>
              编辑
            </p>
          </Line>
          <Line style={{ marginTop: '0.6rem', marginBottom: '0.85rem' }}>
            <p className="p3">免费选片张数</p>
            <p className="boldSize p4">{settings.get('gallery_image_num')}</p>
          </Line>
          {gallery_rule_type === 0 && (
            <div>
              <p className="p5">加片收费</p>
              <p className="p6">
                超过免费选片张数，每加片
                <span className="boldSize" style={{ marginLeft: 0 }}>
                  1
                </span>
                张 收费<span className="boldSize">{settings.get('gallery_image_extra')}</span>元
              </p>
            </div>
          )}
          {gallery_rule_type === 1 && (
            <div>
              <p className="p5" style={{ marginBottom: '0.33rem' }}>
                套餐详情
              </p>
              <div>
                {initComboList.map((item, index) => (
                  <div className="comboList" key={item.uidpk}>
                    <div
                      // style={{
                      //   marginRight: '0.63rem',
                      //   width: `${index === initComboList.length - 1 ? 'auto' : combomMax.width + 'px'
                      //     }`,
                      // }}
                      style={{
                        marginRight: '0.63rem',
                        width: '3rem',
                      }}
                      ref={comboLastNode}
                    >
                      客户加片
                      <span className="boldSize" style={{ marginLeft: 0 }}>
                        {item['gallery_image_num']}
                      </span>
                      张
                    </div>
                    <div className="comboListPrice">
                      <div> 套餐价格 ￥</div>
                      <span className="boldSize" style={{ margin: 0 }}>
                        {item['price']}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          { !presetState &&　
          <div className="payWay">
            <div className="payWayTitle">支持付款方式</div>
            <div className="payWayDesc">
              如需更改客服付款方式，可点击“
              <a target="_blank" href="/software/account?tabs=2">
                这里
              </a>
              ”
            </div>
            <div className="payWayList">
              {offline && (
                <div className="offLine">
                  <XIcon type="off-line-pay" />
                  <div>线下支付</div>
                </div>
              )}
              {online && (
                <div>
                  <XIcon type="on-line-pay" />
                  <div>微信支付</div>
                </div>
              )}
            </div>
          </div>
          }
        </div>
      </RuleLine>
    </div>
  );
}

export default memo(Rule);
