import classNames from 'classnames';
import QS from 'qs';
import React, { memo, useCallback } from 'react';

import { guid } from '@resource/lib/utils/math';
import { getQs } from '@resource/lib/utils/url';

import deleteIcon from '@resource/static/icons/handleIcon/delet.png';
import hiddenIcon from '@resource/static/icons/handleIcon/hidden.png';
import showIcon from '@resource/static/icons/handleIcon/show.png';

import AlertTip from '@common/components/AlertTip';

import { XDropdown, XIcon } from '@common/components';

import AddCustomProduct from '@apps/estore/components/products/components/addCustomProduct';

import photo_download from '../../icons/digital_download.png';
import XImgBox from '../ImageBox';

import './index.scss';

const getDropdownProps = props => {
  const { hideProduct, id, display, subItem, deleteProduct } = props;
  const { product_type } = subItem;
  const dropdownList = [
    {
      type: 'hide_product',
      label: (
        <span className="hide_product">
          <img src={!display ? showIcon : hiddenIcon} />
          {!display ? t('SHOW_PRODUCT') : t('HIDE_PRODUCT')}
        </span>
      ),
      action: () => hideProduct(id, display, subItem),
    },
  ];

  if (product_type === 2 || product_type === 4) {
    dropdownList.push({
      type: 'delete_product',
      label: (
        <span className="delete_product">
          <img src={deleteIcon} />
          {t('DELETE_PRODUCT', 'Delete Product')}
        </span>
      ),
      action: () => deleteProduct(id, subItem),
    });
  }

  return {
    label: '',
    arrow: 'right',
    dropdownList,
    renderLable: label => (
      <XIcon type="more-label" iconWidth={12} iconHeight={12} title={label} text={label} />
    ),
    customClass: __isCN__ ? 'cnDropdown collection-handler' : 'collection-handler',
  };
};

const SpuListContent = memo(({ list = [], ...extra }) => {
  const {
    getSheetList,
    hideProduct,
    urls,
    boundGlobalActions,
    estoreInfo,
    deleteProduct,
    commonAction,
    isExistedDigital,
  } = extra;
  const urlParams = QS.parse(location.search.slice(1));
  const { rack_id, supplier_id } = urlParams;
  const imgBaseUrl = urls.get('imgBaseUrl');
  const imgPath = 'PC/saas_client_B/category/Profile';

  const open = res => {
    history.push(
      `${location.pathname}?rack_id=${res.rack_id}&rack_name=${encodeURIComponent(
        res.rack_name
      )}&store_id=${res.store_id}&supplier_id=${res.supplier_id}`
    );
  };

  const addCustomProps = {
    actions: {
      boundGlobalActions,
      getSheetList,
      open,
      reGetSpu: commonAction.getSpu,
      setLoading: commonAction.setLoading,
    },
    isExistedDigital: isExistedDigital,
    data: { estoreInfo, urls },
    rack_id: rack_id,
    isCustom: Number(supplier_id) !== 1 || !__isCN__,
  };
  return (
    <div className={classNames('spuListContentWrapper', { empt: !list.length })}>
      {list.map(item => (
        <div className="spuItem" id={item.category_code} key={item.category_code}>
          <div className="title">{item.category_name}</div>
          <div className="spuItemList">
            {item.rack_spu_list.map((subItem, i) => {
              const _guid = guid();
              const isDigital = subItem?.product_type == 4;
              const itemActions = {
                handleMouseDown: () => {},
                handleMouseOver: () => {},
                handleMouseOut: () => {},
                handleClick: () => {
                  let standard_spu_id = subItem?.category_code;
                  let route = 'pricing';
                  if (subItem.product_type === 2) {
                    route = 'custom-pricing';
                    standard_spu_id = 'CUSTOM_PRODUCT';
                  }
                  // digital
                  if (isDigital) {
                    route = 'pricing-digital';
                    standard_spu_id = 'DIGITAL_DOWNLOAD';
                  }
                  window.logEvent.addPageEvent({
                    name: 'Estore_Products_SPUList_Click_EditPrice',
                    standard_spu_id,
                  });
                  console.log('route: ', route);
                  window.location.href = `/software/e-store/products/${route}?rack_spu_id=${
                    subItem.id
                  }&supplier_id=${getQs('supplier_id')}&rack_id=${
                    subItem.rack_id
                  }&rack_name=${getQs('rack_name')}&spu_uuid=${subItem.spu_uuid}`;
                },
              };
              const img =
                subItem.spu_asset_list?.filter(sub => sub.section_path?.indexOf(imgPath) !== -1) ||
                [];
              const imgProps = {
                data: {
                  item: {
                    guid: _guid,
                    url: '',
                    imageUrl: isDigital
                      ? photo_download
                      : `${imgBaseUrl}${img[0] && img[0].storage_path}`,
                    imgStyle: {
                      width: '60px',
                      height: '60px',
                      display: 'inline-block',
                    },
                  },
                  options: {},
                  columnHeight: '5.2rem',
                  columnWidth: '5.2rem',
                  background: '#F6F6F6',
                },
                actions: itemActions,
              };

              const dropAction = {
                hideProduct,
                deleteProduct,
              };

              return (
                <div
                  key={`${subItem.category_code}${i}`}
                  className={`listItem col-6 ${
                    subItem.rack_spu_status === 3 ? 'hideProduct' : ''
                  } ${__isCN__ ? 'cnListItem' : ''}`}
                >
                  <XImgBox {...imgProps} />
                  <div className="productNameWrapper">
                    <span className="productName" title={subItem.category_name || subItem.spu_name}>
                      {subItem.category_name || subItem.spu_name}
                    </span>
                    {[1, 2].includes(subItem.spu_type) ? (
                      <XDropdown
                        {...getDropdownProps({
                          display: subItem.rack_spu_status === 2,
                          id: subItem.id,
                          subItem,
                          ...dropAction,
                        })}
                      />
                    ) : null}
                  </div>
                  {/* 在sku存在价格为0并且不隐藏时显示alert */}
                  {!!subItem.price_abnormal && subItem.rack_spu_status !== 3 && (
                    <AlertTip
                      className="store-price-sheet-price-alert"
                      maxWidth="165px"
                      message={t('EXIST_PRODUCTS_BUT_NOT_PRICED')}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {!list.length && <AddCustomProduct {...addCustomProps} />}
    </div>
  );
});

export default SpuListContent;
