import dayjs from 'dayjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import DropDown from '@apps/live-photo-client/components/DropDown';
import { useSetting } from '@apps/live-photo-client/constants/context';
import { getDownloadUrl } from '@apps/live-photo-client/utils/helper';
import FButton from '@apps/live/components/FButton';
import IconDownLoad from '@apps/live/components/Icons/IconDownLoad';
import IconPlay from '@apps/live/components/Icons/IconPlay';
import IconPrint from '@apps/live/components/Icons/IconPrint';
import IcondownList from '@apps/live/components/Icons/IcondownList';
import Waring from '@apps/live/components/Icons/waring';

import { Container, DirectionLine, Line } from './layout';

export default function ControlList(props) {
  const {
    handleList,
    // handleDowload,
    handleAotoPlay,
    className,
    isShowImageList,
    point,
    baseUrl,
  } = props;

  const [srcDoc, setSrcDoc] = useState('');
  const iframeRef = useRef(null);
  const { getImageId } = useSetting();

  useEffect(() => {
    if (!point) return;
    getImage(point.imgUrl);
  }, [point]);

  function getImage(src) {
    let width = 0,
      height = 0;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      width = img.width;
      height = img.height;
      if (width > height) {
        setSrcDoc(
          `<div style='height: 100%; display: flex; justify-content: center; align-items: center;'><img src='${src}' style="width: 100%" /></div>`
        );
      } else {
        setSrcDoc(
          `<div style='height: 100%; display: flex; justify-content: center; align-items: center;'><img src='${src}' style="max-height: 100%;height: 100%" /></div>`
        );
      }
      // console.log(width, height);
    };
  }
  function handlePrint() {
    // const src = getImageUrl(baseUrl, point.show_enc_content_id);
    // const page = window.open(src);
    const html = iframeRef.current.contentWindow.document.getElementsByTagName('html')[0];
    html.style.height = '100%';
    iframeRef.current.contentWindow.document.body.style.height = '100%';
    iframeRef.current.contentWindow.document.body.style.margin = '0';
    iframeRef.current.contentWindow.print();
  }

  // 下载图片
  function handleDowload() {
    const imageId = getImageId(point);
    const src = getDownloadUrl({ baseUrl, enc_image_uid: imageId, size: 1 });
    fetch(src)
      .then(res => res.blob())
      .then(blob => {
        // 将链接地址字符内容转变成blob地址
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = point.content_name;
        a.click();
      });
  }

  function getFileSize(size) {
    let s = size / 1024 / 1024;
    let endStr = '';
    if (s > 1) {
      s = s.toFixed(2);
      endStr = 'MB';
    } else {
      s *= 1024;
      s = s.toFixed(2);
      endStr = 'KB';
    }
    return s + endStr;
  }

  const overlay = useMemo(() => {
    return (
      <div>
        <DirectionLine>
          {t('LPC_FILE_SIZE')}：{getFileSize(point.content_size)}
        </DirectionLine>
        {point.shot_time !== 0 ? (
          <DirectionLine>
            {t('LPC_FILMING_TIME')}：{dayjs(point.shot_time).format('YYYY-MM-DD HH:mm:ss')}
          </DirectionLine>
        ) : null}
        <DirectionLine>
          {t('LPC_FILE_No')}：{point.content_name}
        </DirectionLine>
        <DirectionLine>
          {t('LPC_IMAGE_ID')}：{point.enc_content_id}
        </DirectionLine>
        {/* <Line>摄影师：{point.content_uuid}</Line> */}
      </div>
    );
  }, [point]);
  return (
    <Container className={className}>
      <Line />
      <FButton
        type="link"
        color="#3a3a3a"
        style={{ fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={handleList}
      >
        <IcondownList
          className={isShowImageList ? '' : 'rotate'}
          fill="#3a3a3a"
          style={{ verticalAlign: 'medium', marginRight: 5 }}
        />
        <span>{t('LPC_PICTURE_LIST')}</span>
      </FButton>
      <Line />
      <FButton
        type="link"
        color="#3a3a3a"
        style={{ fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={handlePrint}
      >
        <IconPrint fill="#3a3a3a" style={{ verticalAlign: 'medium', marginRight: 5 }} />
        <span>{t('LPC_PRINT')}</span>
      </FButton>
      <Line />
      <FButton
        type="link"
        color="#3a3a3a"
        style={{ fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={handleDowload}
      >
        <IconDownLoad fill="#3a3a3a" style={{ verticalAlign: 'medium', marginRight: 5 }} />
        <span>{t('LPC_DOWNLOAD')}</span>
      </FButton>
      <Line />
      <DropDown overlay={overlay}>
        <FButton
          type="link"
          color="#3a3a3a"
          style={{ fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Waring
            fill="#3a3a3a"
            style={{
              verticalAlign: 'medium',
              marginRight: 5,
              transform: `rotate(180deg)`,
            }}
          />
          <span>{t('LPC_PHOTO_INFO')}</span>
        </FButton>
      </DropDown>

      <Line />
      <FButton
        type="link"
        color="#3a3a3a"
        style={{ fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={handleAotoPlay}
      >
        <IconPlay fill="#3a3a3a" style={{ verticalAlign: 'medium', marginRight: 5 }} />
        <span>{t('LPC_AUTOPLAY')}</span>
      </FButton>
      <iframe ref={iframeRef} srcDoc={srcDoc} height={969} style={{ display: 'none' }} />
    </Container>
  );
}
