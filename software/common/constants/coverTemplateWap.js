import { fromJS } from 'immutable';

export default fromJS([
  {
    template: 'cover-banner',
    elements: [
      {
        type: 'PhotoElement',
        px: 0,
        py: 0,
        pw: 1,
        ph: 1,
        dep: 1,
      },
      {
        type: 'TextElement',
        px: 0.5,
        py: 0.23,
        fontFamily: 'sans',
        fontWeight: '600',
        fontColor: '#fff',
        fontSize: 48,
        dep: 2,
        transform: 'translate(-50%, -50%)',
      },
    ],
  },
  {
    template: 'Center',
    elements: [
      {
        type: 'PhotoElement',
        px: 0,
        py: 0,
        pw: 1,
        ph: 1,
        dep: 1,
      },
      {
        type: 'TextElement',
        px: 0.5,
        py: 0.45,
        fontFamily: 'sans',
        fontWeight: '600',
        fontColor: '#fff',
        dep: 2,
        transform: 'translate(-50%, -50%)',
      },
      {
        type: 'buttonElement',
        px: 0.5,
        py: 0.6,
        fontFamily: 'sans',
        fontWeight: '600',
        fontColor: '#fff',
        dep: 2,
        transform: 'translate(-50%, -50%)',
      },
    ],
  },
  {
    template: 'Left',
    elements: [
      {
        type: 'PhotoElement',
        px: 0,
        py: 0,
        pw: 1,
        ph: 1,
        dep: 1,
      },
      {
        type: 'TextElement',
        px: 0.07,
        py: 0.73,
        fontFamily: 'sans',
        fontWeight: '600',
        fontColor: '#fff',
        // fontSize: 30,
        dep: 2,
      },
      {
        type: 'buttonElement',
        px: 0.1,
        py: 0.84,
        fontFamily: 'sans',
        fontColor: '#fff',
        fontSize: 28,
        dep: 2,
      },
    ],
  },
]);
