import moment from 'moment';
import React, { memo } from 'react';
import LazyLoad from 'react-lazy-load';

import { getImageUrl } from '@resource/lib/saas/image';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import { XImg } from '@common/components';

const packageListCard = (list, history) => {
  const nav = item => {
    // history.push(`/gallery-detail/${item.enc_collection_uid}`);
  };
  return (
    <div style={{ paddingTop: '16px' }}>
      {list.reverse().map(item => {
        return (
          <div className="packageListCard" key={item.uidpk}>
            <div className="time">{moment(item.create_time).format('YYYY/MM/DD')}</div>
            <div className="middle">
              {item.agl_collection_sets.map((inner, index) => (
                <span onClick={() => nav(inner)}>
                  {index > 0 && ','}
                  {inner.set_name}
                </span>
              ))}
            </div>
            <div className="commonFlex bottom">
              <div className="commonFlex">
                <div>{item.resolution_name}</div>
                <div className="diot">.</div>
                <div>{item.email}</div>
              </div>
              {item.pin_code && <div>密码 {item.pin_code}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
const imgListCard = (list, galleryBaseUrl) => {
  return (
    <div style={{ paddingTop: '16px' }}>
      {list.map(item => {
        const { records } = item.details_vo;
        return records.map(itm => {
          return (
            <div className="commonFlex imgListCard">
              <div className="imgBox">
                <LazyLoad className="lazyload-container" once key={`lazyload-item-${itm.image_id}`}>
                  <XImg
                    src={getImageUrl({
                      galleryBaseUrl,
                      image_uid: itm['enc_image_uid'],
                      thumbnail_size: thumbnailSizeTypes.SIZE_1500,
                      // timestamp: enc_image_id ? uid : new Date().getTime(),
                    })}
                    imgRot={itm['orientation']}
                    type="background"
                  />
                </LazyLoad>
              </div>
              <div className="right">
                <div className="commonFlex title">
                  <div>{itm.resolution_name}</div>
                  <div className="diot">.</div>
                  <div>{moment(item.update_time).format('YYYY/MM/DD')}</div>
                </div>
                <div className="phone">{item.email}</div>
                {!!itm['pin_code'] && <div>密码 {itm['pin_code']}</div>}
                <div className="imgName">{itm['single_image_name']}</div>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
};

export default {
  packageListCard,
  imgListCard,
};
