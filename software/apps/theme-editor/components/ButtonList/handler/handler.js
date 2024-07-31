import { merge } from 'lodash';

import { PARSE_PSD_MODAL } from '@resource/lib/constants/modalTypes';
import { elementTypes } from '@resource/lib/constants/strings';

export function deletePage(that) {
  const { page, boundProjectActions } = that.props;
  boundProjectActions.deletePage(page.get('id'));
}

export function setPhotoElement(that, frameStatus) {
  console.log('frameStatus: ', frameStatus);
  const { selectElementIds, page, boundProjectActions } = that.props;
  selectElementIds.forEach(item => {
    const selectElementId = item;
    const element = page.get('elements').find(ele => ele.get('id') === selectElementId);
    if (element) {
      const isPhoto = element.get('type') === elementTypes.photo;
      let type = isPhoto ? elementTypes.sticker : elementTypes.photo;
      if ((!frameStatus && isPhoto) || (frameStatus && !isPhoto)) {
        return;
      }
      if (isPhoto) {
        const pictureWidth = element.get('pictureWidth');
        const pictureHeight = element.get('pictureHeight');
        const elementWidth = element.get('width');
        const elementHeight = element.get('height');
        let updateParams = {
          id: selectElementId,
          type,
        };
        if (elementWidth !== pictureWidth || elementHeight !== pictureHeight) {
          updateParams = merge({}, updateParams, { width: pictureWidth, height: pictureHeight });
        }
        boundProjectActions.updateElement(updateParams);
      } else {
        boundProjectActions.updateElement({
          id: selectElementId,
          type,
        });
      }
    }
  });
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

export function onClickFile(that, e) {
  if (that.fileNode) {
    that.fileNode.click();
  }
}
