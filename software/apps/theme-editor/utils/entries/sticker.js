class Sticker {
  constructor({ width, height, id, code, name }) {
    this.width = width;
    this.height = height;
    this.id = id;
    this.code = code;
    this.name = name;
    this.sourceType = 'full';
    this.craftType = 'NULL';
    this.stickerType = 'OT';
  }
}

export default Sticker;
