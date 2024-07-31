import React from 'react';
import { Link } from 'react-router-dom';

import { getImageUrl } from '@resource/lib/saas/image';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import { XIcon, XImg } from '@common/components';

const memoize = f => {
  const cache = new Map();

  return function (...args) {
    let key = args.length + args.join('+');
    if (cache.has(key)) {
      return cache.get(key);
    }
    let result = f.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

const getStringPxWidth = (str, font) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  context.font = font;

  const metrics = context.measureText(str);

  return metrics.width;
};

export const getTableColumns = ({
  galleryBaseUrl,
  collectionId,
  showDeleteModal,
  handleJumpPhotoSet,
  handleShowMore,
}) => [
  {
    title: t('PHOTO'),
    dataIndex: 'photo',
    key: 'photo',
    width: '30%',
    render(value, item) {
      const { enc_image_uid, name, imgTimestamp, image_version, imgRot, orientation } = item;

      const url = getImageUrl({
        galleryBaseUrl,
        image_uid: enc_image_uid,
        thumbnail_size: thumbnailSizeTypes.SIZE_96,
        isWaterMark: false,
        imgTimestamp: imgTimestamp || image_version,
      });
      return (
        <div className="favorite-detail-list-image-wrapper">
          <div className="favorite-detail-list-image">
            <XImg src={url} imgRot={orientation} alt="" loadingIconSize="sm" />
          </div>
          <span className="favorite-detail-list-image-name" title={name}>
            {name}
          </span>
        </div>
      );
    },
  },
  {
    title: t('NOTE'),
    dataIndex: 'note',
    key: 'note',
    width: '30%',
    className: 'note-column',
    render(value, item, index) {
      const { comment, set_name } = item;
      const getPxWidth = memoize(getStringPxWidth);
      const stringWidth = getPxWidth(String(comment), `400 14px 'Gotham SSm A', 'Gotham SSm B'`);
      const isShowMore = stringWidth > 360;
      const id = `a${set_name}_${index}`.replaceAll(' ', '_');

      return (
        <div className="favorite-detail-list-comment-wrapper" id={id}>
          <div className="wrap">
            <div className="text">{comment ? comment : '---'}</div>
            {isShowMore && (
              <div className="btn" onClick={() => handleShowMore(id)}>
                more
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    title: t('PHOTO_SET'),
    dataIndex: 'set_name',
    key: 'set_name',
    width: '30%',
    render(value, item) {
      const url = `/software/gallery/collection/${collectionId}/photos`;
      const setUid = item.set_uid;
      return (
        <a
          className="favorite-detail-list-set"
          onClick={() => handleJumpPhotoSet(url, collectionId, setUid)}
        >
          {value}
        </a>
      );
    },
  },
  {
    title: t('ACTIONS'),
    key: 'actions',
    width: 70,
    render: (value, item) => {
      return <XIcon type="delete" onClick={() => showDeleteModal(item)} />;
    },
  },
];
