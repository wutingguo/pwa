import React, { Component } from 'react';

// import withSortable from '../WithSortable';
import { XDropdown, XPureComponent } from '@common/components';

import './index.scss';

class CollectionSortActionBar extends XPureComponent {
  constructor(props) {
    super(props);
    const sortByDropDownItem = {
      label: '',
      disabled: false,
      dropdownList: [
        {
          label: t('COLLECTIONS_ORDER_DATE_TAKEN_N_T_O'),
          value: {
            rule: 1,
            orderBy: 'desc',
          },
        },
        {
          label: t('COLLECTIONS_ORDER_DATE_TAKEN_O_T_N'),
          value: {
            rule: 2,
            orderBy: 'asc',
          },
        },
        {
          label: t('COLLECTIONS_ORDER_UPLOAD_TIME_N_T_O'),
          value: {
            rule: 3,
            orderBy: 'desc',
          },
        },
        {
          label: t('COLLECTIONS_ORDER_UPLOAD_TIME_O_T_N'),
          value: {
            rule: 4,
            orderBy: 'asc',
          },
        },
        {
          label: t('COLLECTIONS_ORDER_TITLE_A_Z'),
          value: {
            rule: 5,
            orderBy: 'asc',
          },
        },
        {
          label: t('COLLECTIONS_ORDER_TITLE_Z_A'),
          value: {
            rule: 6,
            orderBy: 'desc',
          },
        },
      ],
      // ].concat(
      //     __isCN__
      //         ? [
      //             {
      //                 label: t('PHOTOTAB_ORDER_RANDOM', '随机排序'),
      //                 value: {
      //                     field: 'random_order',
      //                     orderBy: 'random'
      //                 }
      //             }
      //         ]
      //         : []
      // )
    };

    this.state = {
      sortByDropDownItem: Object.assign({}, sortByDropDownItem, {
        dropdownList: sortByDropDownItem.dropdownList.map(o => {
          return Object.assign({}, o, {
            action: this.onSortByValueChange.bind(this, o.value),
          });
        }),
      }),
    };

    this.onSortByValueChange = this.onSortByValueChange.bind(this);
  }

  onSortByValueChange(value) {
    const { changeSort, trackEvent } = this.props;
    changeSort(value);
    trackEvent && trackEvent(value);
  }

  render() {
    const { sortByDropDownItem } = this.state;
    const { currentSortConfig } = this.props;
    return (
      <div className="image-sort-action-bar">
        <XDropdown {...sortByDropDownItem} selectedValue={currentSortConfig} arrow="right" />
      </div>
    );
  }
}

export default CollectionSortActionBar;
