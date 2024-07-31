import React, { Component } from 'react';
import XSelect from '@resource/websiteCommon/components/dom/XSelect';
import ImageSlider from '../../imageSlider/index';
import { XModal, XPureComponent } from '@common/components';
import service from '../../../constants/service';
import { XLoading } from '@common/components';

import './index.scss';

class ProductInfoModal extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowLoading: true,
      rackSpuDetail: props.data.get('rackSpuDetail').toJS(),
      uuidOptions: props.data.get('uuidOptions').toJS(),
      baseUrl: props.data.get('baseUrl'),
      urls: props.data.get('urls').toJS(),
      productDetail: {}
    };
  }

  componentDidMount() {
    const { rackSpuDetail } = this.state;
    this.getSupplierSpuDetail(rackSpuDetail.spu_uuid);
  }

  save = () => {};
  onChangeUuid = e => {
    window.logEvent.addPageEvent({
      name: 'Estore_Products_CustomizeSPUProductInfoPop_Click_ProductFromTheLab'
    });
    const { value } = e;
    this.setState({
      isShowLoading: true
    });
    this.getSupplierSpuDetail(value);
  };
  // 获取产品详情数据
  getSupplierSpuDetail = async spu_uuid => {
    const { baseUrl } = this.state;
    try {
      const res = await service.getSupplierSpuDetail({ baseUrl, spu_uuid });
      const { data, ret_code } = res;
      if (data && ret_code == 200000) {
        this.setState({
          // isShowLoading: false,
          productDetail: data
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { rackSpuDetail, uuidOptions, productDetail, urls } = this.state;
    const { data } = this.props;
    const close = data.get('close');
    const selectProps = {
      value: productDetail && productDetail.spu_uuid,
      searchable: false,
      clearable: false,
      options: uuidOptions,
      onChanged: this.onChangeUuid
    };
    const fulfillmentText =
      rackSpuDetail &&
      rackSpuDetail.supplier_name +
        ` (${
          rackSpuDetail.fulfill_type == 1 ? `${t('AUTOMATIC_FULFILLMENT', 'Automatic')}` : 'Self'
        })`;
    //spu_asset_list 规则 (PC | WAP)/(saas_client_B | saas_client_C | www_client_WAP )/(ProductDetail | category)/(Slider_xxx | Profile_xxx | AdSpace_xxx)/[1+]
    const spu_asset_list =
      productDetail &&
      productDetail.spu_asset_list &&
      productDetail?.spu_asset_list.filter(i =>
        i.section_path.includes('PC/saas_client_B/ProductDetail/Slider')
      );
    const imageSliderProps = {
      spu_asset_list,
      urls
    };
    return (
      <XModal className="estore-product-info-modal-wrapper" opened={true} onClosed={close}>
        <div className="section-container  border-bottom">
          <div className="options-container">
            <div className="grid">
              <div className="row">
                <div className="cell text title">{productDetail.parent_category_name}</div>
                <div className="cell text title">{t('FULFILLMENT')}</div>
                <div className="cell text title">{t('PRODUCT_FROM_THE_LAB')}</div>
              </div>

              <div className="row">
                <div className="cell text">{productDetail && productDetail.category_name}</div>
                <div className="cell text">{fulfillmentText}</div>
                <div className="cell text select-width">
                  {uuidOptions.length > 1 ? (
                    <XSelect {...selectProps} />
                  ) : (
                    <div className="">{productDetail.display_name}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info*/}
        <div className="section-container padding">
          <div className="text title">{t('INTRODUCTION')}</div>
          <div className="text margin-top24">
            {productDetail && productDetail.product_description}
          </div>
          <div className="text title  margin-top24">{t('PRODUCTION')}</div>
          <div className="text  margin-top24">{productDetail && productDetail.production_desc}</div>
          <div className="image-slider">
            <ImageSlider {...imageSliderProps} />
          </div>
        </div>
      </XModal>
    );
  }
}

export default ProductInfoModal;
