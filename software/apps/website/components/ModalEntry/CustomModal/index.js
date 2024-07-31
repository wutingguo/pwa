import React, { memo, useEffect, useState } from 'react';
import cls from 'classnames';
import { WEBSITE_CUSTOM_MODAL } from '@apps/website/constants/modalTypes';
import { XModal, XButton } from '@common/components';

import './index.scss';

const formList = ['customDomainCont', 'subDomainCont'];

const CustomModal = props => {
  const { data } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const that = data.get('that');
  const { boundGlobalActions, boundProjectActions, collectionList } = that.props;
  const { hideModal } = boundGlobalActions;
  const close = data.get('close');
  const handleOk = data.get('handleOk');
  const open = data.get('open');
  const title = data.get('title');
  const width = data.get('width');
  const okText = data.get('okText');
  const cancelText = data.get('cancelText');
  const className = data.get('className');
  const content = data.get('content');
  const singleBtn = data.get('singleBtn');
  const type = data.get('type');

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  const handleCancel = () => {
    close && close();
    closeModal();
  };

  const closeModal = () => {
    hideModal(WEBSITE_CUSTOM_MODAL);
  };

  // 结束动画后销毁
  const afterClose = e => {
    hideModal(WEBSITE_CUSTOM_MODAL);
  };

  const afterOpenChange = e => {
    setIsModalOpen(e);
  };

  const renderUpgradeReminderCont = list => {
    return (
      <div className="introduce">
        <div className="table">
          <div className="title">
            <span className="row-2">Your Current Plan Supports </span>
            <span className="row-2">You Are About To Publish</span>
          </div>
          {list &&
            list.toJS().map((item, index) => {
              return (
                <div key={index} className="body">
                  <span className="row-2">{item.plan}</span>
                  <span className="row-2">{item.current}</span>
                </div>
              );
            })}
        </div>
        <div className="mt-3">Upgrade your plan to publish or update your website.</div>
      </div>
    );
  };

  return (
    <XModal
      className={cls('website-custom-modal', singleBtn && 'single-btn')}
      title={title}
      open={isModalOpen}
      containerStyle={{
        width: 762,
      }}
      onCancel={handleCancel}
      afterClose={afterClose}
      afterOpenChange={afterOpenChange}
      opened
      onClosed={() => close()}
      escapeClose
      isHideIcon={false}
    >
      <div className="custom-content">
        {type === 'upgradeReminder' ? renderUpgradeReminderCont(content) : content}
      </div>
      {singleBtn ? (
        <div className="custom-btns">
          <XButton className="footer-btn" onClicked={handleOk}>
            {okText || 'Confirm'}
          </XButton>
        </div>
      ) : (
        <div className="custom-btns">
          <XButton className="footer-btn cancel-btn" onClicked={handleCancel}>
            {cancelText || 'Cancel'}
          </XButton>
          <XButton className="footer-btn" onClicked={handleOk}>
            {okText || 'Confirm'}
          </XButton>
        </div>
      )}
    </XModal>
  );
};

export default memo(CustomModal);
