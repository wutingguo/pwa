import { List, Map, is } from 'immutable';
import { isEqual } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';

import UpgradeInfo from '@resource/components/UpgradeInfo';

import equals from '@resource/lib/utils/compare';

import { productBundles, saasProducts } from '@resource/lib/constants/strings';

import { EmptyContent, XCardList, XIcon, XPureComponent } from '@common/components';

import CollectionCard from '@apps/slide-show/components/CollectionCard';

import mainHandler from './handle/main';

import './index.scss';

class CollectionList extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowEmptyContent: false,
      isRequestCompleted: false,
    };
  }

  componentDidMount() {
    window.logEvent.addPageEvent({
      name: 'GalleryCollection',
    });

    const { boundProjectActions, boundGlobalActions } = this.props;
    const { addNotification } = boundGlobalActions;
    const { getSlideshowList } = boundProjectActions;
    getSlideshowList()
      .then(() => {
        this.setState({ isRequestCompleted: true });
        const { storageStatus } = this.props;
        const maxSize = storageStatus.get('maxSize');
        const usageSize = storageStatus.get('usageSize');
        const reachStorageLimit = storageStatus.get('reachStorageLimit');
        if (reachStorageLimit) {
          addNotification({
            children: (
              <span className="upgrade-wrap" onClick={this.handleUpgrade}>
                {t('', { usageSize, maxSize })}
                <a
                  className="upgrade-link"
                  href={`/saascheckout.html?from=saas&product_id=${saasProducts.slideshow}`}
                >
                  {t('SLIDESHOW_STORAGE_TIP_UPGRADE')}
                </a>
              </span>
            ),
            level: 'error',
            // dismissible: 'button',
            autoDismiss: 60,
            uid: 'storageLimit',
          });
        }
      })
      .catch(err => this.setState({ isRequestCompleted: true }));

    if (__isCN__) {
      this.getPostCardList();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { boundGlobalActions } = this.props;
    const { addNotification } = boundGlobalActions;
    const isEqual = equals(nextProps.storageStatus, this.props.storageStatus);
    if (!isEqual) {
      const { storageStatus } = nextProps;
      const maxSize = storageStatus.get('maxSize');
      const usageSize = storageStatus.get('usageSize');
      const reachStorageLimit = storageStatus.get('reachStorageLimit');
      if (reachStorageLimit) {
        addNotification({
          children: (
            <span className="upgrade-wrap" onClick={this.handleUpgrade}>
              {t('SLIDESHOW_STORAGE_LIMIT_TIP', { usageSize, maxSize })}
              <a
                className="upgrade-link"
                href={`/saascheckout.html?from=saas&product_id=${saasProducts.slideshow}`}
              >
                {t('SLIDESHOW_SHARE_UPGRADE')}
              </a>
            </span>
          ),
          level: 'error',
          // dismissible: 'button',
          autoDismiss: 60,
          uid: 'storageLimit',
        });
      }
    }
  }

  handleCreate = () => mainHandler.handleCreate(this);
  handleEdit = item => mainHandler.handleEdit(this, item);
  handleDelete = slideshowUid => mainHandler.handleDelete(this, slideshowUid);
  handleCopy = slideshowUid => mainHandler.handleCopy(this, slideshowUid);
  handleDownload = item => mainHandler.handleDownloadAndShare(this, item, 1);
  handleSharing = slideshowUid => mainHandler.handleDownloadAndShare(this, slideshowUid, 0);
  handleClick = slideshowUid => mainHandler.handleClick(this, slideshowUid);
  handleUpgrade = () => mainHandler.handleUpgrade(this);
  openTutorialVideo = type => mainHandler.openTutorialVideo(this, type);

  getPostCardList = () => {
    const { boundProjectActions } = this.props;
    boundProjectActions.getPostCardList();
  };

  //打开  弹窗表格
  openTablePriceModal = () => {
    const { boundProjectActions, boundGlobalActions } = this.props;
    let data = {
      tableTitle: 'SlideShow Plan Comparison',
      product_id: saasProducts.slideshow,
    };
    boundGlobalActions
      .getTablePriceList({ product_id: saasProducts.slideshow })
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
    const information = activityInformation.find(i => i.product_id === saasProducts.slideshow);
    let showUpgrade = false;
    const { activity_desc, code, code_status, expired_time_display } = information || {};
    const { fee_current, fee_history } = statusAndHistory || {};
    if (fee_current) {
      showUpgrade = !fee_current.SAAS_BUNDLE && !fee_current.SAAS_SLIDE_SHOW;
      productBundles.forEach(item => {
        if (fee_current[item.productId]) {
          const productsInBundle = item.included;
          const isSubscribed = productsInBundle.find(
            prod => prod.productId === saasProducts.slideshow
          );
          showUpgrade = !isSubscribed;
        }
      });
    }
    let showCode = false;
    if (code && fee_current) {
      showCode =
        code_status === 0 &&
        !fee_current[saasProducts.bundle] &&
        !fee_history[saasProducts.slideshow];
    }

    const param = {
      id: saasProducts.slideshow,
      showUpgrade,
      text: 'Upgrade to Slideshow Paid Plans for advanced features such as Unlimited Storage, 4K Download, Watermark Free Slideshows and',
      url: '/saascheckout.html?level=20&cycle=1&product_id=SAAS_SLIDE_SHOW',
      eventName: 'SlideshowUpgradeBanner_Click_Upgrade',
      code,
      expired_time: expired_time_display,
      codeDesc: `${activity_desc}, Ends`,
      showCode,
      onClick: () => {
        this.openTablePriceModal();
      },
    };

    // console.log('slid-param...', param);
    return <UpgradeInfo {...param} />;
  };
  render() {
    const { collectionList = List([]), urls = Map({}), history } = this.props; // eslint-disable-line new-cap
    const { isRequestCompleted } = this.state;
    const isShowEmptyContent = isRequestCompleted && !collectionList.size;

    const cardListProps = {
      items: collectionList,
      galleryBaseUrl: urls.get('galleryBaseUrl'),
      handleClick: this.handleClick,
      handleEdit: this.handleEdit,
      handleDelete: this.handleDelete,
      handleCopy: this.handleCopy,
      handleDownload: this.handleDownload,
      handleSharing: this.handleSharing,
      renderCard: data => <CollectionCard {...data} history={history} />,
    };

    const emptyContentProps = {
      tip: t('SLIDESHOW_DESC_TIP'),
      desc: t('NO_SLIDESHOW_TIP'),
      iconText: t('NEW_SLIDESHOW'),
      bottomButton: (
        <span className="video-btn" onClick={() => this.openTutorialVideo(2)}>
          {t('TUTORIAL_VIDEO')}
        </span>
      ),
      handleClick: this.handleCreate,
    };

    return (
      <div className="collections-list">
        {this.renderUpgradeInfo()}
        <div className="collection-header">
          <span className="collection-label">{t('SLIDESHOWS')}</span>

          <div className="collection-btns">
            <span className="video-btn" onClick={() => this.openTutorialVideo(1)}>
              {t('TUTORIAL_VIDEO')}
            </span>
            <XIcon
              type="add"
              iconWidth={12}
              iconHeight={12}
              theme="black"
              title={t('NEW_SLIDESHOW')}
              text={t('NEW_SLIDESHOW')}
              onClick={this.handleCreate}
            />
          </div>
        </div>

        {collectionList && collectionList.size ? (
          <div className="collection-container">
            <XCardList {...cardListProps} />
          </div>
        ) : null}
        {isShowEmptyContent ? <EmptyContent {...emptyContentProps} /> : null}
      </div>
    );
  }
}

export default CollectionList;
