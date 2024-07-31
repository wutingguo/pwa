import React, { memo, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

import CheckBox from '@resource/components/XCheckBox/RcCheckBox';

import { XIcon, XLoading, XModal } from '@common/components';
import photo_download from '@common/icons/digital_download.png';

import * as localModalTypes from '@apps/estore/constants/modalTypes';
import estoreService from '@apps/estore/constants/service';

import question from './img/question.png';

import './index.scss';

const AddCouponProduct = props => {
  const imgPath = 'PC/saas_client_B/category/Profile';
  const { data } = props;
  const {
    baseUrl,
    boundGlobalActions,
    rack_id,
    imgBaseUrl,
    racks,
    onChange,
    isNextStep,
    rack_spu_item = {},
    currency_symbol,
  } = data.toJS() || {};
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAllTag, setIsAllTag] = useState(false);
  const [list, setList] = useState([]);
  const [skuList, setSkuList] = useState({});
  const [currentSku, setCurrentSku] = useState({});
  const [isPriceTag, setIsPriceTag] = useState(true);

  useEffect(() => {
    if (rack_id) {
      setLoading(true);
      estoreService.estoreGetRackSpuList({ baseUrl, rack_id }).then(res => {
        setList(res.data || []);
        setLoading(false);
      });
    }
  }, [rack_id]);
  useEffect(() => {
    isNextStep &&
      nextStep(rack_spu_item, `${imgBaseUrl}${rack_spu_item.asset_path}`, rack_spu_item.asset_path);
  }, [rack_id]);
  const onCloseModal = () => {
    boundGlobalActions.hideModal(localModalTypes.COUPON_ADDPRODUCT_MODAL);
  };
  const onSelectAll = e => {
    setIsAllTag(e.target.checked);
    const list = [...currentSku.list];
    setCurrentSku({
      ...currentSku,
      list: list.map(item => {
        if (isPriceTag && !item.suggested_price) {
          return item;
        }
        return { ...item, tag: e.target.checked };
      }),
    });
  };
  const nextStep = (skuItem, imgSrc, storage_path) => {
    setCurrentStep(1);
    const rack_spu_id = skuItem.id || skuItem.rack_spu_id;

    setLoading(true);
    estoreService
      .getSkuList({
        baseUrl,
        rack_spu_id,
      })
      .then(res => {
        const rockIndex = racks.findIndex(item => item.rack_id === rack_id);
        const spu_listIndex = racks[rockIndex]['spu_list'].findIndex(
          item => item.rack_spu_id === rack_spu_id
        );
        let selectSku_codes = [];
        if (spu_listIndex > -1) {
          selectSku_codes = racks[rockIndex]['spu_list'][spu_listIndex]['sku_codes'];
        }
        const data =
          res.data.map(item => ({ ...item, tag: selectSku_codes.includes(item.sku_uuid) })) || [];
        setSkuList({
          ...skuList,
          [rack_spu_id]: data,
        });
        setCurrentSku({
          ...skuItem,
          rack_spu_id,
          name: skuItem.category_name || skuItem.spu_name || skuItem.spu_display_name,
          imgSrc,
          storage_path,
          list: data,
        });
        setLoading(false);
      });
  };
  const onSelectAttr = index => {
    const list = [...currentSku.list];
    list[index].tag = !list[index].tag;
    setCurrentSku({
      ...currentSku,
      list,
    });
  };
  const onSaveSku = () => {
    const rockIndex = racks.findIndex(item => item.rack_id === rack_id);
    const tempRacks = [...racks];
    const tempSpu_list = tempRacks[rockIndex]['spu_list']; //取出要操作的spu_list
    const currentSkuIndex = tempSpu_list.findIndex(
      item => item.rack_spu_id === currentSku.rack_spu_id
    );
    if (currentSkuIndex > -1) {
      tempSpu_list[currentSkuIndex] = {
        ...tempSpu_list[currentSkuIndex],
        sku_codes: currentSku.list.filter(item => item.tag).map(item => item.sku_uuid),
      };
    } else {
      tempSpu_list.push({
        rack_id,
        rack_spu_id: currentSku.id,
        spu_display_name: currentSku.name,
        asset_path: currentSku.storage_path,
        sku_codes: currentSku.list.filter(item => item.tag).map(item => item.sku_uuid),
      });
    }
    // console.log('tempRacks', tempRacks);
    onChange(tempRacks);
    onCloseModal();
  };
  return (
    <XModal className="AddCouponProduct" opened onClosed={onCloseModal}>
      <XLoading type="listLoading" isShown={loading} backgroundColor="rgba(255,255,255,0.5)" />
      <div className="commonFlex acpModalTitle">
        {currentStep === 1 && (
          <XIcon type="back" className="backIcon" onClick={() => setCurrentStep(0)} />
        )}
        <div>Add Product</div>
      </div>
      {currentStep === 0 && (
        <div className="printListBox">
          {list.map((item, printIndex) => (
            <div className="printList" key={item.category_code}>
              <div className="title">{item.category_name}</div>
              {(item.rack_spu_list || []).map((listItem, index) => {
                const img =
                  listItem.spu_asset_list?.filter(
                    sub => sub.section_path?.indexOf(imgPath) !== -1
                  ) || [];
                const viewImgSrc =
                  img[0] && img[0].storage_path
                    ? `${imgBaseUrl}${img[0] && img[0].storage_path}`
                    : photo_download;
                return (
                  <div
                    key={listItem.id}
                    className="commonFlex listBox"
                    style={index === 0 ? { border: 'none' } : {}}
                    onClick={() => nextStep(listItem, viewImgSrc, img[0]?.storage_path)}
                  >
                    <div className="commonFlex left">
                      <div className="commonFlex imgBox">
                        <img src={viewImgSrc} alt="" />
                      </div>
                      <div className="commonFlex name">
                        <div>{listItem.category_name || listItem.spu_name}</div>
                        {listItem.rack_spu_status === 3 && (
                          <span className="commonFlex">Product Hidden</span>
                        )}
                      </div>
                    </div>
                    <div className="right">
                      <XIcon type="dropdown"></XIcon>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {currentStep === 1 && (
        <div className="skuListBox">
          <div className="commonFlex titleBox">
            <div className="commonFlex imgBox">
              <img src={currentSku.storage_path ? currentSku.imgSrc : photo_download} alt="" />
            </div>
            <div className="nameBox">
              <div className="printName">{currentSku.name}</div>
              <div className="commonFlex">
                <CheckBox checked={isPriceTag} onChange={() => setIsPriceTag(!isPriceTag)} />
                <div className="desc">Only Show Variations You Sell</div>
                <img
                  data-tip='<p style="width: 7.6rem; font-size: 0.25rem">Having this checked will help you focus on the variations you make available to your clients in this price sheet.</p>'
                  data-html={true}
                  src={question}
                  style={{ width: '0.25rem', marginLeft: '0.1rem' }}
                  alt=""
                />
                <ReactTooltip place="bottom" effect="solid" />
              </div>
            </div>
          </div>
          <div className="table">
            <div className="commonFlex tableHeader">
              <div className="col1">Variations</div>
              <div className="col2">Price</div>
              <div className="commonFlex col3">
                <CheckBox onChange={onSelectAll} />
              </div>
            </div>
            <div className="tableContent">
              {currentSku.list &&
                currentSku.list.map((item, index) =>
                  isPriceTag && !!!item.suggested_price ? null : (
                    <div className="commonFlex tableRow" key={item.sku_uuid}>
                      <div className="col1">{item.display_name}</div>
                      <div className="col2">
                        {item.suggested_price
                          ? `${currency_symbol}${Number.parseFloat(item.suggested_price).toFixed(
                              2
                            )}`
                          : 'not yet priced'}
                      </div>
                      <div className="commonFlex col3">
                        <CheckBox checked={item.tag} onChange={() => onSelectAttr(index)} />
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
          <div className="commonFlex bottomBtnBox">
            <div className="commonFlex btn cancleBtn" onClick={onCloseModal}>
              Cancel
            </div>
            <div className="commonFlex btn saveBtn" onClick={onSaveSku}>
              Save
            </div>
          </div>
        </div>
      )}
    </XModal>
  );
};

export default memo(AddCouponProduct);
