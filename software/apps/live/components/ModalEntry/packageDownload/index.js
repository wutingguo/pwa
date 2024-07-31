import React, { useEffect, useState } from 'react';

import XButton from '@resource/components/XButton';

import { useLanguage } from '@common/components/InternationalLanguage';

import { XModal } from '@common/components';

import { proposeDownloadPackage } from '@apps/live/services/photoLiveSettings';

import ModalContent from './ModalContent';
import { Container } from './layout';

export default function PackageDownload(props) {
  const { data, urls } = props;
  const {
    close,
    title,
    className,
    style,
    onOk,
    cancelText,
    okText,
    okCallBack,
    baseInfo,
    onError,
  } = data.toJS();
  const baseUrl = urls.get('galleryBaseUrl');
  // console.log('baseInfo', baseInfo);

  const [checkbox, setCheckbox] = useState(1);
  const { intl } = useLanguage();

  function onClicked(index, checked) {
    if (checked) {
      setCheckbox(index);
      return null;
    }
    setCheckbox(null);
  }

  async function nextClick() {
    if (checkbox === null) {
      return null;
    }
    const { enc_album_id } = baseInfo;
    const params = {
      baseUrl,
      enc_album_id: enc_album_id,
      download_content_type: Number(checkbox),
    };
    try {
      await proposeDownloadPackage(params);
      onOk && onOk();
      okCallBack && okCallBack();
    } catch (e) {
      onOk && onOk();
      onError && onError(e);
    }
  }

  function onClose(...arg) {
    close && close(...arg);
  }

  return (
    <XModal className={className} styles={style} opened={true} onClosed={() => onClose('icon')}>
      <div className="modal-title">{typeof title === 'function' ? title() : title}</div>
      <div className="modal-body">
        <ModalContent onClicked={onClicked} checkbox={checkbox} intl={intl} />
      </div>
      <div className="modal-footer">
        <XButton className="white" onClicked={onClose}>
          {cancelText || t('CANCEL')}
        </XButton>
        <XButton onClicked={nextClick}>{okText || t('CONFIRM')}</XButton>
      </div>
    </XModal>
  );
}
