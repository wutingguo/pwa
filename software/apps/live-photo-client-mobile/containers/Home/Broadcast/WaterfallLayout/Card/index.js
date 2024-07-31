import React from 'react';

import { isRotated } from '@resource/lib/utils/exif';

import LazyImage from '@apps/live-photo-client-mobile/components/LazyImage';
import { useSetting } from '@apps/live-photo-client-mobile/constants/context';
import { getRotateImageUrl } from '@apps/live-photo-client-mobile/utils/helper';

export default function Card(props) {
  const { index, item, envUrls, images, showImageViewer, style, total, puzzle } = props;
  const { getImageId } = useSetting();
  const baseUrl =
    !__DEVELOPMENT__ && __isCN__ ? envUrls.get('cdnBaseUrl') : envUrls.get('saasBaseUrl');
  // const baseUrl = envUrls.get('saasBaseUrl'); // dd环境调试用，上线需删除
  const enc_image_uid = getImageId(item.toJS());
  const exifOrientation = item.get('orientation');
  const src = getRotateImageUrl({ baseUrl, enc_image_uid });
  const isRotate = isRotated(exifOrientation);
  const height =
    (isRotate ? item.get('width') / item.get('height') : item.get('height') / item.get('width')) *
      style?.width -
    10;
  return (
    <div onClick={() => showImageViewer(index, images, { total })} style={{ ...style, height }}>
      <div offset={1500}>
        <LazyImage
          puzzle={puzzle}
          info={item}
          lazy={false}
          src={src}
          index={index}
          style={{ ...style, height }}
        />
      </div>
    </div>
  );
}
