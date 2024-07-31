import React from 'react';

const commonGenerator = (config = [], onChange, data) => {
  return config.map(item => {
    const extra = {
      ...data.etc
    };

    if (item.key === 'category_code') {
      extra.options = data.options;
    }

    return (
      <div className={`singleSection ${item.className || ''}`} key={item.key}>
        <div className="title">{item.label}</div>
        <div className="sectionControl">
          {item.component({
            ...extra,
            onChange,
            value: data[item.key]
          })}
        </div>
      </div>
    );
  });
};

export default commonGenerator;
