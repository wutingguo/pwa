import { template } from 'lodash';
import React, { useEffect, useState } from 'react';

import { SAAS_GET_WATERMARK_IMAGE_URL } from '@resource/lib/constants/apiUrl';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import estoreService from '@apps/estore/constants/service';

const Img = ({ item, urls }) => {
  const { target_product_type, cover_storage_path, target_id } = item;
  const baseUrl = urls.get('estoreBaseUrl');
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const [imgUrl, setImgUrl] = useState('');
  useEffect(() => {
    if (target_product_type === 2) {
      const imgBaseUrl = urls.get('imgBaseUrl');
      estoreService.getImageUrl({ baseUrl, asset_uuid: cover_storage_path }).then(res => {
        const { storage_path } = res;
        setImgUrl(imgBaseUrl + storage_path);
      });
    } else if (target_product_type === 4) {
      const galleryBaseUrl = urls.get('galleryBaseUrl');
      const imgUrl = template(SAAS_GET_WATERMARK_IMAGE_URL)({
        galleryBaseUrl,
        image_uid: cover_storage_path,
        thumbnail_size: thumbnailSizeTypes.SIZE_350,
        with_exif: 1,
      });
      setImgUrl(imgUrl);
    } else {
      setImgUrl(`${cloudapiUrl}cloudapi/upload_platform/cover/view?projectId=${target_id}`);
    }
  }, [target_product_type]);
  return <img src={imgUrl} alt="" />;
};

export const renderOrderList = that => {
  const { item_detail = [], currency = {} } = that.state;
  const { urls } = that.props;
  const baseUrl = urls.get('estoreBaseUrl');
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const { symbol } = currency;
  const orderList = item_detail.map((item, index) => {
    const { quantity = 1, category_code, item_sku, cover_storage_path, imgUrl: propsImg } = item;
    let imgUrl =
      propsImg || `${baseUrl}cloudapi/upload_platform/cover/view?projectId=${item.target_id}`;
    let digitalTips = '';
    if (category_code === 'Digital') {
      const { digital_sku_type, digital_photo_num } = item_sku[0].digital_other_info;
      if (digital_sku_type === 'FULL_GALLERY_DOWNLOAD') {
        digitalTips = 'All photos included';
      } else {
        digitalTips = `${digital_photo_num} photo(s) included`;
      }
    }
    if (digitalTips) {
      imgUrl = template(SAAS_GET_WATERMARK_IMAGE_URL)({
        galleryBaseUrl,
        image_uid: cover_storage_path,
        thumbnail_size: thumbnailSizeTypes.SIZE_350,
      });
    }

    return (
      <div className="tr">
        <div className="td img_td">
          {/* <img src={imgUrl} /> */}
          <Img item={item} urls={urls}></Img>
        </div>
        <div className="center_td">
          {item.item_sku.map(sku => {
            const {
              item_price = {},
              display_name,
              sku_quantity = 1,
              sku_price,
              sku_total_price,
            } = sku;
            const { unit_price, unit_total } = item_price;
            return (
              <div className="sku_list">
                <div className="td name_td">
                  <div className="name" title={display_name}>
                    {display_name}
                  </div>
                  {digitalTips && <div className="cartItemTips">{digitalTips}</div>}
                </div>
                <div className="td normal_td">
                  {symbol}
                  {sku_price}
                </div>
                <div className="td normal_td">{sku_quantity * quantity}</div>
                <div className="td normal_td">
                  {symbol}
                  {sku_total_price}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  });
  return orderList;
};
