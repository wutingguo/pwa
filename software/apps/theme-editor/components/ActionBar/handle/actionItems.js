import { elementTypes } from '@resource/lib/constants/strings';

const items = [
  {
    types: [elementTypes.sticker],
    className: 'layer',
    showRules: ['isSingleSelect'],
    children: [
      {
        className: 'expand-to-front',
        title: t('BRING_TO_FRONT'),
        tapHandlerName: 'onBringToFront',
        noIcon: true
      },
      {
        className: 'expand-to-back',
        title: t('SEND_TO_BACK'),
        tapHandlerName: 'onSendToback',
        noIcon: true
      },
      {
        className: 'expand-forward',
        title: t('BRING_FORWARD'),
        tapHandlerName: 'onBringForward',
        noIcon: true
      },
      {
        className: 'expand-backward',
        title: t('SEND_BACKWARD'),
        tapHandlerName: 'onSendBackward',
        noIcon: true
      }
    ]
  },
  {
    types: [elementTypes.photo, elementTypes.sticker],
    className: 'clear',
    title: t('REMOVE_ELEMENT'),
    tapHandlerName: 'removeElement',
    showRules: ['isSingleSelect']
  },

  // multi action bar
  {
    className: 'align-horizontal multi-select',
    title: '',
    showRules: ['isMultiSelect'],
    children: [
      {
        className: 'align-left',
        title: t('ALIGN_LEFT'),
        tapHandlerName: 'onAlignLeft'
      },
      {
        className: 'align-center',
        title: t('ALIGN_CENTER'),
        tapHandlerName: 'onAlignCenter'
      },
      {
        className: 'align-right',
        title: t('ALIGN_RIGHT'),
        tapHandlerName: 'onAlignRight'
      }
    ]
  },
  {
    className: 'align-vertical multi-select',
    title: '',
    showRules: ['isMultiSelect'],
    children: [
      {
        className: 'align-top',
        title: t('ALIGN_TOP'),
        tapHandlerName: 'onAlignTop'
      },
      {
        className: 'align-middle',
        title: t('ALIGN_MIDDLE'),
        tapHandlerName: 'onAlignMiddle'
      },
      {
        className: 'align-bottom',
        title: t('ALIGN_BOTTOM'),
        tapHandlerName: 'onAlignBottom'
      }
    ]
  },
  {
    className: 'space multi-select',
    title: t('SPACE_NEED_THREE_MORE_ELEMENTS'),
    showRules: ['isMultiSelect', 'isUseSpace'],
    children: [
      {
        className: 'space-horizontal',
        title: t('SPACE_HORIZONAL'),
        tapHandlerName: 'onSpaceHorizontal'
      },
      {
        className: 'space-vertical',
        title: t('SPACE_VERTICAL'),
        tapHandlerName: 'onSpaceVertical'
      }
    ]
  },
  {
    className: 'match-size multi-select',
    title: '',
    showRules: ['isMultiSelect'],
    children: [
      {
        className: 'match-widest-width',
        title: t('MATCH_WIDEST_WIDTH'),
        tapHandlerName: 'onMatchWidestWidth'
      },
      {
        className: 'match-narrowest-width',
        title: t('MATCH_NARROWEST_WIDTH'),
        tapHandlerName: 'onMatchNarrowestWidth'
      },
      {
        className: 'match-tallest-height',
        title: t('MATCH_TALLEST_HEIGHT'),
        tapHandlerName: 'onMatchTallestHeight'
      },
      {
        className: 'match-shortest-height',
        title: t('MATCH_SHORTEST_HEIGHT'),
        tapHandlerName: 'onMatchShortestHeight'
      },
      {
        className: 'match-first-select-width-and-height',
        title: t('MATCH_FIRST_SELECT_WIDTH_AND_HEIGHT'),
        tapHandlerName: 'onMatchFirstSelectWidthAndHeight'
      }
    ]
  },
  {
    className: 'clear-all multi-select',
    title: t('CLEAR_ALL'),
    tapHandlerName: 'onClearAll',
    showRules: ['isMultiSelect']
  }
];

function getActionBarItems({ element, options = {} }) {
  const eleType = element && element.get('type');
  const showItems = [];
  items.forEach(item => {
    const { showRules = [], types } = item;
    const isMatched = (!types || types.includes(eleType)) && showRules.every(rule => options[rule]);
    if (isMatched) {
      if (item.children && item.children.length) {
        item.children = item.children.filter(itm => {
          const { showRules = [] } = itm;
          return showRules.every(rule => options[rule]);
        });
      }
      showItems.push(item);
    }
  });
  return showItems;
}

export default getActionBarItems;
