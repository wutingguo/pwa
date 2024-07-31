import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Tree from 'rc-tree';
import {XButton} from '@common/components';
import 'rc-tree/assets/index.css';

class CustomProductList extends PureComponent {
  handleDelete = () => {
    const {currentValue, onDelete} = this.props;
    onDelete();
  }
  render() {
    const {treeData=[], currentValue, onSelect, onCreate} = this.props;
    const treeProps = {
      className: 'custom-product-tree',
      selectedKeys: [currentValue],
      defaultExpandAll: true,
      onSelect,
      showIcon: false,
      showLine: true
    }
    return (
      <div className='custom-product-tree-wrapper'>
        <div className='custom-product-title'>{t('CUSTOM_PRODUCTS')}</div>
        {
          treeData.map(item => {
            const itemTreeProps = {
              ...treeProps,
              key: item.key,
              treeData: [item]
            }
            if(item.children) {
              return <Tree {...itemTreeProps} />
            }
          })
        }
        <div className='custom-product-btn-wrapper'>
          <XButton className='custom-product-btn white' disabled={!currentValue} onClick={this.handleDelete}>{t('LABS_DELETE')}</XButton>
          <XButton className='custom-product-btn custom-product-create dark' onClick={onCreate}>{t('LABS_CREATE')}</XButton>
        </div>
      </div>
    )
  }
}

CustomProductList.defaultProps = {
  treeData: [],
  onCreate: () => {},
  onDelete: () => {}
}

CustomProductList.propTypes = {
  treeData: PropTypes.array,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func
}

export default CustomProductList;
