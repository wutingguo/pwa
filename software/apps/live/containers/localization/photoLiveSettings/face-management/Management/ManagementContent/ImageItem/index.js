import Tooltip from 'rc-tooltip';
import React, { useState } from 'react';

import IconSwitchUser from '@apps/live/components/Icons/IconSwitchUser';
import { getDownloadUrl } from '@apps/live/utils';

import { Container } from './layout';

import './index.scss';

export default function ImageItem(props) {
  const { item, onSwitchUser, baseUrl } = props;

  const [toolTipVisible, setToolTipVisible] = useState(false);
  const src = getDownloadUrl({ baseUrl, enc_image_uid: item.enc_image_id });

  function handleSwitchUser() {
    setToolTipVisible(false);
    onSwitchUser?.(item);
  }

  function onVisibleChange(v) {
    setToolTipVisible(v);
  }

  const downloadOverlay = (
    <div className="overlay_menu">
      <div className="overlay_item" onClick={handleSwitchUser}>
        <IconSwitchUser width={16} fill="#3a3a3a" />
        <span style={{ marginLeft: 10 }}>Adjusting facial information</span>
      </div>
    </div>
  );
  return (
    <Container>
      <div className="image_box">
        <img src={src} />
      </div>
      <div className="image_footer">
        <div className="image_name">{item?.image_meta?.imageName}</div>

        <Tooltip
          overlayClassName="image_operator_overlay"
          placement="bottom"
          showArrow
          overlay={downloadOverlay}
          onVisibleChange={onVisibleChange}
          visible={toolTipVisible}
        >
          <div className="image_operator">...</div>
        </Tooltip>
      </div>
    </Container>
  );
}
