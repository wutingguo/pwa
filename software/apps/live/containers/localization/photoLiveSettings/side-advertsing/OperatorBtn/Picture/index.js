import { template } from 'lodash';
import React, { useMemo } from 'react';

import { XFileUpload } from '@common/components';
import { useMessage } from '@common/hooks';

import Add from '@apps/live/components/Icons/Add';
import IconBannerClose from '@apps/live/components/Icons/IconBannerClose';
import { ALBUM_LIVE_IMAGE_URL } from '@apps/live/constants/api';

import { Container } from './layout';

export default function Picture(props) {
  const { value, onChange, boundGlobalActions, baseUrl } = props;
  const [placeholder, message] = useMessage();

  // 文件上传回调
  function getUploadedImgs(successInfo) {
    const { upload_complete } = successInfo;
    const { image_data } = upload_complete[0];

    const imageId = image_data?.enc_image_id;
    onChange(imageId);
  }

  // 文件上传前回调
  function beforeUpload(files) {
    const file = files[0];
    const types = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!types.includes(file.type)) {
      return message.error('仅支持png、jpg、jpeg');
    }
    return true;
  }

  // 计算自定义logosrc
  const costomSrc = useMemo(() => {
    if (!value) return null;
    let src = template(ALBUM_LIVE_IMAGE_URL)({
      baseUrl,
      enc_image_id: value,
      size: 4,
    });
    return src;
  }, [value]);

  const fileUploadProps = {
    multiple: false,
    inputId: 'picture',
    isIconShow: false,
    uploadFilesByS3: true,
    isDropFile: true,
    getUploadedImgs,
    showModal: boundGlobalActions.showModal,
    beforeUpload,
    accept: 'image/jpg,image/png,image/jpeg',
    // acceptFileTip: intl.tf('ONLY_PNG_OR_GIF_SUPPORTED'),
    // cusTypeCheck: {
    //   type: ['image/gif', 'image/png'],
    //   message: intl.tf('ONLY_PNG_OR_GIF_SUPPORTED'),
    // },
  };
  return (
    <Container>
      <div className="costom_box">
        <div className="image_box">
          <div>
            <XFileUpload {...fileUploadProps}>
              <Add fill="#222" style={{ width: '20px' }} />
              <div className="upload_text">点击上传图片</div>
            </XFileUpload>
          </div>
          {costomSrc ? (
            <div className="costom_img">
              <IconBannerClose onClick={() => onChange('')} className="costom_close_icon" />
              <img className="image" src={costomSrc} />
            </div>
          ) : null}
        </div>
        <div className="image_text_rows">
          <div className="image_text_col">推荐尺寸：宽1125px，高2180px</div>
          {/* <div className="image_text_col" style={{ color: '#222' }}>
                      {intl.tf('LP_LOGO_TIMER_TIP_IMG_UPLOAD_TIP_DOWN')}
                    </div> */}
        </div>
      </div>
      {placeholder}
    </Container>
  );
}
