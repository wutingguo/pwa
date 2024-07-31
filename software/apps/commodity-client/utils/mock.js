import { fromJS } from 'immutable';
import { guid } from '@resource/lib/utils/math';

const images = [
  'https://images.pixieset.com/10382252/2e1c69844f04bbcde27c0b92ec826749-medium.JPG',
  'https://images.pixieset.com/10382252/3e5f4d65b01daabf1552b0a7301745d6-medium.jpg',
  'https://images.pixieset.com/10382252/cbc01a2159db116e6b521e09fd8acc3b-medium.jpg',
  'https://images.pixieset.com/10382252/de0863abc038c0f83e8d74f07264f1f4-medium.jpg',
  'https://images.pixieset.com/10382252/e6d4f377ceabc52f5ad057455f6fd43c-medium.jpg',
  'https://images.pixieset.com/10382252/07033d898c979409683d83bf033b5114-medium.JPG',
  'https://images.pixieset.com/10382252/0e6c1d9b6ca8079fd0356fccf3b3cfd2-medium.jpg'
];

export const generateList = (count = 30) => {
  return images
    .map((m, i) => {
      if (i <= count) {
        return {
          guid: guid(),
          src: m,
          title: `image${i}`
        };
      }
      return null;
    })
    .filter(v => v);
};

export default fromJS({
  cover: {
    guid: guid(),
    src:
      'https://images.pixieset.com/10382252/2597e8499a0ec09982e3441e98bb7223-cover-large.jpg'
  },
  sets: [
    {
      set_name: 'Jobs & Mery',
      set_uid: '1234',
      images: generateList()
    },
    {
      set_name: 'AAAA',
      set_uid: '4321',
      images: generateList(10)
    }
  ]
});
