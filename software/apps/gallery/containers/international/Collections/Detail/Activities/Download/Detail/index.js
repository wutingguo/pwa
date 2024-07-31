import React from 'react';
import { withRouter } from 'react-router';
import { get } from 'lodash';
import Table from 'rc-table';
import { isImmutable } from 'immutable';
import { XPureComponent, XIcon } from '@common/components';
import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';
import { BASE_MODAL } from '@apps/gallery/constants/modalTypes';
import { formatDate } from '@apps/gallery/utils/helper';
import { getTableColumns } from './components/config';
import { isEmpty } from '@apps/gallery/utils/helper';
import './index.scss';

class DownLoadDetail extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoadedSingleDownloadRecords: false
    };
  }
  componentDidMount() {
    const { userInfo, boundProjectActions, collectionDetail } = this.props;
    const userId = userInfo.get('id');
    const collectionId = collectionDetail && collectionDetail.get('collection_uid');
    //刷新页面有可能拿不到userInfo
    if (userId != -1 && collectionId) {
      boundProjectActions
        .getSingleDownloadRecords(collectionId)
        .then(res => this.setState({ isLoadedSingleDownloadRecords: true }));
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { userInfo, boundProjectActions, collectionDetail, downloadActivities } = this.props;
    const { isLoadedSingleDownloadRecords } = this.state;
    const userId = userInfo.get('id');
    const { singlePhotoDownloadRecords } = downloadActivities.toJS();
    const collectionId = collectionDetail && collectionDetail.get('collection_uid');
    if (userId != -1 && collectionId) {
      if (!isLoadedSingleDownloadRecords && !singlePhotoDownloadRecords.length) {
        boundProjectActions
          .getSingleDownloadRecords(collectionId)
          .then(res => this.setState({ isLoadedSingleDownloadRecords: true }));
      }
    }
  }

  getSortedDownloadRecords = records => {
    const { match } = this.props;
    const {
      params: { emailId }
    } = match;
    if (records && records.length) {
      const currentEmailItem = records.find(item => item.guest_uid === Number(emailId));
      const currentEmailRecordList = currentEmailItem
        ? get(currentEmailItem, 'details_vo.records')
        : [];
      return currentEmailRecordList.sort((r1, r2) => r2.create_time - r1.create_time);
    }
    return null;
  };

  goBack = () => {
    const { history, match } = this.props;
    const {
      params: { id: collectionId, emailId }
    } = match;
    history.push({
      pathname: `/software/gallery/collection/${collectionId}/activities/download`,
      search: '?tabId=2'
    });
    // history.goBack();
  };
  handleDelete = item => {
    const { match, boundGlobalActions, boundProjectActions, collectionFavorite } = this.props;
    const {
      params: { id, favoriteId }
    } = match;
    const favorite_uid = collectionFavorite.getIn(['guestFavoriteInfo', 'favorite_uid']);
    boundProjectActions
      .deleteFavoriteImg({
        collection_uid: id,
        guest_uid: favoriteId,
        favorite_uid,
        enc_image_uid: item.enc_image_uid
      })
      .then(res => {
        boundGlobalActions.hideModal(BASE_MODAL);
        if (res.data) {
          boundProjectActions.updateListAfterDelte(res.data);
        }
      });
  };
  showDeleteModal = item => {
    window.logEvent.addPageEvent({
      name: 'GalleryActivities_Click_Delete'
    });

    const { boundGlobalActions } = this.props;
    boundGlobalActions.showModal(BASE_MODAL, {
      modalProps: {
        title: t('REMOVE_FAVORITE'),
        confirmText: t('REMOVE_OK'),
        renderChildren: () => (
          <div className="remove-favorite-modal-content">{t('REMOVE_FAVORITE_TEXT')}</div>
        ),
        onOk: () => this.handleDelete(item)
      }
    });
  };

  handleJumpPhotoSet = (url, collectionId, setUid) => {
    const { history, boundProjectActions } = this.props;
    const { getSetPhotoList, changeSelectedSet, setDetailContentLoading } = boundProjectActions;
    const { push } = history;
    changeSelectedSet(setUid);
    setDetailContentLoading({ loading: true });
    getSetPhotoList(collectionId, setUid)
      .then(response => {
        setDetailContentLoading({ loading: false });
      })
      .catch(err => {
        setDetailContentLoading({ loading: false });
      });
    push(url);
  };

  handleShowMore = id => {
    const container = document.querySelector(`#${id}`);
    const btn = container.querySelector('.btn');
    const wrap = container.querySelector('.wrap');
    const isUnfold = wrap.classList.contains('unfold');

    if (!isUnfold) {
      wrap.className = 'wrap unfold';
      btn.style.top = 'calc(100% - 20px)';
      btn.style.right = '-2.5em';
      btn.innerText = 'fold';
    } else {
      wrap.className = 'wrap fold';
      btn.style.top = '0';
      btn.style.right = '0';
      btn.innerText = 'more';
    }
  };

  render() {
    const {
      history,
      match,
      collectionPreviewUrl,
      boundGlobalActions,
      boundProjectActions,
      urls,
      defaultImgs,
      downloadActivities
    } = this.props;
    const {
      params: { id: collectionId, emailId }
    } = match;

    const singlePhotoDownloadRecords = downloadActivities.get('singlePhotoDownloadRecords');
    const currentEmailItem =
      singlePhotoDownloadRecords.find(item => item.guest_uid === Number(emailId)) || {};
    const { download_times, last_download, email } = currentEmailItem;
    let sortedSingleDownloadRecords = this.getSortedDownloadRecords(singlePhotoDownloadRecords);

    const galleryBaseUrl = urls.get('galleryBaseUrl');

    if (isImmutable(sortedSingleDownloadRecords)) {
      sortedSingleDownloadRecords = sortedSingleDownloadRecords.toJS();
    }
    const showEmpty = isEmpty(sortedSingleDownloadRecords);
    const headerProps = {
      history,
      collectionPreviewUrl,
      collectionId,
      title: t('MY_DOWNLOADS'),
      hasHandleBtns: false
    };

    const tableProps = {
      className: 'favorite-detail-table',
      data: sortedSingleDownloadRecords,
      columns: getTableColumns({
        galleryBaseUrl,
        defaultImgs,
        collectionId,
        showDeleteModal: this.showDeleteModal,
        handleJumpPhotoSet: this.handleJumpPhotoSet,
        handleShowMore: this.handleShowMore
      }),
      rowKey: 'enc_image_uid'
    };

    return (
      <div className="gllery-editor-content-wrapper favorite-detail-container">
        <div className="content">
          <CollectionDetailHeader {...headerProps} />
          <div>
            <div className="operations">
              <XIcon className="operation-back-icon" type="back-1" onClick={this.goBack} />
            </div>
            <div className="favorite-detail-display-text">
              <div>
                <span className="favorite-detail-email">{email}</span>
              </div>
              <div>
                <span>{t('DOWNLOAD_TIMES')}</span>
                <span className="favorite-detail-photos-total">{download_times}</span>
                <span>{t('LAST_DOWNLOAD')}</span>
                <span className="favorite-detail-last-modified-time">
                  {formatDate(last_download)}
                </span>
              </div>
            </div>
          </div>
          <div className="favorite-detail-table-wrapper">
            {showEmpty ? (
              <div className="favorite-detail-show-empty-content">
                {t('THRER_ARE_NO_DOWNLOAD_PHOTOS')}
              </div>
            ) : (
              <Table {...tableProps} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(DownLoadDetail);
