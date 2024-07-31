import { wrapPromise } from '@resource/pwa/utils/helper';
import getDataFromState from '@apps/theme-editor/utils/getDataFromState';
import { saveThemeProject } from '@apps/theme-editor/services/project';
import { convertPageArray, generateTheme } from '@apps/theme-editor/utils/projectGenerator';

export const saveTheme = setProgress => {
  return (dispatch, getState) => {
    return wrapPromise((resove, reject) => {
      const { baseUrl, pageArray, title } = getDataFromState(getState());
      const newPageArray = convertPageArray(pageArray);
      saveThemeProject({ pageArray: newPageArray, baseUrl, title, setProgress })
        .then(data => {
          if (data) {
            resove(data);
          }
        })
        .catch(e => {
          console.log('e===>', e);
          reject(e);
        });
    });
  };
};
