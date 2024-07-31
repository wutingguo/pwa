import livePhoto from './livePhoto';

export default function getLanguage(lang = 'cn', options) {
  const language = {
    en: {
      ...livePhoto.en,
    },
    cn: {
      ...livePhoto.cn,
    },
  };

  return language;
}
