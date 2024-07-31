import { cloneDeep, get } from 'lodash';

import {
  PACKAGE_LIST_BOX_MODAL,
  SHOW_TABLE_PRICE_MODAL,
  VIDEO_MODAL_STATUS,
} from '@resource/lib/constants/modalTypes';

import { EDIT_MODAL, NEW_COLLECTION_MODAL } from '@apps/gallery/constants/modalTypes';
import { galleryTutorialVideos } from '@apps/gallery/constants/strings';
import {
  CREATE_MODAL,
  RENAME_PRESET_MODAL,
  WEBSITE_ALERT_MODAL,
  WEBSITE_CUSTOM_MODAL,
  WEBSITE_TEMPLATE_MODAL,
} from '@apps/website/constants/modalTypes';

import {
  publishPollingStatus,
  publishStatus,
  publishStatusLabel,
  publishedStatus,
} from '../../../../../utils/strings';

const handleUpgrade = equityLevel => {
  const url = `${location.origin}/saascheckout.html?product_id=SAAS_WEBSITE&cycle=Annually&level=${equityLevel}&from=saas`;
  if (window) window.open(url, '_blank');
};

export const renderUpgradeReminderCont = list => {
  return (
    <div className="introduce">
      <div className="table w-full bg-[#f6f6f6] p-2 pl-6 pr-6">
        <div className="title flex flex-row border-b font-medium pl-8 pr-8 leading-10">
          <span className="basis-2/4">Your Current Plan Supports </span>
          <span className="basis-2/4">You Are About To Publish</span>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="body flex flex-row pl-8 pr-8 leading-10">
              <span className="basis-2/4">{item.plan}</span>
              <span className="basis-2/4">{item.current}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3">Upgrade your plan to publish or update your website.</div>
    </div>
  );
};

/**
 * 点击card，跳转详情
 * @param {*} that
 * @param {*} id
 */
const handleClick = (that, id) => {
  const { history, boundProjectActions } = that.props;

  boundProjectActions.resetDetail();
  history.push(`/software/gallery/collection/${id}/photos`);
};

/**
 * 创建 collection
 * @param {*} that
 */
const handleCreate = that => {
  const { boundGlobalActions } = that.props;
  const { hideModal, showModal } = boundGlobalActions;
  showModal(WEBSITE_TEMPLATE_MODAL);
};

/**
 * 编辑 website
 * @param {*} that
 * @param {*} item
 */

const handleEdit = (that, item) => {
  const { boundGlobalActions, boundProjectActions } = that.props;

  const { addNotification, hideModal, showModal } = boundGlobalActions;
  const { updateCollection } = boundProjectActions;
  that.props.history.push({
    pathname: `/software/website/editor?id=${item.id}&name=${item.website_name}`,
    query: {
      name: item.website_name,
      id: item.id,
    },
  });
};

const setList = (that, item) => {
  const { websiteList } = that.state;
  const newList = cloneDeep(websiteList);
  newList.forEach((element, index) => {
    if (element.id === item.id) {
      newList[index].publish_status = item.publish_status;
    }
  });
  that.setState({ websiteList: newList });
};

let timer = null;

// 轮询请求状态
const handlePublishStatusPolling = async (that, publish_record_code, item) => {
  const { boundProjectActions } = that.props;
  const { publishStatusPolling } = boundProjectActions;
  const { publish_status } = that.state;
  const ret = await publishStatusPolling(publish_record_code);
  const status = publishPollingStatus[ret.data.status];
  if (status !== 2) {
    setList(that, { ...item, publish_status: status });
    timer && clearInterval(timer);
    timer && clearTimeout(timer);
    return;
  }
  timer = setTimeout(() => {
    handlePublishStatusPolling(that, publish_record_code, item);
  }, 1000);
};

function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

const renderList = data => {
  const { customer_license_data, website_data, status } = data;
  const list = [];
  let equityLevel = 30;
  // customer_license_data -- 权益数据
  // website_data -- 实际数据
  if (
    isNumeric(customer_license_data?.page_count) &&
    Number(customer_license_data?.page_count) < Number(website_data?.page_count)
  ) {
    list.push({
      plan: `Up to ${customer_license_data?.page_count} Pages`,
      current: `${website_data?.page_count} Pages`,
    });
  }
  if (
    isNumeric(customer_license_data?.photo_count) &&
    Number(customer_license_data?.photo_count) < Number(website_data?.photo_count)
  ) {
    list.push({
      plan: `Up to ${customer_license_data?.photo_count} Photos`,
      current: `${website_data?.photo_count} Photos`,
    });
  }
  if (customer_license_data?.font_license < website_data?.font_license) {
    equityLevel = 40;
    list.push({
      plan: 'Orginal Font Pack',
      current: 'Modified Font Pack',
    });
  }
  if (customer_license_data?.color_license < website_data?.color_license) {
    equityLevel = 40;
    list.push({
      plan: 'Orginal Color Palette and Schemes',
      current: 'Modified Color Palette and Schemes',
    });
  }
  return { list, equityLevel };
};

