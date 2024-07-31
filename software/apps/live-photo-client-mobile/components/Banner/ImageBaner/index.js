import React, { useEffect, useRef, useState } from 'react';
import { Autoplay, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import { getDownloadUrl } from '@apps/live-photo-client-mobile/utils/helper';

export default function ImageBanner(props) {
  const { envUrls, banner, setOpen } = props;

  const [imgs, setImgs] = useState([]);
  const rect = useRef({
    baseW: 0,
    baseH: 0,
  });

  useEffect(() => {
    init();
  }, []);

  function init() {
    rect.current.baseW = window.innerWidth;
    const baseUrl = envUrls.get('saasBaseUrl');
    const banner_image_infos = banner.get('banner_image_infos');
    const imgs = banner_image_infos.map((item, index) => {
      const {
        banner_image_id: enc_image_uid,
        banner_ext_url,
        width = 0,
        height = 0,
        orientation,
      } = item.toJS();

      const url = getDownloadUrl({ baseUrl, enc_image_uid });
      const [w, h, baseW, baseH] = getbox({ width, height, orientation }, index);
      return {
        url,
        banner_ext_url,
        height: h,
        width: w,
        baseH,
        baseW,
      };
    });
    setOpen(imgs.size > 0);
    setImgs(imgs);
  }
  function goToInfo(url) {
    if (!url) return null;
    let newUrl = url;
    if (!url.startsWith('http')) {
      newUrl = '//' + url;
    }
    window.location.href = newUrl;
  }

  // 自适应算法
  function getbox({ width, height, orientation }, index) {
    if (orientation === 5 || orientation === 6 || orientation === 7 || orientation === 8) {
      width ^= height;
      height ^= width;
      width ^= height;
    }
    let w = window.innerWidth,
      h = 0,
      r = 1;
    // 根据第一张图片设置标准值
    if (index === 0) {
      r = w / width === Infinity ? 0 : w / width;
      h = height * r;
      rect.current.baseH = h;
    } else {
      r = rect.current.baseH / height === Infinity ? 0 : rect.current.baseH / height;
      w = width * r;
      h = rect.current.baseH;
    }
    return [w, h, rect.current.baseW, rect.current.baseH];
  }

  const isAutoplay = banner && banner.get('banner_image_infos').size > 1;
  const modules = isAutoplay ? [Autoplay, Pagination] : [Pagination];
  return (
    <Swiper
      style={{
        '--swiper-pagination-color': '#000',
      }}
      spaceBetween={15}
      centeredSlides={true}
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={modules}
      className="swiper-items"
    >
      {imgs.map((item, index) => {
        return (
          <SwiperSlide>
            <div
              className="swiper-box"
              style={{ width: item.baseW, height: item.baseH ? item.baseH : '' }}
            >
              <div className="header-top" />
              {item?.banner_ext_url ? (
                <div className="swiper-tip" onTouchStart={() => goToInfo(item.banner_ext_url)}>
                  {t('LPCM_DETAIL')}
                </div>
              ) : null}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={item.url}
                  // onLoad={e => this.onLoad(e, index)}
                  style={{ display: 'block', width: item.width, height: item.height }}
                />
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
