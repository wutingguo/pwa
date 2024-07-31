import React, { memo, useEffect, useState } from 'react';

import { XInput } from '@common/components';

import { dangerSubDomain } from '@src/constants/strings';

import './index.scss';

const SubdomainModal = props => {
  const {
    subdomainValue,
    subdomainDefaultValue,
    brandId,
    boundProjectActions,
    boundGlobalActions,
    editSubdomain,
  } = props;
  const [inputValue, setInput] = useState('');
  const [tipContent, setTipContent] = useState('');
  const [validate, setValidate] = useState(false); //true 不合法 false 合法
  const onInput = e => {
    const value = e.target.value.trim().toLowerCase();
    const regex = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/;
    if (!value) {
      setTipContent('The name field is required.');
      setValidate(true);
    } else if (dangerSubDomain.includes(value)) {
      setTipContent(`The subdomain "${value}" has been taken.`);
      setValidate(true);
    } else if (value && !regex.test(value)) {
      setTipContent('No special characters, spaces, or names that start with "-" are allowed.');
      setValidate(true);
    } else {
      setTipContent('');
      setValidate(false);
    }
    setInput(value);
  };
  const onCancle = () => {
    window.logEvent.addPageEvent({
      name: 'MyBrand_BrandSubdomain_Click_Cancel',
    });
    boundGlobalActions.hideConfirm();
  };
  const onConfirm = () => {
    if (validate) return;
    window.logEvent.addPageEvent({
      name: 'MyBrand_BrandSubdomain_Click_Save',
    });
    if (inputValue === subdomainDefaultValue) {
      boundGlobalActions.hideConfirm();
      return;
    }

    let reserStr = inputValue;
    boundProjectActions
      .check_domain_prefix({
        brand_id: brandId,
        sub_domain_prefix: reserStr,
      })
      .then(res => {
        if (res.data) {
          boundGlobalActions.hideConfirm();
          boundProjectActions.update_domain_prefix({
            brand_id: brandId,
            sub_domain_prefix: reserStr,
          });
          boundGlobalActions.addNotification({
            message: 'Successfully updated',
            level: 'success',
            autoDismiss: 2,
          });
          editSubdomain(reserStr);
        } else {
          boundGlobalActions.addNotification({
            message: `The subdomain "${reserStr}" has been taken.`,
            level: 'error',
            autoDismiss: 2,
          });
          // editSubdomain(subdomainValue)
        }
      });
  };
  useEffect(() => {
    setInput(subdomainValue);
  }, []);
  return (
    <div className="SubdomainModal">
      <div className="nameLabel">What’s your subdomain name?</div>
      <XInput
        value={inputValue}
        placeholder="yourdomain.com"
        onChange={onInput}
        isShowTip={!!tipContent}
        tipContent={tipContent}
      />
      <div className="desc">
        <span>Important</span>: We recommed using a subdomain that best matches your brand and then
        keeping it. If you change your subdomain, your URLs for existing galleries, website,
        slideshows and other software projects will be immediately changed as well. So don't change
        it often.
      </div>
      <div className="modal-footer">
        <button className="button white" onClick={onCancle}>
          <div className="button-text-wrapper">Cancel</div>
        </button>
        <button className="button" onClick={onConfirm}>
          <div className="button-text-wrapper">Confirm</div>
        </button>
      </div>
    </div>
  );
};

export default memo(SubdomainModal);