const handlePublishSubInfo = async (that, id, type) => {
  const { boundProjectActions, boundGlobalActions } = that.props;
  const { publishSubInfo } = boundProjectActions;
  const { showModal } = boundGlobalActions;
  publishSubInfo(id).then(res => {
    const data = res.data;
    const { list, equityLevel } = renderList(data);
    const { customer_license_data, website_data, status } = data;
    if (type === 'domain' && customer_license_data.domain_license < website_data.domain_license) {
      showModal(WEBSITE_CUSTOM_MODAL, {
        that,
        singleBtn: true,
        title: 'Ready to Upgrade?',
        type: 'upgradeConfirm',
        okText: 'Upgrade',
        content:
          ' Use your own custom domain for your website. This feature is included in Zno Website Standard Plan and above. Upgrade for access to this feature and more.',
        close: () => boundGlobalActions.hideModal(WEBSITE_CUSTOM_MODAL),
        handleOk: () => handleUpgrade(equityLevel),
      });
      return status;
    }

    if (data) {
      showModal(WEBSITE_CUSTOM_MODAL, {
        that,
        singleBtn: true,
        title: 'Ready to Upgrade?',
        type: 'upgradeReminder',
        okText: 'Upgrade',
        width: 762,
        content: list,
        close: () => boundGlobalActions.hideModal(WEBSITE_CUSTOM_MODAL),
        handleOk: () => handleUpgrade(equityLevel),
      });
    }
  });
};

/**
 * 发布 collection
 * @param {*} that
 * @param {*} collectionUid
 */
const handlePublish = (that, item, cb) => {
  if (item.publish_status === 2) return false;
  window.logEvent.addPageEvent({
    name: 'WebsiteCollection_Click_publish',
  });

  const { boundGlobalActions, boundProjectActions, collectionList } = that.props;
  const { publishLoading } = that.state;

  const { addNotification, hideConfirm, showConfirm, getMySubscription, showModal } =
    boundGlobalActions;
  const { doPublish } = boundProjectActions;
  if (publishLoading) return false;
  doPublish(item.id).then(
    response => {
      const { ret_code, data, ret_msg } = response;
      if (ret_code === 200000 && data) {
        setList(that, { ...item, publish_status: 2 });
        handlePublishStatusPolling(that, data, item);
      } else if (response.ret_code === 400447) {
        handlePublishSubInfo(that, item.id);
      } else {
        // error handler
        addNotification({
          message: ret_msg,
          level: 'error',
          autoDismiss: 2,
        });
      }
      hideConfirm();
    },
    error => {
      addNotification({
        message: 'system Error',
        level: 'error',
        autoDismiss: 2,
      });
    }
  );
};

/**
 * 删除 collection
 * @param {*} that
 * @param {*} collectionUid
 */
const handleDelete = (that, item, cb) => {
  window.logEvent.addPageEvent({
    name: 'GalleryCollection_Click_Delete',
  });

  const { boundGlobalActions, boundProjectActions, collectionList } = that.props;
  const {
    paginationInfo: { current_page },
  } = that.state;

  const { addNotification, hideConfirm, showConfirm, getMySubscription } = boundGlobalActions;
  const { deleteCollection } = boundProjectActions;
  const collectionUid = item.get('enc_collection_uid');
  const collectionName = item.get('collection_name');

  const data = {
    className: 'delete-collection-modal',
    close: hideConfirm,
    title: `${t('DELETE_COLLECTION')}?`,
    message: t('DELETE_COLLECTION_TIP'),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'GalleryDeleteCollection_Click_Cancel',
          });

          hideConfirm();
        },
      },
      {
        className: 'pwa-btn',
        text: t('DELETE'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'GalleryDeleteCollection_Click_Delete',
          });

          deleteCollection(collectionUid).then(
            response => {
              const { ret_code } = response;
              if (ret_code === 200000) {
                addNotification({
                  message: t('COLLECTION_DELETE_SUCCESSED_TOAST', { collectionName }),
                  level: 'success',
                  autoDismiss: 2,
                });
                if (current_page !== 1 && collectionList.size === 1) {
                  that.getCollectionList('', current_page - 1);
                  return;
                }
                that.getCollectionList('', current_page);
                that.setState({
                  isShowEmptyContent: collectionList.size === 1,
                });
              } else {
                // error handler
                addNotification({
                  message: t('COLLECTION_DELETE_FAILED_TOAST', { collectionName }),
                  level: 'error',
                  autoDismiss: 2,
                });
              }
              hideConfirm();
            },
            error => {
              console.log(error);

              addNotification({
                message: t('COLLECTION_DELETE_FAILED_TOAST', { collectionName }),
                level: 'error',
                autoDismiss: 2,
              });
            }
          );
        },
      },
    ],
  };
  showConfirm(data);
};

const openTutorialVideo = (that, type) => {
  window.logEvent.addPageEvent({
    name: `Gallery_Click_Tutorial0${type}`,
  });
  const { boundGlobalActions } = that.props;
  const { showModal } = boundGlobalActions;

  showModal(VIDEO_MODAL_STATUS, {
    className: 'gallery-tutorial-wrapper',
    groupVideos: galleryTutorialVideos,
  });
};

// 打开 galerry 价格表
const openTablePriceModal = (that, data) => {
  const { boundGlobalActions } = that.props;
  const { showModal } = boundGlobalActions;
  const { priceData, tableTitle = '', product_id = '' } = data;
  showModal(PACKAGE_LIST_BOX_MODAL, {
    className: 'gallery-tutorial-wrapper',
    groupVideos: galleryTutorialVideos,
    priceData,
    tableTitle,
    product_id,
  });
};

export default {
  handleClick,
  handleCreate,
  handleEdit,
  handlePublish,
  handleDelete,
  openTutorialVideo,
  openTablePriceModal,
};
