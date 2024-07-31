import Immutable from 'immutable';
import React from 'react';

import XExternalDropDirectory from '@resource/components/XExternalDropDirectory';
import XPagePagination from '@resource/components/XPagePagination';
import FreeNotify from '@resource/components/freeNotify';

import fbqLogEvent from '@resource/lib/utils/saasfbqLogEvent';

import { aiphotoInfo, saasProducts } from '@resource/lib/constants/strings';

// import VideoModal from '@resource/components/modals/VideoModal';
import {
  checkRetoucherPriceIsDown,
  getAISubscribeLISTForZno,
} from '@resource/pwa/services/subscription';

import { EmptyContent, XIcon, XPureComponent } from '@common/components';

import { getUploadModalParams } from '@apps/aiphoto/components/ModalEntry/getParams';
import CollectionTable from '@apps/aiphoto/components/international/CollectionTable';

import mainHandler from './handle/main';

import './index.scss';

let timer = null;

class CollectionList extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isRequestCompleted: false,
      paginationInfo: {
        currentPage: 1,
        totalPage: 1,
      },
      isBuy: true,
      isRetoucherPriceDown: false,
    };
    this.handleDelete = (...opt) => mainHandler.handleDelete(this, ...opt);
    this.handleClick = (...opt) => mainHandler.handleClick(this, ...opt);
    this.startCollectionImage = (...opt) => mainHandler.startCollectionImage(this, ...opt);
    this.endCollectionImage = (...opt) => mainHandler.endCollectionImage(this, ...opt);
    this.downCollectionImage = (...opt) => mainHandler.downCollectionImage(this, ...opt);
    this.openTutorialVideo = type => mainHandler.openTutorialVideo(this, type);
  }

  async componentDidMount() {
    const { urls, userInfo, boundProjectActions } = this.props;
    const userId = userInfo.get('uidPk');
    const baseUrl = urls && urls.get('baseUrl');
    const params = {
      moduleCode: 'EDIT_IMAGE',
      baseUrl,
      customerId: userId,
    };
    if (userId && userId !== -1) {
      const list = await getAISubscribeLISTForZno(params);
      const isRetoucherPriceDown = await checkRetoucherPriceIsDown(baseUrl);
      this.setState({
        isBuy: list.length > 1,
        isRetoucherPriceDown,
      });
    }
    if (Number(userId) !== -1) {
      this.getCollectionList();
    }
    boundProjectActions.getPfcTopicEffects();

    this.doSetInterval();
  }

  componentDidUpdate(prevProps, prevState) {
    const oldId = prevProps.userInfo.get('id');
    const userId = this.props.userInfo.get('id');
    if (Number(oldId) === -1 && Number(userId) !== -1) {
      this.getCollectionList();
    }
  }

  componentWillUnmount() {
    clearInterval(timer);
    timer = null;
  }

  // 获取collection的详情.
  getCollectionDetail = encCollectionId => {
    const { boundProjectActions } = this.props;
    const { setDetailContentLoading } = boundProjectActions;
    setDetailContentLoading({ loading: true });
    return new Promise((resolve, reject) => {
      boundProjectActions.getCollectionProgress(encCollectionId).then(res => {
        boundProjectActions.updateCollectionId(encCollectionId);
        //获取图片
        boundProjectActions.getCollectionImageList(encCollectionId).then(list => {
          resolve(list);
        });
      });
    }).catch(() => {
      console.log('err');
    });
  };

  getCollectionList = pageNo => {
    const { boundProjectActions } = this.props;
    const {
      paginationInfo: { currentPage },
    } = this.state;
    const page = pageNo || currentPage;
    boundProjectActions
      .getCollectionList(page)
      .then(res => {
        this.setState({
          isRequestCompleted: true,
          paginationInfo: {
            currentPage: res.current,
            totalPage: res.pages,
          },
        });
      })
      .catch(err => this.setState({ isRequestCompleted: true }));
  };

  doSetInterval = () => {
    clearInterval(timer);
    timer = setInterval(() => {
      this.getCollectionList();
    }, 5000);
  };

  /**
   * 新增 collection
   */
  handleCreate = () => {
    const { userInfo } = this.props;
    window.logEvent.addPageEvent({
      name: 'AiPhotos_Click_Creat',
    });
    fbqLogEvent('click_Create', 'ws-retoucher', userInfo);
    mainHandler.handleCreate(this);
  };

  dorpCreate = (...opt) => {
    mainHandler.dorpCreate(this, ...opt);
  };

  changeFilter = data => {
    if (!data || !data.keyName) return;
    const { keyName, value } = data;
    const paginationInfo = Object.assign({}, this.state.paginationInfo, {
      [keyName]: value,
    });
    this.setState(
      {
        paginationInfo,
      },
      () => this.getCollectionList()
    );
  };

  toCheckoutPlan = () => {
    window.location.href = `/saascheckout.html?product_id=${saasProducts.retoucher}&plan_id=30&from=saas`;
  };

  render() {
    const {
      collectionList = Immutable.List([]),
      envUrls = Immutable.Map({}),
      boundGlobalActions,
      boundProjectActions,
      effectsList = Immutable.List([]),
      mySubscription,
      collectionDetail,
    } = this.props;

    const { isRequestCompleted, paginationInfo, isBuy, isRetoucherPriceDown } = this.state;
    const isShowEmptyContent = isRequestCompleted && !collectionList.size;

    const collectionTableProps = {
      collectionList,
      galleryBaseUrl: '/',
      boundGlobalActions,
      boundProjectActions,
      collectionDetail,
      handleClick: this.handleClick,
      handleDelete: this.handleDelete,
      startCollectionImage: this.startCollectionImage,
      endCollectionImage: this.endCollectionImage,
      downCollectionImage: this.downCollectionImage,
    };

    const emptyContentProps = {
      desc: t('EMPTY_COLLECTION'),
      iconText: t('NEW_COLLECTIONS'),
      handleClick: this.handleCreate,
      bottomButton: (
        <span className="video-btn" onClick={() => this.openTutorialVideo(2)}>
          {t('TUTORIAL_VIDEO')}
        </span>
      ),
    };

    // 外部文件上传
    const externalDropProps = {
      boundGlobalActions: {
        showModal: boundGlobalActions.showModal,
        addImages: boundProjectActions.addImages,
      },
      uploadParams: getUploadModalParams,
      acceptFileType: 'image/jpeg,image/jpg',
      creatFolders: (folderName, foldersFiles) => this.dorpCreate(folderName, foldersFiles),
    };
    return (
      <div className="ai-collections-list">
        <FreeNotify
          subscriptionInfo={mySubscription.toJS()}
          isBuy={isBuy}
          softwareType={saasProducts.aiphoto}
        >
          <div className="free-alert">
            <div className="content">
              <div className="tips">
                <p className="tips-line">{t('FREE_PACK_TIP')}</p>
                {isRetoucherPriceDown && (
                  <p className="tips-line">{t('ZR_PROMO_PAID_PACKS_TIPS')}</p>
                )}
              </div>
              <div className="btn" onClick={this.toCheckoutPlan}>
                {t('ORDER')}
              </div>
            </div>
          </div>
        </FreeNotify>
        <div className="collection-header">
          <span className="collection-label">{t('COLLECTIONS')}</span>
          <div className="wrapperCollection">
            <span className="video-btn" onClick={() => this.openTutorialVideo(1)}>
              {t('TUTORIAL_VIDEO')}
            </span>
            <XIcon
              type="add"
              iconWidth={12}
              iconHeight={12}
              theme="black"
              title={t('NEW_COLLECTION')}
              text={t('NEW_COLLECTION')}
              onClick={this.handleCreate}
            />
          </div>
        </div>
        {!!collectionList && !!collectionList.size && <CollectionTable {...collectionTableProps} />}
        {isShowEmptyContent && (
          <>
            <EmptyContent {...emptyContentProps} />
            <div className="show-dorp-label">{t('EXTERAL_DROP_TIP')}</div>
          </>
        )}
        <div className="pagination-container">
          {paginationInfo.totalPage > 1 && (
            <XPagePagination
              changeFilter={this.changeFilter}
              currentPage={paginationInfo.currentPage}
              totalPage={paginationInfo.totalPage}
            />
          )}
        </div>
        {/*  外部文件上传 */}
        <XExternalDropDirectory {...externalDropProps} />
      </div>
    );
  }
}

export default CollectionList;
