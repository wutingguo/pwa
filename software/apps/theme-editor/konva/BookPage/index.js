import classNames from 'classnames';
import React, { PureComponent } from 'react';
import { Group, Layer, Line, Stage, Transformer } from 'react-konva';

import { bindFuncs } from '@resource/lib/utils/component';

import { anchors, elementTypes } from '@resource/lib/constants/strings';

import BackgroundElement from '@apps/theme-editor/konva/BackgroundElement';
import PhotoElement from '@apps/theme-editor/konva/PhotoElement';
import StickerElement from '@apps/theme-editor/konva/StickerElement';
import * as renderHelper from '@apps/theme-editor/utils/canvas/helper';

import * as actionBarEvents from './handler/actionBarEvents';
import * as events from './handler/events';
import * as guidelines from './handler/guidelines';
import * as layerEvents from './handler/layerEvents';
import * as pageActions from './handler/page';
import * as stageEvents from './handler/stageEvents';
import * as transformerEvents from './handler/transformerEvents';

import './index.scss';

class BookPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectElementIds: [],
      hLines: [],
      vLines: [],
    };

    this.getRenderHtml = this.getRenderHtml.bind(this);

    bindFuncs(this, pageActions, 'pageActions');
    bindFuncs(this, stageEvents, 'stageEvents');
    bindFuncs(this, actionBarEvents, 'actionBarEvents');
    bindFuncs(this, transformerEvents, 'transformerEvents');
    bindFuncs(this, guidelines, 'guidelines');
    bindFuncs(this, layerEvents, 'layerEvents');
    bindFuncs(this, events, 'events');
  }

  componentDidMount() {
    const { eventsDisabled } = this.props;
    if (!eventsDisabled) {
      this.events.addListeners();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { page } = this.props;
    const { page: newPage } = nextProps;
    const { selectElementIds } = this.state;
    // 这段代码用于处理在元素切换类型后首次缩放会报错的问题
    if (selectElementIds.length === 1) {
      const oldEle = page.get('elements').find(ele => ele.get('id') === selectElementIds[0]);
      const newEle = newPage.get('elements').find(ele => ele.get('id') === selectElementIds[0]);
      if (oldEle && newEle && oldEle.get('type') !== newEle.get('type')) {
        this.setState({ selectElementIds: [] }, () => {
          this.setState({ selectElementIds });
        });
      }
    }
  }

  componentWillUnmount() {
    const { eventsDisabled } = this.props;
    if (!eventsDisabled) {
      this.events.removeListeners();
    }
  }

  getRenderHtml() {
    const { selectElementIds } = this.state;
    const { ratio, page, pagination, boundProjectActions } = this.props;
    const pageId = page.get('id');
    const elementArray = page.get('elements');
    const html = [];

    const sortedElementArray = renderHelper.sortElementsByZIndex(elementArray);

    const nodes = [];
    // 如果页面上有元素.
    if (sortedElementArray && sortedElementArray.size) {
      sortedElementArray.forEach(element => {
        const elementId = element.get('id');
        const type = element.get('type');
        const isSelected = selectElementIds.includes(elementId);
        const isMultiSelected = selectElementIds.length > 1;

        const baseElementProps = {
          key: elementId,
          ratio,
          element,
          isSelected,
          isMultiSelected,
          boundProjectActions,
          stage: this.stage,
          pageActions: this.pageActions,
          actionBarEvents: this.actionBarEvents,
        };

        if (isSelected && this.stage && this.transformer) {
          const node = this.stage.findOne(`#${elementId}`);
          if (node) {
            nodes.push(node);
          }
        }

        switch (element.get('type')) {
          case elementTypes.photo: {
            const photoElementProps = baseElementProps;
            html.push(<PhotoElement {...photoElementProps} />);
            break;
          }
          case elementTypes.sticker: {
            const stickerElementProps = baseElementProps;

            // 蒙版类型的sticker不单独渲染
            if (!element.get('boundElementId')) {
              html.push(<StickerElement {...stickerElementProps} />);
            }

            break;
          }
          case elementTypes.background: {
            const backgroundElementProps = baseElementProps;
            html.push(<BackgroundElement {...backgroundElementProps} />);
            break;
          }
          default:
            break;
        }
      });
    }

    if (this.transformer) {
      this.transformer.nodes(nodes);
    }

    return html;
  }

  render() {
    const { ratio, page, eventsDisabled = false } = this.props;
    const { hLines, vLines, selectElementIds } = this.state;
    const { width: pageWidth, height: pageHeight } = page.toJS();
    const bookPageClassName = classNames('book-page');

    const stageProps = {
      ref: node => (this.stage = node),
      width: pageWidth * ratio,
      height: pageHeight * ratio,
      className: bookPageClassName,
      listening: !eventsDisabled,
      ...this.stageEvents,
    };

    const layerProps = {
      scale: {
        x: ratio,
        y: ratio,
      },
      ...this.layerEvents,
    };

    const guidelineLayerProps = {
      scale: {
        x: ratio,
        y: ratio,
      },
      listening: false,
    };

    const isSingleSelect = selectElementIds.length === 1;
    let isSelectSingleSticker = false;
    if (isSingleSelect) {
      const ele = page.get('elements').find(ele => ele.get('id') === selectElementIds[0]);
      isSelectSingleSticker = ele && ele.get('type') === elementTypes.sticker;
    }

    const transformerProps = {
      ref: node => (this.transformer = node),
      flipEnabled: false,
      rotateEnabled: selectElementIds.length === 1,
      rotationSnaps: [0, 90, 180, 270],
      anchorCornerRadius: 10,
      enabledAnchors: isSelectSingleSticker
        ? anchors.filter(a => !a.includes('center') && !a.includes('middle'))
        : anchors,
      ...this.transformerEvents,
    };
    console.log('transformerProps: ', transformerProps);
    return (
      <div className="stage-container">
        <Stage {...stageProps}>
          <Layer {...layerProps}>
            <Group ref={group => (this.unselectElements = group)}>{this.getRenderHtml()}</Group>
            <Transformer {...transformerProps} />
          </Layer>
          <Layer {...guidelineLayerProps}>
            {hLines.map((item, i) => (
              <Line key={i} {...item} />
            ))}
            {vLines.map((item, i) => (
              <Line key={i} {...item} />
            ))}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default BookPage;
