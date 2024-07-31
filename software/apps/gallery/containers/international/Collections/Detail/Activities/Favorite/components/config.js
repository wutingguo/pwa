import React from 'react';
import { Link } from 'react-router-dom';

import { getImageUrl } from '@resource/lib/saas/image';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import { XIcon, XImg } from '@common/components';

import { formatDate } from '@apps/gallery/utils/helper';

const EMAIL = 'email';
const PHONE = 'phone';
const FAVORITE_LIST = 'favorite_name';

export const getDropdownList = ({
  type,
  exportFile,
  showCopyList,
  viewGallery,
  copyCollection,
  exportFilePhoto,
}) => {
  let list = [
    {
      id: 1,
      label: t('EXPORT_CSV_FILE'),
      icon: 'export',
      showInDetail: false,
      action: exportFile,
    },
    {
      id: 2,
      label: t('Download Photos'),
      icon: 'small-download',
      showInDetail: false,
      action: exportFilePhoto,
    },
    {
      id: 3,
      label: t('LIGHTROOM_COPY_LIST'),
      icon: 'copy-1',
      showInDetail: false,
      action: showCopyList,
    },
    {
      id: 4,
      label: t('VIEW_IN_GALLERY'),
      icon: 'goto',
      showInDetail: true,
      action: viewGallery,
    },
    {
      id: 5,
      label: t('COPY_TO_NEW_COLLECTION'),
      icon: 'copy',
      showInDetail: true,
      action: copyCollection,
    },
  ];
  list = list.map(item => ({
    ...item,
    label: (
      <>
        <XIcon type={item.icon} />
        {item.label}
      </>
    ),
  }));
  if (type === 'detail') {
    return list.filter(item => item.showInDetail);
  }
  return list;
};

export const formItemConfig = [
  {
    key: [EMAIL, PHONE], // 数组表示可选任意一个，根据顺序如果值存在优先显示
    label: t('CLIENT_EMAIL'),
    disabled: true,
    info: t('CLIENT_EMAIL_INFO'),
  },
  {
    key: FAVORITE_LIST,
    label: t('FAVORITE_LIST_NAME'),
    disabled: true,
  },
];

export const getTableColumns = (urls, defaultImgs, renderAction) => {
  const colums = [
    {
      title: t('EMAIL'),
      dataIndex: EMAIL,
      key: EMAIL,
      render: value => (value ? value : '-'),
    },
    {
      title: t('FAVORITE_LIST'),
      dataIndex: FAVORITE_LIST,
      key: FAVORITE_LIST,
      render(value, item) {
        const {
          guest_uid,
          enc_cover_image_uid,
          imgRot = 0,
          imgTimestamp,
          image_version,
          orientation = 1,
          submit_status,
        } = item;

        const url = enc_cover_image_uid
          ? getImageUrl({
              galleryBaseUrl: urls.get('galleryBaseUrl'),
              image_uid: enc_cover_image_uid,
              thumbnail_size: thumbnailSizeTypes.SIZE_96,
              isWaterMark: false,
              imgTimestamp: imgTimestamp || image_version,
            })
          : defaultImgs.get('defaultCoverXs');

        return (
          <div className="favorite-list-image-wrapper">
            <div className="favorite-list-image">
              <XImg src={url} imgRot={orientation} alt="" loadingIconSize="sm" />
            </div>
            <Link className="favorite-list-name" to={`favorite/${guest_uid}`}>
              {value}
            </Link>
            <div className={`favorite-status ${submit_status ? 'submitted' : ''}`}>
              {submit_status ? 'Submitted' : 'In Progress'}
            </div>
          </div>
        );
      },
    },
    {
      title: t('PHOTOS_UPPCASE_FIRST'),
      dataIndex: 'photos',
      key: 'photos',
      render(value) {
        return `${value} ${t('PHOTOS')}`;
      },
    },
    {
      title: t('CREATED'),
      dataIndex: 'created_time',
      key: 'created_time',
      render: value => formatDate(value),
    },
    {
      title: t('UPDATED'),
      dataIndex: 'updated_time',
      key: 'updated_time',
      render: value => formatDate(value),
    },
    {
      title: t('ACTIONS'),
      key: 'actions',
      width: 64,
      render: renderAction,
    },
  ];

  return colums;
};
