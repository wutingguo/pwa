import React, { useState } from 'react';

import XButton from '@resource/components/XButton';

import FModal from '@apps/live/components/FDilog';
import GroupRadio, { Radio } from '@apps/live/components/GroupRadio';

import ImageBox from '../ImageBox';

import dome01En from './images/dome01-en.jpg';
import dome01 from './images/dome01.jpg';
import dome02En from './images/dome02-en.jpg';
import dome02 from './images/dome02.jpg';
import dome03En from './images/dome03-en.jpg';
import dome03 from './images/dome03.jpg';
import dome04En from './images/dome04-en.jpg';
import dome04 from './images/dome04.jpg';
import dome05En from './images/dome05-en.jpg';
import dome05 from './images/dome05.jpg';
import dome06En from './images/dome06-en.jpg';
import dome06 from './images/dome06.jpg';
import { Box, Container, Item, Text } from './layout';

const getList = lang => [
  {
    key: '3:2',
    text: '3:2',
    width: 180,
    height: 120,
    backgroundUrl: lang === 'cn' ? dome01 : dome01En,
  },
  {
    key: '4:3',
    text: '4:3',
    width: 180,
    height: 135,
    backgroundUrl: lang === 'cn' ? dome02 : dome02En,
  },
  {
    key: '2:3',
    text: '2:3',
    width: 120,
    height: 180,
    backgroundUrl: lang === 'cn' ? dome03 : dome03En,
  },
  {
    key: '3:4',
    text: '3:4',
    width: 135,
    height: 180,
    backgroundUrl: lang === 'cn' ? dome04 : dome04En,
  },
  {
    key: '16:9',
    text: '16:9',
    width: 180,
    height: 101,
    backgroundUrl: lang === 'cn' ? dome05 : dome05En,
  },
  {
    key: '9:16',
    text: '9:16',
    width: 101,
    height: 180,
    backgroundUrl: lang === 'cn' ? dome06 : dome06En,
  },
];
export default function (props) {
  const { open, options, currentClick, lang, onChange, intl, onCancel, ...rest } = props;
  const [ratio, setRatio] = useState('3:2');
  const images = getList(lang);

  function handleChange(value) {
    setRatio(value);
  }
  const footer = (
    <div style={{ textAlign: 'center' }}>
      <XButton
        style={{
          background: '#fff',
          border: '1px solid #d8d8d8',
          color: '#222',
          width: 200,
          height: 40,
        }}
        onClick={handleCancel}
      >
        {intl.tf('LP_OFF')}
      </XButton>
    </div>
  );

  function handleCancel() {
    onCancel?.();
    const record = images.find(item => item.key === ratio);
    onChange?.(ratio, record, images);
  }
  return (
    <FModal open={open} footer={footer} onCancel={handleCancel} {...rest}>
      <GroupRadio value={ratio} onChange={handleChange} className="view">
        <Container>
          {images.map(item => {
            return (
              <Item key={item.key}>
                <Box onClick={() => currentClick(item)}>
                  <ImageBox
                    backgroundUrl={item.backgroundUrl}
                    width={item.width}
                    height={item.height}
                    // options={options}
                  />
                </Box>
                <Text>
                  <Radio value={item.key} />
                  <span>{item.text}</span>
                </Text>
              </Item>
            );
          })}
        </Container>
      </GroupRadio>
    </FModal>
  );
}
