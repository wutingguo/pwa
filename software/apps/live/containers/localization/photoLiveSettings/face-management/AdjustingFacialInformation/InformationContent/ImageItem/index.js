import Tooltip from 'rc-tooltip';
import React, { useState } from 'react';

import IconSwitchUser from '@apps/live/components/Icons/IconSwitchUser';
import useLiveSetting from '@apps/live/hooks/useLiveSetting';
import { getDownloadUrl } from '@apps/live/utils';

import { Container } from './layout';

import './index.scss';

export default function ImageItem(props) {
  const { item } = props;
  const { urls } = useLiveSetting();
  const baseUrl = urls?.get('galleryBaseUrl');
  const src = getDownloadUrl({ baseUrl, enc_image_uid: item.enc_image_id });

  return (
    <Container>
      <div className="image_box">
        <img src={src} />
      </div>
      <div className="image_footer">
        <div className="image_name">{item?.image_meta?.imageName}</div>
      </div>
    </Container>
  );
}
