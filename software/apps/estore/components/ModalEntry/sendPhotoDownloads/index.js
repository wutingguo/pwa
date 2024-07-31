import React, { useState, useEffect } from 'react';
import { RcRadioGroup } from '@resource/components/XRadio';
import Select from '@resource/components/XSelect';
import { Input } from '@resource/components/XInput';
import { NAME_REG, NAME_CN_REG } from '@resource/lib/constants/reg';
import XModal from '@resource/components/modals/XModal';
import CheckBox from '@resource/components/XCheckBox';
import estoreService from '../../../constants/service';

import CommonModal from '../commonModal/index';

import './index.scss';
import Immutable from 'immutable';

const SendPhotoDownloadsModal = props => {
  const { urls, data, boundGlobalActions } = props;
  const [sendCopy, setSendCopy] = useState(false);
  const [loading, setLoading] = useState(false);
  const baseUrl = urls.get('estoreBaseUrl');
  const item_detail = data.get('item_detail');
  const digital_status = data.get('digital_status');
  const detail = data.get('detail');
  const close = data.get('close');

  useEffect(() => {
  }, []);

  const onChange = (value) => {
    setSendCopy(value)
  };

  const onOk = () => {
    setLoading(true);
    const order_no = detail.get('order_number');
    const digital_email_status = detail.get('digital_email_status');
    const orderItems = item_detail.toJS()
    const item_ids = []
    orderItems.forEach(item => {
      if (item.target_product_type === 4) {
        item_ids.push(item.item_id)
      }
    });
    estoreService
      .sendDigitalEmail({
        order_no,
        item_ids,
        send_to_b: sendCopy ? 1: 0,
        baseUrl,
      })
      .then(res => {
        const { ret_code, ret_msg, data } = res;
        if (ret_code === 200000) { 
          if ([1,2,3].includes(data?.digital_email_status)) {
            boundGlobalActions.addNotification({
              message: "We're preparing the download files. When this is done, the files will be automatically sent to your client.",
              level: 'success',
              autoDismiss: 6,
            });
          } else if (digital_email_status === 4 && data?.digital_email_status === 4) {
            boundGlobalActions.addNotification({
              message: "The downloads have been sent. ",
              level: 'seccess',
              autoDismiss: 2
            });
          }
          close(data?.digital_email_status);
          setLoading(false);
        } else {
          close(-1);
          boundGlobalActions.addNotification({
            message:  ret_msg || "Failure: please contact support team.",
            level: 'error',
            autoDismiss: 2
          });
          setLoading(false);
        }
      });
  };

  const modalProps = {
    okText: 'Send',
    cancelText: 'Cancel',
    onOk,
  };

  return (
    <CommonModal className="sendPhotoDownloadsModal" {...props} {...modalProps}>
       <div className="title">We will send the digital photos your clients have purchased in this order to them. Do you wish to continue?</div>
        <CheckBox
          checked={sendCopy}
          className="store-form-add-taxes__item-checkBox black-theme sendCont"
          text="Send me a copy"
          onChange={onChange}
        />
       <div className="describe">*Please confirm receipt of the payment before clicking “Send Photo Downloads” especially when this order is placed through offline payment.</div>
    </CommonModal>
  );
};

export default SendPhotoDownloadsModal;
