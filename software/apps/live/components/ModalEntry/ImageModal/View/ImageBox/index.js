import { template } from 'lodash';
import React, { useMemo } from 'react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import { getOrientationAppliedImage } from '@resource/lib/utils/exif';

import { getDownloadUrl } from '@apps/live-photo-client/utils/helper';
import { ALBUM_LIVE_IMAGE_URL } from '@apps/live/constants/api';

import Item from './Item';
import { Container } from './layout';

export default function ImageBox(props) {
  const { list, baseUrl, onSlideChange, initialSlide } = props;

  const data = useMemo(() => {
    const newData =
      list.map(item => {
        let src = template(ALBUM_LIVE_IMAGE_URL)({
          baseUrl,
          enc_image_id: item.show_enc_content_id,
          size: 3,
        });
        let sourceSrc = template(ALBUM_LIVE_IMAGE_URL)({
          baseUrl,
          enc_image_id: item.show_enc_content_id,
          size: 1,
        });
        const url = () => getOrientationAppliedImage(src, item.orientation);
        const sourceUrl = () => getOrientationAppliedImage(sourceSrc, item.orientation);
        // const sourceUrl = getDownloadUrl({ baseUrl, enc_image_uid: item.show_enc_content_id });
        return {
          ...item,
          url,
          sourceUrl,
        };
      }, []) || [];

    return newData;
  }, [list]);

  return (
    <Container>
      <Swiper
        style={{
          '--swiper-navigation-color': '#3A3A3A',
          '--swiper-pagination-color': '#3A3A3A',
          height: '100%',
        }}
        modules={[Navigation]}
        navigation={true}
        className="mySwiper"
        initialSlide={initialSlide}
        onSlideChange={onSlideChange}
      >
        {data?.map(item => {
          return (
            <SwiperSlide>
              <div className="swiper-zoom-container">
                <Item
                  src={item.url}
                  sourceSrc={item.sourceUrl}
                  orientation={item.orientation}
                  baseUrl={baseUrl}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Container>
  );
}
