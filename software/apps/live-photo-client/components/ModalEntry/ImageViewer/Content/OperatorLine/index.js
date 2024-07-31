import cls from 'classnames';
import { debounce } from 'lodash';
import React, { useState } from 'react';

import IconPause from '@apps/live/components/Icons/IconPause';
import IconPlay from '@apps/live/components/Icons/IconPlay';
import IcondownList from '@apps/live/components/Icons/IcondownList';

import SelectBox, { SelectItem } from './SelectBox';
import { Container, Line, OperatorButton, OperatorButtonIcon, OperatorButtonText } from './layout';

export default function OperatorLine(props) {
  const { className, operatorState = {}, onChange, style } = props;
  const { time, playType, animationType, played, showImageList } = operatorState;

  return (
    <Container className={cls(className)} style={style}>
      <Line>
        <SelectBox
          width="70px"
          className="item"
          value={time || 1}
          onChange={value => onChange('time', value)}
          trigger="hover"
        >
          <SelectItem value={1}>5s</SelectItem>
          <SelectItem value={2}>10s</SelectItem>
          <SelectItem value={3}>15s</SelectItem>
        </SelectBox>
        <SelectBox
          width="116px"
          className="item"
          value={playType || 1}
          onChange={value => onChange('playType', value)}
          trigger="hover"
        >
          <SelectItem value={1}>随机播放</SelectItem>
          <SelectItem value={2}>顺序播放</SelectItem>
        </SelectBox>
        <SelectBox
          width="116px"
          className="item"
          value={animationType || 1}
          onChange={value => onChange('animationType', value)}
          trigger="hover"
        >
          <SelectItem value={1}>随机动画</SelectItem>
          <SelectItem value={2}>由上至下</SelectItem>
          <SelectItem value={3}>左进右出</SelectItem>
          <SelectItem value={4}>右进右出</SelectItem>
          <SelectItem value={5}>渐隐变化</SelectItem>
          <SelectItem value={6}>翻页滚动</SelectItem>
        </SelectBox>
        <OperatorButton
          style={{ marginRight: 10 }}
          onClick={() => onChange('showImageList', !showImageList)}
        >
          <OperatorButtonText>{showImageList ? '收起列表' : '展开列表'}</OperatorButtonText>
          <OperatorButtonIcon
            className={cls({
              up: !showImageList,
            })}
            style={{ marginLeft: 10 }}
          >
            <IcondownList fill="#fff" />
          </OperatorButtonIcon>
        </OperatorButton>
        <OperatorButton
          onClick={debounce(() => onChange('played', !played), 300)}
          backgroundColor="#0077CC"
        >
          <OperatorButtonIcon style={{ marginRight: 10 }}>
            {!played ? <IconPlay fill="#fff" /> : <IconPause fill="#fff" />}
          </OperatorButtonIcon>
          <OperatorButtonText>{!played ? '播放' : '暂停'}</OperatorButtonText>
        </OperatorButton>
      </Line>
    </Container>
  );
}
