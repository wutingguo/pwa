import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import * as modalTypes from '@resource/lib/constants/modalTypes';
import { packageListMapV2, saasProducts } from '@resource/lib/constants/strings';

import rocketIcon from '@resource/static/icons/rocket.png';
import searchIcon from '@resource/static/icons/search.png';

import { XButton, XIcon, XPureComponent } from '@common/components';

import * as localModalTypes from '@apps/gallery/constants/modalTypes';
import { isEmpty } from '@apps/gallery/utils/helper';
import { getWatermarkLoading } from '@apps/gallery/utils/mapStateHelper';

import shareMain from '../../containers/localization/Share/handler/main';

import AddVideoBtn from './AddVideoBtn';
import handler from './handler';

import './index.scss';

@connect(
  state => {
    const { system } = state.root;
    return {
      mySubscription: system.mySubscription,
    };
  },
  () => {}
)
class CollectionDetailHeader extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isShowPannel: false,
      searchText: '',
    };
    this.onOpenAiphotoClick = (...opt) => handler.onOpenAiphotoClick(this, ...opt);
    this.onAiphoto = (...opt) => handler.onAiphoto(this, ...opt);
    this.creatAiCollection = (...opt) => handler.creatAiCollection(this, ...opt);
    this.aiFailedModal = (...opt) => handler.aiFailedModal(this, ...opt);
    this.creatAiSingle = (...opt) => handler.creatAiSingle(this, ...opt);
  }

  componentDidMount() {
    window.addEventListener('click', this.hidePannel, false);
    const { commonAction } = this.props;
    if (commonAction) {
      commonAction.onSmartSharding = this.onSmartSharding;
    }
  }

  componentWillUnMount() {
    window.removeEventListener('click', this.hidePannel, false);
  }

  onView = () => {
    const { collectionPreviewUrl } = this.props;
    const watermarkLoading = getWatermarkLoading(this.props, 'btn');
    if (watermarkLoading) {
      return false;
    }
    window.logEvent.addPageEvent({
      name: 'GalleryPhotos_Click_View',
    });
    window.open(collectionPreviewUrl);
  };

  handleSearchChange = e => {
    const { target } = e;
    this.setState({
      searchText: target.value,
    });
  };

  onKeyUp = e => {
    if (e && e.keyCode && e.keyCode === 13) {
      this.props.doSearch(this.state.searchText);
    }
  };

  showExpiredModal = () => {
    const { boundGlobalActions } = this.props;

    const { hideConfirm, showConfirm } = boundGlobalActions;
    const data = {
      className: 'delete-collection-set-modal',
      close: () => {
        hideConfirm();
      },
      // title: `${t('DELETE_PHOTO_SET')}?`,
      message: t('GALLERY_SHARED_EXPIRED_TIPS'),
      buttons: [
        {
          className: 'white pwa-btn',
          text: t('CANCEL'),
          onClick: () => {
            hideConfirm();
          },
        },
        {
          className: 'pwa-btn',
          text: t('OK'),
          onClick: () => {
            window.onGalleryTabSelect && window.onGalleryTabSelect(1);
          },
        },
      ],
    };
    showConfirm(data);
  };

  onShare = () => {
    const { history, collectionId, isGallerySharedExpired, boundProjectActions } = this.props;
    const watermarkLoading = getWatermarkLoading(this.props, 'btn');
    if (watermarkLoading) {
      return false;
    }
    window.logEvent.addPageEvent({
      name: 'GalleryPhotos_Click_Share',
    });

    const commonLogic = () => {
      if (isGallerySharedExpired) {
        this.showExpiredModal();
        return false;
      }

      if (__isCN__) {
        shareMain.onGetDirectLink(this, {
          id: collectionId,
        });
      } else {
        const { push } = history;
        push(`/software/gallery/share/${collectionId}`);
      }
    };
    if (__isCN__) {
      const { getPinSetting } = boundProjectActions;
      getPinSetting(collectionId).then(() => {
        commonLogic();
      });
    } else {
      commonLogic();
    }
  };

  togglePannel = e => {
    this.setState({
      isShowPannel: !this.state.isShowPannel,
    });
    e.stopPropagation();
    e.preventDefault();
    e.cancelBubble = true;
    return false;
  };
  hidePannel = () => {
    this.setState({
      isShowPannel: false,
    });
  };

  // onSelectionSetting = () => {
  //   window.logEvent.addPageEvent({
  //     name: 'GallerySelectionFeedback_Click_SelectionSet'
  //   });
  //   const { history, collectionId } = this.props;
  //   const { push } = history;
  //   push(`/software/gallery/collection/${collectionId}/settings/selection/`);
  // };
  showUpdateModal = modalData => {
    const { boundGlobalActions, urls } = this.props;
    const { showConfirm, hideConfirm } = boundGlobalActions;
    const saasBaseUrl = urls && urls.get('saasBaseUrl');
    const data = modalData || {
      message: (
        <div style={{ textAlign: 'center' }}>
          导出记录功能需选片标准版及以上版本方可使用
          <br /> 请升级您的版本以使用此功能。{' '}
        </div>
      ),
      close: () => hideConfirm(),
      buttons: [
        {
          text: t('UPGRADE'),
          className: 'pwa-btn',
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'DesignerLabs_Click_Upgrade',
            });
            boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
              product_id: saasProducts.gallery,
              level: packageListMapV2.basic,
              cycle: 1,
              escapeClose: true,
              onClosed: () => {
                boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
                boundGlobalActions.getMySubscription(saasBaseUrl);
              },
            });

            // this.props.history.push(`/software/checkout-plan`);
          },
        },
      ],
    };
    showConfirm(data);
  };

  exportAgainByNewWay = async () => {
    const {
      boundProjectActions,
      collectionDetail,
      allFavoriteList,
      boundGlobalActions,
      mySubscription,
    } = this.props;
    const collectionUid = collectionDetail.get('collection_uid');
    const showEmpty = isEmpty(allFavoriteList);
    const FavoriteList = allFavoriteList.toJS() || [];
    let allFavoritePhoto = 0;
    FavoriteList.forEach(item => {
      allFavoritePhoto += item.photos;
    });
    if (__isCN__) {
      window.logEvent.addPageEvent({
        name: 'GalleryCollectionActivities_Click_BatchExport',
      });
      const galleryDesc = mySubscription
        .get('items')
        .find(sub => sub.get('product_id') === saasProducts.gallery);
      const isOrder = galleryDesc?.get('plan_level') > 10;
      if (!isOrder) {
        this.showUpdateModal();
        return;
      }
    }
    if (showEmpty || allFavoritePhoto < 1) {
      boundGlobalActions.addNotification({
        message: t('FAVORITE_NO_PHOTO'),
        level: 'success',
        autoDismiss: 2,
      });
      return false;
    }

    const res = await boundProjectActions.exportFavoritesList(collectionUid);
    if (res.ret_code === 200000) {
      const windowReference = window.open();
      windowReference.location = `/software/gallery/download?uid=${res.data}`;
    }
  };

  handleBatchExport = async () => {
    const { updateExportRecord, alreadyExportModal } = this.props;
    const { data: hasExportRecord } = await updateExportRecord();
    if (hasExportRecord) {
      const { expired_time, request_uuid } = hasExportRecord;
      const currentTimestamp = new Date().getTime();
      if (currentTimestamp < expired_time) {
        alreadyExportModal(request_uuid, this.exportAgainByNewWay);
        return;
      }
    }
    if (!__isCN__) {
      window.logEvent.addPageEvent({
        name: 'GalleryActivities_Click_BatchDownloadPhotos',
      });
    }
    this.exportAgainByNewWay();
  };

  onSmartSharding = continueGroup => {
    const {
      boundGlobalActions,
      mySubscription,
      urls,
      collectionDetail,
      boundProjectActions,
      setProgress,
      doSetInterval,
      match,
    } = this.props;
    const galleryPlanLevel = mySubscription
      .get('items')
      .find(sub => sub.get('product_id') === saasProducts.gallery);
    const isHigh = galleryPlanLevel?.get('plan_level') > 30;
    const { showConfirm, hideConfirm } = boundGlobalActions;
    const saasBaseUrl = urls && urls.get('saasBaseUrl');
    const collection_group_info = collectionDetail && collectionDetail.get('collection_group_info');
    const group_status = collection_group_info && collection_group_info.get('group_status');
    const enc_collection_uid = collectionDetail.get('enc_collection_uid');
    if (!isHigh) {
      const data = {
        message: (
          <div style={{ textAlign: 'center' }}>升级选片软件高级版本，方可使用智能分片功能</div>
        ),
        close: () => hideConfirm(),
        buttons: [
          {
            text: t('UPGRADE'),
            className: 'pwa-btn',
            onClick: () => {
              boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
                product_id: saasProducts.gallery,
                level: packageListMapV2.pro,
                cycle: 1,
                escapeClose: true,
                onClosed: () => {
                  boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
                  boundGlobalActions.getMySubscription(saasBaseUrl);
                },
              });
            },
          },
        ],
      };
      showConfirm(data);
      return;
    }
    const sets = collectionDetail.get('sets');
    let allPhoto = 0;
    sets.forEach(item => {
      allPhoto += item.get('photo_count');
    });
    if (allPhoto < 30 && !continueGroup && group_status !== 2) {
      const data = {
        message: (
          <div style={{ textAlign: 'center' }}>为了您的分片体验，建议至少上传30张以上图片</div>
        ),
        close: () => hideConfirm(),
        buttons: [
          {
            text: t('确定'),
            className: 'pwa-btn',
            onClick: () => {
              hideConfirm();
            },
          },
        ],
      };
      showConfirm(data);
      return;
    }
    if (group_status === 3 && !continueGroup) {
      const data = {
        message: (
          <div style={{ textAlign: 'center' }}>
            <img src={rocketIcon} style={{ width: '193px' }} />
            <br />
            抱歉，服务正在升级中…
          </div>
        ),
        style: {
          width: '450px',
          padding: '20px 40px 40px',
        },
        close: () => hideConfirm(),
        buttons: [
          {
            text: t('取消'),
            className: 'pwa-btn white',
            onClick: () => {
              hideConfirm();
            },
          },
          {
            text: t('重试'),
            className: 'pwa-btn black',
            onClick: () => {
              boundProjectActions.startSmartSharding(enc_collection_uid);
              boundProjectActions.getSmartShardingStatus(enc_collection_uid);
              hideConfirm();
            },
          },
        ],
      };
      showConfirm(data);
      return;
    }
    if (group_status === 2 && !continueGroup) {
      boundGlobalActions.showModal(localModalTypes.AI_GROUPS_MODAL, {
        collectionDetail,
        onSmartSharding: this.onSmartSharding,
      });
      setProgress(false);
      return;
    }

    const data = {
      message: (
        <div style={{ textAlign: 'left', padding: '0 25px' }}>
          建议将所有图片上传后，再进行智能分片，以避免重新分片浪费时间。
          <br />
          <br />
          开始智能分片？
        </div>
      ),
      style: {
        width: '450px',
      },
      close: () => hideConfirm(),
      buttons: [
        {
          text: t('取消'),
          className: 'pwa-btn white',
          onClick: () => {
            hideConfirm();
          },
        },
        {
          text: t('确定'),
          className: 'pwa-btn black',
          onClick: () => {
            boundProjectActions.startSmartSharding(enc_collection_uid).then(res => {
              if (res.ret_code === 200000) {
                setProgress(true);
                boundProjectActions.getSmartShardingStatus(enc_collection_uid);
                doSetInterval();
                boundGlobalActions.hideModal(localModalTypes.AI_GROUPS_MODAL);
              }
            });
            hideConfirm();
          },
        },
      ],
    };
    showConfirm(data);
    return;
  };

  render() {
    const {
      className,
      title,
      uploadBtn,
      hasHandleBtns = true,
      hasSelectionSettingBtns = false,
      doSearch = () => {},
      uploadDirectory,
      collectionDetail,
      boundGlobalActions,
      uploadVideoBtn,
      boundProjectActions,
    } = this.props;
    const { isShowPannel, searchText } = this.state;
    const collection_group_info = collectionDetail && collectionDetail.get('collection_group_info');
    const group_status = collection_group_info && collection_group_info.get('group_status');
    const count_fresh_images = collectionDetail && collectionDetail.get('count_fresh_images');
    const set_uid = collectionDetail && collectionDetail.get('currentSetUid');
    const curSetVideo =
      collectionDetail && collectionDetail.getIn(['gallery_video_info', 'video_id']);
    const addVideoProps = {
      boundGlobalActions,
      uploadVideoBtn,
      collectionDetail,
      curSetVideo,
      boundProjectActions,
      set_uid,
    };
    const wrapperCls = classnames('collection-detail-header-wrapper', {
      [className]: !!className,
    });
    const pannelClass = classnames('sub-pannel', {
      ['is-show']: !!isShowPannel,
    });
    return (
      <div className={wrapperCls}>
        <div className="collection-detail-header-left">{title}</div>
        {hasHandleBtns ? (
          <div className="collection-detail-header-right">
            {__isCN__ && (
              <div className="ai-btn" onClick={this.onAiphoto}>
                智能AI修图
              </div>
            )}
            {!__isCN__ && <AddVideoBtn {...addVideoProps} />}
            <div className="add-photo-btn-container">
              <XIcon type="add" theme="black" text={t('ADD_PHOTOS')} onClick={this.togglePannel} />
              <ul className={pannelClass}>
                <li>{uploadBtn}</li>
                <li>{uploadDirectory}</li>
                <li onClick={this.onOpenAiphotoClick}>{t('UPLOAD_FROM_ZNO_RETOUCHER')}</li>
                {/* 中文露出照片直播图片上传 */}
                {__isCN__ && (
                  <li onClick={() => this.onOpenAiphotoClick({ type: 'live' })}>
                    {t('UPLOAD_FROM_ZNO_INSTANT')}
                  </li>
                )}
              </ul>
            </div>
            {__isCN__ && (
              <XIcon
                className="collection-detail-header-face"
                type="face"
                theme="black"
                text={group_status === 1 ? '分片中' : t('智能分片')}
                status={group_status === 1 ? 'disable' : ''}
                onClick={() => this.onSmartSharding()}
                title={
                  count_fresh_images
                    ? `检测到${count_fresh_images}张新图片，请重新进行智能分片`
                    : ''
                }
              >
                {group_status >= 2 && !count_fresh_images ? <span className="tab"></span> : null}
                {group_status === 2 && count_fresh_images ? (
                  <span className="tab count">
                    {' '}
                    {count_fresh_images > 99 ? '99+' : count_fresh_images}
                  </span>
                ) : null}
              </XIcon>
            )}
            <XIcon
              className="collection-detail-header-view"
              type="view"
              theme="black"
              text={t('VIEW')}
              onClick={this.onView}
            />

            {/* 分享 */}
            <XIcon
              className="collection-detail-header-share"
              type="share"
              theme="black"
              text={t('COLLECTION_SHARE')}
              onClick={this.onShare}
            />
          </div>
        ) : null}
        {hasSelectionSettingBtns && (
          <div className="search-container">
            {__isCN__ && (
              <div className="collection-search">
                <input
                  type="text"
                  name="searchbox"
                  className="search-input"
                  placeholder="查询"
                  value={searchText}
                  autoComplete="on"
                  onChange={this.handleSearchChange}
                  onKeyUp={this.onKeyUp}
                />
                <div className="search-icon-container" onClick={() => doSearch(searchText)}>
                  <img src={searchIcon} className="search-icon" />
                </div>
              </div>
            )}
            <XButton onClicked={this.handleBatchExport} style={{ width: 'auto' }}>
              {t('BATCH_EXPORT')}
            </XButton>
          </div>
        )}

        {/* {hasSelectionSettingBtns && (
          
        )} */}
      </div>
    );
  }
}
CollectionDetailHeader.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  collectionId: PropTypes.string.isRequired,
  title: PropTypes.any,
};

export default CollectionDetailHeader;
