import React, { Component } from 'react';
import '../OrderList/table-grid.scss';
import { NO_IMAGE_SRC } from '../../constants/apiUrl';
import './index.scss';

class OrderItems extends Component {
  constructor(props) {
    super(props);

    this.getRenderHTML = this.getRenderHTML.bind(this);
    this.onImageError = this.onImageError.bind(this);
    this.getRenderBottomHTML = this.getRenderBottomHTML.bind(this);
  }

  onImageError(e) {
    const noImageSrc = `${CDN_PREFIX}${NO_IMAGE_SRC}`;
    e.target.src = noImageSrc;
  }

  getRenderHTML() {
    const { data, userInfo } = this.props;
    const { itemViewList, trackingNumberMap } = data;
    const trackNumberShowed = {};
    const html = [];

    const isChildAccount = userInfo.get('customerLevel') === 3 || false;
    // 根据运单号排序 将同一个运单号的产品排在一起
    itemViewList.sort((a, b) => {
      const ac = a.trackingNumber ? a.trackingNumber.split(',')[0] : '';
      const bc = b.trackingNumber ? b.trackingNumber.split(',')[0] : '';
      return bc.localeCompare(ac);
    });

    // 计算同单号跨行的行数
    const countMergeRowsMap = itemViewList.reduce((result, item) => {
      const { childItemViewList = [], trackingNumber } = item;
      const lastTrackingNumber = trackingNumber ? trackingNumber.split(',')[0] : '';
      const itemCount = 1 + childItemViewList.length;
      if (!result[lastTrackingNumber]) {
        result[lastTrackingNumber] = itemCount;
      } else {
        result[lastTrackingNumber] += itemCount;
      }
      return result;
    }, {});

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
        itemSkuDisplayName
      } = item;

      const lastTrackingNumber = trackingNumber ? trackingNumber.split(',')[0] : '';

      // 当前产品需要跨行的行数
      const currenItemCount = 1 + childItemViewList.length;

      // 运单信息
      const trackInfo = lastTrackingNumber ? trackingNumberMap[lastTrackingNumber] : {};
      const { courier, trackingInfos } = trackInfo;

      // 同运单号的产品是否已经添加过列
      const isTrackerNumberShowed = trackNumberShowed[lastTrackingNumber];
      if (!isTrackerNumberShowed) {
        trackNumberShowed[lastTrackingNumber] = true;
      }

      html.push(
        <tr key={`${itemUid}-${index}`} className="item">
          <td>
            <img src={itemPreviewUrl} onError={this.onImageError} />
          </td>
          <td className="align-left">{itemSkuDisplayName}</td>
          {isTrackerNumberShowed ? null : (
            <td rowSpan={countMergeRowsMap[lastTrackingNumber]} className="tracking-number">
              {
                lastTrackingNumber ?
                  <a href="javascript:;">
                    {lastTrackingNumber}
                    <span className="dot"></span>
                    <div className="tracking-log">
                      <div className="content">
                        <div className="courier">{`${courier}： ${lastTrackingNumber}`}</div>
                        <ul>
                          {
                            trackingInfos.map((item, index) => {
                              const { infoDate, infoMsg } = item;
                              const className = index === 0 ? 'latest' : '';
                              return (
                                <li key={index} className={className}>
                                  <span className="dota"></span>
                                  <div className="status">
                                    <p>{infoDate}</p>
                                    <p>{infoMsg}</p>
                                  </div>
                                </li>
                              )
                            })
                          }
                        </ul>
                      </div>
                    </div>
                  </a> : null
              }
            </td>
          )}
          { !isChildAccount ? <td rowSpan={currenItemCount}>{itemUnitPrice}</td> : null }
          <td rowSpan={currenItemCount}>{itemQuantity}</td>
          { !isChildAccount ? <td rowSpan={currenItemCount}>{itemUnitTotal}</td> : null }
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
              <td className="align-left">
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
    const { data } = this.props;
    const {
      itemTotal,
      subTotalDiscountMoney,
      subTotalMoney,
      shippingCostMoney,
      depositMoney,
      cnCreditMoney,
      totalMoney,
      rebatesMoney,
      returnRebatesMoney
    } = data;

    const html = [];

    // 商品总额
    html.push(
      <tr className="foot" key={0}>
        <td colSpan="5">商品总价</td>
        <td>{itemTotal}</td>
      </tr>
    );

    // 折扣
    if (subTotalDiscountMoney) {
      html.push(
        <tr className="foot" key={1}>
          <td colSpan="5">优惠码抵扣</td>
          <td>-{subTotalDiscountMoney}</td>
        </tr>
      );
    }

    // 返点
    if (rebatesMoney) {
      html.push(
        <tr className="foot" key={7}>
          <td colSpan="5">返点抵扣</td>
          <td>-{rebatesMoney}</td>
        </tr>
      );
    }

    // 预存优惠抵扣
    // if (depositMoney) {
    //   html.push(
    //     <tr className="foot" key={4}>
    //       <td colSpan="5">预存优惠抵扣</td>
    //       <td>-{depositMoney}</td>
    //     </tr>
    //   );
    // }

    // 预存款抵扣
    if (depositMoney) {
      html.push(
        <tr className="foot" key={4}>
          <td colSpan="5">预存款抵扣</td>
          <td>-{depositMoney}</td>
        </tr>
      );
    }

    // 积分抵扣
    // if (cnCreditMoney) {
    //   html.push(
    //     <tr className="foot" key={5}>
    //       <td colSpan="5">积分抵扣</td>
    //       <td>-{cnCreditMoney}</td>
    //     </tr>
    //   );
    // }

    // if (returnRebatesMoney) {
    //   html.push(
    //     <tr className="foot" key={8}>
    //       <td colSpan="5">
    //         本单返点
    //         <span className="info">
    //           <img src={infoIcon} />
    //           <div className="tip">取消订单返点将收回</div>
    //         </span>
    //       </td>
    //       <td>{returnRebatesMoney}</td>
    //     </tr>
    //   );
    // }

    // 运费
    html.push(
      <tr className="foot" key={3}>
        <td colSpan="5">配送费</td>
        <td>{shippingCostMoney}</td>
      </tr>
    );

    // 应付总额
    html.push(
      <tr className="foot" key={6}>
        <td colSpan="5">实付</td>
        <td>{totalMoney}</td>
      </tr>
    );

    return html;
  }

  render() {
    const isChildAccount = this.props.userInfo.get('customerLevel') === 3 || false;
    return (
      <div className="section order-items">
        <div className="section-title">订单详情</div>
        <div className="section-content">
          <table>
            <tr className="head">
              <td />
              <td>产品信息</td>
              <td>快递单号</td>
              { !isChildAccount ? <td>单价</td> : null }
              <td>数量</td>
              { !isChildAccount ? <td>总价</td> : null }
            </tr>
            {this.getRenderHTML()}
            {!isChildAccount ? this.getRenderBottomHTML() : null }
          </table>
        </div>
      </div>
    );
  }
}

export default OrderItems;
