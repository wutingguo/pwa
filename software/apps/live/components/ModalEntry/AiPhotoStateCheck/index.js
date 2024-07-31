import React, { useEffect, useRef, useState } from 'react';

import XButton from '@resource/components/XButton';

import { XCheckBox } from '@common/components';

import FModal from '@apps/live/components/FDilog';
import { queryCorrectStatics, updateCorrectEnable } from '@apps/live/services/photoLiveSettings';
import { openPayCard } from '@apps/live/utils/index';

import { ButtonGroup, Container } from './layout';

export default function AiPhotoStateCheck(props) {
  const { data, urls, boundGlobalActions } = props;
  const { close, onOk, album_id, customer_id } = data.toJS();

  const [checkbox, setCheckbox] = useState(null);
  const [isAuth, setIsAuth] = useState(true);

  useEffect(() => {
    getAuth();
  }, []);

  function onClicked(index, checked) {
    if (checked) {
      setCheckbox(index);
      return null;
    }
    setCheckbox(null);
  }

  async function getAuth() {
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const params = {
      baseUrl: galleryBaseUrl,
      customer_id,
      album_id,
    };
    const res = await queryCorrectStatics(params);
    const { point_count } = res || {};
    if (point_count && point_count < 300) {
      setIsAuth(false);
      return;
    }
    setIsAuth(true);
  }

  async function getCorrectStatics() {
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const params = {
      baseUrl: galleryBaseUrl,
      customer_id,
      album_id,
    };
    const res = await queryCorrectStatics(params);
    let countStatus = 0;
    // point_count
    const { point_count, roll_count, method } = res;
    if (roll_count > 0 && point_count > 0) {
      countStatus = 3;
    } else if (roll_count > 0 && point_count === 0) {
      countStatus = 2;
    } else if (roll_count === 0 && point_count > 0) {
      countStatus = 1;
    }
    return {
      method,
      countStatus,
    };
  }

  function goBuy() {
    const url = urls.get('galleryBaseUrl');
    close?.();
    // 打开张数购买弹窗
    openPayCard({ boundGlobalActions, baseUrl: url }, 'aiphoto');
  }

  function updateCorrectEnableFun() {
    const galleryBaseUrl = urls.get('galleryBaseUrl');

    let correct_method = '';
    if (checkbox === 1) {
      correct_method = 'POINTS';
    } else if (checkbox === 2) {
      correct_method = 'ROLLS';
    }
    const params = {
      album_id,
      correct_enable: true,
      correct_method,
      baseUrl: galleryBaseUrl,
    };
    return updateCorrectEnable(params);
  }

  async function success() {
    if (checkbox === null) {
      close?.();
      return;
    }
    const url = urls.get('galleryBaseUrl');
    const { countStatus } = await getCorrectStatics();
    if (checkbox === 1) {
      if (countStatus === 1 || countStatus === 3) {
        // 切换为张数次模式
        await updateCorrectEnableFun();
      } else if (countStatus === 2) {
        // 打开张数购买弹窗
        openPayCard({ boundGlobalActions, baseUrl: url }, 'aiphoto');
        return;
      }
    } else if (checkbox === 2) {
      if (countStatus === 2 || countStatus === 3) {
        // 切换为场次模式
        await updateCorrectEnableFun();
      } else if (countStatus === 1) {
        // 打开场次购买弹窗
        openPayCard({ boundGlobalActions, baseUrl: url }, 'aiphotoField');
        return;
      }
    }
    onOk?.();
    close?.();
  }
  const footer = (
    <ButtonGroup>
      <XButton width={160} className="white" onClicked={close}>
        取消
      </XButton>
      <XButton width={160} onClicked={success}>
        确认
      </XButton>
    </ButtonGroup>
  );

  const radioText = (
    <>
      按张数扣费(点数不足300张，
      <a href="javascript:;" onClick={goBuy}>
        去购买
      </a>
      )
    </>
  );
  return (
    <FModal
      open
      title="如何扣取AI修图？"
      titleStyle={{ fontSize: 20, textAlign: 'center' }}
      width={'500px'}
      onCancel={close}
      footer={footer}
    >
      <Container>
        <XCheckBox
          checked={checkbox === 1}
          onClicked={({ checked }) => onClicked(1, checked)}
          style={{ marginTop: 20 }}
          text={isAuth ? '按张数扣费' : radioText}
          className={checkbox === 1 ? 'black-round-check' : 'black'}
        />
        <XCheckBox
          checked={checkbox === 2}
          onClicked={({ checked }) => onClicked(2, checked)}
          style={{ marginTop: 20 }}
          className={checkbox === 2 ? 'black-round-check' : 'black'}
          text="按场次扣费"
        />
      </Container>
    </FModal>
  );
}
