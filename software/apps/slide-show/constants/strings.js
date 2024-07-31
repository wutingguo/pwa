// slideshow 使用视频集合
export const slideshowTutorialVideos = [
  {
    src: '/clientassets-zno-saas/slideshow/slideshow-tutorial-videos/slideshow-introduction.mp4',
    placeholderImg: '',
    videoTitle: 'How to use Slideshow'
  },
  !__isCN__ && {
    src: '/clientassets-zno-saas/slideshow/slideshow-tutorial-videos/download.mp4',
    placeholderImg: '',
    videoTitle: 'How to enable your clients to download slideshows in Zno Slideshow'
  }
].filter(a => a);

// slideshow 发布状态

// 未发布 status === 0
// 修改中 status === 1
// 已发布 status === 2
// 可回退 status === 1 && version >= 1
export const projectProsessMap = {
  UNPUBLISH: 'UNPUBLISH',
  MODIFYING: 'MODIFYING',
  PUBLISHED: 'PUBLISHED',
  REVERTABLE: 'REVERTABLE'
};

export const makdeVideoStausEnum = {
  // 待生成
  waitingGenerate: 0,
  //生成中
  generating: 1,
  // 生成成功
  generateSuccess: 2,
  //生成失败
  generateFaile: 4
};

export const timePerImageMin = 0.5; //照片允许的最小间隔
