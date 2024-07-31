import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@resource/lib/saas/image';
import { XIcon, XImg } from '@common/components';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';
import { formatDate } from '@apps/gallery/utils/helper';
import classNames from 'classnames';

const EMAIL = 'email';
const RESOLUTION_NAME = 'resolution_name';
const PIN_CODE = 'pin_code';
const CREATE_TIME = 'create_time';
const ENC_IMAGE_UID = 'enc_image_uid';
const SINGLE_IMAGE_NAME = 'single_image_name';
const FIRST_DOWNLOAD = 'first_download';
const LAST_DOWNLOAD = 'last_download';
const DETAIL_VO = 'details_vo';
const DOWNLOAD_TIMES = 'download_times';

const COLLECTION_SETS = 'agl_collection_sets';

const getCommonColumns = () => {
  const colums = [
    {
      title: t('EMAIL'),
      dataIndex: EMAIL,
      key: EMAIL,
      render: value => (value ? value : '-')
    },
    {
      title: t('TEXT_PIN'),
      dataIndex: PIN_CODE,
      key: PIN_CODE,
      render: value => (value ? value : 'N/A')
    },
    {
      title: t('RESOLUTION'),
      dataIndex: RESOLUTION_NAME,
      key: RESOLUTION_NAME,
      render: value => (value ? value : 'original')
    },

    {
      title: t('Date_DOWNLOADED'),
      dataIndex: CREATE_TIME,
      key: CREATE_TIME,
      render: value => formatDate(value)
    }
  ];
  return colums;
};

export const getPackageDownloadColumns = actions => {
  const { handleJumpPhotoSet } = actions || {};
  const columns = getCommonColumns();
  const insertIndex = columns.findIndex(co => co.key === EMAIL);
  const insertColumns = [
    {
      title: t('PHOTO_SETS'),
      dataIndex: COLLECTION_SETS,
      key: COLLECTION_SETS,
      render(value, item) {
        return (
          <div className="download-sets-container">
            {value &&
              value.length &&
              value.map((set, index) => {
                const { is_del, collection_uid, enc_collection_uid, set_name, uidpk: setId } = set;
                const setName = is_del == 1 ? 'Set Deleted' : set_name;
                const setClassName = classNames('set-item', {
                  disabled: is_del == 1
                });
                const setUrl =
                  is_del == 1 ? '' : `/software/gallery/collection/${enc_collection_uid}/photos`;
                const separator = index < value.length - 1 ? ', ' : '';
                return (
                  <span
                    className={setClassName}
                    onClick={setUrl ? () => handleJumpPhotoSet(setUrl, collection_uid, setId) : ''}
                  >
                    {setName}
                    <span className="set-separator">{separator}</span>
                  </span>
                );
              })}
          </div>
        );
      }
    }
  ];
  columns.splice(insertIndex + 1, 0, ...insertColumns);
  return columns;
};

export const getSingleDownloadColumns = (urls, defaultImgs) => {
  const columns = [
    {
      title: t('EMAIL'),
      dataIndex: EMAIL,
      key: EMAIL,
      render: value => (value ? value : '-')
    },
    {
      title: t('DOWNLOAD_LIST'),
      dataIndex: DETAIL_VO,
      key: DETAIL_VO,
      render: (value, row) => {
        const { records } = value;
        const { enc_image_uid, email, guest_uid } = row || {};
        const { orientation = 1 } =
          records.find(item => item.enc_image_uid === enc_image_uid) || {};
        const url = enc_image_uid
          ? getImageUrl({
              galleryBaseUrl: urls.get('galleryBaseUrl'),
              image_uid: row.enc_image_uid,
              thumbnail_size: thumbnailSizeTypes.SIZE_96,
              isWaterMark: false
            })
          : defaultImgs.get('defaultCoverXs');
        return (
          <div className="download-list-image-wrapper">
            <div className="download-list-image">
              <XImg src={url} imgRot={orientation} alt="" loadingIconSize="sm" />
            </div>
            <Link className="download-list-name" to={`download/${guest_uid}`}>
              {t('MY_DOWNLOADS')}
            </Link>
          </div>
        );
      }
    },
    {
      title: t('DOWNLOAD_TIMES'),
      dataIndex: DOWNLOAD_TIMES,
      key: DOWNLOAD_TIMES,
      render: value => {
        return value ? value : '_';
      }
    },
    {
      title: t('FIRST_DOWNLOAD'),
      dataIndex: FIRST_DOWNLOAD,
      key: FIRST_DOWNLOAD,
      render: value => {
        return formatDate(value);
      }
    },
    {
      title: t('LAST_DOWNLOAD'),
      dataIndex: LAST_DOWNLOAD,
      key: LAST_DOWNLOAD,
      render: value => {
        return formatDate(value);
      }
    }
  ];
  return columns;
};

export const getSingleDownloadColumns2 = (urls, defaultImgs) => {
  const columns = getCommonColumns();
  const insertIndex = columns.findIndex(co => co.key === EMAIL);
  const insertColumns = [
    {
      title: t('PHOTO'),
      dataIndex: ENC_IMAGE_UID,
      key: ENC_IMAGE_UID,
      render(value, item) {
        const url = value
          ? getImageUrl({
              galleryBaseUrl: urls.get('galleryBaseUrl'),
              image_uid: value,
              thumbnail_size: thumbnailSizeTypes.SIZE_96,
              isWaterMark: false
            })
          : defaultImgs.get('defaultCoverXs');
        return (
          <div className="thumbnail-image">
            <XImg src={url} alt="" loadingIconSize="sm" />
          </div>
        );
      }
    },
    {
      title: t('FILENAME'),
      dataIndex: SINGLE_IMAGE_NAME,
      key: SINGLE_IMAGE_NAME,
      render: value => (value ? value : '-')
    }
  ];
  columns.splice(insertIndex + 1, 0, ...insertColumns);
  return columns;
};
