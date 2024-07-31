import QS from 'qs';
import React from 'react';

import backIcon from '@resource/static/icons/handleIcon/back_1.png';
import moreIcon from '@resource/static/icons/handleIcon/more.png';
import settingIcon from '@resource/static/icons/handleIcon/setting.png';

import { XDropdown } from '@common/components';

import { PRICE_SHEET_SETTING } from '@apps/estore/constants/modalTypes';

import AddCustomProduct from '../addCustomProduct';
import AddPriceSheetBtn from '../addPriceSheetButton';
import getDropdownProps from '../dropDownProps';

import './index.scss';

const ProductHeader = props => {
  const {
    boundGlobalActions,
    estoreInfo,
    getSheetList,
    history,
    sheetList,
    commonAction,
    urls,
    isExistedDigital,
  } = props;
  const urlParams = QS.parse(location.search.slice(1));
  const { rack_id, rack_name, supplier_id } = urlParams;
  const sheetInfo = sheetList.find(item => item.id == rack_id);
  const default_fulfill_type = sheetInfo?.default_fulfill_type || '';
  let store_id = '';
  if (sheetInfo) {
    store_id = sheetInfo.store_id;
  }
  const back = () => {
    history.push(`${location.pathname}`);
  };

  const open = res => {
    history.push(
      `${location.pathname}?rack_id=${res.rack_id}&rack_name=${encodeURIComponent(
        res.rack_name
      )}&store_id=${res.store_id}&supplier_id=${res.supplier_id}`
    );
  };
  const openSetting = () => {
    window.logEvent.addPageEvent({
      name: 'Estore_Products_SPUList_Click_Settings',
    });
    boundGlobalActions.showModal(PRICE_SHEET_SETTING, {
      title: t('PRICE_SHEET_SETTING'),
      close: (params = {}) => {
        const { noLogEvent } = params;
        !noLogEvent &&
          window.logEvent.addPageEvent({
            name: 'Estore_Products_SPUListSettingPop_Click_Cancel',
          });
        boundGlobalActions.hideModal(PRICE_SHEET_SETTING);
      },
      sheetInfo,
      callback: name => {
        history.push(
          `${location.pathname}?rack_id=${rack_id}&rack_name=${encodeURIComponent(name)}`
        );
        getSheetList();
      },
    });
  };
  return (
    <div className="productHeaderWrapper">
      <div className="title">
        <img src={backIcon} className={`back ${rack_id ? 'show' : ''}`} onClick={back} />
        <span>{rack_name ? decodeURIComponent(rack_name) : t('PRICE_SHEETS', 'Price Sheets')}</span>
      </div>
      <div className={`operateBtn ${rack_id ? 'show' : 'unShow'}`}>
        <XDropdown
          {...getDropdownProps({
            key: 'header',
            deletSheet: () => commonAction.deletSheet(rack_id, store_id),
            assignToCollection: () => commonAction.assignToCollection(store_id),
            renderLable: () => (
              <div className="operate actionBtn">
                <img src={moreIcon} />
                <span>{t('ACTIONS')}</span>
              </div>
            ),
          })}
        />
        <div className="operate settingBtn" onClick={openSetting}>
          <img src={settingIcon} />
          <span>{t('SETTINGS')}</span>
        </div>
        {
          <AddCustomProduct
            className={`${!rack_id ? 'show' : 'unShow'}`}
            actions={{
              boundGlobalActions,
              getSheetList,
              open,
              reGetSpu: commonAction.getSpu,
              setLoading: commonAction.setLoading,
            }}
            isExistedDigital={isExistedDigital}
            data={{ estoreInfo, urls, default_fulfill_type }}
            rack_id={rack_id}
            // isCustom={Number(supplier_id) !== 1}
            isCustom={true}
          ></AddCustomProduct>
        }
      </div>
      <AddPriceSheetBtn
        className={`${!rack_id ? 'show' : 'unShow'}`}
        actions={{ boundGlobalActions, getSheetList, open }}
        data={{ estoreInfo }}
      />
    </div>
  );
};

export default ProductHeader;
