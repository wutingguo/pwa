import Page from './page';
import Background from './background';
import Sticker from './sticker';

class IdeaPage {
  constructor({ page, stickers, backgrounds }) {
    this.pageCode = '';
    this.pages = {};
    this.templates = [];
    this.backgrounds = [];
    this.stickers = [];
    this.ideapage = {
      thumbnail: ''
    };
    this.init({ page, stickers, backgrounds });
  }
  getBackgrounds(backgrounds) {
    return backgrounds
      .filter(background => background.pageCode === this.pageCode)
      .reduce((prev, current) => {
        const { pictureId, pictureWidth, pictureHeight, id, name } = current;
        const params = {
          id,
          name,
          width: pictureWidth,
          height: pictureHeight,
          code: pictureId
        };
        const background = new Background(params);
        prev.push(background);
        return prev;
      }, []);
  }

  getStickers(stickers) {
    return stickers
      .filter(background => background.pageCode === this.pageCode)
      .reduce((prev, current) => {
        const { pictureId, pictureWidth, pictureHeight, id, name } = current;
        const params = {
          id,
          name,
          width: pictureWidth,
          height: pictureHeight,
          code: pictureId
        };
        const sticker = new Sticker(params);
        prev.push(sticker);
        return prev;
      }, []);
  }

  getPages(opt) {
    const { page, stickers, backgrounds } = opt;
    return new Page({ page, stickers, backgrounds });
  }

  init(opt) {
    const { page, stickers, backgrounds } = opt;
    this.pageCode = page.id;
    this.backgrounds = this.getBackgrounds(backgrounds);
    this.stickers = this.getStickers(stickers);
    this.pages = this.getPages({ page, stickers, backgrounds });
    this.ideapage.thumbnail = page.thumbnail;
  }
}

export default IdeaPage;
