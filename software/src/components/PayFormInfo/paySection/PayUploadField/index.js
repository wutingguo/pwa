import React, { memo, useEffect, useMemo, useRef, useState } from 'react';

import { getImageUrl } from '@resource/lib/saas/image';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import { payWechatUploadImg } from '@common/servers/payWeChat';

import { XFileUpload, XImg } from '@common/components';
import { useMessage } from '@common/hooks';

import PayField from '../PayField';

import './index.scss';

const PayUpload = props => {
  const { value = {}, boundGlobalActions, baseUrl, onChange } = props;
  // const [imgId, setImgId] = useState(null);
  const imgId = value && value.enc_image_id;
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [placeholder, message] = useMessage();

  // 文件上传前回调
  function beforeUpload(files) {
    const file = files[0];
    const types = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!types.includes(file.type)) {
      message.error('仅支持png、jpg');
      return false;
    }
    if (file.size > 1024 * 1024 * 2) {
      message.error('超出图片大小限制');
      return false;
    }
    return true;
  }
  const onUploadImg = files => {
    const form = new FormData();
    form.append('file', files[0]);
    setIsShowLoading(true);
    payWechatUploadImg({
      baseUrl,
      params: form,
    })
      .then(res => {
        onChange(res);
        // setImgId(res.enc_image_id)
      })
      .catch(() => setIsShowLoading(false));
  };
  // 计算自定义logosrc
  const costomSrc = useMemo(() => {
    if (!imgId) return null;
    let src = getImageUrl({
      galleryBaseUrl: baseUrl,
      image_uid: imgId,
      thumbnail_size: thumbnailSizeTypes.SIZE_350,
      isWaterMark: false,
      timestamp: new Date().getTime(),
    });
    return src;
  }, [imgId]);
  useEffect(() => {
    // 这里是解决上传过图片 再次上传图片时历史图片未消失的问题
    const im = new window.Image();
    im.onload = () => {
      setIsShowLoading(false);
    };
    im.src = costomSrc;
  }, [costomSrc]);

  const fileUploadProps = {
    isIconShow: false,
    addImages: files => onUploadImg(files),
    useNewUpload: true,
    beforeUpload,
    onSelectFile: () => {},
    showModal: () => {},
    accept: 'image/jpeg,image/png,image/jpg',
  };
  return (
    <div className="payUploadField">
      <XFileUpload {...fileUploadProps}>
        {/* 该组件提示传入数组 (我也不明白为啥要求传数组) */}
        {[
          <div className="upLoadBox" key="0">
            {isShowLoading || costomSrc ? (
              <div className="uploadImageBox">
                <XImg src={costomSrc} isLoading={isShowLoading} />
              </div>
            ) : (
              <div className="upload_text">上传</div>
            )}
          </div>,
        ]}
      </XFileUpload>
      {placeholder}
      <div className="uploadDesc">
        <div>
          1.请上传彩色照片 or 彩色扫描件 or
          加盖公章鲜章的复印件，要求正面拍摄，露出证件四角且清晰、完整，所有字符清晰可识别，不得反光或遮挡。不得翻拍、截图、镜像、PS；
        </div>
        <div>2.图片只支持JPG、PNG格式，文件大小不能超过2M。</div>
      </div>
    </div>
  );
};
const PayUploadField = props => {
  const { child, boundGlobalActions, baseUrl, ...reset } = props;
  const tempChild = child
    ? child
    : (value, onChange) => {
        return <PayUpload {...props} onChange={onChange} value={value} />;
      };
  return <PayField {...reset} child={tempChild} />;
};
export default memo(PayUploadField);
