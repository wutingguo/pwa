import React from 'react';

import emptyPng from '@resource/static/icons/empty.png';
import loadingIcon from '@resource/static/icons/loading.gif';

import { XPureComponent } from '@common/components';

import { isEmpty } from '@apps/gallery/utils/helper';

import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';

import FavoriteTable from './components/FavoriteTable';

import './index.scss';

class Favorite extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      allFavoriteLoad: false,
      isLoadingProject: false,
      search: '',
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
          <div className="title">当前选片记录已经发生过历史导出，是否重新发起导出？</div>
          <div className="tips">如选片记录并未发生修改，建议下载历史文件</div>
          <div className="tips">如选片记录发生了修改，建议重新导出文件</div>
        </div>
      ),
      close: boundGlobalActions.hideConfirm,
      buttons: [
        {
          text: '下载历史',
          className: 'white',
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'GalleryFeedback_Click_DownloadExisting',
            });
            const windowReference = window.open();
            windowReference.location = `/software/gallery/download?uid=${oldId}`;
          },
        },
        {
          text: '重新导出',
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'GalleryFeedback_Click_GenerateNew',
            });
            newWay();
          },
        },
      ],
    });
  };

  updateExportRecord = (collection_favorite_id = '') => {
    const { boundProjectActions, urls, collectionDetail } = this.props;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const collection_id = collectionDetail.get('collection_uid');
    return boundProjectActions.getOldPackageUrl({
      galleryBaseUrl,
      collection_id,
      collection_favorite_id,
    });
  };

  getAllFavoriteData = (userId, searchText = '') => {
    const { match, boundProjectActions } = this.props;
    const {
      params: { id },
    } = match;
    this.setState({
      isLoadingProject: true,
      search: searchText,
    });
    const { getAllFavoriteList, updateFavoriteList } = boundProjectActions;
    getAllFavoriteList({
      collection_uid: id,
      customer_uid: userId,
      search_name: searchText,
    })
      .then(res => {
        updateFavoriteList(res.data);
        this.setState({
          allFavoriteLoad: true,
          isLoadingProject: false,
        });
      })
      .catch(() => {
        this.setState({
          isLoadingProject: false,
        });
      });
  };

  doSearch = searchText => {
    const userId = this.props.userInfo.get('id');
    this.getAllFavoriteData(userId, searchText);
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
      collectionDetail,
      mySubscription,
    } = this.props;
    const { isLoadingProject, search } = this.state;
    const userId = this.props.userInfo.get('id');
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
      hasSelectionSettingBtns: true,
      collectionDetail,
      allFavoriteList,
      mySubscription,
      doSearch: this.doSearch,
      updateExportRecord: this.updateExportRecord,
      alreadyExportModal: this.alreadyExportModal,
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
      collectionDetail,
      mySubscription,
      getAllFavoriteData: () => this.getAllFavoriteData(userId),
      updateExportRecord: this.updateExportRecord,
      alreadyExportModal: this.alreadyExportModal,
    };
    return (
      <div className="gllery-editor-content-wrapper editor-activities-favorite-container">
        <div className="content">
          <CollectionDetailHeader {...headerProps} />
          <div className="editor-activities-favorite-table-wrapper">
            {showEmpty && !isLoadingProject ? (
              <div className="favorite-show-empty-content">
                {search && <img src={emptyPng} width="70px" />}
                {search ? `查询“${search}”没有结果!` : t('YOU_HAVE_NO_FAVORITE_IN_THIS_SET')}
              </div>
            ) : (
              <FavoriteTable {...tableProps} />
            )}
            {isLoadingProject ? (
              <div className="content-loading">
                <img className="my-projects-loading" src={loadingIcon} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
export default Favorite;
