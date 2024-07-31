import React, { useEffect } from 'react';

import { XModal } from '@common/components';

// import XImg from '@resource/components/pwa/XImg';
import IconClose from '@apps/live/components/Icons/IconClose';

import Content from './Content';
import ContentUs from './ContentUs';
import { Container } from './layout';

function ImageViewer(props) {
  const { envUrls, data } = props;
  const {
    handleClose,
    index,
    photoList,
    initalAutoPlay,
    initalShowImageList,
    initalShowControlList,
    logClick,
    autoUpdate,
    handleAutoUpdateImage,
  } = data.toJS();
  const modalProps = {
    isHideIcon: true,
    escapeClose: false,
    styles: { width: '100%', height: '100%', padding: 0 },
  };
  const baseUrl = envUrls.get('saasBaseUrl');

  function closeClick() {
    handleClose();
  }

  // console.log('rest', rest);
  return (
    <XModal {...modalProps} opened>
      <Container>
        <span onClick={closeClick} className="close">
          <IconClose width={20} />
        </span>
        {__isCN__ ? (
          <Content
            index={index}
            photoList={photoList}
            baseUrl={baseUrl}
            initalShowImageList={initalShowImageList}
            initalAutoPlay={initalAutoPlay}
            initalShowControlList={initalShowControlList}
            logClick={logClick}
            autoUpdate={autoUpdate}
            handleAutoUpdateImage={handleAutoUpdateImage}
          />
        ) : (
          <ContentUs
            index={index}
            photoList={photoList}
            baseUrl={baseUrl}
            initalShowImageList={initalShowImageList}
            initalAutoPlay={initalAutoPlay}
            initalShowControlList={initalShowControlList}
            logClick={logClick}
          />
        )}
      </Container>
    </XModal>
  );
}

export default ImageViewer;
