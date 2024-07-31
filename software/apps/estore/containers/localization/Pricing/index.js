import React, { Component } from 'react';
import CheckBox from '@resource/components/XCheckBox';
import tipsIcon from '@resource/static/icons/handleIcon/tips.png';
import AlertTip from '@common/components/AlertTip';
import XSelect from '@resource/websiteCommon/components/dom/XSelect';
import main from './handle/main';
import PricingCollapse from '../../../components/pricingCollapse';
import service from '../../../constants/service';
import PricingCollapseCell from './components/cell';
import SelfPricingCollapseCell from './components/selfCell';
import light from './icons/Light.png';
import './index.scss';
import classNames from 'classnames';
import XLoading from '@resource/components/XLoading';
import { getQs } from '@resource/logevent/util/qs';

class Pricing extends Component {
  state = { data: [] };

  constructor(props) {
    super(props);
    this.state = {
      isShowLoading: true,
      rack_spu_id: '',
      rack_id: '',
      isAllOpened: false,
      isRequestCompleted: true,
      attrList: [],
      rackSpuDetail: {},
      rackSkuList: [],
      optionList: [],
      uuidList: [],
      uuidOptions: [],
      skuAttrList: [],
      saveDisable: true,
      onlyShowSelled: true
    };
  }

  onSave = () => main.onSave(this);
  onBack = () => main.onBack(this);
  showProductInfoModal = () => main.showProductInfoModal(this);
  showManagerOptionModal = () => main.showManagerOptionModal(this);
  showAppluBulkMarkupModal = () => main.showAppluBulkMarkupModal(this);
  onChangeUuid = e => main.onChangeUuid(this, e);
  showCollaspeAllModal = () => main.showCollaspeAllModal(this);

  componentDidMount() {
    const { boundGlobalActions } = this.props;
    boundGlobalActions.getEstoreInfo().then(() => {
      const rack_spu_id = getQs('rack_spu_id');
      const rack_id = getQs('rack_id');
      const rack_name = getQs('rack_name');
      this.setState(
        {
          rack_spu_id,
          rack_id,
          rack_name
        },
        () => {
          this.refreshPageData(rack_spu_id);
        }
      );
      const beforeunload = ev => {
        if (ev && !this.state.saveDisable) {
          ev.preventDefault();
          ev.returnValue = '';
        }
      };
      window.addEventListener('beforeunload', beforeunload);
    });
  }

  componentDidUpdate() {
    const software = document.getElementsByClassName('active-app');
    if (software && software.length > 0) {
      software.navbar.style.height = 0;
      software.software.style.top = 0;
    }
  }

  componentWillUnmount() {
    const software = document.getElementsByClassName('active-app');
    if (software && software.length > 0) {
      software.software.style.top = '48px';
    }
  }

  changeProduct() {
    // const { boundGlobalActions } = that.props;
  }

  getRenderOptionsHTML() {
    const { optionList } = this.state;
    if (optionList.length == 0) {
      return;
    }
    const html = [];
    if (optionList && optionList.length) {
      optionList.forEach((item, index) => {
        const { name, options } = item;
        html.push(
          <div className="row">
            <div className="cell text title">{name}</div>
            <div className="cell text">{options}</div>
          </div>
        );
      });
    }
    return html;
  }

  getRenderSelfFulfillmentHTML() {
    // debugger
    const html = [];
    const { newAttrList, rackSpuDetail } = this.state;
    if (!newAttrList || newAttrList.length == 0) {
      return html;
    }
    const deep = this.recursiveMax(newAttrList);
    const pricingTitleStyle = {
      marginLeft: 273 + deep * 30
    };

    html.push(
      <div>
        <div className="pricing">
          <div className="pricing-title">商品明细</div>
          <div style={pricingTitleStyle} className="self-pricing-title-container">
            <div className="price text title"> {rackSpuDetail.spu_type == 2 ? '' : 'Price'}</div>
            <div className="shipping text title">
              {rackSpuDetail.spu_type == 2 ? 'Price' : 'Additional Shipping Price'}
            </div>
          </div>
        </div>
        {this.getRenderFulfillmentHTML(newAttrList, html)}
      </div>
    );
    return html;
  }

