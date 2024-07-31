import { template } from 'lodash';
import React from 'react';

import { ReactVideo } from '@common/components';

import IconBannerClose from '@apps/live/components/Icons/IconBannerClose';
import { VIDEO_DOWN_URL } from '@apps/live/constants/strings';

import { Container, Text } from './layout';

// const initUrl = 'https://yun.cnzno.com.dd/cloudapi/album_live/image/download?enc_image_uid=uqwCoJlDWZ95Zq0i5Z2e8Q%3D%3D&thumbnail_size=1';
// const initVideoUrl = 'https://yun.cnzno.com.dd/cloudapi/album_live/video/download?enc_media_id=uqwCoJlDWZ%2ByLA32hiDOmA%3D%3D';
export default function VideoCard(props) {
  const { mediaId, baseUrl, onClose, intl } = props;
  let url = '';
  if (mediaId) {
    url = template(VIDEO_DOWN_URL)({ baseUrl, enc_media_id: mediaId });
  }
  if (!url) return null;
  return (
    <Container>
      <ReactVideo url={url} controls width="100%" height="100%" />
      <Text>{intl.tf('LP_BANNER_UPLOAD_VIDEO_BANNER')}</Text>
      {onClose ? <IconBannerClose className="close" onClick={() => onClose(mediaId)} /> : null}
    </Container>
  );
}
