import React, { useEffect, useState } from 'react';
import { Container, Title, SubTitle, Text, Item, GroupBox } from './layout';
import FInput from '@apps/live/components/FInput';
import { RcRadioGroup } from '@resource/components/XRadio';
import XColorPicker from '@resource/components/XColorPicker';
import XButton from '@resource/components/XButton';
import { useLanguage } from '@common/components/InternationalLanguage';

export default function ThemeSetting(props) {
  const { values, onChange } = props;
  const { intl } = useLanguage();
  const buttomElement = (
    <XButton style={{ marginLeft: 10, width: 100, height: 30, lineHeight: '30px' }}>
      {intl.tf('CHANGE_COLOR')}
    </XButton>
  );
  return (
    <Container>
      <Item>
        <Title>{intl.tf('FONT_COLOR')}</Title>
        <SubTitle>{intl.tf('MAIN_FONT')}</SubTitle>
        <Text>{intl.tf('BROWSING_PAGE')}</Text>
        <div className="color_picker">
          <XColorPicker
            initHexString={values.primary_font_color}
            onColorChange={({ hex }) => onChange('primary_font_color', hex)}
            isUpDirection={false}
            icon={buttomElement}
          />
        </div>
        <SubTitle>{intl.tf('OTHER_FONT')}</SubTitle>
        <GroupBox>
          <RcRadioGroup
            wrapperClass="znoRadio"
            onChange={({ target: { value } }) => onChange('other_font_color', value)}
            value={values.other_font_color}
            options={[
              {
                value: '#222',
                label: intl.tf('DARK_COLOR')
              },
              {
                value: '#fff',
                label: intl.tf('LIGHT_COLOR')
              }
            ]}
          />
        </GroupBox>
      </Item>
      <Item>
        <Title>{intl.tf('LP_CURRENT_ALBUM_STYLE_NAME')}</Title>
        <div style={{ marginTop: 20, width: 260 }}>
          <FInput
            max={5}
            placeholder={intl.tf('LP_CURRENT_ALBUM_STYLE_NAME')}
            value={values.album_skin_name}
            onChange={({ target: { value } }) => onChange('album_skin_name', value)}
          />
        </div>
      </Item>
    </Container>
  );
}
