import React, { PureComponent } from 'react';
import { Group, Image } from 'react-konva';

import Portal from '@resource/components/Portal';

import { bindFuncs } from '@resource/lib/utils/component';

import * as renderHelper from '@apps/theme-editor/utils/canvas/helper';

import ActionBar from '../../components/ActionBar';

import * as eventHandler from './handler/events';

class BaseElement extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isTransforming: false,
    };

    bindFuncs(this, eventHandler, 'events');
  }

  render() {
    const { isTransforming } = this.state;
    const { stage, isSelected, element, children, sceneFunc, actionBarEvents, isMultiSelected } =
      this.props;
    const { x, y, width, height, rot, offset, zIndex, image } =
      renderHelper.getRenderElementOptions(element);
    const groupsProps = {
      ref: node => (this.node = node),
      draggable: isSelected,
      id: element.get('id'),
      name: 'element',
      x,
      y,
      width,
      height,
      offset,
      zIndex,
      rotation: rot,
    };

    const imageProps = {
      x: 0,
      y: 0,
      width,
      height,
      image,
    };

    if (sceneFunc) {
      imageProps.sceneFunc = sceneFunc;
    }

    const actionBarProps = {
      stage,
      element,
      isTransforming,
      actions: actionBarEvents,
      options: {
        isSingleSelect: true,
      },
    };
    return (
      <>
        <Group {...groupsProps} {...this.events}>
          <Image {...imageProps} />
          {children}
        </Group>
        {isSelected && !isMultiSelected ? (
          <Portal>
            <ActionBar {...actionBarProps} />
          </Portal>
        ) : null}
      </>
    );
  }
}

export default BaseElement;
