import React from 'react';

const OptionComp = props => {
  const { data } = props;
  const { display_name, spu_attr_values: values, attr_id, term_code } = data;
  const tagsValue = values.map(item => item.display_name);
  return (
    <div className="optWrapper">
      <div className="content">
        <div className="label" title={display_name}>
          {display_name}
        </div>
        <div className="values">{tagsValue.join(', ')}</div>
      </div>
    </div>
  );
};

export default OptionComp;
