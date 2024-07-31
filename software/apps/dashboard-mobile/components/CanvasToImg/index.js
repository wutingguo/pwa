import QRCode from 'qrcode.react';
import React, { memo, useEffect, useRef } from 'react';
import { useState } from 'react';

import { XImg } from '@common/components';

const canvasToImg = ({ share_link_url }) => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    const canvas = document.getElementById('qrid');
    // const ctx = canvas.getContext('2d');
    const url = canvas.toDataURL('image/png');
    setUrl(url);
  }, []);
  return (
    <div>
      <QRCode
        id="qrid"
        style={{ display: 'none' }}
        value={share_link_url}
        size={115}
        fgColor="#000000"
      />
      <div style={{ width: '115px', height: '115px', margin: '0 auto' }}>
        <XImg src={url} />
      </div>
    </div>
  );
};

export default memo(canvasToImg);
