import React, { PureComponent } from 'react';

import XSimplePagination from '@resource/components/XSimplePagination';

import { bindFuncs } from '@resource/lib/utils/component';

import BookSheet from '@apps/theme-editor/components/BookSheet';
import ButtonList from '@apps/theme-editor/components/ButtonList';
import PageNumber from '@apps/theme-editor/components/PageNumber';

import * as events from './handler/events';
import * as handlers from './handler/handler';

import './index.scss';

class MainPanel extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectElementIds: [],
    };

    bindFuncs(this, handlers);
    bindFuncs(this, events, 'events');
  }

  render() {
    const { selectElementIds } = this.state;
    const { pagination, pageArray, ratios, undoData, boundGlobalActions, boundProjectActions } =
      this.props;
    if (!pageArray || !pageArray.size) {
      return null;
    }
    const { current, total } = pagination.toJS();
    const paginationProps = {
      hasPreviousPage: current > 0,
      hasNextPage: current < total - 1,
      goToPreviousPage: this.goToPreviousPage,
      goToNextPage: this.goToNextPage,
    };
    const page = pageArray.get(pagination.get('current'));
    const ratio = ratios.get('innerWorkspace');
    const sheetProps = {
      page,
      pageArray,
      ratio,
      pagination,
      boundGlobalActions,
      boundProjectActions,
      onSelectElements: this.onSelectElements,
    };
    const buttonListProps = {
      page,
      pageArray,
      undoData,
      selectElementIds,
      boundGlobalActions,
      boundProjectActions,
      ratio,
    };

    return (
      <div className="main-panel" {...this.events}>
        <XSimplePagination {...paginationProps} />
        <ButtonList {...buttonListProps} />
        <div className="edit-container" id="editContainer">
          <BookSheet {...sheetProps} />
          <PageNumber sheetIndex={current} />
        </div>
      </div>
    );
  }
}

export default MainPanel;
