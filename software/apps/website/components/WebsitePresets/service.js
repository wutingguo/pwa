import axios from 'axios';
import { pickBy, template } from 'lodash';

import { SAAS_WEBSITE_IMAGE_URL } from '@resource/lib/constants/apiUrl';

export const subjectEnum = {
  website: 'website',
  page: 'page',
  section: 'section',
};

export const tagTypeEnum = {
  [subjectEnum.website]: 1,
  [subjectEnum.page]: 2,
  [subjectEnum.section]: 3,
};

export const statusEnum = {
  private: 0,
  published: 1,
};

const parseRes = res => {
  if (!res.data) {
    console.error(res);
    throw new Error('request error.');
  }
  const { ret_code, ret_msg, data } = res.data;
  if (ret_code === 400446) {
    throw new Error('The name has already been taken');
  }
  if (ret_code !== 200000) {
    throw new Error(`${ret_msg} (${ret_code})`);
  }
  return data;
};

// 通过id获取预览图片
export const toPreviewImgUrl = ({ baseUrl, photoId }) => {
  if (!baseUrl || !photoId) {
    return '';
  }
  const imgUrl = template(SAAS_WEBSITE_IMAGE_URL)({
    galleryBaseUrl: baseUrl,
    enc_image_uid: photoId,
    thumbnail_size: 5,
  });

  const urlObject = new URL(imgUrl);
  urlObject.searchParams.append('thumbnail_size', 5);

  return urlObject.href;
};

// 获取tagId的过滤选项
export const getTagIdOptions = async ({ baseUrl = '/', subject, addAllOption = true }) => {
  const url = `${baseUrl}cloudapi/website/site/website_tag/list_website_tag_by_type`;
  const res = await axios.get(url, {
    params: {
      tag_type: tagTypeEnum[subject],
    },
  });
  const data = parseRes(res) || [];
  // 转为options
  const options = data.map(tag => {
    const { id, tag_code, tag_name, tag_status, tag_type } = tag;
    return {
      value: id,
      label: tag_name,
    };
  });

  // 插入all选项 value为空串
  if (addAllOption) {
    options.unshift({
      value: '',
      label: 'All',
    });
  }
  return options;
};

// 获取预设列表
export const getPresetList = async ({ baseUrl = '/', subject, tagId, status }) => {
  // 几个列表的参数都是一样的
  const map = {
    [subjectEnum.website]: `${baseUrl}cloudapi/website/template/list_website_templates`,
    [subjectEnum.page]: `${baseUrl}cloudapi/website/template/list_page_templates`,
    [subjectEnum.section]: `${baseUrl}cloudapi/website/template/list_section_templates`,
  };
  const url = map[subject];

  const res = await axios.get(url, {
    params: {
      tag_id: tagId,
      status,
    },
  });
  const data = parseRes(res) || [];

  // 将website、page、section数据整理为presetItem
  return data.map(item => {
    switch (subject) {
      case subjectEnum.website: {
        const { id, website_name, is_public, page_photo_id } = item;
        return {
          subject,
          id,
          name: website_name,
          status: Number(is_public),
          photoId: page_photo_id,
          previewImgUrl: toPreviewImgUrl({ baseUrl, photoId: page_photo_id }),
        };
      }

      case subjectEnum.page: {
        const {
          id,
          name,
          is_public,
          thumbnail_photo_id,
          applied_page_template_id,
          footer_section_id,
        } = item;
        return {
          subject,
          id,
          name,
          status: Number(is_public),
          photoId: thumbnail_photo_id,
          previewImgUrl: toPreviewImgUrl({ baseUrl, photoId: thumbnail_photo_id }),
        };
      }

      case subjectEnum.section: {
        const {
          id,
          name,
          is_public,
          thumbnail_photo_id,
          applied_section_template_id,
          element_list,
        } = item;
        return {
          subject,
          id,
          name,
          status: Number(is_public),
          photoId: thumbnail_photo_id,
          previewImgUrl: toPreviewImgUrl({ baseUrl, photoId: thumbnail_photo_id }),
        };
      }
    }
  });
};

