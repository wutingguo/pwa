import React from 'react';
import { Link } from 'react-router-dom';

import { getImageUrl } from '@resource/lib/saas/image';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import { XIcon, XImg } from '@common/components';

import { formatDate } from '@apps/gallery/utils/helper';

const EMAIL = 'email';
const RESOLUTION_NAME = 'resolution_name';
const PIN_CODE = 'pin_code';
const CREATE_TIME = 'create_time';
const ENC_IMAGE_UID = 'enc_image_uid';
const SINGLE_IMAGE_NAME = 'single_image_name';

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
const getCommonColumns = () => {
  const colums = [
    {
      title: t('EMAIL'),
      dataIndex: EMAIL,
      key: EMAIL,
      render: value => (value ? value : '-'),
    },
    {
      title: t('TEXT_PIN'),
      dataIndex: PIN_CODE,
      key: PIN_CODE,
      render: value => (value ? value : 'N/A'),
    },
    {
      title: t('RESOLUTION'),
      dataIndex: RESOLUTION_NAME,
      key: RESOLUTION_NAME,
      render: value => (value ? value : 'original'),
    },

    {
      title: t('Date_DOWNLOADED'),
      dataIndex: CREATE_TIME,
      key: CREATE_TIME,
      render: value => formatDate(value),
    },
  ];
  return colums;
};

export const getTableColumns = opt => {
  const {
    galleryBaseUrl,
    defaultImgs,
    collectionId,
    showDeleteModal,
    handleJumpPhotoSet,
    handleShowMore,
  } = opt;
  const columns = getCommonColumns();
  const insertIndex = columns.findIndex(co => co.key === EMAIL);
  const insertColumns = [
    {
      title: t('PHOTO'),
      dataIndex: ENC_IMAGE_UID,
      key: ENC_IMAGE_UID,
      render(value, item) {
        const { orientation = 1 } = item;
        const url = value
          ? getImageUrl({
              galleryBaseUrl,
              image_uid: value,
              thumbnail_size: thumbnailSizeTypes.SIZE_96,
              isWaterMark: false,
            })
          : defaultImgs.get('defaultCoverXs');
        return (
          <div className="thumbnail-image">
            <XImg src={url} imgRot={orientation} alt="" loadingIconSize="sm" />
          </div>
        );
      },
    },
    {
      title: t('FILENAME'),
      dataIndex: SINGLE_IMAGE_NAME,
      key: SINGLE_IMAGE_NAME,
      render: value => (value ? value : '-'),
    },
  ];
  columns.splice(insertIndex + 1, 0, ...insertColumns);
  return columns;
};

export const getTableColumns2 = ({
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
      const id = `a${set_name}_${index}`;

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
