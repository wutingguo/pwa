import React from 'react';
import { fromPairs, merge } from 'lodash';

import { productTypes, elementTypes, pageTypes } from '@resource/lib/constants/strings';

import getActionBarItems from './actionItems';

const nullFunc = () => {};

export function onMouseDown(that, e) {
  e.stopPropagation();
}

export function getSubActionItems(that, items) {
  const { actions = {}, element } = that.props;
  const html = [];
  items.forEach((item, index) => {
    const { className, title, tapHandlerName, noIcon = false } = item;
    const tapHandler = actions[tapHandlerName] || nullFunc;
    html.push(
      <li className={`icon-item item-${className}`} key={`${className}-${index}`}>
        <a
          onClick={tapHandler.bind(that, element)}
          data-tip={noIcon ? '' : title}
          data-place="right"
        >
          {noIcon ? title : ''}
        </a>
      </li>
    );
  });

  return <ul className="sub-menu">{html}</ul>;
}

export function getRenderActionItems(that) {
  const { actions = {}, element } = that.props;
  const { actionBarItems } = that.state;
  const html = [];

  actionBarItems.forEach((item, index) => {
    const { className, title = '', tapHandlerName, children } = item;
    const hasChildren = children && children.length;
    const tapHandler = actions[tapHandlerName] || nullFunc;
    if (!hasChildren) {
      html.push(
        <li className={`icon-item item-${className}`} key={`${className}-${index}`}>
          <a onClick={tapHandler.bind(that, element)} data-tip={title} />
        </li>
      );
    } else {
      html.push(
        <li className={`icon-item item-${className}`} key={`${className}-${index}`}>
          <a data-tip={title} data-place="top" />
          {that.getSubActionItems(children)}
        </li>
      );
    }
  });
  return html;
}

export function updateItems(that, nextProps) {
  const { element, options } = nextProps || that.props;
  const actionBarItems = getActionBarItems({ element, options });
  that.setState({
    actionBarItems
  });
}
