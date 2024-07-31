import cls from 'classnames';
import { template } from 'lodash';
import QRCode from 'qrcode.react';
import React, { Fragment, useMemo, useState } from 'react';

import XButton from '@resource/components/XButton';

import { IntlConditionalDisplay, useLanguage } from '@common/components/InternationalLanguage';

import CommonModal from '../commonModal';

import './index.scss';

const LiveShareModal = props => {
  const { data, urls } = props;
  const { intl } = useLanguage();
  const [type, setType] = useState(0);
  const enc_broadcast_id = data.get('enc_broadcast_id');
  const broadcastBaseUrl = urls.get('broadcastBaseUrl');
  const album_name = data.get('album_name');
  const message = data.get('message').toJS();
  const share_flag = data.get('share_flag')?.toJS();

  const shareLink = useMemo(() => {
    const templateStr = `<%=baseUrl%>live-photo-client/index.html?enc_broadcast_id=<%=enc_broadcast_id%>&key=<%=key%>#/home`;
    let link = '';
    const { with_watermark, no_watermark } = share_flag || {};
    if (type === 0) {
      link = template(templateStr)({
        baseUrl: broadcastBaseUrl,
        enc_broadcast_id,
        key: with_watermark,
      });
    } else {
      link = template(templateStr)({
        baseUrl: broadcastBaseUrl,
        enc_broadcast_id,
        key: no_watermark,
      });
    }

    return link;
  }, [share_flag, type]);
  const modalProps = {
    hideBtnList: true,
    className: 'liveShareModalWrapper',
    title: <div style={{ textAlign: 'center' }}>{intl.tf('LP_SHARE')}</div>,
  };

  return (
    <CommonModal {...props} {...modalProps}>
      <div className="liveShareModalContent">
        <div className="subTitle">
          <span className={cls('label', { current: type === 0 })} onClick={() => setType(0)}>
            {intl.tf('LP_CLOUND_ALBUM')}
          </span>
          {intl.lang === 'cn' ? (
            <span className={cls('label', { current: type === 1 })} onClick={() => setType(1)}>
              内部无水印相册
            </span>
          ) : null}
        </div>
        {type === 0 ? (
          <Content
            intl={intl}
            shareLink={shareLink}
            message={message}
            album_name={album_name}
            type={type}
          />
        ) : null}
        {type === 1 ? (
          <Content
            intl={intl}
            shareLink={shareLink}
            message={message}
            album_name={album_name}
            type={type}
          />
        ) : null}
      </div>
    </CommonModal>
  );
};

function Content(props) {
  const { intl, shareLink, message, album_name, type } = props;
  const linkList = [
    {
      title: intl.tf('LP_SHARE_LINK'),
      type: 'link',
      className: 'linkContent',
      linkRender: () => <span>{shareLink}</span>,
      buttons: () => (
        <Fragment>
          <XButton className="copyButton" onClicked={copyLink}>
            {intl.tf('LP_SHARE_COPY_LINK')}
          </XButton>
          <XButton onClick={previewAlbum}>{intl.tf('LP_ALBUM_DOWNLOAD_PREVIEW')}</XButton>
        </Fragment>
      ),
    },
    {
      title: intl.tf('LP_SHARE_QR_CODE'),
      type: 'qrCode',
      linkRender: () => (
        <QRCode
          id="qrid"
          value={shareLink}
          size={intl.lang === 'cn' ? 120 : 200}
          fgColor="#000000"
        />
      ),
      className: 'qrCodeContent',
      buttons: () => <XButton onClicked={downCode}>{intl.tf('LP_SHARE_DOWNLOAD')}</XButton>,
    },
  ];

  const previewAlbum = () => {
    window.open(shareLink, '_blank');
  };

  const copyLink = () => {
    let input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', shareLink);
    document.body.appendChild(input);
    input.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
    }
    document.body.removeChild(input);
    message.success(intl.tf('LP_SHARE_COPY_SUCCESS'));
  };

  const downCode = () => {
    const id = intl.lang === 'en' ? 'download' : 'qrid';
    var Qr = document.getElementById(id);
    let image = new Image();
    image.src = Qr.toDataURL('image/png');
    const download = intl.lang === 'cn' ? `相册“${album_name}”分享二维码` : `${album_name} QR code`;
    let a = document.createElement('a');
    a.download = download;
    a.href = image.src;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div>
      <IntlConditionalDisplay reveals={['cn']}>
        <div className="desc">
          {type === 0
            ? '观看直播，参与互动，使用直播相册'
            : '内部人员下载高清无水印图使用，不建议对外发布'}
        </div>
      </IntlConditionalDisplay>
      <div className="linkWrapper">
        {linkList.map(item => {
          return (
            <div className={`commonLink ${item.className}`} key={item.type}>
              <div className="divide">
                <div className="title">{item.title}</div>
                <div className="link">{item.linkRender()}</div>
              </div>
              <div className="buttonsWrapper">{item.buttons()}</div>
            </div>
          );
        })}
      </div>
      <QRCode
        style={{ display: 'none' }}
        level="H"
        id="download"
        value={shareLink}
        size={1000}
        fgColor="#000000"
      />
    </div>
  );
}

export default LiveShareModal;
