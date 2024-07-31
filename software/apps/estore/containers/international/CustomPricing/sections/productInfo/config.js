import React from 'react';

import XSelect from '@resource/components/XSelect';

import { XInput, XTextarea } from '@common/components';

import ExhibitImgs from '../../components/exhibitImgs';

const config = [
  {
    label: 'Category',
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
    label: 'Product Name',
    key: 'product_name',
    component: ({ onChange, ...props }) => {
      return <XInput onChange={e => onChange('product_name', e.target.value)} {...props} />;
    },
  },
  {
    label: (
      <div>
        Product Description <span style={{ color: '#7B7B7B' }}>(optional)</span>
      </div>
    ),
    key: 'product_description',
    component: ({ onChange, ...props }) => {
      return (
        <XTextarea
          onChanged={e => onChange('product_description', e.target.value)}
          maxlength={500}
          placeholder="e.g. Glossy finish"
          {...props}
        />
      );
    },
  },
  {
    label: (
      <div>
        Production Info <span style={{ color: '#7B7B7B' }}>(optional)</span>
      </div>
    ),
    key: 'production_desc',
    component: ({ onChange, ...props }) => {
      return (
        <XTextarea
          onChanged={e => onChange('production_desc', e.target.value)}
          placeholder="e.g. 2-3 business days"
          maxlength={500}
          {...props}
        />
      );
    },
  },
  {
    label: 'Product Images',
    key: 'spu_images',
    className: 'fullWidth',
    component: ({ onChange, ...props }) => {
      return <ExhibitImgs onChange={value => onChange('spu_images', value)} {...props} />;
    },
  },
];

export default config;
