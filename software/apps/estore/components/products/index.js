import React, { Component } from 'react';

import estoreService from '@apps/estore/constants/service';

import ProductContent from './components/productContent';
import ProductHeader from './components/productHeader';

import './index.scss';

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sheetList: [],
      loading: true,
      isExistedDigital: true,
    };
    this.commonAction = {};
  }

  componentDidMount() {
    this.getSheetList();
    this.commonAction = {
      ...this.commonAction,
      findDigital: (data = []) => {
        this.setState({
          isExistedDigital: !!data.find(item => item.category_code === 'Digital'),
        });
      },
    };
  }
  componentDidUpdate(preProps) {
    const { estoreInfo } = this.props;
    const { estoreInfo: preEstoreInfo } = preProps;
    const store_id = estoreInfo.id;
    const preStoreId = preEstoreInfo.id;
    if (store_id !== preStoreId) {
      this.getSheetList();
    }
  }

  getSheetList = async (options = {}) => {
    const { noLoading = false } = options;
    const { estoreInfo, urls } = this.props;
    const store_id = estoreInfo.id;
    const baseUrl = urls.get('estoreBaseUrl');
    !noLoading && this.setState({ loading: true });
    estoreService.estoreGetOptionList({
      baseUrl,
      root_spu_uid: 326,
      product_list: [
        {
          // 如果是单品，则默认是0， 套系，则根据具体的spu uuid 的顺序
          order: 0,
          // 单品则默认是当前页面的spu uuid
          product: 'ZNO_PB_LAYFLAT_PHOTO_BOOK',
        },
      ],
    });

    if (store_id) {
      try {
        const res = await estoreService.estoreGetList({ baseUrl, store_id });
        const { data = [] } = res;
        this.setState({
          sheetList: data || [],
          // loading: false
        });
        !noLoading &&
          setTimeout(() => {
            this.setState({ loading: false });
          }, 1000);
      } catch (e) {
        console.error(e);
      } finally {
        !noLoading && this.setState({ loading: false });
      }
    }
  };

  render() {
    const { urls } = this.props;
    const { sheetList, loading, isExistedDigital } = this.state;
    const commonProps = {
      getSheetList: this.getSheetList,
      loading,
      sheetList,
      isExistedDigital,
      baseUrl: urls?.get('estoreBaseUrl'),
    };
    return (
      <div className="estoreProductsWrapper">
        <ProductHeader {...this.props} {...commonProps} commonAction={this.commonAction} />
        <ProductContent {...this.props} {...commonProps} commonAction={this.commonAction} />
      </div>
    );
  }
}

export default Products;
