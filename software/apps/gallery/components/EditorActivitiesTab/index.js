import React from 'react';
import classnames from 'classnames';
import { XPureComponent, XCollectionCover } from '@common/components';
import ActivitiesList from './ActivitiesList';

class EditorActivitiesTab extends XPureComponent {
  onSelect = ({ key }) => {
    console.log(key);
    const {
      history: { push },
      params: { id } = {},
      collectionDetail
    } = this.props;
    push(`/software/gallery/collection/${id}/activities/${key}`);
    //点击download增加埋点
    if (key === 'download' && collectionDetail && collectionDetail.size) {
      window.logEvent.addPageEvent({
        name: 'GalleryCollectionActivities_Click_DownloadActivities',
        collectionId: collectionDetail.get('collection_uid')
      });
    }
  };
  render() {
    const { items, selectedKeys, coverProps } = this.props;
    const setListProps = {
      items,
      selectedKeys,
      onSelect: this.onSelect
    };

    return (
      <div className="gllery-editor-sidebar-photos-wrapper">
        <ActivitiesList {...setListProps} />
        <div className="gllery-editor-sidebar-photos-cover">
          <XCollectionCover {...coverProps} />
        </div>
      </div>
    );
  }
}

export default EditorActivitiesTab;
