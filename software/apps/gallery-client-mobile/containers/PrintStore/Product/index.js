import Immutable from 'immutable';
import QS from 'qs';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/swiper-bundle.css';

import CustomFulfillCalculator from '@resource/components/CustomFulfillCalculator';
import Calculate from '@resource/components/esNewCalculator';

import { getQs } from '@resource/lib/utils/url';

import loadingPng from '@resource/static/icons/loading2.gif';

import estoreService from '@apps/estore/constants/service';

import BreadCrumb from '../../../components/breadCrumb';
import useLogin from '../../../hooks/useLogin';
import digital_download from '../../../icons/digital_download_big.png';

import Price from './Price';

import './index.scss';

const Product = props => {
  const { boundProjectActions } = props;
  const [categoryList, setCategoryList] = useState([]);
  const [imgs, setImgs] = useState([]);
  const [productDetail, setProductDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [slideImg, setSlideImg] = useState(0);
  const { urls, store = Immutable.Map({}), collectionId, sets, qs } = props;
  const { id: store_id, user } = store.toJS();
  const { store_currency = {} } = user || {};
  const estoreBaseUrl = urls.get('estoreBaseUrl');
  const imgBaseUrl = urls.get('imgBaseUrl');
  const hashPath = location.hash.slice(2);
  const collectionUidUrlComponent = getQs('collection_uid') || qs.get('collection_uid');
  const collection_uid = decodeURIComponent(getQs('collection_uid'));
  const hashSearch = hashPath.split('?')[1];
  const { rack_id, spuId, store_spu_id, sheetCode, product_type } = QS.parse(hashSearch);
  const [curQSProps, setCurQSProps] = useState({
    rack_id,
    spuId,
    store_spu_id,
    sheetCode,
    product_type,
  });
  const swiper = useRef(null);
  const timer = useRef(null);
  const productRef = useRef(null);
  const cloudapiUrl = estoreBaseUrl;
  const imgPath = 'PC/saas_client_C/ProductDetail/Slider';

  const { checkIsLoginByServer, showLoginModal } = useLogin({
    boundGlobalActions: props.boundGlobalActions,
    boundProjectActions: props.boundProjectActions,
  });

  useEffect(() => {
    if (productRef.current) {
      const height = window.innerHeight;
      productRef.current.style.height = `${height - 240}px`;
    }
  }, []);

  useEffect(() => {
    if (estoreBaseUrl) {
      setLoading(true);
      estoreService
        .estoreGetRackSpuList({
          baseUrl: estoreBaseUrl,
          rack_id,
          rack_spu_status: 2,
        })
        .then(res => {
          const { data } = res;
          setCategoryList(data || []);
          if (product_type === '2' || product_type === '4') {
            estoreService
              .getRackSpuDetail({
                baseUrl: estoreBaseUrl,
                rack_spu_id: store_spu_id,
              })
              .then(res => {
                const { data } = res;
                console.log('data:@@@@@@ ', data);
                if (product_type === '2') {
                  let { spu_asset_list } = data;
                  const list = [];
                  spu_asset_list =
                    spu_asset_list &&
                    spu_asset_list.forEach(item => {
                      list.push(item.asset_uuid);
                    });
                  estoreService
                    .getImageUrls({ baseUrl: estoreBaseUrl, asset_uuids: list.join(',') })
                    .then(res => {
                      if (product_type === '2') {
                        setImgs(res);
                      }
                    });
                } else {
                  setImgs([{ storage_path: digital_download }]);
                }
                setProductDetail(data || {});
                setLoading(false);
              })
              .catch(() => {
                setLoading(false);
              });
          } else {
            estoreService
              .getSupplierSpuDetail({
                baseUrl: estoreBaseUrl,
                spu_uuid: spuId,
              })
              .then(res => {
                const { data } = res;
                setProductDetail(data || {});
                setLoading(false);
              })
              .catch(() => {
                setLoading(false);
              });
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
    boundProjectActions.getEditorEnv();
  }, [estoreBaseUrl, curQSProps, spuId, rack_id]);

  useEffect(() => {
    interval();
    return () => {
      clearInterval(timer.current);
    };
  }, [imgs.length, slideImg]);

  const interval = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (swiper.current) {
        const nextNum = slideImg + 1 >= imgs.length ? 0 : slideImg + 1;
        setSlideImg(nextNum);
        swiper.current.swiper.slideTo(nextNum);
      }
    }, 5000);
  };

  const changeSlideImg = val => {
    setSlideImg(val);
    if (swiper.current) {
      swiper.current.swiper.slideTo(val);
    }
  };
  const goEditor = async callBack => {
    let standard_spu_id = String(spuId).split('_').slice(1).join('_');
    if (product_type === '2') {
      standard_spu_id = 'CUSTOM_PRODUCT';
    } else if (product_type === '4') {
      standard_spu_id = 'DIGITAL_DOWNLOAD';
    }
    window.logEvent.addPageEvent({
      name: 'ClientEstore_Click_Make',
      standard_spu_id,
    });
    const isLogion = await checkIsLoginByServer();
    if (!isLogion) {
      showLoginModal({
        onLoginSuccess: () => {
          callBack && callBack();
        },
      });
    } else {
      callBack && callBack();
    }
  };

  const breadcrumbProps = {
    categoryList,
    history: props.history,
    urls,
    setImgs: imgs => {
      const resImgs = imgs.filter(
        item => item.section_path && item.section_path.indexOf(imgPath) !== -1
      );
      setImgs(resImgs);
    },
    setProductDetail,
    setCurQSProps,
  };
  const getPrice = data => {
    setPrice(data);
  };
  const { spu_asset_list, spu_uuid } = productDetail;
  const calculateProps = {
    rack_id,
    spuId,
    store_spu_id,
    store_id,
    sheetCode,
    supplier_code: productDetail.supplier_code,
    productName: productDetail.category_name || productDetail.spu_name,
    collectionUid: collection_uid,
    collectionUidUrlComponent,
    supplierId: productDetail.supplier_id,
    collectionId,
    cloudapiUrl,
    goEditor,
    getPrice,
    sets: sets.toJS(),
    urls,
    spu_uuid,
    product_type,
    boundGlobalActions: props.boundGlobalActions,
    boundProjectActions: props.boundProjectActions,
  };
  const priceProps = {
    currencySymbol: __isCN__ ? '¥' : store_currency?.currency_symbol,
    price,
    precision: 2,
    currency_code: store_currency ? store_currency.currency_code : '',
  };
  const hasProductDetail = Object.values(productDetail).length > 0;

  const makeComplate = () => {
    boundProjectActions.clearProject();
  };
  return (
    <div className="productContainer">
      <div className="breadcrumb">
        // 移动端并不需要面包屑，但是需要执行里面的方法
        <BreadCrumb {...breadcrumbProps} />
      </div>
      <div className={`loading ${loading ? 'show' : ''}`}>
        <img src={loadingPng} />
      </div>
      <div className="productDetail" ref={productRef}>
        <div
          className="productCarouselWrapper"
          onMouseEnter={() => {
            clearInterval(timer.current);
          }}
          onMouseLeave={() => {
            interval();
          }}
        >
          <div className="carousel">
            <Swiper
              ref={swiper}
              slidesPerView={1}
              navigation={true}
              modules={[Navigation, Autoplay]}
              className="image-container"
              onSlideChange={v => changeSlideImg(v.activeIndex)}
            >
              {(imgs && imgs.length) || !loading ? (
                imgs.map(item => (
                  <SwiperSlide>
                    <div className="imgWrapper">
                      <img
                        className="image"
                        width="100%"
                        src={
                          product_type == '4'
                            ? digital_download
                            : `${imgBaseUrl}${item.storage_path}`
                        }
                        // src={digital_download}
                      ></img>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <div className="imgWrapper empty"></div>
              )}
            </Swiper>
          </div>
          {product_type !== '4' && (
            <div className="imgSelect">
              {(imgs && imgs.length) || !loading ? (
                imgs.map((item, i) => (
                  <span
                    className={`thumbnailImg ${i === slideImg ? 'cur' : ''}`}
                    onClick={() => changeSlideImg(i)}
                  >
                    {/* <img
                    key={`${item.storage_path}_${i}`}
                    onClick={() => changeSlideImg(i)}
                    src={`${imgBaseUrl}${item.storage_path}`}
                  /> */}
                  </span>
                ))
              ) : (
                <div className="imgWrapper empty"></div>
              )}
            </div>
          )}
        </div>
        <div className="productDescription">
          <div className="descriptionWrapper">
            <div className="title">{productDetail.category_name || productDetail.spu_name}</div>
            <div className="price">
              {/* <span>{price}</span>
              <span className="unit"> USD</span> */}
              <Price {...priceProps} />
            </div>
            <div className="description">{productDetail.product_description}</div>
            <div className="description last">{productDetail.production_desc}</div>
          </div>
          <div className="calculateWrapper">
            {hasProductDetail && (product_type === '2' || product_type === '4') ? (
              <CustomFulfillCalculator {...calculateProps} />
            ) : null}
            {hasProductDetail && product_type === '1' && (
              <Fragment>
                <div className="title">{t('PRODUCT_OPTIONS')}</div>
                <Calculate {...calculateProps} isMobile={true} makeComplate={makeComplate} />
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
