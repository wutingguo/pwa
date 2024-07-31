import React, { useEffect, useState } from 'react';

import { noHyphenGuid } from '@resource/lib/utils/math';

import { getQs } from '@resource/logevent/util/qs';

import PricingCollapse from '@apps/estore/components/pricingCollapse';
import estoreService from '@apps/estore/constants/service';

import CustomPricingHeader from './components/header';
import SelfPricingCollapseCell from './components/selfCell';
import ProductInfo from './sections/productInfo';
import ProductOptions from './sections/productOptions';
import ProductPricing from './sections/productPricing';

import './index.scss';

const CustomPricing = props => {
  const [infoStates, setInfoStates] = useState({
    rack_id: '',
    rack_spu_id: '',
    category_code: '',
    product_name: 'Custom Product',
    product_description: '',
    production_desc: '',
    spu_images: [],
    photo_required_enable: '',
    photo_required_type: '',
    photo_required_num: '',
  });
  const [expandAll, setExpandAll] = useState(false);
  const [collapseArr, setCollapseArr] = useState([]);
  const [effectSku, setEffectSku] = useState([]);
  const [optionStates, setOptionStates] = useState([]);
  const [pricingStates, setPricingStates] = useState([]);
  const [saveStatus, setSaveStatus] = useState(false);
  const [collapseData, setCollapseData] = useState([]);
  const [deep, setDeep] = useState(1);
  const [requestedPricing, setRequestedPricing] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const { urls, boundGlobalActions, boundProjectActions, history, estoreInfo } = props;
  const estoreBaseUrl = urls.get('estoreBaseUrl');
  const { currency_symbol } = estoreInfo;

  useEffect(() => {
    styleUpdate(0);
    return () => {
      styleUpdate('48px');
    };
  });

  useEffect(() => {
    initInfo();
  }, []);

  useEffect(() => {
    console.log('optionStates: ', optionStates);
    if (optionStates && optionStates.length) {
      const updateData = optionStates.reduce((res, item) => {
        let newAttrValues = item.spu_attr_values || [];
        if (item.spu_attr_values && item.spu_attr_values.length) {
          newAttrValues = newAttrValues.map(subItem => ({
            ...subItem,
            key_code: item.display_name,
          }));
        }
        res.push({
          ...item,
          spu_attr_values: newAttrValues,
        });
        return res;
      }, []);
      const backup = JSON.parse(JSON.stringify(updateData));
      const newOpt = combineOptions(backup, []);
      const skuLists = groupAttrs(newOpt, {}, pricingStates);
      const collapseData = groupCollapse(newOpt[0].spu_attr_values);
      const maxDeep = recursiveMax(newOpt);
      setDeep(maxDeep);
      setCollapseData(collapseData);
      setCollapseArr(newOpt[0].spu_attr_values);
      setPricingStates(skuLists);
    } else {
      //  没有options的时候给默认值
      const skuObj = {
        addition_shipping_fee: '0.00',
        base_price: '0.00',
        sku_attrs: [],
        sku_status: 2,
        sku_uuid: '',
        suggested_price: '0.00',
        no_product_options: true,
      };
      const collapseData = generateCollapse(skuObj);
      setDeep(1);
      setOptionStates([]);
      setCollapseData(collapseData);
      setRequestedPricing(JSON.parse(JSON.stringify([skuObj])));
      setPricingStates(JSON.parse(JSON.stringify([skuObj])));
    }
  }, [JSON.stringify(optionStates)]);

  useEffect(() => {
    if (collapseArr.length) {
      const collapseData = groupCollapse(collapseArr);
      setCollapseData(collapseData);
    }
  }, [expandAll, estoreInfo]);

  // 递归获取最大层级
  const recursiveMax = input => {
    let maxLength = 1;
    if (input.length > 0) {
      const values = input[0].spu_attr_values[0]?.children;
      if (values && values.length > 0) {
        const newNumber = recursiveMax(values);
        return newNumber + maxLength;
      }
    }
    return maxLength;
  };

  const generateCollapse = skuObj => {
    const initData = [
      {
        attr_id: '',
        attr_value_id: '',
        display_name: '',
        key_code: '',
        skuList: [],
        value_term_code: '',
        skuObj,
      },
    ];
    setCollapseArr(initData);
    return groupCollapse(initData);
  };

  const initInfo = () => {
    boundGlobalActions.getEstoreInfo().then(info => {
      const rack_spu_id = getQs('rack_spu_id') || '';
      const rack_id = getQs('rack_id');
      const spu_uuid = getQs('spu_uuid');
      estoreService.getCustomCategoryList({ baseUrl: estoreBaseUrl }).then(res => {
        if (res && res.length) {
          setCategoryOptions(
            res.map(item => ({
              ...item,
              label: item.display_name,
              value: item.category_code,
            }))
          );
        }
        if (!rack_spu_id) {
          setInfoStates({
            ...infoStates,
            rack_id,
            rack_spu_id: '',
            category_code: res[0].category_code,
          });
        } else {
          estoreService.getCustomerSpuDetail({ baseUrl: estoreBaseUrl, rack_spu_id }).then(info => {
            const { spu_asset_list } = info;
            const spu_images = spu_asset_list.map(item => ({
              ...item,
            }));
            setInfoStates({
              ...infoStates,
              ...info,
              product_name: info.spu_name,
              rack_id,
              rack_spu_id,
              spu_images,
            });
          });
          estoreService.getCustomerSpuList({ baseUrl: estoreBaseUrl, rack_spu_id }).then(info => {
            console.log('SpuList: ', info);
            setRequestedPricing(info);
            if (spu_uuid) {
              estoreService
                .getCustomerSpuAttrs({ baseUrl: estoreBaseUrl, spu_uuid })
                .then(attrInfo => {
                  if (!attrInfo) {
                    const collapseData = generateCollapse({ ...info[0], no_product_options: true });
                    setPricingStates([
                      {
                        ...(pricingStates[0] || info[0]),
                        no_product_options: true,
                        sku_uuid: info[0].sku_uuid,
                      },
                    ]);
                    setCollapseData(collapseData);
                    return;
                  }
                  const newOptionsState = attrInfo.map(item => {
                    const { show_scope, display_name, id, value_select_type, term_code } = item;
                    return {
                      attr_id: id,
                      term_code,
                      show_scope,
                      display_name,
                      value_select_type,
                      spu_attr_values: item.customized_spu_attr_value_list.map(subItem => ({
                        attr_id: id,
                        attr_value_id: subItem.attr_value_id,
                        display_name: subItem.display_name,
                        value_term_code: subItem.value_term_code,
                      })),
                    };
                  });
                  setOptionStates(newOptionsState);
                });
            }
          });
        }
      });
      boundGlobalActions.getCustomerCurrency();
    });
  };

  const syncInfoAfterSave = () => {
    initInfo();
  };

  const onChangePrice = params => {
    const { sku_attrs, no_product_options } = params;
    let newPricingState = pricingStates.map(item => {
      if (JSON.stringify(item.sku_attrs) === JSON.stringify(sku_attrs)) {
        return {
          ...item,
          ...params,
        };
      }
      return item;
    });
    if (no_product_options) {
      newPricingState = [params];
    }
    setSaveStatus(true);
    setPricingStates(newPricingState);
  };

  const groupCollapse = (attrs, html) => {
    const firstAttr = attrs[0];
    const values = firstAttr.children;
    if (values) {
      const newHtml = [];
      attrs.forEach(element => {
        const pricingProps = {
          isAllOpened: expandAll,
          element: element,
          html: groupCollapse(element.children[0].spu_attr_values, html),
        };
        newHtml.push(
          <div className="row">
            <div className="cell text">
              <PricingCollapse {...pricingProps} />
            </div>
          </div>
        );
      });
      return newHtml;
    }
    const htmls = [];
    attrs.forEach(element => {
      const cellProps = {
        element,
        onChangePrice,
        currency_symbol,
      };

      // 附属属性 无价格的不展示
      if (!element.skuObj) {
        return;
      }
      htmls.push(<SelfPricingCollapseCell {...cellProps} />);
    });
    return <div>{htmls}</div>;
  };

  const combineOptions = opts => {
    const len = opts.length;
    if (len > 1) {
      const lastIdx = len - 1;
      const lastPreviousIdx = lastIdx - 1;
      const lastOpt = opts[lastIdx];
      const lastPreviousOpt = opts[lastPreviousIdx];
      lastPreviousOpt.spu_attr_values = lastPreviousOpt.spu_attr_values.map(item => ({
        ...item,
        children: [JSON.parse(JSON.stringify(lastOpt))],
      }));
      opts.splice(lastIdx, 1);
      if (opts.length === 1) {
        return opts;
      }
      return combineOptions(opts);
    }
    return opts;
  };

  const groupAttrs = (opts, preItem = {}, skuList = [], effectSku = []) => {
    opts.forEach(item => {
      item.spu_attr_values.forEach(subItem => {
        if (preItem.skuList) {
          const copy = JSON.parse(JSON.stringify(preItem.skuList));
          copy.push({
            attr_key: item.term_code,
            attr_value: subItem.value_term_code,
          });
          subItem.skuList = copy;
        } else {
          subItem.skuList = [
            {
              attr_key: item.term_code,
              attr_value: subItem.value_term_code,
            },
          ];
        }
        if (subItem.children) {
          groupAttrs(subItem.children, subItem, skuList, effectSku);
        } else {
          let skuObj = {
            sku_uuid: '',
            base_price: '0.00',
            suggested_price: '0.00',
            addition_shipping_fee: '0.00',
            sku_status: '2',
            sku_attrs: subItem.skuList,
          };
          effectSku.push(subItem.skuList);
          if (requestedPricing && requestedPricing.length) {
            console.log('pricingStates: ', pricingStates);
            const findAttrFromReq = requestedPricing.find(
              item =>
                JSON.stringify(item.rack_sku_attribute_list) === JSON.stringify(subItem.skuList)
            );
            const findAttrFromState = pricingStates.find(
              item => JSON.stringify(item.sku_attrs) === JSON.stringify(subItem.skuList)
            );
            if (findAttrFromReq) {
              const {
                sku_status,
                rack_sku_attribute_list,
                addition_shipping_fee,
                suggested_price,
                base_price,
                sku_uuid,
              } = findAttrFromReq;
              skuObj = {
                sku_uuid,
                base_price,
                suggested_price,
                addition_shipping_fee,
                sku_status,
                sku_attrs: rack_sku_attribute_list,
              };
            }
            if (findAttrFromState) {
              if (findAttrFromReq) {
                // 如果在接口数据和本地数据同时找到需要 关联 sku_uuid
                findAttrFromState.sku_uuid = findAttrFromReq.sku_uuid;
              }
              skuObj = findAttrFromState;
            }
          }
          const isExisted = skuList.find(
            item => JSON.stringify(item.sku_attrs) === JSON.stringify(skuObj.sku_attrs)
          );
          if (!isExisted) {
            skuList.push(skuObj);
          }
          subItem.skuObj = skuObj;
          setEffectSku(effectSku);
        }
      });
    });
    return skuList;
  };

  const styleUpdate = value => {
    const software = document.getElementById('software');
    const navbar = document.getElementById('navbar');
    if (software) {
      software.style.top = value;
      navbar.style.height = value;
    }
  };

  const changeInfo = (key, val) => {
    setSaveStatus(true);
    if (key === 'spu_images') {
      infoStates.spu_images.push(val);
      setInfoStates({
        ...infoStates,
        spu_images: infoStates.spu_images,
      });
    } else {
      setInfoStates({
        ...infoStates,
        [key]: val,
      });
    }
  };

  const deleteSpuImages = key => {
    const { spu_images } = infoStates;
    const newImages = spu_images.filter(item => (item.asset_uuid || item.key_name) !== key);
    setSaveStatus(true);
    setInfoStates({
      ...infoStates,
      spu_images: newImages,
      spu_asset_list: newImages,
    });
  };

  const syncOptionData = (options, deleted) => {
    setSaveStatus(true);
    setOptionStates(options);
  };

  const etc = {
    boundGlobalActions,
    boundProjectActions,
    urls,
    history,
    estoreInfo,
  };

  const sendedData = {
    spu_detail: infoStates,
    spu_attrs: optionStates,
    sku_list: pricingStates,
    saveStatus,
    setSaveStatus,
    estoreInfo,
    syncInfoAfterSave,
    effectSku,
  };
  return (
    <div className="customPricingPage">
      <CustomPricingHeader baseUrl={estoreBaseUrl} {...sendedData} {...etc} />
      <div className="customPricingContent">
        <ProductInfo
          baseUrl={estoreBaseUrl}
          categoryOptions={categoryOptions}
          onChange={changeInfo}
          data={infoStates}
          deleteSpuImages={deleteSpuImages}
          {...etc}
        />
        <ProductOptions syncOptionData={syncOptionData} optionStates={optionStates} {...etc} />
        <ProductPricing
          optionStates={optionStates}
          collapseData={collapseData}
          deep={deep}
          pricingStates={pricingStates}
          expandAll={expandAll}
          setExpandAll={setExpandAll}
          {...etc}
        />
      </div>
    </div>
  );
};

export default CustomPricing;
