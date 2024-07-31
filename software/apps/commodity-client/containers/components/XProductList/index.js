import classNames from 'classnames';
import { template } from 'lodash';
import React, { Component } from 'react';

import XPureComponent from '@resource/components/XPureComponent';

import { PRODUCT_IMAGE_SRC } from '@resource/lib/constants/apiUrl';

import './index.scss';

class XProductList extends XPureComponent {
  constructor(props) {
    super(props);

    this.getRenderList = this.getRenderList.bind(this);
    this.selectProduct = this.selectProduct.bind(this);
  }
  selectProduct = item => {
    const { boundGlobalActions, urls, qs } = this.props;
    const { project_uid, goods_name, enc_goods_id, id } = item;
    boundGlobalActions.showModal('CREATE_PROJECT_NAME_MODAL', {
      project_uid,
      productTitle: goods_name,
      goods_id: id,
      ...this.props,
      closeModal: () => {
        boundGlobalActions.hideModal('CREATE_PROJECT_NAME_MODAL');
      },
    });
    console.log(item, 'item');
  };
  getRenderList(list) {
    const { baseUrl, productListMap } = this.props;
    const html = [];

    if (list && list.length) {
      list.forEach(item => {
        const { enc_goods_id, cover_img } = item;
        const itemName = item.goods_name;
        const price = item.reference_price || '';
        let imgUrl =
          cover_img ||
          'https://upload.cnzno.com.tt/upload/servlet/ProofBookCoverServlet?projectId=3439020&amp;coverType=frontCover&amp;sizeType=4&amp;mode=myBooksMode&amp;targetSize=184';
        html.push(
          <div className={'item'} key={enc_goods_id} onClick={() => this.selectProduct(item)}>
            <div className={'img-wrppaer'}>{!!imgUrl && <img src={imgUrl} />}</div>
            <div className="prod-name" title={itemName}>
              <div className="name-wrap">{itemName}</div>

              {!!price && (
                <div className="price">
                  售价:<span>￥{price}</span>
                </div>
              )}
            </div>
          </div>
        );
      });
    }

    return html;
  }

  render() {
    const { commodity, pageType } = this.props;
    const { goods } = commodity && commodity?.toJS();
    return (
      <div className="commodity-product-list-container">
        <div className="commodity-product-list">{this.getRenderList(goods)}</div>
      </div>
    );
  }
}

export default XProductList;
