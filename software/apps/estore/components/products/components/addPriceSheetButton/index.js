import React from 'react';
import { ADD_PRICE_SHEET_MODAL } from '@apps/estore/constants/modalTypes';
import './index.scss';

const AddPriceSheetBtn = props => {
  const {
    actions: { boundGlobalActions, getSheetList, open },
    data: { estoreInfo },
    className
  } = props;

  const openAddPriceModal = () => {
    window.logEvent.addPageEvent({
      name: 'Estore_Products_Click_AddPriceSheet'
    });
    boundGlobalActions.showModal(ADD_PRICE_SHEET_MODAL, {
      title: t('ADD_PRICE_SHEET'),
      close: () => {
        window.logEvent.addPageEvent({
          name: 'Estore_Products_PriceSheetPop_Click_Cancel'
        });
        boundGlobalActions.hideModal(ADD_PRICE_SHEET_MODAL);
      },
      noCancel: true,
      estoreInfo,
      getSheetList,
      open
    });
  };

  return (
    <span className={`addPriceSheetBtnWrapper ${className}`} onClick={openAddPriceModal}>
      {`+ ${t('ADD_PRICE_SHEET', 'Add Price Sheet')}`}
    </span>
  );
};

export default AddPriceSheetBtn;
