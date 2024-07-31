import { generatePage } from '@apps/ai-matting/utils/projectGenerator';
import { updateRatio } from '@apps/ai-matting/utils/ratio';

let timer = null;

const onresize = that => {
  const { page, boundProjectActions } = that.props;
  const params = {
    width: page.get('width'),
    height: page.get('height'),
    boundProjectActions,
  };
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    return updateRatio(params);
  }, 50);
};

/**
 * 接受来自其他窗口发来的信息
 * @param {*} that
 * @param {*} message
 */
const onReceiveMessage = (that, message) => {
  const { data, origin } = message;
  if (typeof data != 'object' || data == null) return;
  const { projectId, elementId, image, imageMatting } = data;
  if (!image) return;
  const { boundProjectActions, boundGlobalActions } = that.props;
  //更新projectId
  boundProjectActions.updateProperty({
    projectId,
  });
  //更新图片
  boundProjectActions.setImages([image]);
  //通过当前image生成page
  let { width, height, encImgId, exifOrientation, orientation } = image;
  //判断是否需要旋转调换page的宽高
  const needRotatePage = (orientation / 90) % 2 == 1;
  if (needRotatePage) [width, height] = [height, width];
  const newPage = generatePage({
    width,
    height,
    elementParams: {
      encImgId,
      elementId,
      exifOrientation,
      imageMatting,
      imgRot: orientation,
    },
  });
  boundProjectActions.setPage(newPage);
  updateRatio({
    width,
    height,
    boundProjectActions,
  });
  //获取初始化抠图蒙板
  const isHasMask = imageMatting && imageMatting.finalMaskId;

  if (!isHasMask) {
    initMattingaMask(that);
  }
};

const initMattingaMask = that => {
  const { boundGlobalActions, boundProjectActions } = that.props;
  boundGlobalActions.showGlobalLoading();
  boundProjectActions
    .getMattingMask()
    .catch(e => {
      that.showRetryModal({
        message: '抠图失败，请重试',
        onConfirm: () => initMattingaMask(that),
      });
    })
    .finally(() => {
      boundGlobalActions.hideGlobalLoading();
    });
};

export { onresize, onReceiveMessage };
