import React, { forwardRef, useContext } from 'react';

import useMessage from '@common/hooks/useMessage';

import { XFileUpload } from '@common/components';

import { PhotoLiveSettingContext } from '@apps/live/context';

import MediaItem from './MediaItem';
import src02 from './icons/picture.png';
import src01 from './icons/video.png';
import { Card, Container, MediaList, Text, UploadBox } from './layout';

function UploadVideoCard(props, ref) {
  const { baseUrl, setMedia, media, intl } = props;
  const { boundGlobalActions } = useContext(PhotoLiveSettingContext);
  const [placeholder, message] = useMessage();

  function getUploadedImgs(type, imgs) {
    const [imgObj] = imgs.upload_complete;
    const { image_data } = imgObj;
    if (type === 'image') {
      setMedia(m => ({
        ...m,
        video_cover_media_id: image_data?.enc_image_id,
      }));
    } else {
      setMedia(m => ({
        ...m,
        video_media_id: image_data?.enc_image_id,
      }));
    }
  }

  function showModal(...arg) {
    boundGlobalActions.showModal(...arg);
  }

  function beforeUpload(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const size = file.size / 1024 / 1024;
      if (size > 200 || file.type.indexOf('video') === -1) {
        message.error(intl.tf('LP_BANNER_UPLOAD_IMAGE_TIP'));
        return false;
      }
    }
    return true;
  }

  function beforeUploadImage(files) {
    const size = files[0].size / 1024 / 1024;
    if (size >= 5) {
      message.error(intl.tf('LP_PLEASE_UPLOAD_PICTURES_SMALLER_THAN_5M'));
      return false;
    }
    return true;
  }
  function onClose(type) {
    if (type === 'image') {
      3;
      setMedia(m => ({ ...m, video_cover_media_id: null }));
    } else {
      setMedia(m => ({ ...m, video_media_id: null }));
    }
  }
  return (
    <Container>
      <UploadBox>
        <div>
          <Card>
            <XFileUpload
              // multiple={false}
              inputId="video"
              isIconShow={false}
              uploadFilesByS3={true}
              isDropFile={true}
              getUploadedImgs={(...args) => getUploadedImgs('video', ...args)}
              showModal={showModal}
              beforeUpload={beforeUpload}
              accept="video/mp4"
              media_type={3}
              title={intl.tf('LP_UPLOAD_VIDEO')}
              acceptFileTip={intl.tf('LP_BANNER_UPLOAD_IMAGE_TIP')}
            >
              <img src={src01} style={{ width: '20px' }} />
              <div className="card_text" style={{ color: '#0077CC' }}>
                {intl.tf('LP_BANNER_VIDEO_CARD_TIP')}
              </div>
            </XFileUpload>
          </Card>
          <Text>{intl.tf('LP_BANNER_UPLOAD_IMAGE_TIP')}</Text>
        </div>

        <Card style={{ background: '#F6F6F6', border: 'none', width: 200, marginLeft: 10 }}>
          <XFileUpload
            // multiple={false}
            inputId="image"
            isIconShow={false}
            uploadFilesByS3={true}
            isDropFile={true}
            getUploadedImgs={(...args) => getUploadedImgs('image', ...args)}
            showModal={showModal}
            beforeUpload={beforeUploadImage}
          >
            <img src={src02} style={{ width: '20px' }} />
            <div className="card_text">{intl.tf('LP_BANNER_IMAGE_CARD_TIP')}</div>
          </XFileUpload>
        </Card>
      </UploadBox>

      <MediaList>
        <MediaItem
          baseUrl={baseUrl}
          style={{ width: 374, height: 212 }}
          type="video"
          mediaId={media?.video_media_id}
          onClose={(...arg) => onClose('video', ...arg)}
          intl={intl}
        />
        <MediaItem
          baseUrl={baseUrl}
          style={{ width: 374, height: 212, marginLeft: 20 }}
          type="image"
          mediaId={media?.video_cover_media_id}
          onClose={(...arg) => onClose('image', ...arg)}
          intl={intl}
        />
      </MediaList>
      {placeholder}
    </Container>
  );
}

export default forwardRef(UploadVideoCard);
