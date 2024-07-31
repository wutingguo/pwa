import React from 'react';
import { withRouter } from 'react-router';
import Table from 'rc-table';
import { isImmutable } from 'immutable';
import { XPureComponent, XIcon } from '@common/components';
import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';
import FavoriteAction from '../components/FavoriteAction';
import { BASE_MODAL } from '@apps/gallery/constants/modalTypes';
import { formatDate } from '@apps/gallery/utils/helper';
import { getTableColumns } from './components/config';
import { isEmpty } from '@apps/gallery/utils/helper';
import './index.scss';

class FavoriteDetail extends XPureComponent {
  componentDidMount() {
    const { match, boundProjectActions } = this.props;
    const {
      params: { id, favoriteId }
    } = match;
    const { getGuestFavoriteList, updateGuestFavoriteList } = boundProjectActions;
    getGuestFavoriteList({
      collection_uid: id,
      guest_uid: favoriteId
    }).then(res => {
      updateGuestFavoriteList(res.data);
    });
  }
  goBack = () => {
    const { history } = this.props;
    history.goBack();
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
      collectionFavorite
    } = this.props;
    const {
      params: { id: collectionId }
    } = match;
    const guestData = collectionFavorite.get('guestFavoriteInfo');
    const favorite_name = collectionFavorite.getIn(['guestFavoriteInfo', 'favorite_name']) || 0;
    const total =
      collectionFavorite.getIn(['guestFavoriteInfo', 'favorite_image_list', 'total']) || 0;
    const email = collectionFavorite.getIn(['guestFavoriteInfo', 'email']);
    const phone = collectionFavorite.getIn(['guestFavoriteInfo', 'phone']);
    const last_modified_time = collectionFavorite.getIn([
      'guestFavoriteInfo',
      'last_modified_time'
    ]);
    let tableData = collectionFavorite.getIn([
      'guestFavoriteInfo',
      'favorite_image_list',
      'records'
    ]);
    const galleryBaseUrl = urls.get('galleryBaseUrl');

    if (isImmutable(tableData)) {
      tableData = tableData.toJS();
    }
    const showEmpty = isEmpty(tableData);
    const headerProps = {
      history,
      collectionPreviewUrl,
      collectionId,
      title: favorite_name,
      hasHandleBtns: false
    };
    const actionProps = {
      type: 'detail',
      history,
      item: guestData,
      collectionPreviewUrl,
      boundGlobalActions,
      boundProjectActions
    };
    const tableProps = {
      className: 'favorite-detail-table',
      data: tableData,
      columns: getTableColumns({
        galleryBaseUrl,
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
              {/* <FavoriteAction {...actionProps} /> */}
            </div>
            <div className="favorite-detail-display-text">
              <div>
                <span className="favorite-detail-email">{__isCN__ ? email || phone : email}</span>
              </div>
              <div>
                <span>{t('NO_OF_PHOTOS')}</span>
                <span className="favorite-detail-photos-total">
                  {total} {t('PHOTOS')}
                </span>
                <span>{t('LAST_MODIFIED')}</span>
                <span className="favorite-detail-last-modified-time">
                  {formatDate(last_modified_time)}
                </span>
              </div>
            </div>
          </div>
          <div className="favorite-detail-table-wrapper">
            {showEmpty ? (
              <div className="favorite-detail-show-empty-content">
                {t('THRER_ARE_NO_FAVORITE_PHOTOS')}
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

export default withRouter(FavoriteDetail);
