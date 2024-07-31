import classnames from 'classnames';
import { toArray } from 'lodash';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import XSVGImageComposition from '@resource/components/XSVGImageComposition';

import { guid } from '@resource/lib/utils/math';

import estoreService from '@apps/estore/constants/service';

import digital_download from '../../../icons/digital_download.png';

import './index.scss';

const CategorySpuItem = ({
  className,
  spu,
  style = {},
  imageWidth = '330px',
  onClickImage,
  onImageLoaded,
  urls,
  userImages,
  store_currency,
}) => {
  const {
    store_spu_id,
    category_name,
    min_price,
    spu_uuid: key,
    spu_name,
    product_type,
    spu_asset_list,
  } = spu;
  const [imageUrl, setImageUrl] = useState('');

  const handleClickImage = useCallback(() => {
    onClickImage && onClickImage();
  }, [onClickImage]);

  useEffect(() => {
    const imgBaseUrl = urls.get('imgBaseUrl');
    const baseUrl = urls.get('estoreBaseUrl');
    const imgObj = toArray(spu_asset_list).find(item => item.asset_uuid) || {};
    const { asset_uuid } = imgObj;
    estoreService.getImageUrl({ baseUrl, asset_uuid }).then(res => {
      const { storage_path } = res || {};
      setImageUrl(imgBaseUrl + storage_path);
    });
  }, []);

  const imgProps = useMemo(() => {
    const _guid = guid();
    const imgBaseUrl = urls.get('imgBaseUrl');

    const imgPath = 'PC/saas_client_C/category/Profile';
    const imgSrc =
      toArray(spu.spu_asset_list).find(item => String(item.section_path).indexOf(imgPath) !== -1) ||
      {};
    const imgRelativePath = imgSrc.storage_path || '';
    const itemActions = {
      handleMouseDown: () => {},
      handleMouseOver: () => {},
      handleMouseOut: () => {},
      handleClick: () => {},
      onImageLoaded: e => {
        onImageLoaded && onImageLoaded(e);
      },
    };

    return {
      data: {
        item: {
          guid: _guid,
          url: '',
        },
        options: {},
        columnHeight: '100%',
        columnWidth: '100%',
      },
      baseUrl: urls.get('saasShareUrl'),
      userImages: userImages,
      svgSrc: `${imgBaseUrl}${imgRelativePath}`,
      actions: itemActions,
    };
  }, [store_spu_id, spu, urls, userImages]);

  const imgStyle = product_type === 4 ? { width: '100%', height: '100%' } : {};

  const clName = classnames('category-spu-item', className);
  // const { currency_symbol, currency_code } = store_currency?.toJS();
  const { currency_symbol, currency_code } = store_currency ? store_currency.toJS() : {};
  return (
    <div className={clName} style={style} key={key}>
      <div
        className="category-spu-item__image-box-container"
        style={{ width: imageWidth, height: 'auto' }}
        onClick={handleClickImage}
      >
        {userImages !== null ? (
          [2, 4].includes(product_type) ? (
            <div className="image_box">
              <div className="box_wrap" style={imgStyle}>
                {product_type === 4 ? (
                  <img src={digital_download} />
                ) : (
                  imageUrl && <img src={imageUrl} />
                )}
              </div>
            </div>
          ) : (
            <XSVGImageComposition {...imgProps} />
          )
        ) : null}
      </div>

      <div className="category-spu-item__name" title={category_name || spu_name}>
        {category_name || spu_name}
      </div>
      <div className="category-spu-item__price">
        {!__isCN__ && <span>From</span>}
        <span className="category-spu-item__price__money">{` ${
          __isCN__ ? '¥' : currency_symbol ? currency_symbol : '$'
        }${min_price} `}</span>
        {__isCN__ ? '起' : currency_code ? currency_code : 'USD'}
      </div>
    </div>
  );
};

export default memo(CategorySpuItem);
