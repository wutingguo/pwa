import React, { useEffect, useRef, useState } from 'react';

import XButton from '@resource/components/XButton';
import { RcRadioGroup } from '@resource/components/XRadio';

import { useLanguage } from '@common/components/InternationalLanguage';

import { useMessage, useRequest } from '@common/hooks';

import Switch from '@apps/gallery/components/Switch';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import { getBanner, saveBannerUrl, updateBanner } from '@apps/live/services/photoLiveSettings';

import UploadCard from './UploadCard';
import UploadVideoCard from './UploadVideoCard';
import { Bottom, Container, Content, Lable, Line } from './layout';

export default function Banner(props) {
  const { urls, baseInfo } = props;
  const baseUrl = urls.get('galleryBaseUrl');
  const uploadRef = useRef(null);
  const [media, setMedia] = useState({
    video_media_id: null,
    video_cover_media_id: null,
  });
  // const [checked, setChecked] = useState(false);
  const [bannerType, setBannerType] = useState(1);

  const [uploadDefaultValue, setUploadDefaultValue] = useState([]);
  const { run, loading } = useRequest(updateBanner, { baseUrl });
  const [placeholder, message] = useMessage();
  const { intl } = useLanguage();

  useEffect(() => {
    if (!baseInfo?.broadcast_id) return;
    queryBannerInfo();
  }, [baseInfo?.broadcast_id]);

  // 获取详情信息
  async function queryBannerInfo() {
    const params = {
      baseUrl,
      id: baseInfo.broadcast_id,
    };
    const res = await getBanner(params);
    if (!res) return;
    const { banner_switch, banner_image_infos, banner_video_info, banner_type } = res;
    const images =
      banner_image_infos.length !== 0
        ? banner_image_infos.map(item => ({
            imageId: item.banner_image_id,
            orientation: item.orientation,
            banner_ext_url: item.banner_ext_url,
          }))
        : [];
    setUploadDefaultValue(images);
    banner_video_info && setMedia(banner_video_info);
    setBannerType(banner_type);
    // setChecked(banner_switch);
  }
  function setLogEvent() {
    if (bannerType === 2) {
      intl.lang === 'cn' &&
        window.logEvent.addPageEvent({
          name: 'LIVE_Banner_On_Image',
        });
      intl.lang === 'cn' &&
        window.logEvent.addPageEvent({
          name: 'LIVE_Banner_On',
        });
    } else if (bannerType === 3) {
      intl.lang === 'cn' &&
        window.logEvent.addPageEvent({
          name: 'LIVE_Banner_On_Video',
        });
      intl.lang === 'cn' &&
        window.logEvent.addPageEvent({
          name: 'LIVE_Banner_On',
        });
    } else if (bannerType === 1) {
      intl.lang === 'cn' &&
        window.logEvent.addPageEvent({
          name: 'LIVE_Banner_Off',
        });
    }
  }
  // 保存事件
  async function onSave() {
    const banner_images = uploadRef.current.getValue();
    if (banner_images.length === 0 && bannerType === 2)
      return message.waring(intl.tf('LP_NO_PICTURES_UPLOADED'));
    if (!media.video_media_id && bannerType === 3)
      return message.waring(intl.tf('LP_BANNER_UPLOAD_SAVE_TOP'));

    const params = {
      banner_images,
      // banner_switch: checked,
      broadcast_id: baseInfo.broadcast_id,
      banner_type: bannerType,
      banner_video: media,
    };

    await run(params);
    setLogEvent();
    queryBannerInfo();
    message.success(intl.tf('LP_SAVE_SUCCESSFULLY'));
    // console.log('save:::', params);
  }

  async function saveUrl(data) {
    const params = Object.assign({ broadcast_id: baseInfo?.broadcast_id, baseUrl }, data);
    return saveBannerUrl(params);
  }

  function handleBanner(e) {
    const value = e.target.value;
    setBannerType(value);
  }
  return (
    <WithHeaderComp title={intl.tf('LP_BANNER_TITLE')}>
      <Container>
        <Content>
          <Line>
            <Lable>{intl.tf('LP_BANNER_UPLOAD_TYPE')}</Lable>
          </Line>
          <Line>
            {/* <Switch onSwitch={onSwitch} checked={checked} labelStyle={{ marginBottom: 0 }} /> */}
            <RcRadioGroup
              wrapperClass="znoRadio"
              onChange={handleBanner}
              value={bannerType}
              options={[
                {
                  value: 1,
                  label: intl.tf('LP_BANNER_NONE'),
                },
                {
                  value: 2,
                  label: intl.tf('LP_BANNER_IMAGE'),
                },
                {
                  value: 3,
                  label: intl.tf('LP_BANNER_VIDEO'),
                },
              ]}
            />
          </Line>
          <Line hidden={bannerType !== 2}>
            <UploadCard
              ref={uploadRef}
              baseUrl={baseUrl}
              defaultValue={uploadDefaultValue}
              saveUrl={saveUrl}
              intl={intl}
            />
          </Line>
          <Line hidden={bannerType !== 3}>
            <UploadVideoCard
              media={media}
              setMedia={setMedia}
              baseUrl={baseUrl}
              defaultValue={uploadDefaultValue}
              intl={intl}
            />
          </Line>
        </Content>
        <Bottom>
          <XButton width={200} height={40} onClick={onSave} disabled={loading}>
            {intl.tf('LP_SAVE_SETTING')}
          </XButton>
        </Bottom>
      </Container>
      {placeholder}
    </WithHeaderComp>
  );
}
