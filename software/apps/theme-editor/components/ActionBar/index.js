import React, { PureComponent } from 'react';
import { is } from 'immutable';
import PropTypes from 'prop-types';
import { merge, isEqual } from 'lodash';
import classNames from 'classnames';
import { bindFuncs } from '@resource/lib/utils/component';
import * as handlers from './handle/handlers';

// components
import Portal from '@resource/components/Portal';
import TooltipContainer from '@resource/components/XEnhanceBookpage/components/TooltipContainer';

import './index.scss';

const POSITION_TOP = 10;
const HEIGHT = 26;

class ActionBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      actionBarItems: []
    };

    bindFuncs(this, handlers);
  }

  componentDidMount() {
    this.updateItems();
  }

  componentWillReceiveProps(nextProps) {
    const { element: oldElement, options: oldOptions } = this.props;
    const { element, options } = nextProps;

    if (!is(oldElement, element) || !isEqual(oldOptions, options)) {
      this.updateItems(nextProps);
    }
  }

  render() {
    const { element, stage, isTransforming } = this.props;
    const { actionBarItems } = this.state;

    if (isTransforming || !actionBarItems.length) {
      return null;
    }

    const position = stage.getContainer().getBoundingClientRect();

    const node = stage.findOne(`#${element.get('id')}`);

    if (!node) {
      return null;
    }

    const clientRect = node.getClientRect();

    const style = {
      left: clientRect.x + clientRect.width / 2 + position.left,
      top: clientRect.y + clientRect.height + position.top + POSITION_TOP
    };
    if (style.top + HEIGHT > window.innerHeight) {
      style.top = window.innerHeight - HEIGHT;
    }
    const className = classNames('element-action-bar', {
      revert: style.top + 5 * HEIGHT + 1 > window.innerHeight
    });
    const actionBarProps = {
      className,
      style,
      onMouseDown: this.onMouseDown
    };
    return (
      <Portal>
        <TooltipContainer>
          <ul {...actionBarProps}>{this.getRenderActionItems()}</ul>
        </TooltipContainer>
      </Portal>
    );
  }
}

export default ActionBar;
