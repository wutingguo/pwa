import React, { useEffect, useState } from 'react';

import { saasProducts } from '@resource/lib/constants/strings';

import { useLanguage } from '@common/components/InternationalLanguage';

import Switch from '@apps/gallery/components/Switch';
import Waring from '@apps/live/components/Icons/waring2';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import services from '@apps/live/services/photo';
import { getConfigAiFace, saveConfigAiFace } from '@apps/live/services/photoLiveSettings';
import { openPayCard } from '@apps/live/utils/index';

import TermsOfUseModal from './TermsOfUseModal';
import { Card, Container, Message } from './layout';

export default function AIMapping(props) {
  const { boundGlobalActions, urls, baseInfo, userInfo, planList } = props;
  const baseUrl = urls.get('saasBaseUrl');
  const [open, setOpen] = useState(false);
  const [openType, setOpenType] = useState(0);
  const { intl, lang } = useLanguage();

  // console.log(props);
  const [store, setStore] = useState({
    query_by_pic: false,
    auto_detect: false,
  });

  useEffect(() => {
    if (!baseInfo?.enc_broadcast_id) return;
    queryConfigInfo();
  }, [baseInfo?.enc_broadcast_id]);

  // 获取设置详细
  async function queryConfigInfo() {
    const { enc_broadcast_id } = baseInfo;
    const params = {
      baseUrl,
      enc_broadcast_id,
    };
    try {
      const res = await getConfigAiFace(params);
      const { query_by_pic, auto_detect } = res;
      setStore({
        query_by_pic,
        auto_detect,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 跳转推荐订阅计划-包年版
   */
  function openSubscription() {
    if (intl.lang === 'cn') {
      // 包年免费版item
      const liveInfoArr = planList.get(saasProducts.live)?.toJS();
      const liveInfo = liveInfoArr?.map(item => ({ ...item, isSubscribe: true })) || [];
      const annualItem = liveInfo?.[0];
      openPayCard({ boundGlobalActions, baseUrl, sliceNumber: 1, annualItem });
      boundGlobalActions.hideConfirm();
    } else if (intl.lang === 'en') {
      window.location.href =
        '/saascheckout.html?plan_id=null&product_id=SAAS_INSTANT&coupon_code=STFT2024';
    }
  }

  // 切换事件
  async function onSwitch(name, value) {
    const { uidPk } = userInfo.toJS();
    const { broadcast_id, enc_album_id } = baseInfo;
    if (value) {
      const params = {
        baseUrl,
        id: uidPk,
        scene: 4,
        enc_album_id,
      };
      const isAuth = await services.verifyAuth2(params);
      if (!isAuth) {
        boundGlobalActions.showConfirm({
          title: '',
          message: intl.tf('LP_AI_FIND_PICTURE_TIP'),
          close: boundGlobalActions.hideConfirm,
          buttons: [
            {
              onClick: openSubscription,
              text: intl.tf('LP_AI_FIND_PICTURE_BUTTON'),
            },
          ],
        });
        return;
      }
    }
    // 埋点
    if (name === 'auto_detect') {
      window.logEvent.addPageEvent({
        name: value ? 'livephoto_AI_Auto_On' : 'livephoto_AI_Auto_Off',
        broadcast_id,
      });
      // 每次开启自动人脸识别提示弹窗
      if (value) {
        handleModal(1);
        return;
      }
    } else if (name === 'query_by_pic') {
      window.logEvent.addPageEvent({
        name: value ? 'livephoto_AI_FR_On' : 'livephoto_AI_FR_Off',
        broadcast_id,
      });
    }

    // 更新状态
    const newStore = { ...store };
    newStore[name] = value;
    await updateConfig(newStore);
    setStore(newStore);
  }

  // 更新配置事件方法
  async function updateConfig(initObj = {}) {
    const params = {
      ...store,
      baseUrl,
      enc_broadcast_id: baseInfo?.enc_broadcast_id,
      ...initObj,
    };
    await saveConfigAiFace(params);
    queryConfigInfo();
  }

  function handleModal(type) {
    setOpenType(type);
    setOpen(true);
  }

  return (
    <WithHeaderComp title={intl.tf('LP_AI_FIND_PICTURE')}>
      <Container>
        <Message>
          <Waring
            width={intl.lang === 'cn' ? 14 : 32}
            className="icon"
            style={{ marginRight: 5 }}
            fill="#FFA929"
          />
          <span className="text">{intl.tf('LP_AI_FIND_PICTURE_TOP_TIP')}</span>
        </Message>
        <Card>
          <div className="title_line">
            <span className="title">{intl.tf('LP_AI_FACE')}</span>
            <span className="tip">
              <span className="tip_text">{intl.tf('LP_AI_FACE_READ_BEFORE')}</span>
              <span className="tip_clause" onClick={() => handleModal(0)}>
                {intl.tf('LP_AI_FACE_CLAUSES_NAME')}
              </span>
            </span>
          </div>
          <div className="setting_card">
            <div className="setting_item">
              <div className="setting">
                <span className="setting_item_label">{intl.tf('LP_AI_FACE_FIND_PHOTO')}</span>
                <span className="setting_item_switch">
                  <Switch
                    isShowText={false}
                    onSwitch={v => onSwitch('query_by_pic', v)}
                    checked={store.query_by_pic}
                  />
                </span>
              </div>
              <div className="setting_message">{intl.tf('LP_AI_FACE_FIND_PHOTO_DESC')}</div>
            </div>
            <div className="setting_item" style={{ marginTop: 32 }}>
              <div className="setting">
                <span className="setting_item_label">{intl.tf('LP_AI_FACE_RECOGNITION')}</span>
                <span className="setting_item_switch">
                  <Switch
                    isShowText={false}
                    onSwitch={v => onSwitch('auto_detect', v)}
                    checked={store.auto_detect}
                  />
                </span>
              </div>
              <div className="setting_message">{intl.tf('LP_AI_FACE_RECOGNITION_DESC')}</div>
            </div>
          </div>
        </Card>
        {open ? (
          <TermsOfUseModal
            title={
              openType === 0
                ? intl.tf('LP_AI_FACE_USE_CLAUSES')
                : intl.tf('LP_AI_FACE_USE_CLAUSES_AUTO')
            }
            updateConfig={updateConfig}
            open={open}
            openType={openType}
            onCancel={() => setOpen(false)}
            intl={intl}
          />
        ) : null}
      </Container>
    </WithHeaderComp>
  );
}
