import { template } from 'lodash';

import { SAAS_GET_IMAGE_WITH_ORIENTATION_URL } from '@resource/lib/constants/apiUrl';

export const getImageUrl = ({ galleryBaseUrl, image_uid, thumbnail_size, orientation }) => {
  return template(SAAS_GET_IMAGE_WITH_ORIENTATION_URL)({
    galleryBaseUrl: galleryBaseUrl,
    image_uid,
    thumbnail_size,
    with_exif: orientation || 1,
  });
};
