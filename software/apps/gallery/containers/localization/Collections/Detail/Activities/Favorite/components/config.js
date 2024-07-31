import React from 'react';
import { Link } from 'react-router-dom';

import { getImageUrl } from '@resource/lib/saas/image';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import { XIcon, XImg } from '@common/components';

import { formatDate } from '@apps/gallery/utils/helper';

const EMAIL = 'email';
const PHONE = 'phone';
const FAVORITE_LIST = 'favorite_name';

export const getDropdownList = ({ exportFilePhoto, exportFile }) => {
  let list = [
    {
      id: 1,
      label: t('导出照片与选片记录'),
      // icon: 'export',
      showInDetail: false,
      action: exportFilePhoto,
    },
    {
      id: 2,
      label: t('仅导出选片记录'),
      // icon: 'export',
      showInDetail: false,
      action: exportFile,
    },
  ];
  list = list.map(item => ({
    ...item,
    label: (
      <>
        {item.icon && <XIcon type={item.icon} />}
        {item.label}
      </>
    ),
  }));
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

export const getTableColumns = (urls, defaultImgs, renderAction, { other_information_name }) => {
  const colums = [
    {
      title: t('EMAIL'),
      dataIndex: EMAIL,
      key: EMAIL,
      render: value => (value ? value : '-'),
    },
    {
      title: t('PHONE'),
      dataIndex: PHONE,
      key: PHONE,
      render: (value, item) => {
        const { guest_name, phone } = item;
        return (
          <div>
            {phone}
            <br />
            {guest_name}
          </div>
        );
      },
    },
    {
      title: other_information_name || '其他',
      dataIndex: 'other_information_value',
      key: 'other_information_value',
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
          </div>
        );
      },
    },
    {
      title: t('PHOTOS_UPPCASE_FIRST'),
      dataIndex: 'photos',
      key: 'photos',
      render(value, item) {
        const { extra_img_fee = 0, extra_img_num = 0, submit_status, gallery_rule_type } = item;
        if (!submit_status) {
          return <div>等待客户提交选片</div>;
        }
        if (extra_img_num && extra_img_num) {
          return (
            <div>
              <div>免费选片张数：{`${value - extra_img_num} 张照片`}</div>
              <div>加片模式：{gallery_rule_type === 0 ? '按张计费' : '套餐模式'}</div>
              <div>加片：{`${extra_img_num} 张照片`}</div>
              <div>加片费：￥{extra_img_fee}</div>
            </div>
          );
        }
        return `免费选片张数: ${value} 张${t('PHOTOS')}`;
      },
    },
    {
      title: '订单记录',
      dataIndex: 'order_history',
      key: 'order_history',
      render(value, item) {
        const { favorite_uid } = item;
        return (
          <Link style={{ color: '#0077cc' }} to={`favorite/order-detail/${favorite_uid}`}>
            客户订单详情
          </Link>
        );
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
