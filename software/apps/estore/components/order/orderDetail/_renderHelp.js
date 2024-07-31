import classNames from 'classnames';
import { constant, merge } from 'lodash';
import { template } from 'lodash';
import React, { useEffect, useState } from 'react';

import { getImageUrl } from '@resource/lib/saas/image';

import { SAAS_GET_WATERMARK_IMAGE_URL } from '@resource/lib/constants/apiUrl';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import estoreService from '@apps/estore/constants/service';

import { canEditProjectStatus, orderStatusType } from '../../../constants/strings';

import Designer from './images/designer.png';
import Download from './images/download.png';
import Edit from './images/edit.png';
import Export from './images/export.png';
import View from './images/view.png';

export const renderOptionBtns = that => {
  const { detail, showItemBtns, shipment_number, courier, showTrackPop } = that.state;
  const { cstatus = orderStatusType.PAID } = detail;
  const statusObj = translateStatus(that, cstatus);
  const autoOptionBtns = statusObj.actions;
  function FocusEvent(that, item) {
    if (item.childBtns) {
      that.setState({
        showItemBtns: true,
      });
    }
  }
  return (
    autoOptionBtns &&
    autoOptionBtns.map(item => {
      return (
        <div
          className={'option_btn ' + item.className}
          onClick={item.action}
          onMouseEnter={() => {
            FocusEvent(that, item);
          }}
          onMouseLeave={() => {
            that.setState({ showItemBtns: false });
          }}
        >
          {item.name}
          {showTrackPop && (
            <div className="trackInfo">
              {courier && shipment_number ? (
                <>
                  <div className="tack_t">
                    {t('CARRIER')}: {courier}
                  </div>
                  <div className="tack_t">
                    {t('TRACKING_NUMBER')}: {shipment_number}
                  </div>
                </>
              ) : (
                <div className="no_ship tack_t">{t('NO_SHIPPING_NEEDED')}</div>
              )}
            </div>
          )}
          {showItemBtns && item.childBtns && (
            <div className="childBox">
              {item.childBtns.map(child => {
                const className = child.name + ' child';
                return (
                  <div className={className} onClick={child.action}>
                    {child.name}{' '}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    })
  );
};
function renderChildBtns(that, status) {
  const markStatusList = [
    {
      status: orderStatusType.IN_PRODUCTION,
      name: t('PROCESSING', 'Processing'),
      action: () => {
        that.MarkStatus(orderStatusType.IN_PRODUCTION);
      },
    },
    {
      status: orderStatusType.IN_SHIPPING,
      name: t('SHIPPED', 'Shipped'),
      action: () => {
        that.MarkStatus(orderStatusType.IN_SHIPPING);
      },
    },
  ];
  let curIndex = markStatusList.findIndex(item => status === item.status);
  curIndex = curIndex || curIndex === 0 ? curIndex : -1;
  const initList = markStatusList.slice(curIndex + 1);
  return initList;
}
export const translateStatus = (that, status = orderStatusType.PAID) => {
  const { fulfillType, mixedExistedAuto } = that.state;
  status = orderStatusType[status];
  const autoStatusObj = {
    [orderStatusType.PAID]: {
      status: t('ORDER_REVIEW', 'Order Review'),
      info: t(
        'AUTO_ORDER_REVIEW_INFO',
        'When you are done reviewing, click "Send To Lab" to have the order processed by the lab.'
      ),
      actions: [
        {
          name: t('SEND_TO_LAB', 'Send To Lab'),
          action: that && that.sendToLab,
        },
        {
          name: t('CANCEL_ORDER', 'Cancel'),
          className: 'cancel',
          action: that && that.cancelOrder,
        },
      ].reduce((res, item) => {
        if (!(mixedExistedAuto && item.name === t('SEND_TO_LAB', 'Send To Lab'))) {
          res.push(item);
        }
        return res;
      }, []),
    },
    [orderStatusType.IN_PRODUCTION]: {
      status: t('PROCESSING', 'Processing'),
      info: t('ORDER_PROCESSING', 'The order has been sent to the print lab for fulfillment.'),
    },
    [orderStatusType.PROCESSED]: {
      status: 'Processed',
      info: 'The printing has been competed by the lab.',
    },
    [orderStatusType.UNPAID]: {
      // 仅国内用到
      status: t('UNPAID', '待支付生产费用'),
      info: t(
        'UNPAID_TIPS',
        '您目前已经在生产厂商创建生产订单，但是您尚未完成付款，请去生产厂商完成相应订单的支付。'
      ),
    },
    [orderStatusType.IN_SHIPPING]: {
      status: t('SHIPPED', 'Shipped'),
      info: t('SHIPPED_TIPS', 'The order has been fulfilled and shipped by the lab.'),
      className: 'trackPage',
      actions: [
        {
          name: t('TRACK_PACKAGE', 'Track Package'),
          action: that && that.trackPackage,
        },
      ],
    },
    [orderStatusType.COMPLETED]: {
      status: 'Processed',
      info: 'The printing has been competed by the lab.',
    },
    [orderStatusType.CANCELLED]: {
      status: t('CANCELLED', 'Cancelled'),
      info: t(
        'CANCELLED_ORDER_TIPS',
        'The order is cancelled. It is important to note that this doesn’t necessarily mean your client has been refunded.'
      ),
    },
  };
  const selfStatusObj = {
    [orderStatusType.PAID]: {
      status: t('ORDER_REVIEW', 'Order Review'),
      info: t(
        'ORDER_REVIEW_TIPS',
        'The order is on hold for your review. You can edit the projects for your clients before exporting.'
      ),
      actions: [
        {
          name: t('MARK_AS', 'MARK_AS ...'),
          childBtns: renderChildBtns(that, status),
        },

        {
          name: t('CANCEL_ORDER', 'Cancel'),
          className: 'cancel',
          action: that && that.cancelOrder,
        },
      ],
    },
    [orderStatusType.IN_PRODUCTION]: {
      status: t('PROCESSING', 'Processing'),
      info: t('ORDER_PROCESSING', 'The order has been sent to the print lab for fulfillment.'),
      actions: [
        {
          name: t('MARK_AS', 'MARK_AS ...'),
          childBtns: renderChildBtns(that, status),
        },
        {
          name: t('CANCEL_ORDER', 'Cancel'),
          className: 'cancel',
          action: that && that.cancelOrder,
        },
      ],
    },
    [orderStatusType.IN_SHIPPING]: {
      status: t('SHIPPED', 'Shipped'),
      info: t('SHIPPED_TIPS', 'The order has been fulfilled and shipped by the lab.'),
      actions: [
        {
          name: t('TRACK_PACKAGE', 'Track Package'),
          action: that && that.trackPackage,
          className: 'trackPage',
        },
      ],
    },
    [orderStatusType.UNPAID]: {
      // 仅国内用到
      status: t('UNPAID', '待支付生产费用'),
      info: t(
        'UNPAID_TIPS',
        '您目前已经在生产厂商创建生产订单，但是您尚未完成付款，请去生产厂商完成相应订单的支付。'
      ),
    },
    [orderStatusType.CANCELLED]: {
      status: t('CANCELLED', 'Cancelled'),
      info: t(
        'CANCELLED_ORDER_TIPS',
        'The order is cancelled. It is important to note that this doesn’t necessarily mean your client has been refunded.'
      ),
      actions: [],
    },
  };
  const extraStatusObj = {
    [orderStatusType.CREATED]: {
      status: t('PENDING_PAYMENT', 'Pending Payment'),
      info: t(
        'ORDER_DETAILS_TIPS1',
        'This order was placed through Offline Payment. Please confirm receipt of the payment before clicking "Mark as Paid".'
      ),
      actions: [
        {
          name: t('MARK_AS_PAID', 'Mark as Paid'),
          action: that && that.MarkAsPaid,
        },
        {
          name: t('CANCEL_ORDER', 'Cancel'),
          className: 'cancel',
          action: that && that.cancelOrder,
        },
      ],
    },
  };
  let curStatusObj = fulfillType === 'Auto' ? autoStatusObj : selfStatusObj;

  if (extraStatusObj[status]) {
    curStatusObj = Object.assign({}, curStatusObj, extraStatusObj);
  }

  return curStatusObj[status];
};

export const renderStatus = that => {
  const { detail } = that.state;
  const { cstatus = orderStatusType.PAID } = detail;
  const statusObj = translateStatus(that, cstatus);
  if (statusObj)
    return (
      <React.Fragment>
        <span className="status">{statusObj.status}</span>
        <span className="status_detail">{statusObj.info}</span>
      </React.Fragment>
    );
};

export const getCanEditProject = status => {
  if (canEditProjectStatus.includes(orderStatusType[status])) return true;
};
const Img = ({ item, urls }) => {
  const { target_product_type, cover_storage_path, target_id } = item;
  const baseUrl = urls.get('estoreBaseUrl');
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const [imgUrl, setImgUrl] = useState('');
  useEffect(() => {
    if (target_product_type === 2) {
      const imgBaseUrl = urls.get('imgBaseUrl');
      estoreService.getImageUrl({ baseUrl, asset_uuid: cover_storage_path }).then(res => {
        const { storage_path } = res;
        setImgUrl(imgBaseUrl + storage_path);
      });
    } else if (target_product_type === 4) {
      const galleryBaseUrl = urls.get('galleryBaseUrl');
      // const imageUrl = getImageUrl({
      //   galleryBaseUrl: galleryBaseUrl,
      //   image_uid: cover_storage_path,
      //   thumbnail_size: thumbnailSizeTypes.SIZE_350,
      //   isWaterMark: true,
      //   with_exif: 1
      // });
      const imgUrl = template(SAAS_GET_WATERMARK_IMAGE_URL)({
        galleryBaseUrl,
        image_uid: cover_storage_path,
        thumbnail_size: thumbnailSizeTypes.SIZE_350,
        with_exif: 1,
      });
      setImgUrl(imgUrl);
    } else {
      setImgUrl(`${cloudapiUrl}cloudapi/upload_platform/cover/view?projectId=${target_id}`);
    }
  }, [target_product_type]);
  return <img src={imgUrl} alt="" />;
};
export const renderOrderList = that => {
  const {
    item_detail = [],
    currency = {},
    status,
    curTab,
    productTabs,
    mixedExistedAuto,
  } = that.state;
  let tempItemDetail = item_detail;
  const { history, urls } = that.props;
  const canEditProject = getCanEditProject(status);
  const projectBtnText = canEditProject ? t('PAGENAV_EDIT') : t('ZOOM_OUT');
  const projectBtnImg = canEditProject ? Edit : View;
  const { fulfillType } = that.state;
  const { baseUrl = '', detail = {} } = that.state;
  const { customer_email, store_id, order_number, supplier_name } = detail;
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const { symbol } = currency;

  // if (!__isCN__) {
  //   const curType = productTabs[curTab] ? productTabs[curTab].productType : 0;
  //   tempItemDetail = tempItemDetail.filter(item => {
  //     if (item.target_product_type === 4) {
  //       return item.target_product_type === curType;
  //     }
  //     return item.fulfill_type === curType;
  //   });
  // }

  const curType = productTabs[curTab] ? productTabs[curTab].productType : 0;
  tempItemDetail = tempItemDetail.filter(item => {
    if (item.target_product_type === 4) {
      return item.target_product_type === curType;
    }
    return item.fulfill_type === curType;
  });

  const orderList = tempItemDetail.map(item => {
    const {
      target_id,
      target_rack_spu_id,
      enc_item_id,
      category_code,
      supplier_code,
      parent_category_code,
      item_id,
      quantity = 1,
      rack_id,
      target_product_type,
      fulfill_type,
      view_selected_photos,
    } = item;
    const isCustom = target_product_type === 2 && fulfill_type === 2;
    const isExistedSupplier = fulfill_type === 2 && target_product_type === 1;
    const url = `${cloudapiUrl}prod-assets/app/cxeditor/index.html?initGuid=${target_id}&virtualProjectGuid=${target_id}&packageType=single&languageCode=en&rackSpuId=${target_rack_spu_id}&entityId=${supplier_code}&entityType=${1}&categoryCode=${parent_category_code}&estoreSource=2&storeId=${store_id}&estoreEmail=${customer_email}&rackId=${rack_id}&estoreFrom=ORDER_DETAIL&storeOrderNo=${order_number}&backHref=${encodeURIComponent(
      location.href
    )}`;
    let supplierName = '';
    const isDigital = category_code === 'Digital';
    if (mixedExistedAuto && curTab === 0 && !isDigital) {
      supplierName = t('ZNO', 'Zno');
    } else if (isExistedSupplier) {
      //  && !__isCN__
      supplierName = supplier_name;
    } else if (isCustom) {
      //  && !__isCN__
      supplierName = t('CUSTOM', 'Custom');
    }

    return (
      <div className="tr">
        <div className="td img_td">
          <div className="tag">
            <Img item={item} urls={urls} />
            <div className="supplierName">{supplierName}</div>
          </div>
        </div>
        <div className="center_td">
          {item.item_sku.map(sku => {
            const {
              item_price = {},
              display_name,
              sku_quantity = 1,
              sku_price,
              sku_total_price,
              digital_other_info,
            } = sku;
            const { unit_price, unit_total } = item_price;
            let digital_content = '';
            if (category_code === 'Digital') {
              digital_content =
                digital_other_info?.digital_sku_type === 'SINGLE_PHOTO_DOWNLOAD'
                  ? `${digital_other_info?.digital_photo_num} photos included`
                  : 'All photos included';
            }
            return (
              <div className="sku_list">
                <div className={classNames('td name_td', !!digital_content && 'digital')}>
                  <div className="display_name" title={display_name}>
                    {display_name}
                  </div>
                  {!!digital_content && (
                    <div className="digital_content" title={digital_content}>
                      {digital_content}{' '}
                    </div>
                  )}
                </div>
                <div className="td normal_td">
                  {symbol}
                  {sku_price}
                </div>
                <div className="td normal_td">{sku_quantity * quantity}</div>
                <div className="td normal_td">
                  {symbol}
                  {sku_total_price}
                </div>
              </div>
            );
          })}
        </div>
        {target_product_type === 4 ? (
          <div className="td view_td">
            {view_selected_photos && (
              <div
                className="view_row"
                onClick={() => {
                  that.ViewOrder(enc_item_id, urls);
                }}
              >
                <img src={View} />
                <a>{t('ZOOM_OUT')}</a>
              </div>
            )}
          </div>
        ) : (
          <div className="td view_td">
            {view_selected_photos && (
              <div
                className="view_row"
                onClick={() => {
                  that.ViewOrder(enc_item_id, urls);
                }}
              >
                <img src={View} />
                <a>{t('ZOOM_OUT')}</a>
              </div>
            )}
            {fulfillType === t('SELF_PRODUCT') && !isCustom && (
              <div
                className="view_row"
                onClick={() => {
                  that.ExportOrder(item_id);
                }}
              >
                <img src={Export} />
                <a>{t('EXPORT')}</a>
              </div>
            )}
            {isCustom ? (
              <>
                <div
                  className="view_row"
                  onClick={() => {
                    that.handleDownload(enc_item_id);
                  }}
                >
                  <img src={Download} />
                  <a>{t('DOWNLOAD_PHOTO')}</a>
                </div>
                {category_code === 'PB' && (
                  <div
                    className="view_row"
                    onClick={() => {
                      window.logEvent.addPageEvent({
                        name: 'Estore_Orders_OrderDetail_Click_Design',
                      });
                      history.push('/software/designer/projects');
                    }}
                  >
                    <img src={Designer} />
                    <a>{t('DESIGN_AUTO')}</a>
                  </div>
                )}
              </>
            ) : (
              <div
                className="view_row"
                onClick={() => {
                  that.openProject(url);
                }}
              >
                <img src={projectBtnImg} />
                <a>{projectBtnText}</a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  });
  return orderList;
};
export const renderPaymentDetail = that => {};
export const renderPayAddress = address => {
  let arr = [];
  for (let key in address) {
    if (address[key]) {
      arr.push(address[key]);
    }
  }
  return arr.join(', ');
};
