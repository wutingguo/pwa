import React from 'react';
import PropTypes from 'prop-types';
import XPureComponent from '@resource/components/XPureComponent';
import {XInput} from '@common/components';
import {formItemConfig} from './config';
import '../index.scss';

class EditFavoriteModalCont extends XPureComponent {
  render() {
    const { data } = this.props;
    return (
      <div className="edit-favorite-modal-cont-wrapper">
        {
          formItemConfig.map(({key, label, disabled, info}) => {
            // 数组表示可选任意一个，根据顺序如果值存在优先显示
            if(Array.isArray(key)) {
              key = key.find(item => !!data[item]) || key[0];
            }
            return (
              <div key={key} className="edit-favorite-modal-cont-item">
                <label className="edit-favorite-item-label">{label}</label>
                <XInput value={data[key]} disabled={disabled} />
                {!!info && <span className="edit-favorite-item-info">{info}</span>}
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default EditFavoriteModalCont;