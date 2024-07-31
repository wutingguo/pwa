import React from 'react';
import { Link } from 'react-router-dom';
import { XIcon, XImg } from '@common/components';
import { getImageUrl } from '@resource/lib/saas/image';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

const remake = __isCN__
  ? {
      title: t('REMARK'),
      dataIndex: 'remark',
      key: 'remark',
      render(value, item) {
        return (
          <div className="favorite-detail-list-comment-wrapper">
            <span className="favorite-detail-list-comment-name" title={item.comment || ''}>
              {item.comment || '--'}
            </span>
          </div>
        );
      }
    }
  : {};

export const getTableColumns = ({
  galleryBaseUrl,
  collectionId,
  showDeleteModal,
  handleJumpPhotoSet
}) => [
  {
    title: t('PHOTO'),
    dataIndex: 'photo',
    key: 'photo',
    render(value, item) {
      const { enc_image_uid, name, imgTimestamp, image_version, imgRot, orientation } = item;

      const url = getImageUrl({
        galleryBaseUrl,
        image_uid: enc_image_uid,
        thumbnail_size: thumbnailSizeTypes.SIZE_96,
        isWaterMark: false,
        imgTimestamp: imgTimestamp || image_version
      });
      return (
        <div className="favorite-detail-list-image-wrapper">
          <div className="favorite-detail-list-image">
            <XImg src={url} imgRot={orientation} alt="" loadingIconSize="sm" />
          </div>
          <span className="favorite-detail-list-image-name">{name}</span>
        </div>
      );
    }
  },
  remake,
  {
    title: t('PHOTO_SET'),
    dataIndex: 'set_name',
    key: 'set_name',
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
    }
  },
  {
    title: t('ACTIONS'),
    key: 'actions',
    width: 70,
    render: (value, item) => {
      return <XIcon type="delete" onClick={() => showDeleteModal(item)} />;
    }
  }
];
