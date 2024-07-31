import { template } from 'lodash';
import React from 'react';

import IconBannerClose from '@apps/live/components/Icons/IconBannerClose';
import { DOWN_URL } from '@apps/live/constants/strings';

import { Container, Text } from './layout';

export default function ImageCard(props) {
  const { mediaId, baseUrl, onClose, intl } = props;
  let url = '';
  if (mediaId) {
    url = template(DOWN_URL)({ baseUrl, enc_image_uid: mediaId, size: 1 });
  }
  if (!url) return null;
  return (
    <Container>
      <img src={url} height="100%" className="image" />
      <Text>{intl.tf('LP_BANNER_UPLOAD_COVER')}</Text>
      {onClose ? <IconBannerClose className="close" onClick={() => onClose(mediaId)} /> : null}
    </Container>
  );
}
