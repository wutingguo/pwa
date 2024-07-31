import { initTranslate } from '@resource/lib/utils/translator';
import { initGlobalVariables } from '@resource/lib/utils/global';

const projectNameList = [
  { projectName: 'pwa' },
  { projectName: 'photobook' },
  { projectName: 'box' },
  { projectName: 'certificate' },
  { projectName: 'print' },
  { projectName: 'usb' },
  { projectName: 'apistatus' }
];

const init = () => {
  initTranslate(projectNameList);

  // 初始化全局window下的_app
  initGlobalVariables({ isCN: __isCN__ });
};

export default {
  init
};
