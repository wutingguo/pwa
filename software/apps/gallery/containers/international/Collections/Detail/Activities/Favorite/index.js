import { XPureComponent } from '@common/components';
import React from 'react';
import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';
import FavoriteTable from './components/FavoriteTable';
import { isEmpty } from '@apps/gallery/utils/helper';
import './index.scss';

class Favorite extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      allFavoriteLoad: false
    };
  }
  componentDidMount() {
    const userId = this.props.userInfo.get('id');
    //刷新页面有可能拿不到userInfo
    if (userId != -1) {
      this.getAllFavoriteData(userId);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { allFavoriteLoad } = this.state;
    const userId = this.props.userInfo.get('id');
    const oldId = prevProps.userInfo.get('id');
    if (!allFavoriteLoad && userId != -1 && userId !== oldId) {
      this.getAllFavoriteData(userId);
    }
  }
  alreadyExportModal = (oldId, newWay = () => {}) => {
    const { boundGlobalActions } = this.props;
    boundGlobalActions.showConfirm({
      message: (
        <div className="alreadyExportModal">
          <div className="tips">
            We noticed that you already generated a download file before. You can save time by
            downloading this existing file if the favorite list hasn’t been updated.
          </div>
        </div>
      ),
      close: boundGlobalActions.hideConfirm,
      buttons: [
        {
          text: 'Download Existing File',
          className: 'white',
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'GalleryActivities_DownLoadPop_Click_DownloadExisting'
            });
            const windowReference = window.open();
            windowReference.location = `/software/gallery/download?uid=${oldId}`;
          }
        },
        {
          text: 'Generate New File',
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'GalleryActivities_DownLoadPop_Click_GenerateNew'
            });
            newWay();
          }
        }
      ],
      style: {
        width: '530px'
      }
    });
  };
  updateExportRecord = (collection_favorite_id = '') => {
    const { boundProjectActions, urls, collectionDetail } = this.props;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const collection_id = collectionDetail.get('collection_uid');
    return boundProjectActions.getOldPackageUrl({
      galleryBaseUrl,
      collection_id,
      collection_favorite_id
    });
  };

  getAllFavoriteData = userId => {
    const { match, boundProjectActions } = this.props;
    const {
      params: { id }
    } = match;
    const { getAllFavoriteList, updateFavoriteList } = boundProjectActions;
    getAllFavoriteList({
      collection_uid: id,
      customer_uid: userId
    }).then(res => {
      updateFavoriteList(res.data);
      this.setState({
        allFavoriteLoad: true
      });
    });
  };

  render() {
    const {
      history,
      match,
      urls,
      defaultImgs,
      boundGlobalActions,
      boundProjectActions,
      collectionFavorite,
      collectionPreviewUrl,
      collectionDetail
    } = this.props;
    const allFavoriteList = collectionFavorite.get('allFavoriteList');
    const showEmpty = isEmpty(allFavoriteList);
    const headerProps = {
      history,
      collectionPreviewUrl,
      collectionId: match.params.id,
      title: t('FAVORITE_ACTIVITIES'),
      hasHandleBtns: false,
      boundGlobalActions,
      boundProjectActions,
      collectionDetail,
      allFavoriteList,
      hasSelectionSettingBtns: true,
      updateExportRecord: this.updateExportRecord,
      alreadyExportModal: this.alreadyExportModal
    };
    const tableProps = {
      className: 'editor-activities-favorite-all-table',
      history,
      match,
      urls,
      defaultImgs,
      collectionPreviewUrl,
      boundGlobalActions,
      boundProjectActions,
      data: allFavoriteList,
      updateExportRecord: this.updateExportRecord,
      alreadyExportModal: this.alreadyExportModal
    };
    return (
      <div className="gllery-editor-content-wrapper editor-activities-favorite-container">
        <div className="content">
          <CollectionDetailHeader {...headerProps} />
          <div className="editor-activities-favorite-table-wrapper">
            {showEmpty ? (
              <div className="favorite-show-empty-content">
                {t('YOU_HAVE_NO_FAVORITE_IN_THIS_SET')}
              </div>
            ) : (
              <FavoriteTable {...tableProps} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Favorite;
