import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import XButton from '@resource/components/XButton';

import FInput from '@apps/live/components/FInput';

const Line = styled.div`
  display: flex;
  align-items: center;
  .input {
  }
`;
const Label = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #222222;
  line-height: 14px;
  margin-right: 10px;
  text-wrap: nowrap;
`;

export default function MenuCard(props) {
  const { task, data, save, intl } = props;
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(task.name);
  }, [task.id]);

  function inputChange(e) {
    const { value } = e.target;

    setValue(value);
  }

  function saveClick() {
    if (!value.trim()) return;
    data[task.id].name = value;
    save({ nextData: data });
  }
  return (
    <Line>
      <Label>{intl.tf('LP_EDIT_NAME')}</Label>
      <div className="input" style={{ width: 200, marginRight: 10 }}>
        <FInput value={value} onChange={inputChange} max={30} placeholder={task.name} />
      </div>
      <div>
        <XButton width={126} height={40} onClick={saveClick}>
          {intl.tf('SAVE')}
        </XButton>
      </div>
    </Line>
  );
}
