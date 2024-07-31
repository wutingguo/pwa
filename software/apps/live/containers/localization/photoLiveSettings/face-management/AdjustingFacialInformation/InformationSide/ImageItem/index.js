import cls from 'classnames';
import React, { useEffect, useState } from 'react';

import { fetchImage } from '@resource/lib/utils/image';

import liveLoading from '@common/icons/live_loading.gif';

import { getDownloadUrl, getFaceAvatarSrc } from '@apps/live/utils';

import { MenuListItem } from './layout';

export default function ImageItem(props) {
  const { values, item, onChange, index, baseUrl } = props;
  const [src, setSrc] = useState(liveLoading);

  useEffect(() => {
    if (!item.enc_image_id) return;
    getUrl();
  }, [item.enc_image_id]);
  async function getUrl() {
    const sourceUrl = item.enc_image_id
      ? getDownloadUrl({ baseUrl, enc_image_uid: item.enc_image_id })
      : '';
    const faceItem = {
      x: item.face_x,
      y: item.face_y,
      width: item.face_width,
      height: item.face_height,
    };
    const image = await fetchImage(sourceUrl);
    const res = await getFaceAvatarSrc({ imgInfo: image, item: faceItem });
    setSrc(res);
  }

  // console.log('src', src);

  return (
    <MenuListItem
      className={cls({
        current: values.includes(item.detail_id),
      })}
      key={item.detail_id}
      num={index}
      onClick={() => {
        onChange?.(item.detail_id);
      }}
    >
      {item.enc_image_id ? (
        <div className="image_box">
          <img src={src} />
        </div>
      ) : (
        <div className="text_name" title={item.full_name}>
          {item.full_name || 'empty'}
        </div>
      )}
    </MenuListItem>
  );
}
