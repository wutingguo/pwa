import QS from 'qs';
import Tooltip from 'rc-tooltip';
import React, { useState } from 'react';

import { ADD_PRICE_SHEET_MODAL } from '@apps/estore/constants/modalTypes';
import estoreService from '@apps/estore/constants/service';

import shangpinpeizhi from '../../../static/shangpinpeizhi.png';
import xiazai from '../../../static/xiazai.png';

import './index.scss';

const AddCustomProduct = props => {
  const [visible, setVisible] = useState(false);
  const {
    actions: { reGetSpu, setLoading, boundGlobalActions, getSheetList },
    data: { urls, default_fulfill_type },
    isCustom,
    isExistedDigital,
  } = props;
  const urlParams = QS.parse(location.search.slice(1));
  const { rack_id, rack_name = '', supplier_id } = urlParams;

  const actionList = isCustom
    ? [
        {
          icon: shangpinpeizhi,
          title: t('CUSTOM_PRODUCT'),
          text: t('PRODUCTS_WILL_BE_FULFILLED'),
          type: 'customProduct',
        },
        {
          icon: xiazai,
          title: 'Photo Download',
          disabled: isExistedDigital,
          text: 'Digital files are automatically delivered to your customer after their order is placed.',
          type: 'photoDownload',
        },
      ]
    : [
        {
          icon: xiazai,
          title: 'Photo Download',
          disabled: isExistedDigital,
          text: 'Digital files are automatically delivered to your customer after their order is placed.',
          type: 'photoDownload',
        },
      ];

  const handleAction = async (type, disabled) => {
    const estoreBaseUrl = urls.get('estoreBaseUrl');
    if (type === 'photoDownload') {
      const isExistedDigital = await estoreService.checkDigitalExisted({
        baseUrl: estoreBaseUrl,
        rack_id,
      });
      if (disabled || isExistedDigital) {
        boundGlobalActions.addNotification({
          message: 'Photo Download Already Added',
          level: 'error',
          autoDismiss: 2,
        });
        return;
      }
      setLoading();
      setVisible(false);

      window.logEvent.addPageEvent({
        name: 'Estore_Products_SPUList_Click_AddPhotoDownload',
        price_sheet: default_fulfill_type === 1 ? 'auto' : 'self',
      });
      const data = await estoreService.addCustomerSpu({
        baseUrl: estoreBaseUrl,
        params: {
          spu_detail: {
            rack_id,
            category_code: 'Digital',
            product_type: 4,
          },
        },
      });
      if (data) {
        reGetSpu();
        getSheetList({ noLoading: true });
      }
    } else {
      window.logEvent.addPageEvent({
        name: 'Estore_Products_SPUList_Click_AddCustomProduct',
      });

      window.location.href = `/software/e-store/products/custom-pricing?rack_id=${rack_id}&rack_name=${rack_name}&supplier_id=${supplier_id}`;
    }
  };
  const handleClick = () => {
    window.logEvent.addPageEvent({
      name: 'Estore_Products_SPUList_Click_AddProduct',
      price_sheet: default_fulfill_type === 1 ? 'auto' : 'self',
    });
  };

  const renderCont = () => {
    return (
      <div className="add-product-cont">
        {actionList.map((action, index) => {
          const { title, text, icon, type, disabled } = action;
          if (type === 'photoDownload' && __isCN__) return null;
          return (
            <div
              className={`add-product-block ${disabled ? 'disabled' : ''}`}
              key={index}
              onClick={() => handleAction(type, disabled)}
            >
              <img src={icon} className="icon"></img>
              <div className="title">{title}</div>
              <div className="text">{text}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Tooltip
      overlayClassName="add-product-tooltip"
      placement="bottomLeft"
      trigger="click"
      visible={visible}
      destroyTooltipOnHide={true}
      onVisibleChange={val => {
        setVisible(val);
      }}
      overlay={renderCont()}
    >
      <span className={`add-custom-product`} onClick={handleClick}>
        {`+`} {t('ADD_PRODUCT')}
      </span>
    </Tooltip>
  );
};

export default AddCustomProduct;
