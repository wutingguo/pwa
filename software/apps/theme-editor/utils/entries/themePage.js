import IdeaPage from '@apps/theme-editor/utils/entries/ideaPage';
import { elementTypes } from '@resource/lib/constants/strings';
class ThemePage {
  constructor({ page, stickers, backgrounds }) {
    this.pageCode = '';
    this.sheetType = 2;
    this.pageType = 2;
    this.metadata = '';
    this.photoFrameCount = 1;
    this.textFrameCount = 0;
    this.backgrounds = [];
    this.stickers = [];
    this.init({ page, stickers, backgrounds });
  }
  getStickers(stickers) {
    return stickers
      .filter(sticker => sticker.pageCode === this.pageCode)
      .map(item => {
        const { pictureSource, pictureId, pictureWidth, pictureHeight } = item;
        return {
          pictureSource,
          pictureId,
          pictureWidth,
          pictureHeight
        };
      });
  }
  getBackgrounds(backgrounds) {
    return backgrounds
      .filter(background => background.pageCode === this.pageCode)
      .map(item => {
        const { pictureSource, pictureId, pictureWidth, pictureHeight } = item;
        return {
          pictureSource,
          pictureId,
          pictureWidth,
          pictureHeight
        };
      });
  }
  getElementCountByType(page, type) {
    const elements = page['elements'];
    const targetElements = elements.filter(element => element.type === type);
    return targetElements.length;
  }

  init(opt) {
    const { page, stickers, backgrounds } = opt;
    this.pageCode = page.id;
    this.stickers = this.getStickers(stickers);
    this.backgrounds = this.getBackgrounds(backgrounds);
    this.photoFrameCount = this.getElementCountByType(page, elementTypes.photo);
    const ideaPage = new IdeaPage({ page, stickers, backgrounds });
    this.metadata = JSON.stringify(ideaPage);
  }
}

export default ThemePage;
