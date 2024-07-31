import React, { useEffect, useState } from 'react';

import * as localModalTypes from '@apps/estore/constants/modalTypes';

import OptionComp from './optionComp';

import './index.scss';

const ProductOptions = props => {
  const { boundGlobalActions, syncOptionData, optionStates, backupOptionStates } = props;

  const openManageModal = (params = {}) => {
    boundGlobalActions.showModal(localModalTypes.MANAGE_OPTIONS_MODAL, {
      close: (type = '') => {
        if (type !== 'ok') {
          window.logEvent.addPageEvent({
            name: 'Estore_Products_CustomizeSPUManageOptionsPop_Click_Cancel',
          });
        }
        boundGlobalActions.hideModal(localModalTypes.MANAGE_OPTIONS_MODAL)
      },
      pushOption: receiveOption,
      noCancel: true,
      optionStates,
      backupOptionStates,
    });
  };

  const openManageOptModal = () => {
    window.logEvent.addPageEvent({
      name: 'Estore_Products_CustomizeSPU_Click_ManageOptions',
    });
    openManageModal();
  };

  const receiveOption = opt => {
    console.log('opt:*************** ', opt);
    syncOptionData(opt);
  };

  return (
    <div className="digitalProductOptionWrapper commonSection">
      <div className="selectionTitle">
        <div>Product Options</div>
        <div
          className={`addProductOptions ${optionStates.length >= 10 ? 'disabled' : ''}`}
          onClick={openManageOptModal}
        >
          Manage Options
        </div>
      </div>
      <div className="singleSection">
        {optionStates.map(item => (
          <OptionComp key={item.key} data={item} />
        ))}
      </div>
    </div>
  );
};

export default ProductOptions;