  getPricingVariationGroupingList(cb) {
    const { showAttrList, onlyShowSelled } = this.state;
    if (showAttrList.length == 0) {
      return;
    }
    //获取全部关键属性 attr_type 是区分关键和非关键的，0关键，1非关键
    let newAttrList = showAttrList
      .filter(item => item.attr_type === 0)
      .sort((a, b) => a.sequence_no - b.sequence_no);

    // 全部关键属性列表
    let sku_attribute_list = [];
    newAttrList.forEach((element, index) => {
      const attrObject = {
        attr_key: element.key_code
      };
      // 设置点选属性值
      if (element.value_select_type == 2) {
        const attrValue = element.values.find(i => i.selected);
        attrObject.attr_value = attrValue?.value_term_code;
      }
      sku_attribute_list.push(attrObject);
    });

    // 过滤单选属性
    newAttrList = newAttrList.filter(item => item.value_select_type == 1);
    let attrs = [];
    newAttrList.forEach((element, index) => {
      // 获取已购选选项列表
      let selectedElements = element.values.filter(i => i.selected);

      // 数据为一个时为必选项目
      if (element.values.length == 1) {
        selectedElements = element.values;
      }
      selectedElements.forEach(value => {
        value.key_code = element.key_code;
      });

      if (selectedElements.length > 0) {
        if (attrs.length == 0) {
          selectedElements.forEach(selectedElement => {
            selectedElement.sku_attribute_list = this.updateSkuAttributeList([], selectedElement);
          });
          attrs = selectedElements;
        } else {
          this.attrsGrouping(attrs, selectedElements);
        }
      }
    });
    // 设置sku
    if (attrs.length > 0) {
      this.newAttrsGrouping(attrs, sku_attribute_list);
    }
    const shakeData = this.handleShakeData(attrs, onlyShowSelled);
    this.setState(
      {
        newAttrList: shakeData
      },
      () => {
        if (cb) {
          cb();
        }
      }
    );
  }

  handleShakeData = (data, onlyShowSelled) => {
    let outData = [];
    const { rackSpuDetail } = this.state;
    if (!onlyShowSelled || rackSpuDetail.spu_type != 2) {
      return data;
    }
    data.forEach(item => {
      const values = [];
      if (item.values && item.values.length) {
        item.values.forEach(subItem => {
          const subValues = [];
          if (subItem.values && subItem.values.length) {
            subItem.values.forEach(value => {
              if (value.skuObj) {
                subValues.push(subItem.values);
              }
            });
          }
          if (subValues.length) {
            values.push(subItem);
          }
        });
      }
      if (values.length) {
        outData.push({
          ...item,
          values
        });
      }
    });
    return outData;
  };

  // 递归排序获取SkuObject
  newAttrsGrouping(attrs, sku_attribute_list) {
    attrs.forEach(attr => {
      const values = attr.values;
      if (!values) {
        attr.skuObj = this.getSkuObject(this.updateSkuAttributeList(sku_attribute_list, attr));
      } else {
        const sku_attribute_list_copy = this.updateSkuAttributeList(sku_attribute_list, attr);
        this.newAttrsGrouping(values, sku_attribute_list_copy);
      }
    });
  }

  attrsGrouping(attrs, selectedElements) {
    const firstAttr = attrs[0];
    const values = firstAttr.values;
    if (selectedElements.find(item => item.value_term_code == firstAttr.value_term_code)) {
      return;
    }
    if (!values) {
      attrs.forEach(element => {
        const newSelectedElements = selectedElements.map(selectedElement => {
          return selectedElement;
        });
        element.values = JSON.parse(JSON.stringify(newSelectedElements));
      });
    } else {
      attrs.forEach(element => {
        this.attrsGrouping(element.values, selectedElements);
      });
    }
  }

