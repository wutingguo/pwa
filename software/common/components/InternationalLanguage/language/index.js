import base from './base';

export default function getLanguage(lang = 'cn', options) {
  const language = {
    en: {
      ...base.en,
    },
    cn: {
      ...base.cn,
    },
  };

  return language;
}
