import React, { useEffect, useRef, useState } from 'react';

import { formatFileSize } from '@resource/lib/utils/math';

import { getRotateImageUrl } from '@apps/live-photo-client-mobile/utils/helper';
import { trimFileName } from '@apps/live-photo-client-mobile/utils/utils';

export default function page(props) {
  const {
    content_name,
    date,
    show_enc_content_id,
    imageCount,
    onCloseBtn,
    isShowContentSize,
    record,
    envUrls,
  } = props;

  const [showTip, setShowTIp] = useState(false);
  const [contentSize, setContentSize] = useState('');
  const lockRef = useRef(false);

  useEffect(() => {
    if (isShowContentSize) {
      onShowTip(showTip);
    }
  }, [isShowContentSize]);
  async function fetchImage(item) {
    lockRef.current = true;
    const baseUrl =
      !__DEVELOPMENT__ && __isCN__ ? envUrls.get('cdnBaseUrl') : envUrls.get('saasBaseUrl');
    // const baseUrl = envUrls.get('saasBaseUrl'); // dd环境调试用，上线需删除
    const enc_image_uid = item.show_enc_content_id;
    const imgUrl = getRotateImageUrl({ baseUrl, enc_image_uid, thumbnail_size: 5 });
    const fetchOptions = {
      headers: {
        'Accept-Encoding': 'identity', // Disable compression
      },
    };
    const fileImg = await fetch(imgUrl, fetchOptions).then(r => r.blob());
    lockRef.current = false;
    setContentSize(formatFileSize(fileImg.size));
  }
  function onShowTip(v) {
    if (lockRef.current) return;
    if (!showTip && !isShowContentSize && !contentSize) {
      fetchImage(record);
    } else if (isShowContentSize) {
      setContentSize(formatFileSize(record.content_size));
    }

    if (typeof v === 'boolean') {
      setShowTIp(v);
      return;
    }
    setShowTIp(!showTip);
  }
  return (
    <>
      <div className="top-bar-warp">
        <div className="image-info" onClick={onShowTip}></div>
        <div className="image-count">{imageCount}</div>
        <div className="close" onClick={onCloseBtn}></div>
      </div>
      {showTip ? (
        <div className="image-info-tip-warp" onClick={onShowTip}>
          <div className="info-text-warp">
            {contentSize && (
              <div className="text-warp">
                <div>{t('LPC_FILE_SIZE')}：</div>
                <div>{contentSize}</div>
              </div>
            )}
            {date && (
              <div className="text-warp">
                <div>{t('LPCM_FILMING_TIME')}：</div>
                <div>{date}</div>
              </div>
            )}
            <div className="text-warp">
              <div>{t('LPCM_FILE_NAME')}：</div>
              <div>{trimFileName(content_name)}</div>
            </div>
            <div className="text-warp">
              <div>{t('LPCM_IMAGE_ID')}：</div>
              <div>{trimFileName(show_enc_content_id)}</div>
            </div>
          </div>
        </div>
      ) : null}
      ;
    </>
  );
}