  getSkuObject(sku_attribute_list) {
    const { rackSkuList, onlyShowSelled, rackSpuDetail } = this.state;
    let newSkuList = rackSkuList;
    sku_attribute_list.forEach(element => {
      newSkuList = newSkuList.filter(sku => {
        if (sku.option_sku_effect || !onlyShowSelled || rackSpuDetail.spu_type != 2) {
          return sku.rack_sku_attribute_list.find(attr => attr.attr_value == element.attr_value);
        }
        return false;
        // return sku.rack_sku_attribute_list.find(attr => attr.attr_value == element.attr_value);
      });
    });
    return newSkuList[0];
  }

  updateSkuAttributeList(sku_attribute_list, element) {
    sku_attribute_list.forEach(attr => {
      if (attr.attr_key == element.key_code) {
        attr.attr_value = element.value_term_code;
      }
    });
    return sku_attribute_list;
  }
  // 递归获取最大层级
  recursiveMax(input) {
    var maxLength = 1;
    if (input.length > 0) {
      const values = input[0]?.values;
      if (values && values.length > 0) {
        const newNumber = this.recursiveMax(values);
        return newNumber + maxLength;
      }
    }
    return maxLength;
  }

  getRenderAutoFulfillmentHTML() {
    const html = [];
    const { newAttrList } = this.state;
    if (!newAttrList || newAttrList.length == 0) {
      return html;
    }
    const deep = this.recursiveMax(newAttrList);
    const pricingTitleStyle = {
      marginLeft: 170 + deep * 30
    };

    html.push(
      <div>
        <div className="pricing">
          <div className="pricing-title">商品明细</div>
          <div style={pricingTitleStyle} className="pricing-title-container">
            <div className="a text title">成本</div>
            <div className="b text title">利润</div>
            <div className="c text title">售价</div>
          </div>
        </div>
        {this.getRenderFulfillmentHTML(newAttrList, html)}
      </div>
    );
    return html;
  }

