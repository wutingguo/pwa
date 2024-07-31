import React from 'react';

import equals from '@resource/lib/utils/compare';

import { XCollectionCover, XIcon, XPureComponent } from '@common/components';

import PhotoSetList from './PhotoSetList';
import * as main from './handle/main';

import './index.scss';

class EditorPhotoTab extends XPureComponent {
  handleSetSelect = item => main.handleSetSelect(item, this);
  handleRenameSet = item => main.handleRenameSet(item, this);
  handleDeleteSet = item => main.handleDeleteSet(item, this);
  handleAddSet = () => main.handleAddSet(this);
  handleDragEnd = result => main.handleDragEnd(result, this);

  render() {
    const { params, items, coverProps, currentSetUid, defaultSetUid } = this.props;
    const setListProps = {
      params,
      items,
      handleRenameSet: this.handleRenameSet,
      handleDeleteSet: this.handleDeleteSet,
      onSelect: this.handleSetSelect,
      onDragEnd: this.handleDragEnd,
      selectedKeys: [currentSetUid],
      defaultSetUid,
    };
    return (
      <div className="gllery-editor-sidebar-photos-wrapper">
        <div className="gllery-editor-sidebar-photos-sets">
          <PhotoSetList {...setListProps} />
          {items ? (
            <div className="add-set-btn" onClick={this.handleAddSet}>
              <XIcon type="add-gray" text={t('ADD_SET')} />
            </div>
          ) : null}
        </div>
        <div className="gllery-editor-sidebar-photos-cover">
          <XCollectionCover {...coverProps} />
        </div>
      </div>
    );
  }
}

export default EditorPhotoTab;
