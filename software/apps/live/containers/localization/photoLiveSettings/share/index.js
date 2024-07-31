import QRCode from 'qrcode.react';
import React from 'react';

import XButton from '@resource/components/XButton';

import WithHeaderComp from '@apps/live/components/WIthHeaderComp';

import { CodeBox, Container } from './layout';

export default function Share(props) {
  const { urls, baseInfo } = props;
  const { enc_broadcast_id, album_name } = baseInfo || {};
  const broadcastBaseUrl = urls.get('broadcastBaseUrl');
  const shareLink = `${broadcastBaseUrl}live-photo-client/index.html?enc_broadcast_id=${enc_broadcast_id}#/home`;

  const downCode = () => {
    const Qr = document.getElementById('download');
    const image = new Image();
    image.src = Qr.toDataURL('image/png');
    const download = `${album_name} QR code`;
    const a = document.createElement('a');
    a.download = download;
    a.href = image.src;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  return (
    <WithHeaderComp title="QR Code">
      <Container>
        <CodeBox>
          {baseInfo ? <QRCode id="qrid" value={shareLink} size={200} fgColor="#000000" /> : null}
          <QRCode
            style={{ display: 'none' }}
            level="H"
            id="download"
            value={shareLink}
            size={1000}
            fgColor="#000000"
          />
          <XButton className="btn" width={180} onClick={downCode}>
            Download
          </XButton>
        </CodeBox>
      </Container>
    </WithHeaderComp>
  );
}
