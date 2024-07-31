import ThemePage from '@apps/theme-editor/utils/entries/themePage';

class Theme {
  constructor({ stickers, backgrounds, pageArray, title }) {
    const themeCode = pageArray[0].themeCode;
    this.attributes = {
      size: '10X10'
    };
    this.theme = {
      code: themeCode,
      name: title,
      category: 'YX_PB',
      pages: []
    };
    this.init({
      stickers,
      backgrounds,
      pageArray
    });
  }
  getPages(opt) {
    const { stickers, backgrounds, pageArray } = opt;
    return pageArray.reduce((accumulator, currentValue, index) => {
      const themePage = new ThemePage({ page: currentValue, stickers, backgrounds });
      accumulator.push(themePage);
      return accumulator;
    }, []);
  }

  getSize(pageArray) {
    const firstPage = pageArray[0];
    const { width, height } = firstPage;
    let shape = '';
    const shapSizeMap = {
      square: '10X10',
      portrait: '11X8',
      landscape: '8X11'
    };
    const ratio = width / height;
    if (ratio > 2.1) {
      shape = 'landscape';
    }
    if (ratio <= 2.1 && ratio >= 1.9) {
      shape = 'square';
    }
    if (ratio < 1.9) {
      shape = 'portrait';
    }
    return shapSizeMap[shape];
  }

  init(opt) {
    const { stickers, backgrounds, pageArray } = opt;
    this.theme.pages = this.getPages({ stickers, backgrounds, pageArray });
    this.attributes.size = this.getSize(pageArray);
  }
}

export default Theme;
