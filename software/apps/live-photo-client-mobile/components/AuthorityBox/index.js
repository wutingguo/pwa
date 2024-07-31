import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  LIVE_PHOTO_VERIFY_DEFAULT,
  LIVE_PHOTO_VERIFY_ERROR,
  LIVE_PHOTO_VERIFY_NO_WATERMARK,
  LIVE_PHOTO_VERIFY_WATERMARK,
} from '@common/constants/strings';

import { Authority } from '@common/utils/localStorage';

import { verifyKey } from '@common/servers/livePhoto';

import Empty from '@apps/live-photo-client-mobile/components/Empty';
import { SettingContext } from '@apps/live-photo-client-mobile/constants/context';
import { checkAccessPassword, getAccessSetting } from '@apps/live-photo-client-mobile/servers';

import FormModal from '../ModalEntry/FormModal';

const auth = new Authority();

export default function AuthorityBox(props) {
  const { children, className, style, hiddenLoading, handleChangeSelfieCheckInEnable } = props;
  const urls = useSelector(state => state.root?.system.env.urls);
  const broadcastAlbum = useSelector(state => state.activityInfo.get('broadcast_album'));
  const isLoadCompleted = useSelector(state => state.activityInfo.get('isLoadCompleted'));
  const formConfigVo = useSelector(state => state.activityInfo.get('form_config_vo'))?.toJS();
  const search = new URLSearchParams(window.location.search);
  const enc_broadcast_id = search.get('enc_broadcast_id');
  const baseUrl = urls.get('saasBaseUrl');
  const history = useHistory();
  const [store, setStore] = useState({
    watermark: LIVE_PHOTO_VERIFY_DEFAULT,
  });
  const [loading, setLoading] = useState(false);

  // CN-直播 登记表单弹窗显示
  const [showFormModal, setShowFormModal] = useState(false);
  // CN-直播 登记表单号，一个相册id只能登记一次
  const registerID = `${enc_broadcast_id}-register-form`;

  useEffect(() => {
    if (!isLoadCompleted) return;
    init();
  }, [isLoadCompleted]);
  if (!isLoadCompleted) return;
  if (
    (broadcastAlbum && broadcastAlbum.get('album_del') === 1) ||
    broadcastAlbum?.get('album_expired') === 1 ||
    broadcastAlbum?.get('album_status') === 3 ||
    store.watermark === LIVE_PHOTO_VERIFY_ERROR
  ) {
    return <Empty />;
  }

  async function checkPassword(value) {
    const params = {
      password: value,
      baseUrl,
      enc_broadcast_id,
    };
    const res = await checkAccessPassword(params);
    return res?.data;
  }
  async function init() {
    const watermark = await queryVerifyKey();

    const params = {
      enc_broadcast_id,
      baseUrl,
    };
    setLoading(false);
    const res = await getAccessSetting(params);
    const { password_enable, selfie_check_in_enable } = res.data || {};
    // 隐私模式传值
    handleChangeSelfieCheckInEnable(selfie_check_in_enable);
    if (auth.hasCode(enc_broadcast_id)) {
      // const password = auth.getCode(enc_broadcast_id);
      // const res = await checkPassword(password);
      const isShow = showRegisterForm(watermark);
      if (!isShow) {
        return;
      }
      setLoading(true);
      return;
      // if (res) return;
      // history.replace('/login');
    } else if (!auth.hasCode(enc_broadcast_id) && password_enable) {
      history.replace('/login');
    }

    const isShow = showRegisterForm(watermark);
    if (!isShow) {
      return;
    }
    setLoading(true);
  }

  async function queryVerifyKey() {
    const searchParams = new URLSearchParams(window.location.search);
    const key = searchParams.get('key');
    if (!key) {
      setStore({
        watermark: LIVE_PHOTO_VERIFY_WATERMARK,
      });
      return LIVE_PHOTO_VERIFY_WATERMARK;
    }
    const params = {
      key,
      baseUrl,
    };
    try {
      const res = await verifyKey(params);
      setStore({
        watermark: res ? LIVE_PHOTO_VERIFY_WATERMARK : LIVE_PHOTO_VERIFY_NO_WATERMARK,
      });
      return res ? LIVE_PHOTO_VERIFY_WATERMARK : LIVE_PHOTO_VERIFY_NO_WATERMARK;
    } catch (err) {
      setStore({
        watermark: LIVE_PHOTO_VERIFY_ERROR,
      });
      console.log(err);
      return LIVE_PHOTO_VERIFY_ERROR;
    }
  }

  function getImageId(record) {
    const { show_enc_content_id, correct_enc_content_id } = record;
    if (store.watermark === LIVE_PHOTO_VERIFY_NO_WATERMARK) {
      return correct_enc_content_id;
    }
    return show_enc_content_id;
  }

  /**
   * 营销表单展示时机
   * CN
   * 有水印
   * 访问相册
   */
  function showRegisterForm(watermark) {
    if (
      __isCN__ &&
      watermark === LIVE_PHOTO_VERIFY_WATERMARK &&
      formConfigVo?.popup_type === 1 &&
      !auth.hasCode(registerID) &&
      formConfigVo?.enabled
    ) {
      setShowFormModal(true);
      return false;
    }
    return true;
  }

  /**
   * CN-直播 登记表单提交成功
   */
  function onSuccess() {
    setShowFormModal(false);
    setLoading(true);
    hiddenLoading?.(true);
  }

  const actions = {
    getImageId,
  };
  return (
    <SettingContext.Provider value={{ ...store, ...actions }}>
      <div className={className} style={style}>
        {loading ? children : null}
        {/* CN-直播 登记表单弹窗 */}
        {showFormModal && <FormModal onSuccess={onSuccess} urls={urls} />}
      </div>
    </SettingContext.Provider>
  );
}
