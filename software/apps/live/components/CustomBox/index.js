import React, { useMemo } from 'react';
import { Container, Banner, CenterText, GridImageBox } from './layout';
import Info from './Info';
import bSrc from './images/banner.png';
import gSrc from './images/grid.png';
import bSrc_en from './images/banner_en.png';
import gSrc_en from './images/grid_en.png';
import { ALBUM_LIVE_IMAGE_URL } from '@apps/live/constants/api';
import { template } from 'lodash';
import { useLanguage } from '@common/components/InternationalLanguage';

export default function CustomBox(props) {
  const { isBorder, isInfo, style, values, baseUrl } = props;
  const { intl } = useLanguage();

  const theme = useMemo(() => {
    const t = {
      ...values
    };
    if (!!values.bg_image_id) {
      let src = template(ALBUM_LIVE_IMAGE_URL)({
        baseUrl,
        enc_image_id: values.bg_image_id,
        size: '1'
      });
      t.infoBackgroundUrl = src;
    } else if (!!values.bg_color) {
      t.infoBackground = values.bg_color;
    }

    if (!!values.decorate_image_id) {
      let src = template(ALBUM_LIVE_IMAGE_URL)({
        baseUrl,
        enc_image_id: values.decorate_image_id,
        size: '1'
      });
      t.gridBackgroundUrl = src;
    } else if (!!values.decorate_color) {
      t.gridBackground = values.decorate_color;
    }

    return t;
  }, [values]);
  return (
    <Container style={style}>
      <Banner isBorder={isBorder}>
        <img src={intl.lang == 'cn' ? bSrc : bSrc_en} width="100%" />
      </Banner>
      <Info isBorder={isBorder} isInfo={isInfo} theme={theme} />
      <GridImageBox
        isBorder={isBorder}
        style={{
          backgroundColor: theme.gridBackground ? theme.gridBackground : '',
          backgroundImage: theme.gridBackgroundUrl ? `url(${theme.gridBackgroundUrl})` : ''
        }}
      >
        <img src={intl.lang == 'cn' ? gSrc : gSrc_en} width="100%" />
      </GridImageBox>
    </Container>
  );
}
