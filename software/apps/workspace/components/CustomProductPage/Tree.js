import React, { Component } from 'react';
import classNames from 'classnames';
import XIcon from '@resource/components/icons/XIcon';

class Tree extends Component {
  constructor(props) {
    super(props);
    this.treeItemCroup = this.treeItemCroup.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      openList: false
    };
  }

  handleClick(e) {
    e.stopPropagation();
    e.target.style.transform =
      e.target.style.transform == 'rotate(-90deg)' ? 'rotate(0deg)' : 'rotate(-90deg)';
    for (let item in e.target.parentNode.parentNode.childNodes) {
      if (item > 0) {
        e.target.parentNode.parentNode.childNodes[item].style.display =
          e.target.parentNode.parentNode.childNodes[item].style.display === 'none'
            ? 'block'
            : 'none';
      }
    }
  }

  treeItemCroup(itemGroup) {
    let itemGroupItem = [];
    let itemStyle = {
      paddingLeft: 25 * itemGroup.level + 'px'
    };
    itemGroupItem.push(
      <ul>
        <li className={`level-${itemGroup.level}`} key={itemGroup.key} style={itemStyle}>
          {!!itemGroup.children && (
            <i className="chevron-down" onClick={this.handleClick.bind(this)}></i>
          )}
          {itemGroup.title}
        </li>
        {this.tree(itemGroup.children)}
      </ul>
    );
    return itemGroupItem;
  }

  tree(children) {
    const { currentValue } = this.props;
    let treeItem;
    if (children) {
      treeItem = children.map((item, key) => {
        const isActive = item.key === currentValue;
        const itemStyle = {
          display: 'flex',
          paddingLeft: 25 * item.level + 'px',
          cursor: 'pointer'
        };
        const classname = classNames(`level-${item.level}`, { 'tree-item-active': isActive });
        return (
          <ul>
            <li
              style={itemStyle}
              className="labs-item"
              onClick={() => this.props.onSelect(item.key)}
            >
              <div className={classname}>
                {!!item.children && (
                  <i className="chevron-down" onClick={this.handleClick.bind(this)}></i>
                )}
                {item.title}
              </div>
              {isActive && !item.isSystem && (
                <XIcon
                  type={'delete'}
                  iconWidth={12}
                  iconHeight={12}
                  onClick={e => this.props.onDelete(e)}
                />
              )}
            </li>
            {this.tree(item.children)}
          </ul>
        );
      });
    }
    return treeItem;
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.props.treeData.map(itemGroup => this.treeItemCroup(itemGroup))}
      </div>
    );
  }
}

export default Tree;
