import classNames from 'classnames';
import React, { memo } from 'react';

import { Field } from '@common/components/Form';

import './index.scss';

const CouponField = props => {
  const { children, desc, labelStyle, name, className, ...reset } = props;

  return (
    <div className="couponFileCommonBox">
      <Field
        isScrollError={true}
        name={name}
        className={classNames(['couponFileCommon', className])}
        labelStyle={labelStyle}
        ruleTrigger="onChange"
        {...reset}
      >
        {children}
      </Field>
      {!!desc && (
        <div className="descBox">
          {desc.map((item, index) => (
            <div className="desc" key={index} dangerouslySetInnerHTML={{ __html: item }}></div>
          ))}
        </div>
      )}
    </div>
  );
};
export default memo(CouponField);
