import { template } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import { ReactVideo } from '@common/components';

import { VIDEO_DOWN_URL } from '@apps/live-photo-client/constants/imageUrl';
import { getDownloadUrl } from '@apps/live-photo-client/utils/helper';

import './index.scss';

export default function VideoBanner(props) {
  const { envUrls, info, setOpen } = props;
  const [url, setUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  useEffect(() => {
    initUrl(info);
  }, []);

  function initUrl() {
    const baseUrl = envUrls.get('saasBaseUrl');
    const { video_media_id, video_cover_media_id } = info || {};
    if (!video_media_id) {
      setOpen(false);
    }
    const r = template(VIDEO_DOWN_URL)({ baseUrl, enc_media_id: video_media_id });
    const cr = getDownloadUrl({
      baseUrl,
      enc_image_uid: video_cover_media_id,
    });

    setUrl(r);
    setCoverUrl(cr);
    setOpen(true);
  }
  return <ReactVideo url={url} controls width="412px" height="210px" playing coverUrl={coverUrl} />;
}
