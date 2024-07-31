import { fromJS } from 'immutable';

const templates = fromJS([
  {
    templateId: 1,
    templateName: 'tplName1',
    elements: [
      {
        type: 'photo',
        // x,
        // y,
        // width,
        // height,
        // cropx,
        // cropy
      },
      {
        type: 'text',
        // fontSize,
        // fontWeight,
        // fontFamily,
        // fontColor,
        // text,
        // x,
        // y,
        // width,
        // height
      }
    ]
  },
  {
    templateId: 2,
    templateName: 'tplName2',
    elements: [
      {
        type: 'photo',
        // x,
        // y,
        // width,
        // height,
        // cropx,
        // cropy
      },
      {
        type: 'text',
        // fontSize,
        // fontWeight,
        // fontFamily,
        // fontColor,
        // text,
        // x,
        // y,
        // width,
        // height
      }
    ]
  },
]);

export default templates;