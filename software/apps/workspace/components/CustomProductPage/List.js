import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import { XButton } from '@common/components';
import addIcon from './icons/add2.png';

class CustomProductList extends PureComponent {
  render() {
    const { treeData = [], currentValue, onSelect, onCreate, onDelete } = this.props;
    const treeProps = {
      className: 'custom-product-tree',
      currentValue,
      treeData,
      onSelect,
      onDelete
    };
    return (
      <div className="custom-product-tree-wrapper">
        <XButton className="custom-product-btn dark" onClick={onCreate}>
          <img src={addIcon} />
          {__isCN__ ? t('LABS_CREATE_NEW') : t('CREATE_NEW_CUSTOM_PRODUCT')}
        </XButton>
        <div className="custom-product-title">{__isCN__ ? t('LABS_ALL') : t('ALL')}</div>
        <Tree {...treeProps} />
      </div>
    );
  }
}

CustomProductList.defaultProps = {
  treeData: [],
  onCreate: () => {},
  onDelete: () => {}
};

CustomProductList.propTypes = {
  treeData: PropTypes.array,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func
};

export default CustomProductList;
