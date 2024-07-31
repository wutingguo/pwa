import QS from 'qs';
import React, { useEffect, useRef, useState } from 'react';

import XLoading from '@resource/components/XLoading';

import { CONFIRM_MODAL } from '@resource/lib/constants/modalTypes';

import AlertTip from '@common/components/AlertTip';
import SpuListContent from '@common/components/spuListContent';

import { XDropdown } from '@common/components';

import * as localModalTypes from '@apps/estore/constants/modalTypes';
import estoreService from '@apps/estore/constants/service';

import AddPriceSheetBtn from '../addPriceSheetButton';
import getDropdownProps from '../dropDownProps';

import sheetContentIcon from './sheetContent.png';

import './index.scss';

const SheetContent = ({
  list,
  history,
  baseUrl,
  urls,
  getSheetList,
  boundGlobalActions,
  empty,
  loading: propsLoading,
  commonAction,
  estoreInfo,
}) => {
  const [itemW, setItemW] = useState(250);
  const [ratio, setRatio] = useState(3);
  const [spuList, setSpuList] = useState([]);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef(null);
  const urlParams = QS.parse(location.search.slice(1));
  const { id = '' } = estoreInfo;
  const estoreBaseUrl = urls.get('estoreBaseUrl');
  const { rack_id, rack_name = '', store_id = '', supplier_id } = urlParams;
  const { addNotification, showConfirm, hideConfirm } = boundGlobalActions;

  useEffect(() => {
    reszieItem();
    window.addEventListener('resize', reszieItem);
    commonAction.deletSheet = () => deletSheet(rack_id, store_id || id);
    commonAction.getSpu = () => {
      getSpu({ fixedDigital: true });
    };
    commonAction.setLoading = () => setLoading(true);
    commonAction.assignToCollection = (storeId = '') =>
      assignToCollection(rack_id, store_id || storeId);
    if (rack_id) {
      openSPU(rack_id, rack_name, store_id, true, supplier_id);
      getSpu();
    } else {
      setSpuList([]);
    }
    return () => {
      window.removeEventListener('resize', reszieItem);
    };
  }, [rack_id, propsLoading]);

  const getSpu = async (options = {}) => {
    const { refreshSheetList = false, fixedDigital } = options;
    setLoading(true);
    try {
      const res = await estoreService.estoreGetRackSpuList({
        baseUrl: estoreBaseUrl,
        rack_id,
        // rack_spu_status: 2
      });
      const { data = [] } = res;
      commonAction.findDigital(data);
      setSpuList(data);
      setLoading(false);
      if (fixedDigital) {
        setTimeout(() => {
          const fixed = document.getElementById('fixedDigital');
          fixed.click();
        }, 1000);
      }
      refreshSheetList && (await getSheetList({ noLoading: true }));
    } catch (e) {
      console.error(e);
    }
  };

  const openSPU = (id, name, store_id, noLogEvent, supplier_id, type) => {
    !noLogEvent &&
      window.logEvent.addPageEvent({
        name: 'Estore_Products_Click_EditPriceSheet',
      });
    history.push(
      `${location.pathname}?rack_id=${id}&rack_name=${encodeURIComponent(
        name
      )}&store_id=${store_id}&supplier_id=${supplier_id}&type=${type}`
    );
  };

  const reszieItem = () => {
    const contentWidth = contentRef.current.clientWidth;
    const ratio = Math.floor(contentWidth / 250);
    const marginWidth = (ratio - 1) * 30;
    const itemWidth = (contentWidth - marginWidth) / ratio;
    setRatio(ratio);
    setItemW(itemWidth - 1);
  };

  const hideProduct = (id, display, product) => {
    const { price_abnormal, rack_spu_status, product_type } = product || {};
    let standard_spu_id = product.category_code;
    if (product_type === 2) {
      standard_spu_id = 'CUSTOM_PRODUCT';
    } else if (product_type === 4) {
      standard_spu_id = 'DIGITAL_DOWNLOAD';
    }
    window.logEvent.addPageEvent({
      name: !display
        ? 'Estore_Products_SPUList_Click_ShowProduct'
        : 'Estore_Products_SPUList_Click_HideProduct',
      standard_spu_id,
    });
    estoreService
      .estoreModifySpuStatus({
        estoreBaseUrl,
        rack_spu_id: id,
        operation: !display ? 'SHOW' : 'HIDE',
      })
      .then(res => {
        const { ret_code } = res;
        if (ret_code == 500440) {
          addNotification({
            message: 'Please make at least one album available first.',
            level: 'error',
            autoDismiss: 2,
          });
        } else {
          addNotification({
            message: !display ? t('PRODUCT_SHOWN') : t('PRODUCT_HIDDEN'),
            level: 'success',
            autoDismiss: 2,
          });
          // openSPU(rack_id, rack_name);
          // 在sku存在价格为0时重新拉取sheetList
          getSpu({ refreshSheetList: !!price_abnormal });
        }
      });
  };

  const deleteProduct = (id, product) => {
    console.log(product, 'product');
    let spuType = '';
    if (product.product_type === 2) {
      spuType = 'custom_product';
    }
    if (product.product_type === 4) {
      spuType = 'digital_download';
    }
    window.logEvent.addPageEvent({
      name: 'Estore_Products_SPUList_Click_DeleteProduct',
      spuType,
    });
    showConfirm({
      close: hideConfirm,
      message: t('DELETE_THE_PRICE_SHEET'),
      buttons: [
        {
          text: t('CANCEL'),
          className: 'white',
          onClick: hideConfirm,
        },
        {
          text: t('DELETE'),
          onClick: () => {
            console.log('id, product: ', id, product);
            estoreService
              .deleteProductFromCustom({ baseUrl: estoreBaseUrl, rack_spu_id: id })
              .then(() => {
                addNotification({
                  message: t('SUCCESSFULLY_DELETED'),
                  level: 'success',
                  autoDismiss: 2,
                });
                getSpu();
              });
          },
        },
      ],
    });
  };

  const confirmDelete = (id, store_id) => {
    estoreService.estoreDelRack({ baseUrl, rack_id: id, store_id }).then(res => {
      const { ret_code } = res;
      if (ret_code == 500740) {
        boundGlobalActions.showModal(CONFIRM_MODAL, {
          message: <div style={{ textAlign: 'left' }}>{t('ESTPRE_DELETE_TIP2')}</div>,
          close: () => boundGlobalActions.hideModal(CONFIRM_MODAL),
          buttons: [
            {
              text: t('OK'),
            },
          ],
        });
      } else if (ret_code == 200000) {
        boundGlobalActions.addNotification({
          message: t('SUCCESSFULLY_DELETED'),
          level: 'success',
          autoDismiss: 2,
        });
        history.push(`${location.pathname}`);
        getSheetList();
      }
    });
  };

  const deletSheet = (id, store_id) => {
    // e.stopPropagation();
    window.logEvent.addPageEvent({
      name: 'Estore_Products_Click_DeletePriceSheet',
    });
    estoreService.estoreExistsBinded({ estoreBaseUrl, rack_id: id }).then(res => {
      const { data } = res;
      if (!data) {
        boundGlobalActions.showModal(CONFIRM_MODAL, {
          message: <div style={{ textAlign: 'left' }}>{t('ESTORE_DELETE_TIP')}</div>,
          close: () => {
            window.logEvent.addPageEvent({
              name: 'Estore_Products_DeletePriceSheetPop_Cancel',
            });
            boundGlobalActions.hideModal(CONFIRM_MODAL);
          },
          buttons: [
            {
              text: t('CANCEL'),
              className: 'white',
            },
            {
              text: t('CONFIRM1'),
              onClick: () => {
                window.logEvent.addPageEvent({
                  name: 'Estore_Products_DeletePriceSheetPop_Confirm',
                });
                confirmDelete(id, store_id);
              },
            },
          ],
        });
      } else {
        boundGlobalActions.showModal(CONFIRM_MODAL, {
          message: <div style={{ textAlign: 'left' }}>{t('ESTPRE_DELETE_TIP2')}</div>,
          close: () => boundGlobalActions.hideModal(CONFIRM_MODAL),
          buttons: [
            {
              text: t('OK'),
            },
          ],
        });
      }
    });
  };

  const assignToCollection = (rack_id, store_id) => {
    window.logEvent.addPageEvent({
      name: 'Estore_Products_Click_AssignPriceSheetToCollections',
    });
    boundGlobalActions.showModal(localModalTypes.ASSIGN_TO_COLLECTIONS, {
      close: () => {
        window.logEvent.addPageEvent({
          name: 'Estore_Products_AssignPriceSheetToCollectionsPop1_Click_Cancel',
        });
        boundGlobalActions.hideModal(localModalTypes.ASSIGN_TO_COLLECTIONS);
      },
      store_id,
      rack_id,
    });
  };

  const renderList = () => {
    const listAction = {
      getSheetList,
      urls,
      hideProduct,
      deleteProduct,
      boundGlobalActions,
      estoreInfo,
      commonAction,
    };
    if (loading || propsLoading) {
      return <XLoading isShown={loading || propsLoading} />;
    }

    if (!list?.length) {
      return empty();
    }

    if (rack_id) {
      return <SpuListContent list={spuList} {...listAction} />;
    }

    return list.map((item, i) => (
      <div
        className="sheetWrapper"
        key={i}
        onClick={() =>
          openSPU(
            item.id,
            item.rack_name,
            item.store_id,
            '',
            item.supplier_id,
            item.default_fulfill_type
          )
        }
        style={{ width: itemW, marginRight: i % ratio === ratio - 1 ? 0 : 30 }}
      >
        <img src={sheetContentIcon} />
        <div className="SheetActionBar" onClick={e => e.stopPropagation()}>
          <div className="title" title={item.rack_name}>
            {item.rack_name}
          </div>
          <div className="icons">
            <XDropdown
              {...getDropdownProps({
                key: `${item.rack_name}_${item.id}`,
                editor: () =>
                  openSPU(
                    item.id,
                    item.rack_name,
                    item.store_id,
                    '',
                    item.supplier_id,
                    item.default_fulfill_type
                  ),
                deletSheet: () => deletSheet(item.id, item.store_id),
                assignToCollection: () => assignToCollection(item.id, item.store_id),
              })}
            />
          </div>
        </div>
        {!!item.spu_price_abnormal && (
          <AlertTip
            className="store-price-sheet-price-alert"
            maxWidth="165px"
            placement={i % ratio === ratio - 1 ? 'left' : 'right'}
            message={t('EXIST_PRODUCTS_BUT_NOT_PRICED')}
          />
        )}
      </div>
    ));
  };

  return (
    <div className="productContent" ref={contentRef}>
      {renderList()}
    </div>
  );
};

const ProductContent = props => {
  const {
    boundGlobalActions,
    estoreInfo,
    sheetList = [],
    getSheetList,
    history,
    baseUrl,
    urls,
    loading,
    commonAction,
  } = props;

  const empty = () => (
    <div className="productContent empty">
      <AddPriceSheetBtn actions={{ boundGlobalActions, getSheetList }} data={{ estoreInfo }} />
      <div className="emptyMsg">{t('ESTORE_PRODUCT_TIP')}</div>
    </div>
  );

  const sheetData = {
    list: sheetList,
    loading,
    history,
    baseUrl,
    urls,
    getSheetList,
    boundGlobalActions,
    empty,
    commonAction,
    estoreInfo,
  };

  return (
    <div className="ProductContentWrapper">
      <a href="#Digital" id="fixedDigital"></a>
      <SheetContent {...sheetData} />
    </div>
  );
};

export default ProductContent;
