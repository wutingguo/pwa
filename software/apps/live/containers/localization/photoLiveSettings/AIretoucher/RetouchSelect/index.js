import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import XSelect from '@resource/components/XSelect';

import {
  getAIRetouchPreset,
  getTopicEffects,
  saveAIRetouchPreset,
} from '@apps/live/services/photoLiveSettings';

import cancel from './cancel.png';

function RetouchSelect(props) {
  const { baseUrl, albumId: enc_album_id, removeTopicByCode } = props;
  const [retouchList, setRetouchList] = useState([]);
  const [value, setValue] = useState('');
  useEffect(() => {
    getRouchList();
    getpreset();
  }, []);
  useImperativeHandle(props.onRef, () => ({
    // onChild 就是暴露给父组件的方法
    getRouchList: () => {
      return getRouchList();
    },
  }));
  /**
   * 获取美图预设下拉列表
   */
  async function getRouchList() {
    const params = {
      provider: 'MT',
      galleryBaseUrl: baseUrl,
    };
    const res = await getTopicEffects(params);
    console.log('res', res);
    const options = res
      // .filter(item => item.category_code === 'GENERAL')
      .map(item => {
        return {
          value: item.topic_code,
          label: item.topic_name || '未命名', // item.topic_name || '未命名',
          ...item,
        };
      });
    // GENERAL
    setRetouchList(options || []);
  }

  /**
   * 保存美图预设值
   */
  async function savePreset(topic_code) {
    const params = {
      baseUrl,
      enc_album_id,
      topic_code,
      provider: 'MT', // MT:美图
    };
    const res = await saveAIRetouchPreset(params);
  }

  /**
   * 获取美图预设值
   */
  async function getpreset() {
    const params = {
      baseUrl,
      enc_album_id,
      provider: 'MT', // MT:美图
    };
    const { topic_code } = await getAIRetouchPreset(params);
    setValue(topic_code);
  }

  function retouchChange({ topic_code }) {
    savePreset(topic_code);
    setValue(topic_code);
  }
  function optionComponent(props) {
    return (
      <div
        className={props.className}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onClick={() => props.onSelect(props.option)}
      >
        <span>{props.children}</span>
        {!props.option.system_preset && !props.isSelected && (
          <img
            onClick={e => {
              e.stopPropagation();
              removeTopicByCode(props.option.topic_code);
            }}
            src={cancel}
            style={{ width: '11px', height: '11px' }}
            alt="1.png"
          ></img>
        )}
      </div>
    );
  }
  return (
    <div className="retouchModified">
      <div className="label">修图模式</div>
      <div className="adjustRetouch">
        <XSelect
          value={value}
          options={retouchList}
          onChange={retouchChange}
          optionComponent={optionComponent}
        />
      </div>
    </div>
  );
}
export default forwardRef(RetouchSelect);
