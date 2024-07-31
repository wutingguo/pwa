import React, { Component } from 'react';
import withSortable from '../WithSortable';
import { XDropdown } from '@common/components';
import './index.scss';

class ImageSortActionBar extends Component {
  constructor(props) {
    super(props);
    const sortByDropDownItem = {
      label: t('SORT_BY'),
      disabled: false,
      dropdownList: [
        {
          label: t('PHOTOTAB_ORDER_DATE_TAKEN_O_T_N'),
          value: {
            field: 'shot_time',
            orderBy: 'asc'
          }
        },
        {
          label: t('PHOTOTAB_ORDER_DATE_TAKEN_N_T_O'),
          value: {
            field: 'shot_time',
            orderBy: 'desc'
          }
        },
        {
          label: t('PHOTOTAB_ORDER_UPLOAD_TIME_O_T_N'),
          value: {
            field: 'create_time',
            orderBy: 'asc'
          }
        },
        {
          label: t('PHOTOTAB_ORDER_UPLOAD_TIME_N_T_O'),
          value: {
            field: 'create_time',
            orderBy: 'desc'
          }
        },
        {
          label: t('PHOTOTAB_ORDER_TITLE_A_Z'),
          value: {
            field: 'image_name',
            orderBy: 'asc'
          }
        },
        {
          label: t('PHOTOTAB_ORDER_TITLE_Z_A'),
          value: {
            field: 'image_name',
            orderBy: 'desc'
          }
        }
      ].concat(
        __isCN__
          ? [
              {
                label: t('PHOTOTAB_ORDER_RANDOM', '随机排序'),
                value: {
                  field: 'random_order',
                  orderBy: 'random'
                }
              }
            ]
          : []
      )
    };

    this.state = {
      sortByDropDownItem: Object.assign({}, sortByDropDownItem, {
        dropdownList: sortByDropDownItem.dropdownList.map(o => {
          return Object.assign({}, o, {
            action: this.onSortByValueChange.bind(this, o.value)
          });
        })
      })
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

export default withSortable(ImageSortActionBar);