  getRenderFulfillmentHTML(attrs, html) {
    const firstAttr = attrs[0];
    const values = firstAttr.values;
    const { isAllOpened, rackSpuDetail } = this.state;
    if (values) {
      const newHtml = [];
      attrs.forEach(element => {
        const pricingProps = {
          isAllOpened,
          element,
          html: this.getRenderFulfillmentHTML(element.values, html)
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
        rackSpuDetail,
        element,
        onChangePrice: () => {
          this.setState({
            saveDisable: false
          });
          window.logEvent.addPageEvent({
            name: 'Estore_Products_CustomizeSPU_Click_EditSKUPrice'
          });
        }
      };

      // 附属属性 无价格的不展示
      if (rackSpuDetail.spu_type == 2 && !element.skuObj) {
        return;
      }
      rackSpuDetail.fulfill_type == 1
        ? htmls.push(<PricingCollapseCell {...cellProps} />)
        : htmls.push(<SelfPricingCollapseCell {...cellProps} />);
    });
    return <div>{htmls}</div>;
  }

  autoFulfillmentCell(attr) {
    const html = [];
    html.push(
      <div className="row">
        <div className="cell"></div>
        <div className="cell text">$100</div>
        <div className="cell text">$200</div>
        <input className="cell"></input>
      </div>
    );
    return html;
  }

  /**
   * 重新刷新页面数据
   */
  async refreshPageData(rack_spu_id) {
    this.setState({
      isShowLoading: true
    });
    try {
      const rackSpuDetail = await this.getRackSpuDetail(rack_spu_id);
      const rackSkuList = await this.getRackSkuList(rack_spu_id);
      const { spu_uuid } = rackSpuDetail;
      const attrList = await this.listAttrBySpu(spu_uuid);
      const uuidList = await this.listSpuByUuid(spu_uuid);

      // 排序
      attrList.sort((a, b) => a.sequence_no - b.sequence_no);
      attrList.forEach(item => {
        item.values.sort((a, b) => a.sequence_no - b.sequence_no);
      });
      // 过滤显示用属性
      const showAttrList = attrList.filter(item => (1 & item.show_scope) > 0);
      // rackSpuDetail.spu_type = 2
      const uuidOptions = [];
      uuidList.forEach(element => {
        uuidOptions.push({
          label: element.display_name,
          value: element.spu_uuid
        });
      });
      this.setState(
        {
          showAttrList,
          attrList,
          rackSpuDetail,
          rackSkuList,
          uuidList,
          uuidOptions,
          isShowLoading: false
        },
        () => {
          this.updateAttrList();
          this.getPricingVariationGroupingList();
        }
      );
    } catch (error) {
      console.log(error);
      this.setState({
        isShowLoading: false
      });
      this.props.boundGlobalActions.addNotification({
        message: t('SERVICE_ERROR_UNKNOWN'),
        level: 'success',
        autoDismiss: 3
      });
    }
  }

  /**
   * 添加是否已选
   * @returns
   */
  updateAttrList() {
    const { rackSpuDetail, showAttrList } = this.state;
    if (!!!rackSpuDetail.selected_attrs || showAttrList.length == 0) {
      return;
    }
    const optionList = [];
    const attrs = JSON.parse(rackSpuDetail.selected_attrs);
    attrs.forEach((item, index) => {
      const collection = {};
      const key = Object.keys(item)[0];
      const values = Object.values(item)[0].split(',');
      const attr = showAttrList.find(i => i.key_code == key);
      if (attr) {
        const valuesNames = [];
        attr.values.sort((a, b) => a.sequence_no - b.sequence_no);
        attr.values.forEach(v => {
          if (values.indexOf(v.value_term_code) > -1) {
            valuesNames.push(v.display_name);
            v.selected = true;
          }
        });
        collection.name = attr.display_name;
        collection.options = valuesNames.join(', ');
        collection.sequence_no = attr.sequence_no;
        optionList.push(collection);
      }
    });
    // 根据sequence_no 重新排序
    optionList.sort((a, b) => a.sequence_no - b.sequence_no);
    this.setState({
      optionList
    });
  }

  // 保存价格
  savePrice = async () => {
    const { newAttrList } = this.state;
    const amount_param = [];
    this.priceAttrList(newAttrList, amount_param);
    amount_param.map(item => {
      item.price = item.suggested_price;
    });
    const param = {
      type: 'AMOUNT',
      param: amount_param
    };
    const data = await this.applyMarkup(param);
    return data;
  };
  // 递归排序获取SkuObject
  priceAttrList(newAttrList, amount_param) {
    newAttrList.forEach(attr => {
      const values = attr.values;
      if (!values) {
        attr.skuObj && amount_param.push(attr.skuObj);
      } else {
        this.priceAttrList(attr.values, amount_param);
      }
    });
  }
  /**
   * 获取sku list
   * @param {} rack_spu_id
   */
  getRackSkuList = async rack_spu_id => {
    const { urls } = this.props;
    const baseUrl = urls && urls.get('estoreBaseUrl');
    try {
      const res = await service.getRackSkuList({ baseUrl, rack_spu_id });
      const { data, ret_code } = res;
      if (data && ret_code == 200000) {
        data.forEach(item => {
          item.base_price = Number(item.base_price ? item.base_price : '0').toFixed(2);
          item.suggested_price = Number(item.suggested_price ? item.suggested_price : '0').toFixed(
            2
          );
          item.addition_shipping_fee = Number(
            item.addition_shipping_fee ? item.addition_shipping_fee : '0'
          ).toFixed(2);
        });
        // return data.map((item, i) => {
        //   if (i < 50) {
        //     return {
        //       ...item,
        //       option_sku_effect: false
        //     }
        //   }
        //   return item;
        // });
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  getRackSpuDetail = async rack_spu_id => {
    const { urls } = this.props;
    const baseUrl = urls && urls.get('estoreBaseUrl');
    try {
      const res = await service.getRackSpuDetail({ baseUrl, rack_spu_id });
      const { data, ret_code } = res;
      if (data && ret_code == 200000) {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  listAttrBySpu = async (spu_uuid = 'ZNO_WA_WOODFRAME') => {
    const { urls } = this.props;
    const baseUrl = urls && urls.get('estoreBaseUrl');
    try {
      const res = await service.listAttrBySpu({ baseUrl, spu_uuid });
      const { data, ret_code } = res;
      if (data && ret_code == 200000) {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  listSpuByUuid = async (spu_uuid = 'ZNO_WA_WOODFRAME') => {
    const { urls } = this.props;
    const baseUrl = urls && urls.get('estoreBaseUrl');
    try {
      const res = await service.listSpuByUuid({ baseUrl, spu_uuid });
      const { data, ret_code } = res;
      if (data && ret_code == 200000) {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  changeCarrierSupplierSpu = async (rack_spu_id, store_id, spu_uuid) => {
    const { urls } = this.props;
    const baseUrl = urls && urls.get('estoreBaseUrl');
    try {
      const res = await service.changeCarrierSupplierSpu({
        baseUrl,
        rack_spu_id,
        store_id,
        spu_uuid
      });
      const { ret_code } = res;
      if (ret_code == 200000) {
        return res;
      }
      this.props.boundGlobalActions.addNotification({
        message: t('SERVICE_ERROR_UNKNOWN'),
        level: 'success',
        autoDismiss: 3
      });
    } catch (error) {
      console.log(error);
    }
  };

  managerOption = async options => {
    const { urls, estoreInfo } = this.props;
    const { rack_spu_id, rack_id } = this.state;
    const store_id = estoreInfo.id;
    const baseUrl = urls && urls.get('estoreBaseUrl');
    try {
      const res = await service.managerOption({ baseUrl, store_id, rack_spu_id, rack_id, options });
      const { ret_code } = res;
      if (ret_code == 200000) {
        return res;
      }
      this.props.boundGlobalActions.addNotification({
        message: t('SERVICE_ERROR_UNKNOWN'),
        level: 'success',
        autoDismiss: 2
      });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   *
   * @param {*} type AMOUNT表示直接设置价格（对应UI中单个价格的设置），PERCENT 表示通过设置比例（对应UI中的apply bulk markup）
   * @param {*} param  当type=PERCENT时 设置percent_param，当type= AMOUNT时 设置amount_param
   * @returns
   */
  applyMarkup = async ({ type, param }) => {
    const { urls } = this.props;
    const { rack_spu_id } = this.state;
    const baseUrl = urls && urls.get('estoreBaseUrl');
    const applyPriceParam = { baseUrl, rack_spu_id, type };
    if (type == 'PERCENT') {
      applyPriceParam.percent_param = param;
    }
    if (type == 'AMOUNT') {
      applyPriceParam.amount_param = param;
    }
    try {
      const res = await service.applyMarkup(applyPriceParam);
      const { ret_code } = res;
      if (ret_code == 200000) {
        this.setState({
          isAllOpened: true
        });
        return res;
      }
      this.props.boundGlobalActions.addNotification({
        message: t('SERVICE_ERROR_UNKNOWN'),
        level: 'success',
        autoDismiss: 2
      });
    } catch (error) {
      console.log(error);
    }
  };

  showSell = () => {
    const { isAllOpened, onlyShowSelled } = this.state;
    const handle = cb => {
      this.setState({ onlyShowSelled: !onlyShowSelled }, () => {
        this.updateAttrList();
        this.getPricingVariationGroupingList(cb);
      });
    };
    if (!isAllOpened) {
      handle();
    } else {
      this.setState(
        {
          isAllOpened: false
        },
        () => {
          setTimeout(() => {
            handle(() => {
              this.setState({
                isAllOpened: true
              });
            });
          }, 200);
        }
      );
    }
  };

  render() {
    const {
      isAllOpened,
      rackSpuDetail,
      rackSkuList,
      uuidOptions,
      isShowLoading,
      saveDisable,
      onlyShowSelled
    } = this.state;

    const selectProps = {
      value: rackSpuDetail && rackSpuDetail.spu_uuid,
      searchable: false,
      clearable: false,
      options: uuidOptions,
      onChanged: this.onChangeUuid
    };
    const collaspeClass = classNames('icon collaspe', {
      active: isAllOpened
    });

    const saveClass = classNames('save-btn', {
      disabled: saveDisable
    });

    //fulfill_type 1:automatic 2: self，  spu_type 1:Produict 2: Extra Spreads
    const fulfillmentText =
      rackSpuDetail &&
      rackSpuDetail.supplier_name +
        ` (${
          rackSpuDetail.fulfill_type == 1 ? `${t('AUTOMATIC_FULFILLMENT', 'Automatic')}` : 'Self'
        })`;
    return (
      <div className="estore-pricing-wrapper">
        <div className="estore-pricing-container">
          <div className="nav-container">
            <div className="back-container" onClick={this.onBack}>
              <div className="back-img" />
              <div className="back-text">返回</div>
            </div>
            <div className={saveClass} onClick={this.onSave}>
              保存
            </div>
          </div>
          <div className="product-content">
            {rackSpuDetail && rackSpuDetail.spu_name ? (
              <div className="product-container">
                {/* Product Section */}
                <div className="section-container border-bottom">
                  <div className="title-container">
                    <div className="title">
                      <div className="text section-title">{rackSpuDetail.category_name}</div>
                      {rackSpuDetail && rackSpuDetail.default_pages && (
                        <div className="text ">(默认：{rackSpuDetail.default_pages} 页)</div>
                      )}
                    </div>
                    {rackSpuDetail.spu_type == 1 ? (
                      <div className="section-btn" onClick={this.showProductInfoModal}>
                        <div className="icon info" />
                        <div className="text">商品信息</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="info-container">
                    <div className="text title">履约模式</div>
                    <div className="info-text text">{fulfillmentText}</div>
                    {rackSpuDetail.spu_type == 1 ? (
                      <div className="info-lab-container">
                        <div className="info-lab text title">厂商商品名</div>
                        <div className="select-container">
                          {uuidOptions.length > 1 ? (
                            <XSelect {...selectProps} />
                          ) : (
                            <div className="text">{rackSpuDetail.spu_name}</div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                {/* Product Options Section */}
                {rackSpuDetail.spu_type == 1 ? (
                  <div className="section-container border-bottom">
                    <div className="title-container">
                      <div className="title">
                        <div className="text section-title">商品选项</div>
                      </div>
                      <div className="section-btn" onClick={this.showManagerOptionModal}>
                        <div className="icon option" />
                        <div className="text">编辑选项</div>
                      </div>
                    </div>
                    <div className="options-container">
                      <div className="grid">{this.getRenderOptionsHTML()}</div>
                    </div>
                  </div>
                ) : null}

                {rackSpuDetail.spu_type == 2 ? (
                  <div className="section-container border-bottom extra">
                    <img className="light" src={light}></img>
                    <span className="text extra">
                      您需要对相册额外的加页进行定价，定价针对跨页（相册左页+相册右页）进行，这张价格表里的所有相册的加页收费都会根据这里的定价计算。
                    </span>
                  </div>
                ) : null}
                {/* Pricing Section */}
                <div className="section-container ">
                  <div className="title-container">
                    <div className="title">
                      <div className="text section-title">定价</div>
                    </div>
                    <div className="section-btns">
                      {rackSpuDetail.spu_type == 2 && (
                        <div className="section-btn check" onClick={this.showSell}>
                          <CheckBox
                            checked={onlyShowSelled}
                            isShowChecked
                            className="custom-checkout black-theme"
                          />
                          <span className="text">
                            只显示在售
                            <AlertTip
                              className="tips-alert"
                              maxWidth="365px"
                              message={t('SHOW_VARIATIONS_TEXT')}
                              icon={tipsIcon}
                              placement="top"
                            />
                          </span>
                        </div>
                      )}
                      {rackSpuDetail.fulfill_type == 1 ? (
                        <div className="section-btn" onClick={this.showAppluBulkMarkupModal}>
                          <div className="icon markup" />
                          <div className="text">批量定价</div>
                        </div>
                      ) : null}
                      <div className="section-btn" onClick={this.showCollaspeAllModal}>
                        <div className={collaspeClass} />
                        <div className="text">{isAllOpened ? '收起' : '展开'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="options-container top">
                    {rackSpuDetail.fulfill_type == 1
                      ? this.getRenderAutoFulfillmentHTML()
                      : this.getRenderSelfFulfillmentHTML()}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <XLoading zIndex={99} isShown={isShowLoading} />
        </div>
      </div>
    );
  }
}

export default Pricing;
