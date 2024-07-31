import React, { useState, useEffect, memo, useRef } from 'react';
import CommonModal from '../commonModal/index';
import './index.scss';

const GoodCostModal = props => {
  const { urls, data } = props;
  const close = data.get('close');
  const shipment_number = data.get('shipment_number');
  const courier = data.get('courier');
  let noship = false;
  if (!shipment_number && !courier) noship = true;

  const modalProps = {
    hideBtnList: true
  };

  return (
    <CommonModal className="estore_cost" {...props} {...modalProps}>
      <div className="item_list">
        {noship ? (
          <div className="no_ship">No shipping needed</div>
        ) : (
          <>
            {' '}
            <div className="es_cost_content">
              <span className="title">courier</span>
              <span>{courier}</span>
            </div>
            <div className="es_cost_content">
              <span className="title">shipmentNumber</span>
              <span>{shipment_number}</span>
            </div>
          </>
        )}
      </div>
    </CommonModal>
  );
};

export default memo(GoodCostModal);
