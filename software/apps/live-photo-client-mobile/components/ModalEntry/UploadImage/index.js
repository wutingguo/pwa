import cls from 'classnames';
import React, { useRef, useState } from 'react';

import { useMessage } from '@common/hooks';

import BaseDrawer from '@apps/live-photo-client-mobile/components/BaseDrawer';
import loadingSrc from '@apps/live-photo-client-mobile/components/ModalEntry/ImageViewer/img/loading.gif';
import {
  AVATAR_SEARCH_DRAWER,
  CLAUSE_DRAWER,
} from '@apps/live-photo-client-mobile/constants/modalTypes';
import { uploadFileCombine } from '@apps/live-photo-client-mobile/servers';
import { judgeImageSuffix } from '@apps/live-photo-client-mobile/utils/utils';
import FButton from '@apps/live/components/FButton';
import Close from '@apps/live/components/Icons/IconClose';

import './index.scss';

export default function UploadImage(props) {
  const { data } = props;
  const { handleClose, baseUrl } = data.toJS();
  const [placeholder, message] = useMessage({ style: { fontSize: 24 } });
  const [readed, setReaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const isCn = __isCN__;

  const inputRef = useRef();

  function handleChange(e) {
    const { checked } = e.target;
    setReaded(checked);
    // console.log(e.target.checked);
  }

  function openClause() {
    const { boundGlobalActions } = props;
    const { showModal, hideModal } = boundGlobalActions;
    showModal(CLAUSE_DRAWER, {
      handleClose: () => {
        hideModal(CLAUSE_DRAWER);
      },
    });
  }

  function uploadImage() {
    if (!readed || loading) return;
    inputRef.current.click();
  }

  async function handleFileChange(e) {
    const files = e.target.files;
    const file = files[0];
    if (judgeImageSuffix(file)) {
      message.error(t('LIVE_AI_FACE_IMAGE_TYPE_TIP'));
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error(t('LIVE_AI_FACE_IMAGE_SIZE_TIP'));
      return;
    }
    const { boundGlobalActions } = props;
    const { showModal, hideModal } = boundGlobalActions;
    const search = new URLSearchParams(window.location.search);
    const enc_broadcast_id = search.get('enc_broadcast_id');
    const params = {
      baseUrl,
      file,
      enc_broadcast_id,
    };
    setLoading(true);
    try {
      const res = await uploadFileCombine(params);
      const { upload_result } = res;
      const { image_data } = upload_result[0];
      handleClose?.();
      setLoading(false);
      // 放在后面相当于dispatch是异步action
      showModal(AVATAR_SEARCH_DRAWER, {
        handleClose: () => {
          hideModal(AVATAR_SEARCH_DRAWER);
        },
        imageId: image_data.enc_image_id,
        baseUrl,
        imageInfo: image_data, // 当前图片信息
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  // 背景图片静态地址
  const avatarBgSrc = isCn
    ? `${baseUrl}clientassets-cunxin-saas/portal/images/pc/live/faceAvatar.png`
    : './images/faceAvatar.png';

  return (
    <BaseDrawer open>
      <div className={cls('upload_image_drawer')}>
        {loading && (
          <div className="upload_image_loading">
            <img src={loadingSrc} />
          </div>
        )}
        <Close className={cls('upload_image_close')} width={30} onClick={handleClose} />

        <div className={cls('upload_image_content')}>
          <div className={cls('upload_image_title')}>{t('LIVE_AI_FACE_RECOGNITION')}</div>
          <div className={cls('upload_image_body')}>
            <img className={cls('upload_image_avatar')} src={avatarBgSrc} />
            <div className={cls('upload_image_avatar_msg')} style={{ width: !isCn ? 450 : '' }}>
              {t('LIVE_AI_FACE_UPLOAD_TIP')}
            </div>
            <FButton
              className={cls('upload_image_btn', { disabled: !readed || loading })}
              onClick={uploadImage}
            >
              {t('LIVE_AI_FACE_UPLOAD_TIP_2')}
            </FButton>
            <div
              className={cls({
                upload_image_clause_line: isCn,
                upload_image_clause_line_us: !isCn,
              })}
            >
              <input
                id="area"
                className={cls('upload_image_clause_check')}
                type="checkbox"
                checked={readed}
                onChange={handleChange}
              />
              <label for="area" className={cls('upload_image_clause_text')}>
                {t('LIVE_AI_FACE_UPLOAD_TERMS')}
                <span className={cls('upload_image_clause_area')} onClick={openClause}>
                  {t('LIVE_AI_FACE_UPLOAD_TERMS_USE')}
                </span>
              </label>
            </div>
          </div>
        </div>
        <input
          onChange={handleFileChange}
          ref={inputRef}
          style={{ display: 'none' }}
          type="file"
          accept=".png,.jpg,.jpeg"
          // capture="camera"
        />
        {placeholder}
      </div>
    </BaseDrawer>
  );
}
