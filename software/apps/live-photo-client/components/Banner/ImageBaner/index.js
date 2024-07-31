import React, { useEffect, useState } from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import { getDownloadUrl } from '@apps/live-photo-client/utils/helper';

import './index.scss';

export default function ImageBanner(props) {
  const { envUrls, banner, setOpen } = props;

  const [imgUrls, setImgUrls] = useState([]);

  useEffect(() => {
    const baseUrl = envUrls.get('saasBaseUrl');
    const enc_image_uid = banner.get('banner_image_infos').toJS();
    const imgUrls = enc_image_uid.map(item => {
      const url = getDownloadUrl({
        baseUrl,
        enc_image_uid: item.banner_image_id,
      });
      return url;
    });
    setOpen(imgUrls.length > 0);
    setImgUrls(imgUrls);
  }, []);

  return (
    <Swiper
      style={{
        '--swiper-pagination-color': '#000',
      }}
      initialSlide={1}
      spaceBetween={15}
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
      className="swiper-items"
    >
      {imgUrls.map(url => {
        return (
          <SwiperSlide key={url}>
            <div className="swiper-box">
              <img className="swiper-bg-image" src={url}></img>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
