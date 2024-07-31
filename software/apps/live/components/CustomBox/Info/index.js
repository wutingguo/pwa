import React from 'react';

import descriptionPNG from '@apps/live-photo-client-mobile/icons/description.png';
import sortImgSrc from '@apps/live-photo-client-mobile/icons/grid-s.png';
import locationPNG from '@apps/live-photo-client-mobile/icons/location.png';
import qrCode from '@apps/live-photo-client-mobile/icons/qrcode.png';
import timePNG from '@apps/live-photo-client-mobile/icons/time.png';
import IconQrCode from '@apps/live/components/Icons/IconQrCode';
import Sort from '@apps/live/components/Icons/Sort';
import { useLanguage } from '@common/components/InternationalLanguage';

import {
  Container,
  Content,
  Item,
  Left,
  List,
  Right,
  SubTitle,
  Tabs,
  TabsItem,
  Title,
} from './layout';

// themeColor: '',
// color: '',
// infoBackgroundUrl: '',
// gridBackgroundUrl: '',

export default function Info(props) {
  const { isBorder, isInfo, theme } = props;
  const { primary_font_color, other_font_color, infoBackgroundUrl, infoBackground } = theme;
  const { intl } = useLanguage();

  return (
    <Container
      style={{
        backgroundColor: infoBackground ? infoBackground : '',
        backgroundImage: infoBackgroundUrl ? `url(${infoBackgroundUrl})` : '',
      }}
      isBorder={isBorder}
    >
      <Content>
        <Title style={{ color: other_font_color ? other_font_color : '' }}>{intl.tf('PRODUCT_TITLE')}</Title>
        {isInfo ? (
          <>
            <SubTitle color={other_font_color}>
             {intl.lang == 'cn'? '已有' :'' }
              <span style={{ color: primary_font_color ? primary_font_color : '#042A9D' }}>
              {intl.lang == 'cn' ? 427 : 0}  
              </span>
              {intl.tf('BROWSER_ALBUM')}
            </SubTitle>
            <List>
              <Item color={other_font_color}>
                <img className="image" src={timePNG}></img>
                <div> {intl.lang == 'cn' ? '2022.08.20' : '2023.08.20'}</div>
              </Item>
              <Item color={other_font_color}>
                <img className="image" src={locationPNG}></img>
                <div>{intl.lang == 'cn' ? '上海' : 'CA, USA'} </div>
              </Item>
              <Item color={other_font_color}>
                <img className="image" src={descriptionPNG}></img>
                <div>{intl.lang == 'cn' ? '增长/链接/创新 产品运营大会' : 'Growth, Link, Innovation'}</div>
              </Item>
            </List>
          </>
        ) : null}

        <Tabs>
          <Left>
            <TabsItem isCurrent color={primary_font_color ? primary_font_color : '#042A9D'}>
              
              {intl.lang == 'cn' ? '照片直播' : 'Live photos'} 
            </TabsItem>
            <TabsItem style={{ color: other_font_color ? other_font_color : '' }}> {intl.lang == 'cn' ? '热门' : 'Popular'} </TabsItem>
         {
          intl.lang == 'cn' && <TabsItem style={{ color: other_font_color ? other_font_color : '' }}>
          活动介绍
        </TabsItem>
         }   
          </Left>
          {isInfo ? (
            <Right>
              <IconQrCode className="icon" fill={other_font_color}></IconQrCode>
              <Sort className="icon" fill={other_font_color}></Sort>
            </Right>
          ) : null}
        </Tabs>
      </Content>
    </Container>
  );
}
