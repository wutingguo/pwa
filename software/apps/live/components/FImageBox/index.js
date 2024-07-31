import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Container, CloseElement, ImageItem } from './layout';
import IconLoading from '@apps/live/components/Icons/IconLoading';
import IconUploadError from '@apps/live/components/Icons/IconUploadError';
import IconBannerClose from '@apps/live/components/Icons/IconBannerClose';
import IconSuccess from '@apps/live/components/Icons/IconSuccess';
import { ALBUM_LIVE_IMAGE_URL } from '@apps/live/constants/api';
import { template } from 'lodash';
import classNames from 'classnames';
import { getOrientationAppliedImage } from '@resource/lib/utils/exif';

export default function ImageBox(props) {
  const {
    code,
    index,
    status,
    onLoading,
    onLoad,
    baseUrl,
    size,
    onRemove,
    style,
    backgroundSize,
    isShowSuccessIcon,
    delay = 1,
    isAnimated,
    onDrop,
    draggable,
    orientation,
    defaultUrl,
    onClick
  } = props;
  const [boxStatus, setBoxStatus] = useState(status);
  const [url, setUrl] = useState(defaultUrl);
  const boxRef = useRef(null);

  useEffect(() => {
    if (code instanceof Promise) {
      onLoading && onLoading({ key: index });
      setBoxStatus('loading');
      code.then(
        result => {
          onLoad && onLoad({ key: index, result });
          setBoxStatus('success');
        },
        result => {
          onLoad && onLoad({ key: index, result });
          setBoxStatus('error');
        }
      );
    } else {
      setBoxStatus('success');
    }
  }, [code]);

  useEffect(() => {
    boxRef.current.ondrop = drop;
    boxRef.current.ondragover = dragover;
    // boxRef.current.ondragenter = onDragEnter;
    boxRef.current.ondragstart = onDragStart;
  }, [code]);

  const boxClass = classNames({
    bottomToTop: isAnimated
  });

  function drop(e) {
    // e.preventDefault();
    const sourceCode = e.dataTransfer.getData('code');
    onDrop && onDrop({ source: sourceCode, target: code });
  }
  function dragover(e) {
    e.preventDefault();
  }

  function onDragStart(e) {
    e.dataTransfer.setData('code', code);
  }

  useEffect(() => {
    if (!code) return;
    getUrl();
  }, [orientation, baseUrl, code, size]);

  async function getUrl() {
    let src = template(ALBUM_LIVE_IMAGE_URL)({ baseUrl, enc_image_id: code, size });
    // console.log('orientation: ', orientation);
    if (typeof orientation === 'number') {
      src = await getOrientationAppliedImage(src, orientation);
    }
    setUrl(src);
  }
  const getElement = () => {
    if (boxStatus === 'loading') {
      return <IconLoading className="loading" />;
    } else if (boxStatus === 'success') {
      return (
        <ImageItem>
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${url})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: backgroundSize || 'cover',
              backgroundPosition: 'center'
            }}
          />
          {isShowSuccessIcon ? <IconSuccess className="success" /> : null}
        </ImageItem>
      );
    }

    return <IconUploadError className="loading_error" />;
  };

  return (
    <Container
      ref={boxRef}
      draggable={draggable}
      style={style}
      className={boxClass}
      delay={delay}
      onClick={onClick}
    >
      {getElement()}
      {onRemove ? (
        <CloseElement onClick={() => onRemove(index, { data: code })}>
          <IconBannerClose className="close" />
        </CloseElement>
      ) : null}
    </Container>
  );
}
