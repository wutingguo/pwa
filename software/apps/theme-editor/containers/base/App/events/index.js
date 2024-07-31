import { checkAndUpdateProjectRatio } from '@apps/theme-editor/utils/calculate/ratio';
let timer = null;

const onresize = that => {
  const { presentTheme, boundProjectActions } = that.props;
  const paramsparams = {
    presentTheme,
    boundProjectActions
  };
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    return checkAndUpdateProjectRatio(paramsparams);
  }, 50);
};

export { onresize };
