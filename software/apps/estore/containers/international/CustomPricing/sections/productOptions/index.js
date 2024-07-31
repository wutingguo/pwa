import React, { useEffect, useState } from 'react';

import * as localModalTypes from '@apps/estore/constants/modalTypes';

import OptionComp from './optionComp';

import './index.scss';

const ProductOptions = props => {
  const { boundGlobalActions, syncOptionData, optionStates } = props;

  const generateAttrVal = ({ attrCode = '', valueCode = '', name, termCode }) => {
    return {
      attr_value_id: valueCode,
      attr_id: attrCode,
      display_name: name,
      value_term_code: termCode,
    };
  };

  const generateOption = (name, code, attrVals) => {
    return {
      attr_id: '',
      display_name: name,
      value_select_type: '1',
      show_scope: '',
      term_code: code,
      spu_attr_values: attrVals.map(item => {
        return generateAttrVal({
          attrCode: '',
          valueCode: '',
          name: item.value,
          termCode: item.key,
        });
      }),
    };
  };

  const openEditModal = (params = {}) => {
    boundGlobalActions.showModal(localModalTypes.EDIT_PRODUCT_OPTIONS, {
      close: () => {
        boundGlobalActions.hideModal(localModalTypes.EDIT_PRODUCT_OPTIONS)
        window.logEvent.addPageEvent({
          name: 'Estore_Products_CustomizeSPUEditOptionsPop_Click_Cancel'
        });
      },
      pushOption: receiveOption,
      allNames: optionStates.map(item => item.display_name),
      ...params,
    });
  };

  const onEdit = curOpt => {
    openEditModal({
      existedOpt: {
        ...curOpt,
        name: curOpt.display_name,
        key: curOpt.attr_id || curOpt.term_code,
        values: curOpt.spu_attr_values.map(item => ({
          ...item,
          value: item.display_name,
          key: item.attr_value_id || item.value_term_code,
        })),
      },
    });
    window.logEvent.addPageEvent({
      name: 'Estore_Products_CustomizeSPU_Click_EditProductOptions'
    });
  };

  const openEditOptionModal = () => {
    window.logEvent.addPageEvent({
      name: 'Estore_Products_CustomizeSPU_Click_AddProductOptions'
    });
    if (optionStates.length >= 10) {
      boundGlobalActions.addNotification({
        message: 'Up to 10 options can be added!',
        level: 'error',
        autoDismiss: 2,
      });
      return;
    }
    openEditModal();
  };

  const receiveOption = opt => {
    const isInsert = optionStates.findIndex(item => (item.attr_id || item.term_code) === opt.key);
    const { display_name, values, key, attr_id = '', spu_attr_values } = opt;
    if (isInsert !== -1) {
      boundGlobalActions.addNotification({
        message: 'Product options updated.',
        level: 'success',
        autoDismiss: 3,
      });
      optionStates[isInsert].display_name = display_name;
      optionStates[isInsert].spu_attr_values = opt.values.map(item => {
        const findAttr = spu_attr_values.find(attr => attr.display_name === item.value) || {};
        const { attr_value_id, display_name, value_term_code } = findAttr;
        return generateAttrVal({
          attrCode: attr_id,
          valueCode: attr_value_id || '',
          name: display_name || item.value,
          termCode: value_term_code || item.key,
        });
      });
    } else {
      boundGlobalActions.addNotification({
        message: 'Product options added.',
        level: 'success',
        autoDismiss: 3,
      });
      const newOpt = generateOption(display_name, key, values);
      optionStates.push(newOpt);
    }
    syncOptionData(optionStates);
  };

  const deleteOpt = key => {
    boundGlobalActions.showConfirm({
      message: 'Are you sure you want to delete this option?',
      close: () => {
        boundGlobalActions.hideConfirm()
        window.logEvent.addPageEvent({
          name: 'Estore_Products_CustomizeSPUDeleteOptionsPop_Click_Cancel'
        });
      },
      btnOpenClose: true,
      buttons: [
        {
          className: 'white',
          text: 'Cancel',
          onClick: () => {
            boundGlobalActions.hideConfirm()
            window.logEvent.addPageEvent({
              name: 'Estore_Products_CustomizeSPUDeleteOptionsPop_Click_Cancel'
            });
          },
        },
        {
          text: 'Delete',
          onClick: () => {
            const idx = optionStates.findIndex(item => (item.attr_id || item.term_code) === key);
            if (idx !== -1) {
              optionStates.splice(idx, 1);
              syncOptionData(optionStates, 'delete');
              boundGlobalActions.addNotification({
                message: 'Successfully deleted.',
                level: 'success',
                autoDismiss: 3,
              });
            }
            window.logEvent.addPageEvent({
              name: 'Estore_Products_CustomizeSPUDeleteOptionsPop_Click_Confirm'
            });
            boundGlobalActions.hideConfirm()
          },
        },
      ],
    });
    window.logEvent.addPageEvent({
      name: 'Estore_Products_CustomizeSPU_Click_DeleteProductOptions'
    });
    
  };

  return (
    <div className="productOptionWrapper commonSection">
      <div className="selectionTitle">
        <div>Product Options</div>
        <div
          className={`addProductOptions ${optionStates.length >= 10 ? 'disabled' : ''}`}
          onClick={openEditOptionModal}
        >
          + Add Product Options
        </div>
      </div>
      <div className="singleSection">
        {optionStates.map(item => (
          <OptionComp key={item.key} onEdit={onEdit} deleteOpt={deleteOpt} data={item} />
        ))}
      </div>
      <div className="tips">
        Create different options for this product such as different sizes and colors. This is
        optional.
      </div>
    </div>
  );
};

export default ProductOptions;
