import React, { Component } from 'react';

import CheckBox from '@resource/components/XCheckBox';
import XSelect from '@resource/components/XSelect';

import { NAME_CN_REG, NAME_REG } from '@resource/lib/constants/reg';

import { XModal, XPureComponent } from '@common/components';

import shippingService from '../../../constants/service';

import './index.scss';

class AddShippingModal extends XPureComponent {
  constructor(props) {
    super(props);
    const shippingData = props.data.get('shippingData');
    this.state = {
      showHint: false,
      shipping_id: shippingData ? shippingData?.get('id') : '',
      ship_method: shippingData ? shippingData?.get('ship_method_name') : '',
      flat_fee: shippingData ? shippingData?.get('shipping_fee') : '0.00',
      region_type: shippingData ? shippingData?.get('region_type') : 1,
      region_code: shippingData ? shippingData?.get('region_code') : 'US',
      region_name: shippingData ? shippingData?.get('region_name') : 'United States',
      countryList: [],
      hintText: '',
      sub_country: '',
      provinceList: [],
    };
  }

  componentDidMount() {
    this.getShippingCountryAndProvinceData();
  }

  // 获取地区列表
  getShippingCountryAndProvinceData = async () => {
    const { data } = this.props;
    const shippingData = data.get('shippingData');
    const estoreBaseUrl = data.get('estoreBaseUrl');
    try {
      const data = await shippingService.getShippingCountryAndProvince({
        baseUrl: estoreBaseUrl,
      });
      if (data && data?.data && data.data.length === 1) {
        this.setState({
          provinceList: this.transformRegionOptions(data?.data[0]?.child_regions),
        });
        if (!(shippingData && shippingData?.get('region_type') === 0)) {
          this.setState({
            region_type: 2,
          });
        }
      } else if (data && data?.data) {
        this.setState({
          countryList: this.transformRegionOptions(data?.data),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };
  transformRegionOptions = (regions = []) => {
    return regions.map(r => {
      const { id, region_type, region_code, region_name, parent_id, sequence_no, child_regions } =
        r;
      return {
        key: id,
        value: region_code,
        label: region_name,
        subOptions: child_regions ? this.transformRegionOptions(child_regions) : [],
        data: r,
      };
    });
  };

  changeShippingName(e) {
    this.setState({
      ship_method: e.target.value,
      showHint: false,
    });
  }

  changeEvent(e) {
    const value = e.target.value.replace(/[^\d]/, '');
    this.setState({
      inputValue: value,
    });
  }

  changeContry = e => {
    this.setState({
      region_name: e.label,
      region_code: e.value,
    });
  };
  changeShippingInternational(e) {
    const { value, checked, id } = e.target;
    const type = __isCN__ ? 2 : 1;
    this.setState({
      region_type: checked ? 0 : type,
    });
  }

  confirm = e => {
    const {} = this.props;
    const { shipping_id, ship_method, flat_fee, region_type, region_code, region_name } =
      this.state;
    const { data } = this.props;
    const confirm = data.get('confirm');
    const estoreBaseUrl = data.get('estoreBaseUrl');
    const estoreInfo = data.get('estoreInfo');
    const REG = __isCN__ ? NAME_CN_REG : NAME_REG;
    if (ship_method && !/^\s+$/.test(ship_method)) {
      if (!REG.test(ship_method)) {
        this.setState({
          showHint: true,
          hintText: t('CREATE_COLLECTION_ILLEGAL_TIP'),
        });
      } else {
        const obj = {
          baseUrl: estoreBaseUrl,
          id: shipping_id,
          store_id: estoreInfo.get('id'),
          ship_method: ship_method.trim(),
          flat_fee,
          region_type,
          region_code,
          region_name,
        };
        confirm(obj);
      }
    } else {
      this.setState({
        showHint: true,
        hintText: t('SHIPPING_METHOD_NAME_IS_REQUIRED'),
      });
    }
  };

  changeEvent(e) {
    let val = e.target.value.toString();
    val = val.replace(/[^\d.]/g, '');
    val = val.replace(/\.{2,}/g, '.');
    val = val.replace(/^0+\./g, '0.');
    val = val.match(/^0+[1-9]+/) ? (val = val.replace(/^0+/g, '')) : val;
    val = val.match(/^\d*(\.?\d{0,2})/g)[0] || '';
    if (val == '.') {
      val = '0.';
    }
    this.setState({
      flat_fee: val,
    });
  }

  onBlur(e) {
    const { flat_fee } = this.state;
    this.setState({
      flat_fee: Number(flat_fee).toFixed(2),
    });
  }

  render() {
    const {
      region_code,
      countryList,
      ship_method,
      flat_fee,
      showHint,
      region_type,
      hintText,
      provinceList,
    } = this.state;
    const { data } = this.props;
    const close = data.get('close');
    const selectProps = {
      searchable: false,
      options: __isCN__ ? provinceList : countryList,
      onChanged: this.changeContry,
    };
    const isShowSelect = region_type === 2 || region_type == 1;

    return (
      <XModal className="estore-edit-shipping-wrapper" opened={true} onClosed={close}>
        <div className="text title">{t('EDIT_SHIPPING_METHOD')}</div>
        <div className="text light">{t('YOU_CAN_ADD_MULTIPLE_SHIPPING_METHODS')}</div>
        <div className="shipping-container">
          <div className="text book">{t('NAME_THIS_SHIPPING_METHOD')}</div>
          <div className="shipping-input">
            <input
              maxLength={50}
              type="text"
              onChange={e => this.changeShippingName(e)}
              value={ship_method}
            ></input>
          </div>
          {showHint ? <div className="shipping-hint">{hintText}</div> : null}
          <div className="text light">{t('THIS_IS_WHAT_THE_CLIENTS')}</div>
          <div className="text book">{t('FLAT_FEE_PER_ORDER')}</div>
          <div className="shipping-input">
            <input
              type="text"
              onChange={e => this.changeEvent(e)}
              onBlur={e => this.onBlur(e)}
              value={flat_fee}
            ></input>
          </div>
          {isShowSelect && (
            <div>
              <div className="text book">{t('COUNTRY_REGION')}</div>
              <div className="select-container">
                <XSelect {...selectProps} value={region_code} />
              </div>
              <div className="text light">{t('SPECIFY_WHICH_COUNTRY')}</div>
            </div>
          )}
          <div className="input-content">
            <input
              id={region_type}
              type="checkbox"
              defaultChecked={region_type == 0}
              onChange={e => this.changeShippingInternational(e)}
              value={region_type}
            />
            <span className="text margin-left5">{t('SHIP_TO_INTERNATIONAL')}</span>
          </div>
        </div>
        <div className="btns-container">
          <div className="cancel" onClick={close}>
            {t('CANCEL')}
          </div>
          <div className="confirm" onClick={this.confirm}>
            {t('SAVE')}
          </div>
        </div>
      </XModal>
    );
  }
}

export default AddShippingModal;
