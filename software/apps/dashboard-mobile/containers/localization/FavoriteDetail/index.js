import { isEqual, template } from 'lodash';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import LazyLoad from 'react-lazy-load';
import { connect } from 'react-redux';

import { getImageUrl } from '@resource/lib/saas/image';
import { getUrl } from '@resource/lib/saas/image';

import { saasProducts, thumbnailSizeTypes } from '@resource/lib/constants/strings';

import { XIcon, XImg } from '@common/components';

import Dialog from '@apps/dashboard-mobile/components/vant/Dialog';
import Empty from '@apps/dashboard-mobile/components/vant/Empty';
// import List from '@apps/dashboard-mobile/components/vant/List';
import PullRefresh from '@apps/dashboard-mobile/components/vant/PullRefresh';
import Sticky from '@apps/dashboard-mobile/components/vant/Sticky';
import Toast from '@apps/dashboard-mobile/components/vant/Toast';
import mapDispatch from '@apps/dashboard-mobile/redux/selector/mapDispatch';
import mapState from '@apps/dashboard-mobile/redux/selector/mapState';

// import Tabs from '@apps/dashboard-mobile/components/vant/Tabs';
import './index.scss';

const FavoriteDetail = props => {
  const { boundProjectActions, urls, match } = props;
  const [list, setList] = useState([]);
  const [info, setInfo] = useState([]);
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const { params } = match;
  const onDelete = item => {
    Dialog.confirm({
      title: '删除收藏',
      message: '该操作不可撤销，请确认',
      onCancel: () => console.log('cancel'),
      onConfirm: () => {
        boundProjectActions
          .deleteFavoriteImg({
            collection_uid: params.id,
            enc_image_uid: item.enc_image_uid,
            favorite_uid: info.favorite_uid,
            guest_uid: params.guestUid,
          })
          .then(() => {
            onRefresh();
          });
      },
    });
  };
  const onRefresh = async () => {
    Toast.loading({ duration: 0 });
    boundProjectActions
      .getGuestFavoriteList({
        collection_uid: params.id,
        guest_uid: params.guestUid,
        businessLine: 'YX_SAAS',
        platform: 'PWA',
      })
      .then(res => {
        const { favorite_image_list } = res.data;
        setList(favorite_image_list.records);
        setInfo(res.data);
        Toast.clear();
      });
  };

  useEffect(() => {
    props.setPageHeaders(3);
    onRefresh();
  }, []);
  return (
    <div className="FavoriteDetail">
      <Sticky>
        <div className="header">
          <div className="commonFlex name">
            <div>{info.phone || info.email}</div>
            <div>{moment(info.last_modified_time).format('YYYY/MM/DD')}</div>
          </div>
          <div className="commonFlex desc">
            <div>免费选片：{list.length - info.extra_img_num}张</div>
            {!!info.extra_img_num && <div>加片：{info.extra_img_num}张</div>}
            {!!info.extra_img_num && !!info.extra_img_fee && (
              <div>加片费：¥{info.extra_img_fee}</div>
            )}
          </div>
        </div>
      </Sticky>
      {/* <PullRefresh successText="刷新成功" onRefresh={onRefresh}> */}
      <div className="listContainer">
        {list.length ? (
          list.map(item => (
            <div className="listBox" key={item.enc_image_uid}>
              <div className="imgBox">
                <LazyLoad
                  className="lazyload-container"
                  once
                  key={`lazyload-item-${item.enc_image_uid}`}
                >
                  <XImg
                    src={getImageUrl({
                      galleryBaseUrl,
                      image_uid: item.enc_image_uid,
                      thumbnail_size: thumbnailSizeTypes.SIZE_1500,
                      // timestamp: enc_image_id ? uid : new Date().getTime(),
                    })}
                    imgRot={item['orientation']}
                    type="background"
                  />
                </LazyLoad>
              </div>
              <div style={{ padding: '0 12px' }}>
                <div className="remark ellipsis" style={{ width: '330px' }}>
                  {item.comment}
                </div>
                <div className="commonFlex labelList">
                  {item.img_labels_info &&
                    item.img_labels_info.map(
                      itm => itm.mark && <div key={itm.label_id}>{itm.label_name}</div>
                    )}
                </div>
                <div className="commonFlex name">
                  <div className="ellipsis">{item.name}</div>
                  <XIcon
                    onClick={() => onDelete(item)}
                    type="delete"
                    iconWidth={12}
                    iconHeight={12}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <Empty />
        )}
      </div>

      {/* </PullRefresh> */}
    </div>
  );
};

export default memo(FavoriteDetail);
