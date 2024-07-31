import classNames from 'classnames';
import { fromJS } from 'immutable';
import { template } from 'lodash';
import { get } from 'lodash';
import { toArray } from 'lodash';
import React, { memo, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';

import { getLanguageCode } from '@resource/lib/utils/language';

import { SAAS_GET_WATERMARK_IMAGE_URL } from '@resource/lib/constants/apiUrl';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import estoreService from '@apps/estore/constants/service';

import { CONFIRM_MODAL } from '../../constants/modalTypes';

import AdditionalItems from './AdditionalItems';
import PriceSection from './PriceSection';
import QuantitySection from './QuantitySection';
import SkuItems from './SkuItems';
import shopCartItemConfig from './config';

import './index.scss';

const DEFAULT_COVER_IMAGE_URL = '/clientassets/portal/template-resources/images/noimage_pc.png';

// 购物车迁移
const ShoppingCartItem = ({
  cartItem,
  isSubProject = false,
  currency,
  countryCode,
  volumeDiscountProducts = [],
  className,
  // 标识当前在Shipping的ItemList中
  isShippingItem,
  removeCartItem,
  changeCartItemQuantity,
  boundGlobalActions,
  boundProjectActions,
  refetchCartNums,
}) => {
  const { urls } = useSelector(storeState => {
    return {
      urls: storeState.root.system.env.urls,
    };
  });
  const cloudapiUrl = urls && urls.get('estoreBaseUrl');

  const [immutableCartItemState, dispatch] = useReducer(
    (state, { type, payload, name }) => {
      switch (type) {
        case 'set': {
          return state.mergeDeep(payload);
        }
        case 'show': {
          const bool = !!payload;
          return state.mergeDeep({
            show: {
              [name]: bool,
            },
          });
        }
        case 'loading': {
          const bool = !!payload;
          return state.mergeDeep({
            loading: {
              [name]: bool,
            },
          });
        }
        default: {
          throw new Error();
        }
      }
    },
    fromJS({
      crossSellItems: [],
      show: {
        childItems: false,
        additionalItems: false,
      },
      loading: {
        headerIcon: false,
      },
    })
  );

  const { loading, show, crossSellItems } = useMemo(
    () => immutableCartItemState.toJS(),
    [immutableCartItemState]
  );

  const {
    std_spu_info,
    item_details,
    // 已经下架
    disabled: isPulled,
  } = cartItem;

  const productCode = get(std_spu_info, 'spu_code');
  const skuLength = get(item_details, 'length');
  let parentCategoryCode = get(std_spu_info, 'parent_category_code');
  parentCategoryCode = parentCategoryCode ? parentCategoryCode : 'CUSTOM';
  const isSelfProject = shopCartItemConfig.selfProjectCategories.includes(parentCategoryCode);
  const noAdditionalItemQuantity =
    shopCartItemConfig.noAdditionalItemQuantityCategories.includes(parentCategoryCode);
  const hasAdditionalItemRightQuantity =
    shopCartItemConfig.hasAdditionalItemRightQuantityCategories.includes(parentCategoryCode);
  const isHaveNoDescTriProject =
    shopCartItemConfig.noDescTriCategories.includes(parentCategoryCode);
  const isHasChildProjects = shopCartItemConfig.isHasChildProducts({ productCode });
  const isProjectProduct = get(item_details, '0.main_sku.item_target_type') === 1;
  const isDigital = get(item_details, '0.main_sku.digital_other_info');
  const digitalIsExisted = get(item_details, '0.main_sku.collect exist');
  const firstProjectId = get(item_details, '0.main_sku.project_id');
  const product_type = get(item_details, '0.main_sku.product_type');
  const cover_storage_path = get(item_details, '0.main_sku.cover_storage_path');
  // 禁止改变数量  1 产品下线时  2 prints
  const disableQuantityChange =
    shopCartItemConfig.disableQuantityCategories.includes(parentCategoryCode) || isPulled;

  const child_items_quantity = useMemo(() => {
    if (!item_details?.length) return 0;
    const count = item_details.reduce((preQ, cur) => {
      const curQ = cur.main_sku.quantity;
      return preQ + curQ;
    }, 0);
    return count;
  }, [item_details]);

  const handleClickRemove = useCallback(
    ({ start, done }) => {
      boundGlobalActions.showModal(CONFIRM_MODAL, {
        // title: "Info",
        message: t('REMOVE_CART_ITEM_TIP'),
        close: () => boundGlobalActions.hideModal(CONFIRM_MODAL),
        buttons: [
          {
            text: t('CANCEL'),
            className: 'confirm-btn-delete-cancel',
            style: {
              color: '#222',
              backgroundColor: '#FFF',
              border: '1px solid #222',
            },
          },
          {
            text: t('REMOVE'),
            className: 'confirm-btn-delete-confirm',
            onClick: async () => {
              start();
              window.logEvent.addPageEvent({
                name: 'ClientEstore_Cart_Click_Remove',
              });
              await removeCartItem(cartItem.cart_item_id);
              done();
            },
          },
        ],
      });
    },
    [removeCartItem, cartItem]
  );

  const handleQuantityChange = useCallback(
    async ({ value, start, done }) => {
      start();
      await changeCartItemQuantity({ cartItemId: cartItem.cart_item_id, quantity: value });
      done();
    },
    [changeCartItemQuantity, cartItem]
  );

  const onHeaderIconLoadFailed = useCallback(() => { });

  const toggleChildItems = useCallback(() => {
    dispatch({ type: 'show', name: 'childItems', payload: !show.childItems });
  }, [show]);

  const toggleAdditionalItems = useCallback(() => {
    dispatch({ type: 'show', name: 'additionalItems', payload: !show.additionalItems });
  }, [show]);

  const toggleVolumeDiscountModal = useCallback(() => { }, []);

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const imgBaseUrl = urls.get('imgBaseUrl');
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const baseUrl = urls.get('estoreBaseUrl');
    if (isDigital) {
      const imgUrl = template(SAAS_GET_WATERMARK_IMAGE_URL)({
        galleryBaseUrl,
        image_uid: cover_storage_path,
        thumbnail_size: thumbnailSizeTypes.SIZE_350,
      });
      setImageUrl(imgUrl);
    } else if (product_type === 2) {
      estoreService.getImageUrl({ baseUrl, asset_uuid: cover_storage_path }).then(res => {
        const { storage_path } = res;
        setImageUrl(imgBaseUrl + storage_path);
      });
    } else {
      let headIconSrc = loading.headerIcon
        ? DEFAULT_COVER_IMAGE_URL
        : isProjectProduct
          ? `${cloudapiUrl}cloudapi/upload_platform/cover/view?projectId=${firstProjectId}`
          : get(std_spu_info, 'thumbnail_image');
      setImageUrl(headIconSrc);
    }
  }, [JSON.stringify(cartItem)]);

  const projectTitle = get(std_spu_info, 'target_item_display_name');
  const projectDesc = isSelfProject
    ? get(std_spu_info, 'cart_item_display_name')
    : get(std_spu_info, 'spu_name');

  let foramtTotalOriginalPrice = isSubProject
    ? ''
    : `${currency['symbol']}${get(std_spu_info, 'total_unit_price')}`;
  
  const sale_price = get(std_spu_info, 'sale_price');
  const total_sale_price = get(std_spu_info, 'total_sale_price');
  const total_unit_price = get(std_spu_info, 'total_unit_price');
  // let foramtTotalSalePrice = isSubProject ? '' : `${currency['symbol']}${get(std_spu_info, 'total_sale_price')}`;
  let showDiffPrice = sale_price && Number(total_unit_price) > Number(total_sale_price);
  if (isSubProject) {
    showDiffPrice = false;
  }
  let formatUnitPrice = `${currency['symbol']}${total_unit_price}`;
  const salePriceValue = showDiffPrice ? total_sale_price : total_unit_price;
  let formatSalePriceValue = salePriceValue ? `${currency['symbol']}${salePriceValue}` : null;
  const showNormalAdditionalIcon =
    !isShippingItem && !isHaveNoDescTriProject && isSelfProject && !!get(item_details, 'length');
  const showChildProjectIcon = isHasChildProjects;

  const showVolumeDiscountButton = !isSubProject && volumeDiscountProducts.includes(productCode);

  const outContainerClass = classNames(
    {
      'shopping-cart-project-main-container': !isSubProject,
      'shopping-cart-project-subitem-container': isSubProject,
    },
    className
  );

  const childItemIconName = classNames('dropdown-icon', {
    opened: show.childItems,
  });
  const additionalItemIconName = classNames('dropdown-icon', {
    opened: show.additionalItems,
  });
  const itemCountIconName = classNames('dropdown-icon', 'count-dropdown-icon', {
    opened: show.additionalItems,
  });
  let digitalTips = '';
  if (isDigital) {
    const { digital_sku_type, digital_photo_num } = isDigital;
    if (digital_sku_type === 'FULL_GALLERY_DOWNLOAD') {
      digitalTips = 'All photos included';
    } else {
      digitalTips = `${digital_photo_num} photo(s) included`;
    }
  }

  return (
    <div className={outContainerClass}>
      <div className="shopping-cart-project-item">
        <div className="project-right-container">
          <div className="project-img-container">
            <img className="project-img" src={imageUrl} onError={onHeaderIconLoadFailed} />
          </div>
          {!isShippingItem && <div className="item-total">{t('ITEM_TOTAL')}</div>}
        </div>

        <div className="project-detail">
          {/* 右侧价格、数量、总价 部分 */}
          {/* <div className="right-section project-right-section">
            <div className="right-section-item">
              <div className="project-item-price-container">
                {this.getPriceSection()}
                {!isPulled && (
                  <PriceSection
                    {...{
                      isSubProject,
                      cartItem,
                      currency,
                      countryCode,
                      isShippingItem,
                    }}
                  />
                )}
                {showChildProjectIcon && (
                  <div className={childItemIconName} onClick={toggleChildItems}></div>
                )}
              </div>
            </div>

          </div> */}

          {/* 左侧产品 title, 描述, 添加项, 子产品描述 */}
          <div className="project-summary">
            {/* <div className="project-item-title" title={projectTitle}>
              {projectTitle}
            </div> */}
            {!!projectDesc && (
              <div className="project-item-desc-container">
                <div className="project-item-desc-container">
                  <div className="project-item-desc" title={projectDesc}>
                    {projectDesc}
                  </div>
                  {showNormalAdditionalIcon && (
                    <div className={additionalItemIconName} onClick={toggleAdditionalItems}></div>
                  )}
                </div>
                {digitalTips && <div className="cartItemTips">{digitalTips}</div>}

                {!!isPulled && !isShippingItem && (
                  <div className="project-item-disabled">
                    {product_type === 4 && !digitalIsExisted
                      ? t('DIGITAL_DISABLED_PRODUCT_TIPS')
                      : t('DISABLED_PRODUCT_TIPS')}
                  </div>
                )}

                {!isSelfProject && child_items_quantity && !isShippingItem && (
                  <div className="project-item-count">
                    <span>{t('N_ITEMS_IN_PROJECT', { n: child_items_quantity })}</span>
                    <div className={itemCountIconName} onClick={toggleAdditionalItems}></div>
                  </div>
                )}
              </div>
            )}
          </div>
          {show.additionalItems && (
            // <AdditionalItems {...{ isSubProject, currency, countryCode, cartItem }} />
            <SkuItems
              {...{
                isPulled,
                isSubProject,
                currency,
                countryCode,
                cartItem,
                isShippingItem,
                noQuantity: noAdditionalItemQuantity,
                hasRightQuantity: hasAdditionalItemRightQuantity,
              }}
            />
          )}
          <div className="right-section-item bottom-price-container">
            {isShippingItem && (
              <PriceSection
                {...{
                  isSubProject,
                  cartItem,
                  currency,
                  countryCode,
                  isShippingItem,
                }}
              />
            )}
            <QuantitySection
              {...{
                isSubProject,
                cartItem,
                isDigital,
                isShippingItem,
                disableQuantityChange,
                onRemove: handleClickRemove,
                onQuantityChange: handleQuantityChange,
                refetchCartNums,
              }}
            />
            <div className="right-section-item-total-price">
              {showDiffPrice && <div className="project-item-price origin">{formatUnitPrice}</div>}
              <div className="project-item-price">{formatSalePriceValue}</div>
              {/* {!isPulled && foramtTotalOriginalPrice}
              {} */}
            </div>
          </div>
        </div>
      </div>

      {/* {show.additionalItems && this.getRenderChildProjects()} */}

      {!isShippingItem && (
        <div className="actions-container">
          {showVolumeDiscountButton && (
            <span className="action-button" onClick={toggleVolumeDiscountModal}>
              {t('VOLUME_DISCOUNT_BUTTON_TEXT')}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(ShoppingCartItem);
