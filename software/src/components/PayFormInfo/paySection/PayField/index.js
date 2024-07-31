import classNames from 'classnames';
import React, { memo, useEffect, useRef, useState } from 'react';

import Form, { Field, useForm } from '@apps/live/components/Form';

import './index.scss';

const PayField = props => {
  const { child, desc, labelStyle, name, className, ...reset } = props;

  return (
    <div className="payFileCommonBox">
      <Field
        isScrollError={true}
        name={name}
        className={classNames(['payFileCommon', className])}
        labelStyle={labelStyle}
        ruleTrigger="onChange"
        {...reset}
      >
        {child}
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
export default memo(PayField);
