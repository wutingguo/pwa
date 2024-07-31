const positionKey = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const textToPosition = [
  {
    top: 0,
    left: 0,
    right: '.',
    bottom: '.',
  },
  {
    top: 0,
    left: 0,
    right: 0,
    bottom: '.',
  },
  {
    top: 0,
    left: '.',
    right: 0,
    bottom: '.',
  },
  {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  {
    top: '.',
    left: 0,
    right: '.',
    bottom: 0,
  },
  {
    top: '.',
    left: 0,
    right: 0,
    bottom: 0,
  },
  {
    top: '.',
    left: '.',
    right: 0,
    bottom: 0,
  },
  {
    top: 0,
    left: 0,
    right: '.',
    bottom: 0,
  },
  {
    top: 0,
    left: '.',
    right: 0,
    bottom: 0,
  },
];
export const initalDefaultOption = [
  {
    key: 0,
    children: [
      {
        key: positionKey[0],
        label: t('LP_WATERMARK_POSITION_LEFTTOP'),
      },
      {
        key: 'space',
      },
      {
        key: positionKey[1],
        label: t('LP_WATERMARK_POSITION_MIDDLETOP'),
      },
      {
        key: 'space',
      },
      {
        key: positionKey[2],
        label: t('LP_WATERMARK_POSITION_RIGHTTOP'),
      },
    ],
  },
  {
    key: 1,
    children: [
      {
        key: positionKey[7],
        label: t('LP_WATERMARK_POSITION_LEFTCENTER'),
      },
      {
        key: 'space',
      },
      {
        key: positionKey[3],
        label: t('LP_WATERMARK_POSITION_CENTER'),
      },
      {
        key: 'space',
      },
      {
        key: positionKey[8],
        label: t('LP_WATERMARK_POSITION_RIGHTCENTER'),
      },
    ],
  },
  {
    key: 2,
    children: [
      {
        key: positionKey[4],
        label: t('LP_WATERMARK_POSITION_LEFTBOTTOM'),
      },
      {
        key: 'space',
      },
      {
        key: positionKey[5],
        label: t('LP_WATERMARK_POSITION_MIDDLEBOTTOM'),
      },
      {
        key: 'space',
      },
      {
        key: positionKey[6],
        label: t('LP_WATERMARK_POSITION_RIGHTBOTTOM'),
      },
    ],
  },
];
