import { PARSE_PSD_MODAL } from '@resource/lib/constants/modalTypes';

import { mouseWheel } from '../../constants/strings';

export const handlerMouseWheel = (that, dir) => {
  that.pageNav.scrollLeft += dir * mouseWheel.width;
};
export function onClickFile(that, e) {
  if (that.fileNode) {
    that.fileNode.click();
  }
}
export function onSelectPsdFiles(that, e) {
  const { pageArray, boundGlobalActions } = that.props;
  const psdFiles = [].slice.call(e.target.files, 0).filter(f => f.name.endsWith('.psd'));
  if (psdFiles.length) {
    boundGlobalActions.addPsds(psdFiles);
    boundGlobalActions.showModal(PARSE_PSD_MODAL, {
      isAddPages: true,
      uploadedPsds: pageArray,
    });
  }
  e.target.value = '';
}
