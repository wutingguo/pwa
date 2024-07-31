import React from 'react';

import deletePng from '@resource/static/icons/handleIcon/delet.png';
import editorPng from '@resource/static/icons/handleIcon/editor.png';

const OptionComp = props => {
  const { data, onEdit, deleteOpt } = props;
  const { display_name, spu_attr_values: values, attr_id, term_code } = data;
  const key = attr_id || term_code;
  const tagsValue = values.map(item => item.display_name);
  return (
    <div className="optWrapper">
      <div className="content">
        <div className="label" title={display_name}>
          {display_name}
        </div>
        <div className="values">{tagsValue.join(', ')}</div>
      </div>
      <div className="editWrapper">
        <img src={editorPng} onClick={() => onEdit(data)} />
        <img src={deletePng} onClick={() => deleteOpt(key)} />
      </div>
    </div>
  );
};

export default OptionComp;