// 更新预设状态
export const updatePresetStatus = async ({ baseUrl, subject, id, status }) => {
  const map = {
    [subjectEnum.website]: {
      url: `${baseUrl}cloudapi/website/template/update_website_template_status`,
      params: {
        website_id: id,
        is_public: status,
      },
    },
    [subjectEnum.page]: {
      url: `${baseUrl}cloudapi/website/template/update_page_template_status`,
      params: {
        page_dto: {
          id,
          is_public: status,
        },
      },
    },
    [subjectEnum.section]: {
      url: `${baseUrl}cloudapi/website/template/update_section_template_status`,
      params: {
        section_dto: {
          id,
          is_public: status,
        },
      },
    },
  };

  const config = map[subject];

  const res = await axios.post(config.url, config.params);
  parseRes(res);
};

// 改名
export const renamePreset = async ({ baseUrl, subject, id, name }) => {
  const map = {
    [subjectEnum.website]: {
      url: `${baseUrl}cloudapi/website/site/save_setting`,
      params: { id, key: 'web_nav_title', value: name },
    },
    [subjectEnum.page]: {
      url: `${baseUrl}cloudapi/website/template/page_re_name`,
      params: { page_dto: { id, name } },
    },
    [subjectEnum.section]: {
      url: `${baseUrl}cloudapi/website/template/section_re_name`,
      params: { section_dto: { id, name } },
    },
  };

  const config = map[subject];
  const res = await axios.post(config.url, config.params);
  parseRes(res);
};

// 预设重名检查
export const checkNameIsExist = async ({ baseUrl, subject, name }) => {
  const map = {
    [subjectEnum.website]: {
      url: `${baseUrl}cloudapi/website/site/website_name_exists`,
      params: {
        website_name: name,
      },
    },
    [subjectEnum.page]: {
      url: `${baseUrl}cloudapi/website/template/check_page_name`,
      params: {
        page_name: name,
      },
    },
    [subjectEnum.section]: {
      url: `${baseUrl}cloudapi/website/template/check_section_name`,
      params: {
        section_name: name,
      },
    },
  };
  const config = map[subject];
  const res = await axios.get(config.url, { params: config.params });

  // 处理响应
  switch (subject) {
    // 如果重名 website接口会返回true
    case subjectEnum.website: {
      const exist = parseRes(res);
      if (exist) throw new Error('The name has already been taken');
    }
    // 如果重名 page和section接口会报400446
    case subjectEnum.page:
    case subjectEnum.section: {
      parseRes(res);
    }
  }
};

// 删除预设
export const deletePreset = async ({ baseUrl, subject, id }) => {
  const map = {
    [subjectEnum.website]: {
      url: `${baseUrl}cloudapi/website/template/delete_website_by_id`,
      params: {
        website_id: id,
      },
    },
    [subjectEnum.page]: {
      url: `${baseUrl}cloudapi/website/template/delete_page_by_id`,
      params: {
        page_dto: {
          id,
        },
      },
    },
    [subjectEnum.section]: {
      url: `${baseUrl}cloudapi/website/template/delete_section_by_id`,
      params: {
        section_dto: {
          id,
        },
      },
    },
  };
  const config = map[subject];
  const res = await axios.post(config.url, config.params);
  parseRes(res);
};

// 创建预设
export const createPreset = async ({ baseUrl, subject, tagId, name }) => {
  await checkNameIsExist({ baseUrl, subject, name });

  const origin = window.origin;
  const url = `${origin}/website/generator?name=${name}&type=${subject}&tagId=${tagId}`;
  window.open(url);
};

// 编辑预设
export const editPreset = ({ subject, id }) => {
  const origin = window.origin;
  const url = `${origin}/website/generator/${subject}/${id}`;
  window.open(url);
};
