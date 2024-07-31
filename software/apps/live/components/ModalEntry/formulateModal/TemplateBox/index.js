import React from 'react';
import { Container, ButtonBox, ColorPickerBox } from './layout';
import CustomBox from '@apps/live/components/CustomBox';
import XButton from '@resource/components/XButton';
import { XFileUpload } from '@common/components';
import XColorPicker from '@resource/components/XColorPicker';
import { useLanguage } from '@common/components/InternationalLanguage';

export default function TemplateBox(props) {
  const { boundGlobalActions, onChange, values, baseUrl} = props;
  const { intl } = useLanguage();

  // 图片上传成功回调
  function getUploadedImgs(key, data) {
    const {
      image_data: { enc_image_id }
    } = data.upload_complete[0];

    onChange(key, enc_image_id);
    // console.log('getUploadedImgs', key, files);
  }
  // 设置颜色
  function setColor(key, color) {
    onChange(key, color);
  }
  const fileUploadProps = {
    multiple: true,
    inputId: 'toggle',
    isIconShow: false,
    uploadFilesByS3: true,
    isDropFile: true,
    showModal: boundGlobalActions.showModal,
    style: { padding: 0 }
  };

  console.log('values', values);
  return (
    <Container>
      <CustomBox style={{ width: 200 }} values={values} isInfo isBorder baseUrl={baseUrl} />
      <ButtonBox style={{width:230}}>
        <div className="box_line">
          <div className="btns">
            <XFileUpload
              {...fileUploadProps}
              getUploadedImgs={(...arg) => getUploadedImgs('bg_image_id', ...arg)}
            >
              <XButton type="button" width={100} height={30}>
                  {intl.tf('LP_CURRENT_ALBUM_STYLE_IMAGE')}
              </XButton>
            </XFileUpload>
            <ColorPickerBox>
              <XColorPicker
                initHexString={values.bg_color}
                onColorChange={({ hex }) => setColor('bg_color', hex)}
                isUpDirection={false}
                icon={
                  <XButton
                    style={{
                      background: '#fff',
                      color: '#222',
                      border: '1px solid #d8d8d8',
                      width: 100,
                      height: 30,
                      lineHeight: '30px',
                      marginLeft: 10
                    }}
                    type="button"
                  >
                     {intl.tf('LP_CURRENT_ALBUM_STYLE_COLOR')}
                  </XButton>
                }
              />
            </ColorPickerBox>
          </div>
          <div className="btn_text">
            <p>{intl.tf('LP_CURRENT_ALBUM_STYLE_SIZE')}</p>
            <p>{intl.tf('LP_CURRENT_ALBUM_STYLE_KEEP_TOP_RIGHT')}</p>
          </div>
        </div>
        <div className="box_line">
          <div className="btns">
            <XFileUpload
              {...fileUploadProps}
              getUploadedImgs={(...arg) => getUploadedImgs('decorate_image_id', ...arg)}
            >
              <XButton type="button" width={100} height={30}>
              {intl.tf('LP_CURRENT_ALBUM_STYLE_IMAGE')}
              </XButton>
            </XFileUpload>
            <ColorPickerBox>
              <XColorPicker
                initHexString={values.decorate_color}
                onColorChange={({ hex }) => setColor('decorate_color', hex)}
                isUpDirection={false}
                icon={
                  <XButton
                    style={{
                      background: '#fff',
                      color: '#222',
                      border: '1px solid #d8d8d8',
                      width: 100,
                      height: 30,
                      lineHeight: '30px',
                      marginLeft: 10
                    }}
                    type="button"
                  >
                    {intl.tf('LP_CURRENT_ALBUM_STYLE_COLOR')}
                  </XButton>
                }
              />
            </ColorPickerBox>
          </div>
          <div className="btn_text">
            <p> {intl.tf('LP_CURRENT_ALBUM_STYLE_SIZE')} </p>
            <p>{intl.tf('LP_CURRENT_ALBUM_STYLE_KEEP_TOP_REPLACE')}</p>
          </div>
        </div>
      </ButtonBox>
    </Container>
  );
}
