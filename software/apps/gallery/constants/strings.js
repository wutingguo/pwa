// gallery 使用视频集合
export const galleryTutorialVideos = [
  {
    src: '/clientassets-zno-saas/gallery/gallery-tutorial-videos/gallery-introduction.mp4',
    placeholderImg: '',
    videoTitle: 'How to use Gallery',
  },
  {
    src: '/clientassets-zno-saas/gallery/gallery-tutorial-videos/download-new.mp4',
    placeholderImg: '',
    videoTitle: 'How to enable your clients to download photos in Zno Gallery',
  },
];
// 正则匹配外链视频id
const videoRegExpMap = {
  youtube: /(?:http(?:s)?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-z0-9_\-]+)/i,
  vimeo: /(?:http(?:s)?:\/\/)?(?:www\.)?vimeo.com\/([0-9\-_]+)/i,
};
// 检查 视频地址是否合法
export const checkIsVideoUrlValid = url => {
  const isValid = Object.keys(videoRegExpMap).some(k => {
    const regExp = videoRegExpMap[k];
    const matches = String(url).match(regExp) || [];
    const id = matches[1];
    return !!id;
  });

  return isValid;
};
