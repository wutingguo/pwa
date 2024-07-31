import React, { memo, useEffect, useRef, useState } from 'react';

// import { emailReg, phoneReg } from '@resource/lib/constants/reg';
import { contact_type } from '../../config';
import { PayDate, PayField, PayInputField, PayUploadField, SelectDown } from '../index';

import './index.scss';

const SubjectInfo = props => {
  return (
    <div className="payFormSection subjectInfo">
      <div className="title">
        <div>超级管理员信息</div>
        <div className="titleDesc">
          超级管理员需在开户后进行签约，并可接受日常重要管理信息和进行资金操作，请确定其为商户法定代表人或负责人
        </div>
      </div>
      <PayField
        {...props}
        name="contact_type"
        label="超级管理员类型"
        rules={[{ required: true, message: '超级管理员类型为空！' }]}
        defaultValue={contact_type[0]['value']}
        child={(value, onChange) => {
          return (
            <div style={{ width: '7.38rem' }}>
              <SelectDown
                defaultSelect={contact_type[0]}
                selectValue={value}
                onChange={onChange}
                dropdownList={contact_type}
              />
            </div>
          );
        }}
        required
      />
      <PayInputField
        {...props}
        name="contact_name"
        rules={[{ required: true, message: '超级管理员姓名为空！' }]}
        label="超级管理员姓名"
        required
      />
      <PayInputField
        {...props}
        name="mobile_phone"
        rules={[
          { required: true, message: '联系电话为空！' },
          // { pattern: phoneReg, message: '格式不正确！' },
        ]}
        label="联系电话"
        desc={[
          '1、请填写真实有效的电话，以便入驻后微信官方回拨确认',
          '2、绑定后可前往“微信商户助手”操作变更',
        ]}
        required
      />
      <PayInputField
        {...props}
        name="contact_email"
        rules={[
          { required: true, message: '联系邮箱为空！' },
          // { pattern: emailReg, message: '格式不正确！' },
        ]}
        label="联系邮箱"
        required
      />
    </div>
  );
};

export default memo(SubjectInfo);
