import { getSettingsLogoUrl } from '@resource/lib/saas/image';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';
import { IMAGE_SRC1 } from '@resource/lib/constants/apiUrl';
import { template } from 'lodash';
import getPuid from '@resource/websiteCommon/utils/getPuid';

// 获取渲染 logo 所需数据
export const getLogoData = (isFullTheme, logo, urls) => {
  const enc_image_uid = logo && logo.get('enc_image_uid');
  const orientation = (logo && logo.get('orientation')) || 0;
  const hasLogo = logo && !!logo.get('image_uid');
  if (!enc_image_uid || !hasLogo) return null;
  const src = __isCN__
    ? template(IMAGE_SRC1)({
        uploadBaseUrl: urls.get('uploadBaseUrl'),
        encImgId: getPuid(enc_image_uid)
      })
    : getSettingsLogoUrl({
        galleryBaseUrl: urls.get('galleryBaseUrl'),
        enc_image_uid,
        thumbnail_size: thumbnailSizeTypes.SIZE_350
      });

  const height = isFullTheme ? 58 : 52;
  const top = isFullTheme ? 156 : 96;

  return {
    src,
    orientation,
    style: {
      height,
      top
    }
  };
};
