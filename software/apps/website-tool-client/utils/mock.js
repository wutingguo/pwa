import { fromJS } from 'immutable';
import { guid } from '@resource/lib/utils/math';

const images = [
  'https://images.pixieset.com/10382252/0e6c1d9b6ca8079fd0356fccf3b3cfd2-medium.jpg',
  'https://images.pixieset.com/10382252/f3b44dcc4868d79e00ad5f8ab514bc45-medium.JPG',
  'https://images.pixieset.com/10382252/89178f076c5c0157fd4ca44383cfe234-medium.jpg',
  'https://images.pixieset.com/10382252/8f290c6325f484e9858b8f2b1bbcdcd1-medium.jpg',
  'https://images.pixieset.com/10382252/c3e17182284d5372c22268cba3b1870f-medium.JPG',
  'https://images.pixieset.com/10382252/38f1b7ecde060b430d9067cf382098d8-medium.JPG',
  'https://images.pixieset.com/10382252/ea843ea8390212459544929bb5a07fc3-medium.JPG',
  'https://images.pixieset.com/10382252/820b0557544931cd34a711f63a7552bf-medium.jpg',
  'https://images.pixieset.com/10382252/5d9249bcafcd2741c83093da0182eec7-medium.jpg',
  'https://images.pixieset.com/10382252/1d4903387bead7ada68da83351c73815-medium.jpg',
  'https://images.pixieset.com/10382252/4d30f0c53d6e727a63e020ae934df2fc-medium.jpg',
  'https://images.pixieset.com/10382252/2e1c69844f04bbcde27c0b92ec826749-medium.JPG',
  'https://images.pixieset.com/10382252/3e5f4d65b01daabf1552b0a7301745d6-medium.jpg',
  'https://images.pixieset.com/10382252/cbc01a2159db116e6b521e09fd8acc3b-medium.jpg',
  'https://images.pixieset.com/10382252/de0863abc038c0f83e8d74f07264f1f4-medium.jpg',
  'https://images.pixieset.com/10382252/e6d4f377ceabc52f5ad057455f6fd43c-medium.jpg',
  'https://images.pixieset.com/10382252/07033d898c979409683d83bf033b5114-medium.JPG',
  'https://images.pixieset.com/10382252/0e6c1d9b6ca8079fd0356fccf3b3cfd2-medium.jpg',
  'https://images.pixieset.com/10382252/f3b44dcc4868d79e00ad5f8ab514bc45-medium.JPG',
  'https://images.pixieset.com/10382252/89178f076c5c0157fd4ca44383cfe234-medium.jpg',
  'https://images.pixieset.com/10382252/8f290c6325f484e9858b8f2b1bbcdcd1-medium.jpg',
  'https://images.pixieset.com/10382252/c3e17182284d5372c22268cba3b1870f-medium.JPG',
  'https://images.pixieset.com/10382252/38f1b7ecde060b430d9067cf382098d8-medium.JPG',
  'https://images.pixieset.com/10382252/ea843ea8390212459544929bb5a07fc3-medium.JPG',
  'https://images.pixieset.com/10382252/820b0557544931cd34a711f63a7552bf-medium.jpg',
  'https://images.pixieset.com/10382252/5d9249bcafcd2741c83093da0182eec7-medium.jpg',
  'https://images.pixieset.com/10382252/1d4903387bead7ada68da83351c73815-medium.jpg',
  'https://images.pixieset.com/10382252/4d30f0c53d6e727a63e020ae934df2fc-medium.jpg',
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
    src: 'https://images.pixieset.com/10382252/2597e8499a0ec09982e3441e98bb7223-cover-large.jpg'
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
