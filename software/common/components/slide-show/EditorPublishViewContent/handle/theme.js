import { themeIds } from '@apps/slide-show/constants/theme';
// const themeIds = {
//   'classic-light': 'classic-light',
//   'classic-dark': 'classic-dark',
//   'contemporary-light': 'contemporary-light',
//   'contemporary-dark': 'contemporary-dark'
// };
export const getThemeColor = themeId => {
  switch(themeId) {
    case themeIds['classic-light']:
      return '#3A3A3A';
    default:
      return '#FFFFFF';
  }
}

export const checkFullTheme = themeId => {
  switch(themeId) {
    case themeIds['contemporary-light']:
    case themeIds['contemporary-dark']:
      return true;
    default:
      return false;
  }
}

export const getThemeBgColor = themeId => {
  switch(themeId) {
    case themeIds['classic-light']:
    case themeIds['contemporary-light']:
      return '#F6F6F6';
    default:
      return '#000000';
  }
}

export const getBackDropColor = themeId => {
  switch(themeId) {
    case themeIds['contemporary-dark']:
      return 'rgba(16,16,16,0.5)';
    default:
      return '';
  }
}