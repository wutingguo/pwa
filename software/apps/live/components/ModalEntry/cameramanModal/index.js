import React, { useRef, useState } from 'react';
import RcStep from 'react-step-wizard';

import { useLanguage } from '@common/components/InternationalLanguage';

import useMessage from '@common/hooks/useMessage';

import FModal from '@apps/live/components/FDilog';
import { addCameraman, getCameramanInfo } from '@apps/live/services/photoLiveSettings';

import SearchBox from './SearchBox';
import UserBox from './UserBox';
import { Container } from './layout';

const custom = {
  enterRight: 'your custom css transition classes',
  enterLeft: 'your custom css transition classes',
  exitRight: 'your custom css transition classes',
  exitLeft: 'your custom css transition classes',
  intro: 'your custom css transition classes',
};
export default function CameramanModal(props) {
  const { data, urls } = props;
  const { close, baseInfo, onOk } = data.toJS();
  const baseUrl = urls.get('galleryBaseUrl');
  const SW = useRef(null);
  const [placeholder, message] = useMessage();
  const [info, setInfo] = useState(null);
  const { intl, lang } = useLanguage();

  function onCancel() {
    close && close();
  }

  function onSearch(value) {
    if (!value || !value.trim()) return;
    queryInfo(value.trim());
  }

  // 查询摄影师基本信息
  async function queryInfo(phone) {
    const params = {
      baseUrl,
      phone,
    };
    try {
      const res = await getCameramanInfo(params);
      if (res === null) {
        message.error(intl.tf('LP_Not_HOTOGRAPHER_FOUND'));
        setInfo(res);
        return;
      }
      setInfo(res);
      SW.current.nextStep();
    } catch (error) {
      message.error(intl.tf('LP_PHOTOGRAPHER_VERIFY_MESSAGE'));
      console.error(error);
    }
  }

  // 添加摄影师事件
  async function addUser() {
    const { album_id } = baseInfo;
    const { phone } = info;
    const params = {
      phone_number: phone,
      album_id,
      baseUrl,
    };
    try {
      await addCameraman(params);
      onOk && onOk();
    } catch (error) {
      if (error.ret_code === 400351) {
        message.error(intl.tf('LP_Not_ADD_MYSELF'));
      }

      if (error.ret_code === 400355) {
        message.error(intl.tf('LP_Not_REPEAT_ADD_PHOTOGRAPHER'));
      }
      console.error(error);
    }
  }

  return (
    <FModal
      open
      title={intl.tf('LP_ADD_PHOTOGRAPHER')}
      titleStyle={{ fontSize: 24, textAlign: 'center' }}
      width={lang === 'cn' ? '400px' : '500px'}
      footer={null}
      onCancel={onCancel}
    >
      <RcStep transitions={custom} instance={ref => (SW.current = ref)}>
        <SearchBox onSearch={onSearch} intl={intl} lang={lang} />
        <UserBox addUser={addUser} info={info} baseInfo={baseInfo} intl={intl} />
      </RcStep>
      {placeholder}
    </FModal>
  );
}
