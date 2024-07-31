import React, { Component } from 'react';
import { getLanguageCode } from '@resource/lib/utils/language';
import { getImageByLanguage } from '../../../utils/img';
import './index.scss';
import '../OrderList/table-grid.scss';

class OrderItems extends Component {
  constructor(props) {
    super(props);

    this.getRenderHTML = this.getRenderHTML.bind(this);
    this.onImageError = this.onImageError.bind(this);
    this.getRenderBottomHTML = this.getRenderBottomHTML.bind(this);
  }

  onImageError(e) {
    const lang = getLanguageCode();
    e.target.src = getImageByLanguage('defaultCoverImage', lang);
  }

  getRenderHTML() {
    const { data } = this.props;
    const { itemViewList, trackingNumberMap } = data;
    const html = [];

    // 根据运单号排序 将同一个运单号的产品排在一起
    itemViewList.sort((a, b) => {
      const ac = a.trackingNumber ? a.trackingNumber.split(',')[0] : '';
      const bc = b.trackingNumber ? b.trackingNumber.split(',')[0] : '';
      return bc.localeCompare(ac);
    });

    // 计算同ProjectID跨行的行数

    let lastProjectId = '';

    // const itemGroups = [];

    const itemGroups = itemViewList.reduce((result, item) => {
      const { itemUid, projectId } = item;
      if (projectId) {
        const foundGroup = result.find(group => {
          return group.find(it => it.projectId == projectId);
        });

        if (foundGroup && projectId == lastProjectId) {
          foundGroup.push(item);
        } else {
          const newGroup = [];
          newGroup.push(item);
          result.push(newGroup);
        }
      } else {
        const newGroup = [];
        newGroup.push(item);
        result.push(newGroup);
      }

      lastProjectId = projectId;

      return result;
    }, []);

    // 渲染主产品
    itemViewList.forEach((item, index) => {
      const {
        itemUid,
        itemPreviewUrl,
        itemDisplayName,
        itemUnitPrice,
        itemQuantity,
        itemUnitTotal,
        childItemViewList = [],
        trackingNumber,
        itemSkuDisplayName,
        projectId
      } = item;

      // 当前产品需要跨行的行数
      const currenItemCount = 1 + (Array.isArray(childItemViewList) && childItemViewList.length ? childItemViewList.length : 0);

      const foundGroup = itemGroups.find(group => {
        return group.find(it => it.itemUid == itemUid);
      });

      // 同ProjectID的产品是否已经添加过列
      const isGroupShowed = foundGroup.showed;
      if (!isGroupShowed) {
        foundGroup.showed = true;
      }

      let sameProjectSpanCount = 1;
      if (foundGroup) {
        sameProjectSpanCount = foundGroup.length;
      }

      html.push(
        <tr key={`${itemUid}-${index}`} className="item">
          {isGroupShowed ? null : (
            <td rowSpan={sameProjectSpanCount}>
              <img src={itemPreviewUrl} onError={this.onImageError} />
            </td>
          )}
          <td className="align-left">{itemSkuDisplayName ? itemSkuDisplayName : itemDisplayName}</td>
          <td rowSpan={currenItemCount} className="bool">
            {itemUnitPrice}
          </td>
          <td rowSpan={currenItemCount} className="bool">
            {itemQuantity}
          </td>
          <td rowSpan={currenItemCount} className="bool">
            {itemUnitTotal}
          </td>
        </tr>
      );

      // 渲染子产品
      if (childItemViewList && childItemViewList.length) {
        childItemViewList.forEach((sItem, index) => {
          const {
            itemUid,
            itemPreviewUrl,
            itemDisplayName,
            itemUnitPrice,
            itemQuantity,
            itemUnitTotal,
            itemSkuDisplayName
          } = sItem;
          html.push(
            <tr key={`${itemUid}-${index}`} className="sub-item">
              <td>
                <img src={itemPreviewUrl} onError={this.onImageError} />
              </td>
              <td className="align-left-child">
                <div className="title">{itemSkuDisplayName}</div>
              </td>
            </tr>
          );
        });
      }
    });

    return html;
  }

  getRenderBottomHTML() {
    const { data, isDSOrder } = this.props;
    const {
      itemTotal,
      subTotalDiscountMoney,
      subTotalMoney,
      shippingCostMoney,
      depositMoney,
      cnCreditMoney,
      totalMoney,
      usedCredit,
      tax
    } = data;

    const html = [];

    const creditHtml = <tr className="foot" key={3}> <td colSpan="4">{t('CREDIT_USED')}</td> <td>-{usedCredit}</td></tr>;
    const orderTotalHtml = <tr className="foot" key={6}> <td colSpan="4" className="bool"> {t('ORDER_TOTAL')} </td> <td>{totalMoney}</td> </tr>;

    // design service订单
    // 订单类型 默认值：0  design services：1
    if (isDSOrder) {
      // 积分使用
      if (usedCredit) {
        html.push(creditHtml);
      }
      // 应付总额
      html.push(orderTotalHtml);

      return html;
    }

    // 商品总额
    html.push(
      <tr className="foot" key={0}>
        <td colSpan="4">{t('ITEMS_TOTAL')}</td>
        <td>{itemTotal}</td>
      </tr>
    );

    // 折扣
    if (subTotalDiscountMoney) {
      html.push(
        <tr className="foot" key={1}>
          <td colSpan="4">{t('DISCOUNT')}</td>
          <td>-{subTotalDiscountMoney}</td>
        </tr>
      );
    }

    // 合计
    html.push(
      <tr className="foot" key={2}>
        <td colSpan="4">{t('SUBTOTAL')}</td>
        <td>{subTotalMoney}</td>
      </tr>
    );

    // 积分使用
    if (usedCredit) {
      html.push(creditHtml);
    }

    // 运费
    html.push(
      <tr className="foot" key={4}>
        <td colSpan="4">{t('SHIPPING_COST')}</td>
        <td>{shippingCostMoney}</td>
      </tr>
    );

    // Tax
    if (tax) {
      html.push(
        <tr className="foot" key={5}>
          <td colSpan="4">{t('ESTIMATED_TAX')}</td>
          <td>{tax}</td>
        </tr>
      );
    }

    // 预存款抵扣
    // if (depositMoney) {
    //   html.push(
    //     <tr className="foot" key={4}>
    //       <td colSpan="5">预存款抵扣</td>
    //       <td>-{depositMoney}</td>
    //     </tr>
    //   );
    // }

    // // 积分抵扣
    // if (cnCreditMoney) {
    //   html.push(
    //     <tr className="foot" key={5}>
    //       <td colSpan="5">积分抵扣</td>
    //       <td>-{cnCreditMoney}</td>
    //     </tr>
    //   );
    // }

    // 应付总额
    html.push(orderTotalHtml);

    return html;
  }

  render() {
    const { data, isDSOrder } = this.props;
    const KEY_TITLE = isDSOrder ? "ORDER_PAGES" : "QUANTITY";
    return (
      <div className="section order-items">
        <div className="section-title">{t('PURCHASE_DETAILS')}</div>
        <div className="section-content">
          <table>
            <tr className="head">
              <td>{t('ORDER_DISPLAY')}</td>
              <td>{t('ITEM')}</td>
              {/* <td>快递单号</td> */}
              <td>{t('UNIT_PRICE')}</td>
              <td>{t(KEY_TITLE)}</td>
              <td>{t('UNIT_TOTAL')}</td>
            </tr>
            {this.getRenderHTML()}
            {this.getRenderBottomHTML()}
          </table>
        </div>
      </div>
    );
  }
}

export default OrderItems;
