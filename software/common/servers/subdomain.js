import { template } from 'lodash';

import { SUBDOMAIN_CHECK_URL_SLUG, VALIDATE_URL_SLUG } from '@resource/lib/constants/apiUrl';

import * as xhr from '@resource/websiteCommon/utils/xhr';

const checkUrlSlug = ({ galleryBaseUrl, collection_uid, url_slug }) => {
  return new Promise(resolve => {
    const url = template(SUBDOMAIN_CHECK_URL_SLUG)({
      galleryBaseUrl,
      collection_uid,
      url_slug,
    });
    xhr.get(url).then(res => {
      resolve(res.data);
    });
  });
};

const validateUrlSlug = ({ baseUrl, project_id, url_slug }) => {
  return new Promise(resolve => {
    const url = template(VALIDATE_URL_SLUG)({
      baseUrl,
      project_id,
      url_slug,
    });
    xhr.get(url).then(res => {
      resolve(res.data);
    });
  });
};

export { checkUrlSlug, validateUrlSlug };
