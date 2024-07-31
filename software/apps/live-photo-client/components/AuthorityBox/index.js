import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  LIVE_PHOTO_VERIFY_DEFAULT,
  LIVE_PHOTO_VERIFY_ERROR,
  LIVE_PHOTO_VERIFY_NO_WATERMARK,
  LIVE_PHOTO_VERIFY_WATERMARK,
} from '@common/constants/strings';

import { Authority } from '@common/utils/localstorage';

import { verifyKey } from '@common/servers/livePhoto';

import Empty from '@apps/live-photo-client/components/Empty';
import { SettingContext } from '@apps/live-photo-client/constants/context';
import services from '@apps/live-photo-client/services';

const auth = new Authority();

export default function AuthorityBox(props) {
  const { children, className, style } = props;
  const urls = useSelector(state => state.root?.system.env.urls);
  const broadcastAlbum = useSelector(state => state.activityInfo.get('broadcast_album'));
  const isLoadCompleted = useSelector(state => state.activityInfo.get('isLoadCompleted'));
  const search = new URLSearchParams(window.location.search);
  const enc_broadcast_id = search.get('enc_broadcast_id');
  const baseUrl = urls.get('saasBaseUrl');
  const history = useHistory();

  const [store, setStore] = useState({
    watermark: LIVE_PHOTO_VERIFY_DEFAULT,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoadCompleted) return;
    if (
      broadcastAlbum.get('album_del') === 1 ||
      broadcastAlbum.get('album_Expired') === 1 ||
      broadcastAlbum.get('album_status') === 3
    )
      return;
    init();
  }, [isLoadCompleted]);

  if (!isLoadCompleted) return;
  if (
    broadcastAlbum.get('album_del') === 1 ||
    broadcastAlbum.get('album_Expired') === 1 ||
    broadcastAlbum.get('album_status') === 3
  ) {
    return <Empty />;
  }

  async function checkPassword(value) {
    const params = {
      password: value,
      baseUrl,
      enc_broadcast_id,
    };
    const res = await services.checkAccessPassword(params);
    return res?.data;
  }
  async function init() {
    await queryVerifyKey();
    setLoading(false);
    const params = {
      enc_broadcast_id,
      baseUrl,
    };
    const res = await services.getAccessSetting(params);
    const { password_enable } = res.data || {};
    if (auth.hasCode(enc_broadcast_id)) {
      // const password = auth.getCode(enc_broadcast_id);
      // const res = await checkPassword(password);
      setLoading(true);
      return;
      // history.replace('/login');
    } else if (!auth.hasCode(enc_broadcast_id) && password_enable) {
      history.replace('/login');
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
      return;
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
    } catch (err) {
      setStore({
        watermark: LIVE_PHOTO_VERIFY_ERROR,
      });
      console.log(err);
    }
  }

  function getImageId(record) {
    const { show_enc_content_id, correct_enc_content_id } = record;
    if (store.watermark === LIVE_PHOTO_VERIFY_NO_WATERMARK) {
      return correct_enc_content_id;
    }
    return show_enc_content_id;
  }
  const actions = {
    getImageId,
  };
  return (
    <SettingContext.Provider value={{ ...store, ...actions }}>
      <div className={className} style={style}>
        {loading ? children : null}
      </div>
    </SettingContext.Provider>
  );
}
