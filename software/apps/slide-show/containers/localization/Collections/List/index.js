import { List, Map, is } from 'immutable';
import React from 'react';
import { Link } from 'react-router-dom';

import FreeNotify from '@resource/components/freeNotify';
import VideoModal from '@resource/components/modals/GroupsVideoModal';

import equals from '@resource/lib/utils/compare';

import * as modalTypes from '@resource/lib/constants/modalTypes';
import { saasProducts } from '@resource/lib/constants/strings';
import { vedioGroupsStr } from '@resource/lib/constants/vedioGroupsString';

import getRemainDay from '@resource/lib/service/remainDay';

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
      showVideoModal: false,
      remainDay: {},
    };
  }

  componentDidMount() {
    const { boundProjectActions } = this.props;
    const { getSlideshowList } = boundProjectActions;
    const { urls } = this.props;
    const userId = this.props.userInfo.get('id');
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    getRemainDay({
      customer_id: userId,
      galleryBaseUrl,
      product_scope: saasProducts.slideshow,
    }).then(res => {
      this.setState({
        remainDay: res,
      });
    });
    getSlideshowList().then(() => {
      this.getPostCardList();
      this.setState({ isRequestCompleted: true });
    });
  }

  handleCreate = () => mainHandler.handleCreate(this);
  handleEdit = item => mainHandler.handleEdit(this, item);
  handleDelete = slideshowUid => mainHandler.handleDelete(this, slideshowUid);
  handleCopy = slideshowUid => mainHandler.handleCopy(this, slideshowUid);
  handleDownload = item => mainHandler.handleDownloadAndShare(this, item, 2);
  handleSharing = slideshowUid => mainHandler.handleDownloadAndShare(this, slideshowUid, 0);
  handleClick = slideshowUid => mainHandler.handleClick(this, slideshowUid);
  handleUpgrade = () => mainHandler.handleUpgrade(this);
  openTutorialVideo = type => mainHandler.openTutorialVideo(this, type);

  getPostCardList = () => {
    const { boundProjectActions } = this.props;
    boundProjectActions.getPostCardList();
  };

  toCheckoutPlan = () => {
    const { boundGlobalActions, urls } = this.props;
    const saasBaseUrl = urls.get('saasBaseUrl');
    boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
      product_id: saasProducts.slideshow,
      escapeClose: true,
      onClosed: () => {
        boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
        boundGlobalActions.getMySubscription(saasBaseUrl);
      },
    });
  };
  openVideoModal = () => {
    this.setState({
      showVideoModal: true,
    });
  };
  hideVideoModal = () => {
    this.setState({
      showVideoModal: false,
    });
  };

  render() {
    const { collectionList = List([]), urls = Map({}), history, mySubscription } = this.props; // eslint-disable-line new-cap
    const { isRequestCompleted, showVideoModal, remainDay } = this.state;
    const { is_subscribed, remain_days } = remainDay;
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
      // tip: t('SLIDESHOW_DESC_TIP'),
      desc: t('NO_SLIDESHOW_TIP'),
      iconText: t('NEW_SLIDESHOW'),
      // bottomButton: (
      //   <span className="video-btn" onClick={() => this.openTutorialVideo(2)}>
      //     {t('TUTORIAL_VIDEO')}
      //   </span>
      // ),
      handleClick: this.handleCreate,
    };
    const groupVideos = vedioGroupsStr('slideshow');
    const isNearLimit = is_subscribed && remain_days <= 5;

    const text = isNearLimit
      ? `您的动感MV付费版还剩${remain_days}天可用，到期后仅可使用免费功能，建议您尽快续费，查看`
      : '您当前为动感MV【免费版】，建议尽快购买付费版本享受更多功能，点击查看';

    return (
      <div className="collections-list slideshow-collection-container">
        <FreeNotify
          subscriptionInfo={mySubscription.toJS()}
          softwareType={saasProducts.slideshow}
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
                    window.location.href = '/software/account?tabs=3&itemTab=4';
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
          <span className="collection-label">{t('SLIDESHOWS')}</span>

          <div className="collection-btns">
            {/* <span className="video-btn" onClick={() => this.openTutorialVideo(1)}>
              {t('TUTORIAL_VIDEO')}
            </span> */}
            <span className="link" onClick={() => this.openVideoModal()}>
              新手教程
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
        {showVideoModal && (
          <VideoModal
            style={{
              padding: 0,
            }}
            groupVideos={groupVideos}
            videoSrc="/clientassets-cunxin-saas/portal/groupVideos/slideshow/动感MV快速入门.mp4"
            handleClose={this.hideVideoModal}
          ></VideoModal>
        )}
      </div>
    );
  }
}

export default CollectionList;
