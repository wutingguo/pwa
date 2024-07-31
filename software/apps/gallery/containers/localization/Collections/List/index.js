import { List, Map } from 'immutable';
import React from 'react';

import XPagePagination from '@resource/components/XPagePagination';
import FreeNotify from '@resource/components/freeNotify';
// import VideoModal from '@resource/components/modals/VideoModal';
import VideoModal from '@resource/components/modals/GroupsVideoModal';

import * as modalTypes from '@resource/lib/constants/modalTypes';
import { saasProducts } from '@resource/lib/constants/strings';
import { vedioGroupsStr } from '@resource/lib/constants/vedioGroupsString';

import getRemainDay from '@resource/lib/service/remainDay';

import loadingIcon from '@resource/static/icons/loading.gif';
import searchIcon from '@resource/static/icons/search.png';

import { EmptyContent, XCardList, XIcon, XPureComponent } from '@common/components';

import CollectionCard from '@apps/gallery/components/CollectionCard';
import CollectionSortActionBar from '@apps/gallery/components/CollectionSortActionBar';

import { buildUrlParmas, getQueryStringObj } from '@src/utils/url';

import mainHandler from './handle/main';

import './index.scss';

class CollectionList extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowEmptyContent: false,
      isRequestCompleted: false,
      isShowVideoModal: false,
      searchText: '',
      isLoadingProject: false,
      remainDay: {},
      paginationInfo: {},
      maxOrdering: 0,
    };
  }

  componentDidMount() {
    window.logEvent.addPageEvent({
      name: 'GalleryCollection',
    });
    const { urls } = this.props;
    const userId = this.props.userInfo.get('id');
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const qs = getQueryStringObj();
    if (qs.searchText) {
      this.setState({
        searchText: qs.searchText,
      });
    }
    getRemainDay({ customer_id: userId, galleryBaseUrl, product_scope: saasProducts.gallery }).then(
      res => {
        this.setState({
          remainDay: res,
        });
      }
    );
    if (Number(userId) !== -1) {
      this.getCollectionList(qs.searchText);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const oldId = prevProps.userInfo.get('id');
    const userId = this.props.userInfo.get('id');
    if (Number(oldId) === -1 && Number(userId) !== -1) {
      this.getCollectionList();
    }
  }

  getCollectionList = (searchText = '', current_page = 1) => {
    const { boundProjectActions, boundGlobalActions } = this.props;
    this.setState({
      isLoadingProject: true,
    });

    const qs = getQueryStringObj();
    const urlParams = buildUrlParmas({ ...qs, searchText });
    history.pushState(null, null, urlParams);
    boundProjectActions
      .getCollectionList(searchText, current_page)
      .then(res => {
        this.setState({
          isRequestCompleted: true,
          isLoadingProject: false,
          paginationInfo: res.data,
        });
        if (searchText === '' && current_page === 1) {
          this.setState({
            maxOrdering: res.data.records[0] && res.data.records[0]['ordering'],
          });
        }
        boundGlobalActions.getMySubscription();
      })
      .catch(err => this.setState({ isRequestCompleted: true }));
  };

  handleSearchChange = e => {
    const { target } = e;
    this.setState({
      searchText: target.value,
    });
  };

  onKeyUp = e => {
    if (e && e.keyCode && e.keyCode === 13) {
      this.doSearch();
    }
  };

  doSearch = () => {
    const { searchText, isLoadingProject } = this.state;
    if (isLoadingProject) return;
    this.getCollectionList(searchText, 1);
  };
  changeFilter = data => {
    if (!data || !data.keyName) return;
    const { searchText, isLoadingProject } = this.state;
    if (isLoadingProject) return;
    this.getCollectionList(searchText, data.value);
  };

  /**
   * 新增 collection
   */
  handleCreate = () => {
    window.logEvent.addPageEvent({
      name: 'GalleryCollection_Click_NewCollections',
    });
    mainHandler.handleCreate(this);
  };

  /**
   * 编辑 collection
   */
  handleEdit = item => mainHandler.handleEdit(this, item);

  /**
   * 删除 collection
   */
  handleDelete = collectionUid => mainHandler.handleDelete(this, collectionUid);

  /**
   * 点击 card 至详情
   */
  handleClick = collectionUid => mainHandler.handleClick(this, collectionUid);

  hideModal = () => {
    this.setState({
      isShowVideoModal: false,
    });
  };

  openTutorialVideo = () => {
    this.setState({
      isShowVideoModal: true,
    });
  };

  toCheckoutPlan = () => {
    const { boundGlobalActions, urls } = this.props;
    const saasBaseUrl = urls.get('saasBaseUrl');
    boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
      product_id: saasProducts.gallery,
      escapeClose: true,
      onClosed: () => {
        boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
        boundGlobalActions.getMySubscription(saasBaseUrl);
      },
    });
  };
  doClearSearch = () => {
    const { searchText, isLoadingProject } = this.state;
    if (isLoadingProject) return;
    localStorage.setItem('collectListSeartext', '');
    this.getCollectionList('', 1);
    this.setState({
      searchText: '',
    });
  };
  render() {
    // eslint-disable-next-line new-cap
    const {
      collectionList = List([]),
      envUrls = Map({}),
      mySubscription,
      boundProjectActions,
    } = this.props;

    const {
      isRequestCompleted,
      isShowVideoModal,
      searchText,
      isLoadingProject,
      remainDay,
      paginationInfo,
    } = this.state;
    const { is_subscribed, remain_days } = remainDay;
    const isShowEmptyContent = isRequestCompleted && !collectionList.size;

    const cardListProps = {
      items: collectionList,
      galleryBaseUrl: envUrls.get('galleryBaseUrl'),
      handleClick: this.handleClick,
      handleEdit: this.handleEdit,
      handleDelete: this.handleDelete,
      renderCard: data => <CollectionCard {...data} />,
    };

    const emptyContentProps = {
      desc: searchText ? `查询“${searchText}”没有结果!` : t('NO_COLLECTIONS_TIP'),
      iconText: t('NEW_COLLECTIONS'),
      handleClick: this.handleCreate,
    };

    const groupVideos = vedioGroupsStr('gallery');
    const isNearLimit = is_subscribed && remain_days <= 5;

    const text = isNearLimit
      ? `您的选片软件付费版还剩${remain_days}天可用，到期后仅可使用免费功能，建议您尽快续费，查看`
      : '您当前为选片软件【免费版-512M容量额度】，可在开通付费版本后享更高容量和权益';
    const imageSortActionBarProps = {
      changeSort: async value => {
        await boundProjectActions.sortCollectionList(value.rule);
        this.getCollectionList('', 1);
        // const sortedUidList = sortedImageList.map(image => image.image_uid);
        // boundProjectActions.resortImages(fromJS(sortedImageList));
        // boundProjectActions.postResortImages(sortedUidList);
        // boundProjectActions.handleClearSelectImg();
      },
      trackEvent: config => {},
    };
    return (
      <div className="collections-list gallery-collection-container">
        <FreeNotify
          subscriptionInfo={mySubscription.toJS()}
          softwareType={saasProducts.gallery}
          remainDay={remainDay}
        >
          <div className="free-alert">
            <div className="content">
              <div>
                {text}
                <span
                  style={{
                    color: '#0077CC',
                    cursor: 'pointer',
                    marginLeft: 5,
                    textDecoration: 'underline',
                  }}
                  onClick={() => {
                    window.location.href = '/software/account?tabs=3&itemTab=1';
                  }}
                >
                  版本介绍
                </span>
              </div>
              <div className="btn" onClick={this.toCheckoutPlan}>
                {isNearLimit ? '立即续费' : '立即购买'}
              </div>
            </div>
          </div>
        </FreeNotify>
        <div className="collection-header">
          <span className="collection-label">{t('COLLECTIONS')}</span>
          <div className="wrapperCollection">
            {__isCN__ && (
              <div className="tutorialVideo" onClick={this.openTutorialVideo}>
                新手教程
              </div>
            )}
            <XIcon
              type="add"
              iconWidth={12}
              iconHeight={12}
              theme="black"
              title={t('NEW_COLLECTIONS')}
              text={t('NEW_COLLECTIONS')}
              onClick={this.handleCreate}
            />
          </div>
        </div>
        <div className="search-container">
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
            {!!searchText && (
              <div className="search-icon-clear" onClick={this.doClearSearch}>
                X
              </div>
            )}
            <div className="search-icon-container" onClick={this.doSearch}>
              <img src={searchIcon} className="search-icon" />
            </div>
          </div>
          {!searchText && (
            <div style={{ marginLeft: '20px', display: 'inline-block' }}>
              <CollectionSortActionBar {...imageSortActionBarProps} />
            </div>
          )}
        </div>
        {collectionList && collectionList.size ? (
          <div className="collection-container">
            <XCardList {...cardListProps} />
            <div className="pagination-container">
              {paginationInfo.total > 20 && (
                <XPagePagination
                  changeFilter={this.changeFilter}
                  currentPage={paginationInfo.current_page}
                  totalPage={paginationInfo.page_count}
                />
              )}
            </div>
          </div>
        ) : null}
        {isShowEmptyContent ? <EmptyContent {...emptyContentProps} /> : null}
        {isLoadingProject ? (
          <div className="content-loading">
            <img className="my-projects-loading" src={loadingIcon} />
          </div>
        ) : null}
        {isShowEmptyContent && __isCN__ ? (
          <div className="tutorialVideoEmpty">
            <span onClick={this.openTutorialVideo}>新手教程</span>
          </div>
        ) : null}
        {isShowVideoModal && (
          <VideoModal
            style={{
              padding: 0,
            }}
            groupVideos={groupVideos}
            videoSrc="/clientassets-cunxin-saas/portal/videos/gallery.mp4"
            handleClose={this.hideModal}
          />
        )}
      </div>
    );
  }
}

export default CollectionList;
