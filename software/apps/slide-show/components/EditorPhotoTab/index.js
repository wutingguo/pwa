import React from 'react';
import { XPureComponent, XCollectionCover } from '@common/components';

import './index.scss';

class EditorPhotoTab extends XPureComponent {
  render(){
    const {
      name,
      coverProps
    } = this.props;
    return (
      <div className="slide-show-editor-sidebar-photos-wrapper">
        <nav className="slide-show-name">{name}</nav>
        <div className="slide-show-editor-sidebar-photos-cover">
          <XCollectionCover {...coverProps} />
        </div>
      </div>
    )
  }
}

export default EditorPhotoTab;