import Immutable from 'immutable';
import React from 'react';

import XExternalDropDirectory from '@resource/components/XExternalDropDirectory';
// import AddPreinstallModal from '@apps/aiphoto/components/AddPreinstallModal';
import XPagePagination from '@resource/components/XPagePagination';
import FreeNotify from '@resource/components/freeNotify';
// import VideoModal from '@resource/components/modals/VideoModal';
import VideoModal from '@resource/components/modals/GroupsVideoModal';

import * as modalTypes from '@resource/lib/constants/modalTypes';
import { aiphotoInfo, saasProducts } from '@resource/lib/constants/strings';
import { vedioGroupsStr } from '@resource/lib/constants/vedioGroupsString';

import { getAISubscribeLIST } from '@resource/pwa/services/subscription';

import { EmptyContent, XIcon, XPureComponent } from '@common/components';

import CollectionTable from '@apps/aiphoto/components/CollectionTable';
import { getUploadModalParams } from '@apps/aiphoto/components/ModalEntry/getParams';

import mainHandler from './handle/main';

import './index.scss';

let timer = null;

class CollectionList extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isRequestCompleted: false,
      isShowVideoModal: false,
      isShowPreinstall: false,
      paginationInfo: {
        currentPage: 1,
        totalPage: 1,
      },
      isBuy: true,
    };
    this.handleDelete = (...opt) => mainHandler.handleDelete(this, ...opt);
    this.handleClick = (...opt) => mainHandler.handleClick(this, ...opt);
    this.startCollectionImage = (...opt) => mainHandler.startCollectionImage(this, ...opt);
    this.endCollectionImage = (...opt) => mainHandler.endCollectionImage(this, ...opt);
    this.downCollectionImage = (...opt) => mainHandler.downCollectionImage(this, ...opt);
  }

  componentDidMount() {
    const { urls, userInfo, boundProjectActions } = this.props;
    const userId = userInfo.get('uidPk');
    const baseUrl = urls && urls.get('baseUrl');
    const params = {
      moduleCode: 'EDIT_IMAGE',
      baseUrl,
      customerId: userId,
    };
    if (userId && userId !== -1) {
      getAISubscribeLIST(params).then(res => {
        this.setState({
          isBuy: res.length > 1,
        });
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
    window.logEvent.addPageEvent({
      name: 'AiPhotos_Click_Creat',
    });
    mainHandler.handleCreate(this);
  };

  dorpCreate = (...opt) => {
    mainHandler.dorpCreate(this, ...opt);
  };

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

  openPreinstallModal = () => {
    window.logEvent.addPageEvent({
      name: 'AiPhotos_Click_Preset',
    });
    this.setState({
      isShowPreinstall: true,
    });
  };

  closePreinstallModal = () => {
    this.setState({
      isShowPreinstall: false,
    });
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
    const { boundGlobalActions, urls } = this.props;
    const saasBaseUrl = urls.get('saasBaseUrl');
    const curInfo = aiphotoInfo[1] || {};
    boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
      product_id: saasProducts.aiphoto,
      aiphotoParams: {
        ...curInfo,
        combos: aiphotoInfo.slice(1),
      },
      level: curInfo.level_id,
      cycle: curInfo.cycle_id,
      escapeClose: true,
      onClosed: () => {
        boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
        boundGlobalActions.getMySubscription(saasBaseUrl);
      },
    });
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

    const { isRequestCompleted, isShowVideoModal, isShowPreinstall, paginationInfo, isBuy } =
      this.state;
    const isShowEmptyContent = isRequestCompleted && !collectionList.size;

    const collectionTableProps = {
      collectionList,
      galleryBaseUrl: envUrls.get('galleryBaseUrl'),
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
      desc: t('暂无修片档案'),
      iconText: t('新建修片'),
      handleClick: this.handleCreate,
    };

    const preinstallModalProps = {
      galleryBaseUrl: envUrls.get('galleryBaseUrl'),
      handleClose: this.closePreinstallModal,
      effectsList: effectsList.toJS(),
    };

    const groupVideos = vedioGroupsStr('aiphoto');
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
              <div>
                您当前为智能修图【体验套餐-100张修图额度】，可在购买修图套餐后享更多修图张数
                <span
                  style={{
                    color: '#0077CC',
                    cursor: 'pointer',
                    marginLeft: 5,
                    textDecoration: 'underline',
                  }}
                  onClick={() => {
                    window.location.href = '/software/account?tabs=3&itemTab=3';
                  }}
                >
                  版本介绍
                </span>
              </div>
              <div className="btn" onClick={this.toCheckoutPlan}>
                立即购买
              </div>
            </div>
          </div>
        </FreeNotify>
        <div className="collection-header">
          <span className="collection-label">文件夹</span>
          <div className="wrapperCollection">
            <div className="tutorialVideo" onClick={this.openTutorialVideo}>
              新手教程
            </div>
            {/* <div className="preinstall" onClick={this.openPreinstallModal}>
              预设预览
            </div> */}
            <XIcon
              type="add"
              iconWidth={12}
              iconHeight={12}
              theme="black"
              title={t('新建修片')}
              text={t('新建修片')}
              onClick={this.handleCreate}
            />
          </div>
        </div>
        {!!collectionList && !!collectionList.size && <CollectionTable {...collectionTableProps} />}
        {isShowEmptyContent && (
          <>
            <EmptyContent {...emptyContentProps} />
            <div className="tutorialVideoEmpty">
              <span onClick={this.openTutorialVideo}>新手教程</span>
            </div>
            <div className="show-dorp-label">将文件夹拖拽到此处上传</div>
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
        {isShowVideoModal && (
          <VideoModal
            style={{
              padding: 0,
            }}
            groupVideos={groupVideos}
            videoSrc="/clientassets-cunxin-saas/portal/videos/aiphoto.mov"
            handleClose={this.hideModal}
          />
        )}
        {/* {isShowPreinstall && <AddPreinstallModal {...preinstallModalProps} />} */}
        {/*  外部文件上传 */}
        <XExternalDropDirectory {...externalDropProps} />
      </div>
    );
  }
}

export default CollectionList;
