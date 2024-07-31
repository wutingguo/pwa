import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Authority } from '@common/utils/localstorage';

import { checkAccessPassword, getAccessSetting } from '@apps/live-photo-client-mobile/servers';
import FButton from '@apps/live/components/FButton';
import FInput from '@apps/live/components/FInput';

import cn from './imgs/icon_cn.png';
import en from './imgs/icon_en.png';

import './index.scss';

const iconSrc = __isCN__ ? cn : en;

const auth = new Authority();

export default function Login(props) {
  const { urls } = props;
  const history = useHistory();

  const [value, setValue] = useState('');
  const [isErr, setIsErr] = useState(false);
  const [info, setInfo] = useState({});

  const search = new URLSearchParams(window.location.search);
  const enc_broadcast_id = search.get('enc_broadcast_id');
  const baseUrl = urls.get('saasBaseUrl');
  useEffect(() => {
    init();
  }, [enc_broadcast_id]);

  async function init() {
    const params = {
      enc_broadcast_id,
      baseUrl,
    };
    const res = await getAccessSetting(params);
    const { password_enable } = res.data || {};
    setInfo(res.data);
    if (!password_enable) {
      history.replace('/home');
    }

    if (auth.hasCode(enc_broadcast_id)) {
      // const value = auth.getCode(enc_broadcast_id);
      // const hasSuccess = await checkPassword(value);
      // if (hasSuccess) {
      //   history.replace('/home');
      // }
      history.replace('/home');
    }
  }
  async function checkPassword(value) {
    const params = {
      password: value,
      baseUrl,
      enc_broadcast_id,
    };
    const res = await checkAccessPassword(params);
    return res.data;
  }
  async function submit() {
    const isSucess = await checkPassword(value);
    if (isSucess) {
      auth.setCode(enc_broadcast_id, value);
      history.replace('/home');
    } else {
      setIsErr(true);
    }
  }
  return (
    <div className="live_photo_client">
      <div className="login_card">
        <div className="login_title">
          {/* <img src={iconSrc} className="login_icon" /> */}
          <span className="login_title_text">{t('LIVE_CLIENT_TITLE')}</span>
        </div>
        <div className="login_operator">
          <p className="login_operator_tip">{info.access_title || t('LIVE_CLIENT_PLACE_TIP')}</p>
          <FInput
            className="login_input"
            type="password"
            placeholder={info.password_input_tip || t('LIVE_CLIENT_PLACE_INPUT')}
            onChange={e => setValue(e.target.value)}
          />
          {isErr ? <p className="login_operator_err">{t('LIVE_CLIENT_PASSWORD_ERROR')}</p> : null}
        </div>
        <div className="login_btn">
          <FButton className="login_submit" size="large" onClick={submit}>
            {t('LIVE_CLIENT_ACCESS')}
          </FButton>
        </div>
      </div>
    </div>
  );
}
