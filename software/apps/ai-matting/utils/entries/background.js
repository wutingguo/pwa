class Background {
  constructor({ width, height, id, code, name }) {
    this.width = width;
    this.height = height;
    this.id = id;
    this.code = code;
    this.sourceType = 'full';
    this.name = name;
    this.meta = {
      craftMeta: {
        allowedCraft: []
      },
      applyObjMeta: {
        edit: {
          allowResize: true,
          allowModify: true,
          allowMove: true,
          allowRotate: true,
          allowChangeColor: true
        }
      },
      designObjType: 'ART',
      craftType: 'NULL',
      craftParams: {}
    };
  }
}

export default Background;
