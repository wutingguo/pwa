import React from 'react';

import XSelect from '@resource/components/XSelect';

import { XInput, XTextarea } from '@common/components';

import ExhibitImgs from '../../components/exhibitImgs';

const config = [
  {
    label: '分类',
    key: 'category_code',
    component: ({ onChange, options, ...selectProps }) => {
      return (
        <XSelect
          onChange={e => onChange('category_code', e.value)}
          options={options.filter(item => item.category_code !== 'Digital')}
          {...selectProps}
        />
      );
    },
  },
  {
    label: '商品名称',
    key: 'product_name',
    component: ({ onChange, ...props }) => {
      return <XInput onChange={e => onChange('product_name', e.target.value)} {...props} />;
    },
  },
  {
    label: (
      <div>
        商品描述 <span style={{ color: '#7B7B7B' }}>(选填)</span>
      </div>
    ),
    key: 'product_description',
    component: ({ onChange, ...props }) => {
      return (
        <XTextarea
          onChanged={e => onChange('product_description', e.target.value)}
          maxlength={500}
          placeholder="如：采用博物馆级艺术纸"
          {...props}
        />
      );
    },
  },
  {
    label: (
      <div>
        生产信息 <span style={{ color: '#7B7B7B' }}>(选填)</span>
      </div>
    ),
    key: 'production_desc',
    component: ({ onChange, ...props }) => {
      return (
        <XTextarea
          onChanged={e => onChange('production_desc', e.target.value)}
          placeholder="如：72小时出货"
          maxlength={500}
          {...props}
        />
      );
    },
  },
  {
    label: '商品图片',
    key: 'spu_images',
    className: 'fullWidth',
    component: ({ onChange, ...props }) => {
      return <ExhibitImgs onChange={value => onChange('spu_images', value)} {...props} />;
    },
  },
];

export default config;
