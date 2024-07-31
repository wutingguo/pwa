import { fromJS } from 'immutable';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import XLoading from '@resource/components/XLoading';

import estoreService from '@apps/estore/constants/service';
import { querySetImages } from '@apps/gallery-client/services/project';
import { transformSetImages } from '@apps/gallery-client/utils/mapStateHelper';
import collectionPriceSheetService from '@apps/gallery/containers/international/Collections/Detail/Settings/Store/service';

import CategorySpuItem from '../../../components/CategorySpuItem';

import './index.scss';

const Category = ({ category, rackId, history, urls, userImages, user }) => {
  const { category_code, rack_spu_list = [], category_code: key } = category;

  const handleClick = useCallback(spu => {
    if (!spu) return;
    const { product_type } = spu;
    let standard_spu_id = spu.category_code;
    if (product_type === 2) {
      standard_spu_id = 'CUSTOM_PRODUCT';
    } else if (product_type === 4) {
      standard_spu_id = 'DIGITAL_DOWNLOAD';
    }
    window.logEvent.addPageEvent({
      name: 'ClientEstore_Click_ViewProduct',
      standard_spu_id,
    });
    history.push(
      `/printStore/products?rack_id=${rackId}&sheetCode=${category_code}&spuId=${
        spu.spu_uuid
      }&store_spu_id=${spu.id}&product_type=${spu.product_type}&product_name=${
        spu.category_name || spu.spu_name
      }`
    );
  });
  const store_currency = user?.get('store_currency');

  return (
    <div className="print-store-category" key={key}>
      <div className="print-store-category__header">
        <span className="print-store-category__header__title">{category.category_name}</span>
      </div>
      <div className="print-store-category__content">
        {rack_spu_list.map(spu => {
          return (
            !!spu && (
              <CategorySpuItem
                className="print-store-category__content__spu-item"
                imageWidth="100%"
                imageHeight="auto"
                spu={spu}
                urls={urls}
                onClickImage={() => handleClick(spu)}
                userImages={userImages}
                store_currency={store_currency}
              />
            )
          );
        })}
      </div>
    </div>
  );
};

const Categories = props => {
  const { urls, collectionUid, history, detail, store } = props;
  const galleryBaseUrl = urls.get('galleryBaseUrl') || '';
  const saasShareUrl = urls.get('saasShareUrl') || '';
  const cloudapiUrl = urls.get('estoreBaseUrl');
  const { set_uid } = detail.get('sets') ? detail.get('sets').toJS()[0] : {};
  const [userImages, setUserImages] = useState(null);
  const [state, setState] = useState({
    rackId: '',
    list: [],
    loading: true,
  });
  const user = store.get('user');

  useEffect(() => {
    if (!set_uid) return;
    getSetImages(set_uid);
  }, [set_uid]);

  // 获取图片列表
  async function getSetImages(id) {
    if (!id) return;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const params = {
      baseUrl: galleryBaseUrl,
      set_uid: id,
    };
    try {
      const res = await querySetImages(params);
      const data = transformSetImages(fromJS({ images: res }), null, urls);
      setUserImages(data.toJS());
    } catch (err) {
      setUserImages([]);
      console.log(err);
    }
  }

  const initData = useCallback(async () => {
    if (!collectionUid) return;
    setState(v => ({
      ...v,
      loading: true,
    }));
    try {
      const collectionBindPriceSheet =
        await collectionPriceSheetService.getCollectionBindPriceSheet({
          galleryBaseUrl,
          collectionId: collectionUid,
        });
      if (!collectionBindPriceSheet) {
        const e = new Error('获取到的rackId为空');
        console.error();
        throw e;
      }

      const { store_rack_id } = collectionBindPriceSheet;

      const res = await estoreService.estoreGetRackSpuList({
        baseUrl: cloudapiUrl,
        rack_id: store_rack_id,
        rack_spu_status: 2,
      });
      console.log('estoreService.estoreGetRackSpuList', res);
      if (res && res.ret_code === 200000) {
        const listOrder = ['PP', 'WA', 'Digital', 'PB', 'Other'];
        setState(v => ({
          ...v,
          rackId: store_rack_id,
          list: listOrder.reduce((r, i) => {
            // res.data
            if (!res.data) {
              return r;
            }
            const find = res.data.find(item => item.category_code === i);
            r.push(find);
            return r;
          }, []),
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setState(v => ({
        ...v,
        loading: false,
      }));
    }
  }, [cloudapiUrl, galleryBaseUrl, collectionUid]);

  useEffect(() => {
    initData();
  }, [collectionUid]);

  return (
    <div
      className="print-store-page-content-categories"
      style={{ height: window.innerHeight - 280 }}
    >
      <XLoading isShown={state.loading} isCalculate={true} size="lg" />
      {state.list.length > 0
        ? state.list.map(
            category =>
              !!category && (
                <Category
                  history={history}
                  category={category}
                  rackId={state.rackId}
                  urls={urls}
                  userImages={userImages}
                  user={user}
                />
              )
          )
        : null}
      {state.list.length === 0 && !state.loading && (
        <div className="empty"> {__isCN__ ? '无可用产品' : 'No Products Available!'} </div>
      )}
    </div>
  );
};

export default memo(Categories);
