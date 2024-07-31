import classNames from 'classnames';
import Immutable from 'immutable';
import React, { Component, PureComponent } from 'react';
import { Group, Layer, Line, Stage, Transformer } from 'react-konva';

import { bindFuncs } from '@resource/lib/utils/component';

import { anchors, elementTypes } from '@resource/lib/constants/strings';

import PhotoElement from '@apps/ai-matting/konva/PhotoElement';
import * as renderHelper from '@apps/ai-matting/utils/canvas/helper';
import getPrefixCls from '@apps/ai-matting/utils/getPrefixCls';

import { memoizeConvertElements } from './handler/element';
import * as mattingMaskHandler from './handler/mattingMask';
import loadingImage from './icon/cunxin.gif';

import './index.scss';

const prefixCls = getPrefixCls('book-page');
class BookPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      elementArray: Immutable.List(),
    };
    this.getRenderHtml = this.getRenderHtml.bind(this);
    bindFuncs(this, mattingMaskHandler);
  }

  componentDidUpdate() {
    this.obtainMaskImgObj();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.page.isEmpty()) return null;
    const tempElements = memoizeConvertElements(nextProps);
    return {
      elementArray: tempElements,
    };
  }

  getRenderHtml() {
    const { ratio, page, boundProjectActions, property } = this.props;
    if (page.isEmpty()) return null;
    const { isOpenMatting } = property.toJS();
    const { elementArray } = this.state;
    const html = [];
    //获取当前蒙板滤镜
    const curMaskImgObj = this.getCurrentMaskImgObj();
    const mattingMaskFilter = curMaskImgObj ? this.createMattingMaskFilter(curMaskImgObj) : null;

    const sortedElementArray = renderHelper.sortElementsByZIndex(elementArray);

    // 如果页面上有元素.
    if (sortedElementArray && sortedElementArray.size) {
      sortedElementArray.forEach(element => {
        const elementId = element.get('id');
        const type = element.get('type');

        const baseElementProps = {
          key: elementId,
          ratio,
          element,
          boundProjectActions,
          stage: this.stage,
        };

        switch (type) {
          case elementTypes.photo: {
            const photoElementProps = {
              ...baseElementProps,
            };
            if (isOpenMatting && mattingMaskFilter) {
              photoElementProps.filters = [mattingMaskFilter];
            }
            html.push(<PhotoElement {...photoElementProps} />);
            break;
          }
          default:
            break;
        }
      });
    }

    return html;
  }

  getLoadingHtml() {
    const curMaskImgObj = this.getCurrentMaskImgObj();
    if (curMaskImgObj) return null;
    return (
      <div className={`${prefixCls}-loading-wrapper`}>
        <img className={`${prefixCls}-loading-icon`} src={loadingImage} />
        <span className={`${prefixCls}-loading-text`}>抠图中...</span>
      </div>
    );
  }

  render() {
    const { ratio, page } = this.props;
    const { width: pageWidth, height: pageHeight } = page.toJS();
    const stageClassName = `${prefixCls}-stage`;
    const stageProps = {
      ref: node => (this.stage = node),
      width: pageWidth * ratio,
      height: pageHeight * ratio,
      className: stageClassName,
    };

    return (
      <div className={prefixCls}>
        <Stage {...stageProps}>
          <Layer>
            <Group ref={group => (this.unselectElements = group)}>{this.getRenderHtml()}</Group>
          </Layer>
        </Stage>
        {this.getLoadingHtml()}
      </div>
    );
  }
}

export default BookPage;
