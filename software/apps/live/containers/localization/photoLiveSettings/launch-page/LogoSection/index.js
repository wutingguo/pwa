import { template } from 'lodash';
import React, { useMemo, useState } from 'react';

import { XFileUpload } from '@common/components';
import { useMessage } from '@common/hooks';

import Switch from '@apps/gallery/components/Switch';
import Add from '@apps/live/components/Icons/Add';
import IconBannerClose from '@apps/live/components/Icons/IconBannerClose';
import { ALBUM_LIVE_IMAGE_URL } from '@apps/live/constants/api';

import InputNumber from './InputNumber';
import defaultImage from './images/loading.gif';
import { Container, Content, SettingBlock, ViewBlock } from './layout';

export default function LogoSection(props) {
  const { intl, boundGlobalActions, baseUrl, logoStore, setLogoStore } = props;
  const [placeholder, message] = useMessage();

  const tabs = [
    {
      label: intl.tf('LP_DEFAULT'),
      key: 0,
    },
    {
      label: intl.tf('LP_CUSTOM'),
      key: 1,
    },
  ];

  function onChange(key, value) {
    const newStore = { ...logoStore };
    if (key === 'loading_time') {
      if (value === '') {
        newStore[key] = value;
      } else {
        newStore[key] = isNaN(Number(value)) ? 1 : Math.floor(Number(value));
      }
    } else {
      newStore[key] = value;
    }
    setLogoStore(newStore);
  }

  // 文件上传回调
  function getUploadedImgs(successInfo) {
    const { upload_complete } = successInfo;
    const { image_data } = upload_complete[0];

    const imageId = image_data?.enc_image_id;
    onChange('loading_pic', imageId);
  }

  // 文件上传前回调
  function beforeUpload(files) {
    const file = files[0];
    const maxSize = 1024 * 1024;
    const types = ['image/png', 'image/gif'];
    if (!types.includes(file.type)) {
      return message.error(intl.tf('LP_PICTURE_FORMAT_NOT_SUPPORTED'));
    }
    if (file.size > maxSize) {
      message.error(intl.tf('LP_LOGO_TIMER_TIP_IMG_UPLOAD_TIP'));
      return false;
    }
    return true;
  }

  // 计算自定义logosrc
  const costomSrc = useMemo(() => {
    if (!logoStore?.loading_pic || logoStore?.is_default_loading === 0) return null;
    let src = template(ALBUM_LIVE_IMAGE_URL)({
      baseUrl,
      enc_image_id: logoStore?.loading_pic,
      size: 4,
    });
    return src;
  }, [logoStore?.loading_pic, logoStore?.is_default_loading]);

  const fileUploadProps = {
    multiple: false,
    inputId: 'loading',
    isIconShow: false,
    uploadFilesByS3: true,
    isDropFile: true,
    getUploadedImgs,
    showModal: boundGlobalActions.showModal,
    beforeUpload,
    accept: 'image/gif,image/png',
    acceptFileTip: intl.tf('ONLY_PNG_OR_GIF_SUPPORTED'),
    cusTypeCheck: {
      type: ['image/gif', 'image/png'],
      message: intl.tf('ONLY_PNG_OR_GIF_SUPPORTED'),
    },
  };
  return (
    <Container>
      <Content>
        <SettingBlock>
          <div className="switch_item">
            <div className="switch_label" style={{ width: intl.lang === 'en' ? 130 : '' }}>
              {intl.tf('LP_LOGO_TIMER_SWITCH_LABLE')}
            </div>
            <div className="switch_setting">
              <Switch
                checked={logoStore.switch_status}
                onSwitch={v => onChange('switch_status', v)}
              />
            </div>
          </div>
          <div className="swtich_title" style={{ width: intl.lang === 'en' ? 230 : 230 }}>
            <p className="switch_tip">{intl.tf('LP_LOGO_SWITCH_TIP')}</p>
            <InputNumber
              min={1}
              max={10}
              value={logoStore.loading_time}
              onChange={v => onChange('loading_time', v)}
              width={78}
            />
            <p className="switch_input_tip">{intl.tf('LP_LOGO_TIMER_NUMBER_TIP')}</p>
          </div>
        </SettingBlock>
        <ViewBlock>
          <div className="instantEffect" style={{ marginLeft: intl.lang === 'en' ? 240 : 168 }}>
            <div className="title">{intl.tf('LP_LOGO_TIMER_CUSTOM_PIC')}</div>
            <div className="tabWrpper">
              {tabs.map((item, i) => (
                <div
                  className={`tab ${i === logoStore.is_default_loading ? 'cur' : ''}`}
                  key={item.key}
                  onClick={() => onChange('is_default_loading', i)}
                >
                  {item.label}
                </div>
              ))}
            </div>
            <div className="effectContent">
              {logoStore.is_default_loading === 0 ? (
                <div className="default_box">
                  <div className="image_box">
                    <img className="image" src={defaultImage} />
                  </div>
                  <div className="image_text">{intl.tf('LP_LOGO_TIMER_TIP_IMG_DEFAULT')}</div>
                </div>
              ) : null}
              {logoStore.is_default_loading === 1 ? (
                <div className="costom_box">
                  <div className="image_box">
                    {costomSrc ? (
                      <div className="costom_img">
                        <IconBannerClose
                          onClick={() => onChange('loading_pic', '')}
                          className="costom_close_icon"
                        />
                        <img className="image" src={costomSrc} />
                      </div>
                    ) : (
                      <div>
                        <XFileUpload {...fileUploadProps}>
                          <Add fill="#222" style={{ width: '20px' }} />
                          <div className="upload_text">
                            {intl.tf('LP_LOGO_TIMER_TIP_IMG_UPLOAD')}
                          </div>
                        </XFileUpload>
                      </div>
                    )}
                  </div>
                  <div className="image_text_rows">
                    <div className="image_text_col">
                      {intl.tf('LP_LOGO_TIMER_TIP_IMG_UPLOAD_TIP')}
                    </div>
                    {/* <div className="image_text_col" style={{ color: '#222' }}>
                      {intl.tf('LP_LOGO_TIMER_TIP_IMG_UPLOAD_TIP_DOWN')}
                    </div> */}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </ViewBlock>
      </Content>
      {placeholder}
    </Container>
  );
}
