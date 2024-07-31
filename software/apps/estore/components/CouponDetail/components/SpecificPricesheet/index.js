import React, { memo, useEffect, useMemo, useState } from 'react';
import ReactTooltip from 'react-tooltip';

import { XIcon } from '@common/components';
import photo_download from '@common/icons/digital_download.png';

import question from '@apps/estore/components/ModalEntry/AddCouponProduct/img/question.png';
import * as localModalTypes from '@apps/estore/constants/modalTypes';
import estoreService from '@apps/estore/constants/service';

import { SelectDown } from '@src/components/PayFormInfo/paySection';

import './index.scss';

const SpecificPricesheet = props => {
  const {
    onChange,
    value = [],
    boundGlobalActions,
    baseUrl,
    rackList = [],
    imgBaseUrl,
    init_rack_id,
    initRocks,
    currency_symbol,
  } = props;
  const [rack_id, setRack_id] = useState('');
  useEffect(() => {
    onFormChange(init_rack_id);
  }, [init_rack_id]);
  useEffect(() => {
    onChange(initRocks);
  }, [initRocks]);
  const onOpenAddProductModal = item => {
    boundGlobalActions.showModal(localModalTypes.COUPON_ADDPRODUCT_MODAL, {
      boundGlobalActions,
      baseUrl,
      rack_id: item ? item.rack_id : rack_id,
      rack_spu_item: item,
      imgBaseUrl,
      racks: value || [],
      onChange,
      isNextStep: !!item,
      currency_symbol,
    });
  };
  const dropdownList = useMemo(() => {
    return rackList.map(item => ({
      value: item.id,
      label: item.rack_name,
      desc: '',
    }));
  }, [rackList]);

  // useEffect(() => {
  //   if (dropdownList.length === 0) return;
  //   const findsku_scope_typeItem = value.find(vItem => vItem.sku_scope_type === 0);
  //   if (findsku_scope_typeItem) {
  //     onFormChange(findsku_scope_typeItem['rack_id'])
  //   } else {
  //     onFormChange(dropdownList[0]['value'])
  //   }
  // }, [dropdownList])

  const onFormChange = id => {
    setRack_id(id);
    //将选定的货架sku_scope_type置为0 其他的货架sku_scope_type置为1
    const tempValue = [...value];
    tempValue.forEach(item => {
      if (item.rack_id === id) {
        item.sku_scope_type = 0;
      } else {
        item.sku_scope_type = 1;
        // 货架单选 切换时将其他货架清空
        item.spu_list = [];
      }
    });
    onChange(tempValue); //给表单racks赋值
  };
  const onDelete = (spuItem, rackItem) => {
    const tempValue = [...value];
    // const current_rack_id = rackItem.rack_id
    const currentRackIndex = tempValue.findIndex(item => item.rack_id === rackItem.rack_id);
    const currentSpuIndex = tempValue[currentRackIndex]['spu_list'].findIndex(
      item => item.rack_spu_id === spuItem.rack_spu_id
    );
    tempValue[currentRackIndex]['spu_list'].splice(currentSpuIndex, 1);
    onChange(tempValue);
  };

  return (
    <div className="SpecificPricesheet">
      <div className="SpecificPricesheetBox">
        <SelectDown onChange={onFormChange} selectValue={rack_id} dropdownList={dropdownList} />

        <div className="listBox">
          {!!value &&
            value.map(rackItem => {
              return rackItem.spu_list.map(item => (
                <div className="commonFlex printList" key={item.rack_spu_id}>
                  <div className="commonFlex plLeft">
                    <div className="commonFlex imgBox">
                      <img
                        src={item.asset_path ? `${imgBaseUrl}${item.asset_path}` : photo_download}
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="printName">{item.spu_display_name}</div>
                      <div className="printDesc">({item.sku_codes.length} variants available)</div>
                    </div>
                  </div>
                  <div className="commonFlex plRight">
                    <XIcon
                      className="edit"
                      type="rename"
                      onClick={() => onOpenAddProductModal(item)}
                    />
                    <XIcon
                      className="delete"
                      type="delete"
                      onClick={() => onDelete(item, rackItem)}
                    />
                  </div>
                </div>
              ));
            })}
        </div>
        <div className="addBtn" onClick={() => onOpenAddProductModal()}>
          + Add Product
          <img
            data-tip='<p style="width: 8rem; font-size: 0.25rem;position:basolute">If you want to restrict discount to specific products from a pricesheet, use "Add Product" to specify.</p>'
            data-html={true}
            src={question}
            style={{ width: '0.25rem', marginLeft: '0.1rem' }}
            alt=""
          />
          <ReactTooltip place="bottom" effect="solid" />
        </div>
      </div>
    </div>
  );
};

export default memo(SpecificPricesheet);
