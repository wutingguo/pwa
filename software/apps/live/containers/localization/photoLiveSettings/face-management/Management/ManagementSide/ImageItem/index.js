import cls from 'classnames';
import React, { useEffect, useState } from 'react';

import { fetchImage } from '@resource/lib/utils/image';

import liveLoading from '@common/icons/live_loading.gif';

import { getDownloadUrl, getFaceAvatarSrc } from '@apps/live/utils';

import other from '../images/other.jpg';

import { MenuListItem } from './layout';

export default function ImageItem(props) {
  const { value, item, onChange, index, baseUrl } = props;
  const [src, setSrc] = useState(liveLoading);
  //   const src =
  //   item.detail_type === 1
  //     ? getDownloadUrl({ baseUrl, enc_image_uid: item.enc_image_id })
  //     : other;
  useEffect(() => {
    getUrl();
  }, [item.enc_image_id]);
  async function getUrl() {
    if (item.detail_type === 2) {
      setSrc(other);
      return;
    }
    if (!item.enc_image_id) return;
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
      key={item.id}
      num={index}
      onClick={() => {
        onChange?.(item.detail_id);
      }}
    >
      {item.enc_image_id || item.detail_type === 2 ? (
        <div
          className={cls('image_box', {
            current: value === item.detail_id,
          })}
        >
          <img src={src} />
        </div>
      ) : (
        <div
          className={cls('text_name', {
            current: value === item.detail_id,
          })}
          title={item.full_name}
        >
          {item.full_name || 'empty'}
        </div>
      )}
      <div className="image_dec">{item.detail_type === 1 ? item.full_name : 'Unsorted'}</div>
    </MenuListItem>
  );
}
