import React, { Fragment } from 'react';
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

  renderPicInfo = (total, extraImgNum = 0, extraImgFee = 0) => {
    if (extraImgNum && extraImgFee) {
      return (
        <Fragment>
          <span>{t('已选照片:')}</span>
          <span className="favorite-detail-photos-total">{total - extraImgNum}张照片</span>
          <span>{t('加片:')}</span>
          <span className="favorite-detail-photos-total">{extraImgNum}张照片</span>
          <span>{t('加片费:')}</span>
          <span className="favorite-detail-photos-total">￥{extraImgFee}</span>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <span>{t('已选照片:')}</span>
        <span className="favorite-detail-photos-total">
          {total} {t('PHOTOS')}
        </span>
      </Fragment>
    );
  };
  getLabList = labelList => {
    const label =
      labelList &&
      labelList.map((label, index) => {
        return {
          title: `${label.label_name}`,
          dataIndex: 'lable',
          key: 'lable',
          render(value, item) {
            return (
              <div className="favorite-detail-list-lable-wrapper">
                <span className="favorite-detail-list-lable-name">
                  {item.img_labels_info[index].mark ? '是' : ``}
                </span>
              </div>
            );
          }
        };
      });
    return label;
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
    const extraImgNum = collectionFavorite.getIn(['guestFavoriteInfo', 'extra_img_num']);
    const extraImgFee = collectionFavorite.getIn(['guestFavoriteInfo', 'extra_img_fee']);
    const last_modified_time = collectionFavorite.getIn([
      'guestFavoriteInfo',
      'last_modified_time'
    ]);
    let tableData = collectionFavorite.getIn([
      'guestFavoriteInfo',
      'favorite_image_list',
      'records'
    ]);
    let labels = collectionFavorite.getIn(['guestFavoriteInfo', 'labels']);
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    let lableList = [];
    if (isImmutable(tableData) || isImmutable(labels)) {
      tableData = tableData.toJS();
      lableList = this.getLabList(labels.toJS());
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

    let tableProps = {
      className: 'favorite-detail-table',
      data: tableData,
      columns: getTableColumns({
        galleryBaseUrl,
        collectionId,
        showDeleteModal: this.showDeleteModal,
        handleJumpPhotoSet: this.handleJumpPhotoSet
      }),
      rowKey: 'enc_image_uid'
    };
    if (lableList && lableList.length) {
      tableProps.columns.splice(2, 0, ...lableList);
    }
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
                {this.renderPicInfo(total, extraImgNum, extraImgFee)}
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
