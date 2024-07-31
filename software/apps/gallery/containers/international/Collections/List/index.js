import Immutable from 'immutable';
import { isEqual } from 'lodash';
import React from 'react';

import UpgradeInfo from '@resource/components/UpgradeInfo';
import XPagePagination from '@resource/components/XPagePagination';

import fbqLogEvent from '@resource/lib/utils/saasfbqLogEvent';

import { productBundles, saasProducts } from '@resource/lib/constants/strings';

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
    this.collectionsRef = React.createRef();
    this.state = {
      isShowEmptyContent: false,
      isRequestCompleted: false,
      paginationInfo: {},
      searchText: '',
      maxOrdering: 0,
      portfolioConfig: {},
    };
  }

  componentDidMount() {
    window.logEvent.addPageEvent({
      name: 'GalleryCollection',
    });
    const qs = getQueryStringObj();
    if (qs.searchText) {
      this.setState({
        searchText: qs.searchText,
      });
    }
    this.getCollectionList(qs.searchText);
    this.getPortfolioConfig();
    // 获取优惠code 和结束时间
  }

  getPortfolioConfig = async () => {
    const {
      boundProjectActions,
      urls,
      userAuth: { customerId },
    } = this.props;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const that = this;
    boundProjectActions
      .getPortfolioConfig({ customer_id: customerId, galleryBaseUrl })
      .then(res => {
        const { data = {} } = res;
        that.setState({
          portfolioConfig: data,
        });
      });
  };

  getCollectionList = (searchText = '', current_page = 1) => {
    const { boundProjectActions, boundGlobalActions } = this.props;
    const qs = getQueryStringObj();
    const urlParams = buildUrlParmas({ ...qs, searchText });
    history.pushState(null, null, urlParams);
    boundProjectActions
      .getCollectionList(searchText, current_page)
      .then(res => {
        this.setState({
          isRequestCompleted: true,
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
  // changeFilter = data => {
  //   if (!data || !data.keyName) return;
  //   this.getCollectionList('', data.value);
  //   this.collectionsRef.current.scrollTop = 0;
  // };
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
    const { userInfo } = this.props;
    window.logEvent.addPageEvent({
      name: 'GalleryCollection_Click_NewCollections',
    });
    fbqLogEvent('click_Create', 'ws_gallery', userInfo);

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

  /**
   * 用户引导视频
   */
  openTutorialVideo = type => mainHandler.openTutorialVideo(this, type);

  //打开  弹窗表格
  openTablePriceModal = () => {
    const { boundProjectActions, boundGlobalActions } = this.props;
    let data = {
      tableTitle: 'Gallery Plan Comparison',
      product_id: saasProducts.gallery,
    };
    // debugger
    boundGlobalActions
      .getTablePriceList({ product_id: saasProducts.gallery })
      .then(res => {
        // console.log("res....",res)
        if (res.ret_code === 200000) {
          data.priceData = res.data;
          mainHandler.openTablePriceModal(this, data);
        }
        this.setState({ isRequestCompleted: true });
      })
      .catch(err => this.setState({ isRequestCompleted: true }));
  };

  renderUpgradeInfo = () => {
    const { mySubscription } = this.props;
    const { activityInformation, statusAndHistory } = mySubscription.toJS();
    if (!activityInformation || !statusAndHistory) return;
    const information = activityInformation.find(i => i.product_id === saasProducts.gallery);
    let showUpgrade = false;
    const { activity_desc, code, code_status, expired_time_display } = information || {};
    const { fee_current, fee_history } = statusAndHistory || {};
    if (fee_current) {
      showUpgrade = !fee_current.SAAS_BUNDLE && !fee_current.SAAS_GALLERY;
      productBundles.forEach(item => {
        if (fee_current[item.productId]) {
          const productsInBundle = item.included;
          const isSubscribed = productsInBundle.find(
            prod => prod.productId === saasProducts.gallery
          );
          showUpgrade = !isSubscribed;
        }
      });
    }
    let showCode = false;
    if (code && fee_current) {
      showCode = code_status === 0 && !fee_current.SAAS_BUNDLE && !fee_history.SAAS_GALLERY;
    }
    if (localStorage.getItem('hide_zg_banner')) {
      showCode = false;
    }
    const param = {
      id: saasProducts.gallery,
      showUpgrade,
      text: 'Upgrade to Gallery Paid Plans for advanced features such as Unlimited Storage, Remove Zno Branding From Client Gallery, Full Resolution Download and',
      url: '/saascheckout.html?level=20&cycle=1&product_id=SAAS_GALLERY',
      eventName: 'GalleryUpgradeBanner_Click_Upgrade',
      showCode,
      code,
      expired_time: expired_time_display,
      codeDesc: `${activity_desc}, Ends`,
      onClick: id => {
        this.openTablePriceModal();
      },
    };

    // console.log("gallery-param...",param)
    return <UpgradeInfo {...param} />;
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
  doClearSearch = () => {
    const { searchText, isLoadingProject } = this.state;
    if (isLoadingProject) return;
    localStorage.setItem('collectListSeartext', '');
    this.getCollectionList('', 1);
    this.setState({
      searchText: '',
    });
  };

  handleViewLink = () => {
    const { collectionsSettings } = this.props;
    const { portfolioConfig } = this.state;
    const domainName = portfolioConfig?.portfolio_link || '';
    if (!portfolioConfig?.portfolio_status) {
      this.props.history.push({
        pathname: '/software/gallery/settings',
      });
    }
    if (portfolioConfig?.portfolio_status && domainName) {
      window.logEvent.addPageEvent({
        name: 'Gallery_List_Click_ViewPortfolio',
      });
      const link = domainName.startsWith('https://')
        ? domainName
        : `${window.location.protocol}//${domainName}`;
      window.open(link, '_blank');
    }
  };

  render() {
    const {
      collectionList = Immutable.List([]),
      envUrls = Immutable.Map({}),
      boundProjectActions,
    } = this.props;

    const { isRequestCompleted, paginationInfo, searchText } = this.state;
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
      tip: searchText ? '' : t('GALLERY_DESC_TIP'),
      desc: searchText ? 'No collections found.' : t('NO_COLLECTIONS_TIP'),
      iconText: t('NEW_COLLECTIONS'),
      bottomButton: (
        <span className="video-btn" onClick={() => this.openTutorialVideo(2)}>
          {t('TUTORIAL_VIDEO')}
        </span>
      ),
      handleClick: this.handleCreate,
    };
    const imageSortActionBarProps = {
      changeSort: async value => {
        await boundProjectActions.sortCollectionList(value.rule);
        this.getCollectionList('', 1);
      },
      trackEvent: config => {},
    };

    return (
      <div className="collections-list">
        {this.renderUpgradeInfo()}
        <div className="collection-header">
          <span className="collection-label">{t('COLLECTIONS')}</span>
          <div className="collection-btns">
            <span className="video-btn" onClick={() => this.handleViewLink()}>
              {t('SHOW_ON_PORTFOLIO_TIP_LINK')}
              <XIcon type="share" iconWidth={16} iconHeight={16} />
            </span>
            <span className="video-btn" onClick={() => this.openTutorialVideo(1)}>
              {t('TUTORIAL_VIDEO')}
            </span>
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
              placeholder="Search"
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
          <div className="collection-container" ref={this.collectionsRef}>
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
      </div>
    );
  }
}

export default CollectionList;
