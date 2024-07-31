import reviewProjectData from 'appsCommon/utils/review';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, { Component } from 'react';

import XLink from '@resource/components/XLink';

import bus from '@resource/lib/utils/bus';
import { checkProjectBackgrounds, checkProjectCropRatio } from '@resource/lib/utils/checkProject';
import { getLanguageCode } from '@resource/lib/utils/language';

import { PROOF_STATUS_MAP, orderType } from '@resource/lib/constants/strings';

import * as helper from '@resource/lib/project/helper';

import { addToCart, checkIsNeedConvert } from '@resource/pwa/services/cart';

import { disableCopyList } from '../../../constants/strings';
import { getImageByLanguage } from '../../../utils/img';
import { getVirtualProjectData } from '../../../utils/projectService';
import AlertModal from '../../AlertModal';

import { getLinkParams, getRenderActionbar } from './handler/actionbar';
import editIcon from './icons/edit_icon.png';
import switcherIcon from './icons/floder-switcher.png';

import './index.scss';

class ProjectListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderAlertModalData: {
        isShow: false,
        text: t('DS_ORDER_TEXT'),
        confirmBtnText: t('OK'),
        actions: {
          handleOk: () => this.toogleOrderAlert({ isShow: false }),
          handleClose: () => this.toogleOrderAlert({ isShow: false }),
        },
      },
      delAlertModalData: {
        isShow: false,
        text: t('DS_DELETE_TEXT'),
        confirmBtnText: t('OK'),
        actions: {
          handleOk: () => this.toogleDeleteAlert({ isShow: false }),
          handleClose: () => this.toogleDeleteAlert({ isShow: false }),
        },
      },
      isAddingToCart: false,
      subProjectsOpen: true,
      useDefaultCoverImage: false,
      isShowOrderPendingText: false,
    };
    this.toogleSubProject = this.toogleSubProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.showShareModal = this.showShareModal.bind(this);
    this.getStatusText = this.getStatusText.bind(this);
    this.showChangeTitleModal = this.showChangeTitleModal.bind(this);
    this.showCloneProjectModal = this.showCloneProjectModal.bind(this);
    this.onCoverImageError = this.onCoverImageError.bind(this);
    this.onAddToCart = this.onAddToCart.bind(this);
    this.onAddParentBookToCart = this.onAddParentBookToCart.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.getRenderActionbar = () => getRenderActionbar(this);
    this.showErrTip = this.showErrTip.bind(this);
    this.hideErrTip = this.hideErrTip.bind(this);
    this.onClickCoverImage = this.onClickCoverImage.bind(this);
    this.getCoverImageLinkIsDisabled = this.getCoverImageLinkIsDisabled.bind(this);
    this.onExport = this.onExport.bind(this);
    this.reviewProject = this.reviewProject.bind(this);
    this.reviewAllProjectData = this.reviewAllProjectData.bind(this);
    this.excuteAddToCart = this.excuteAddToCart.bind(this);
  }

  toogleDeleteAlert = ({ isShow, text }) => {
    this.setState(state => {
      const { delAlertModalData } = state;
      return Object.assign(delAlertModalData, { isShow, text });
    });
  };

  toogleOrderAlert = ({ isShow, text }) => {
    this.setState(state => {
      const { orderAlertModalData } = state;
      return Object.assign(orderAlertModalData, { isShow, text });
    });
  };

  toogleSubProject() {
    const { subProjectsOpen } = this.state;
    this.setState({
      subProjectsOpen: !subProjectsOpen,
    });
  }

  onEditClick(linkUrl, logEventName) {
    const { itemData } = this.props;
    const { productType, projectId } = itemData;
    console.log('linkUrl: ', linkUrl);
    window.location.href = linkUrl;
    // navigateToWwwOrDesigner(linkUrl);
    // goTracker(`CN_YX_MyProject_Click_View,${productType},${projectId}`);
    logEvent.addPageEvent({
      name: logEventName,
      product: productType,
      projectId,
    });
  }

  getOrderBody(orderPath) {
    // "/commonProduct/addShoppingCart.html?projectGUID=826154&skuCode="
    // 提取. projectGUID=826154&skuCode=
    const params = qs.parse(orderPath.slice(orderPath.indexOf('?') + 1));
    const {
      projectGUID: project_guid,
      isParentBook: is_parent_book,
      crossSell: cross_sell,
      defaultQuantity: default_quantity,
    } = params;

    return {
      order_type: orderType,
      project_guid,
      is_parent_book,
      cross_sell,
      default_quantity: default_quantity || 1,
    };
  }

  async onAddToCart() {
    const { itemData, showUpgradeProjectAlert, baseUrl } = this.props;
    const { isAddingToCart } = this.state;
    const {
      proofStatus,
      inDesignService,
      isStandard,
      productType,
      isVirtualType,
      orderPath,
      editStatus,
      projectId,
    } = itemData;
    if (isAddingToCart) return;

    if (inDesignService || (proofStatus && proofStatus !== PROOF_STATUS_MAP.approved)) {
      this.toogleOrderAlert({
        isShow: true,
        text: inDesignService ? t('DS_ORDER_TEXT') : t('PF_ORDER_TEXT'),
      });
      return;
    }

    // 检测是否老项目需要转换
    const isNeedConvert = await checkIsNeedConvert(projectId, baseUrl);
    if (isNeedConvert) {
      const linkParams = getLinkParams(this);
      return this.onEditClick(linkParams.linkUrl);
    }

    // 【【Bug转需求】【US】在my projects中点击Flex项目的order reorder,不应该添加到购物车，应该进入H5编辑器】
    // https://www.tapd.cn/21244281/prong/stories/view/1121244281001028002
    if (productType === 'PB') {
      const linkParams = getLinkParams(this);
      showUpgradeProjectAlert(linkParams.linkUrl);
      return;
    }
    // if (isVirtualType && editStatus != 2) {
    //   window.alert('您的套系排版未完成，请排版完成后再加入购物车');
    //   return;
    // }

    // const traceName = isStandard ? 'CN_YX_MyProject_Click_PurchaseChildProdcut(TaoxiOnly)' : 'CN_YX_MyProject_Click_AddToCart';
    // goTracker(`${traceName},${productType},${projectId}`);
    logEvent.addPageEvent({
      name: 'DesignerProjectList_Click_Order',
      product: productType,
      projectId,
    });
    this.setState({
      isAddingToCart: true,
    });
    return this.reviewProject();
  }
  async reviewAllProjectData() {
    const { itemData, baseUrl, userInfo } = this.props;
    const { projectId } = itemData;
    const { uidPk: userId, securityToken, timestamp } = userInfo;

    const params = {
      baseUrl,
      userId,
      projectId,
      securityToken,
      timestamp,
    };
    const verifyResult = [];
    try {
      const res = await getVirtualProjectData(params);
      if (res && res.projectList) {
        const { projectList } = res;
        projectList.forEach(projectItem => {
          const { project, images = [] } = projectItem;
          const params = {
            imageArray: images,
            project,
          };
          const result = reviewProjectData({
            ...params,
            isEditParentBook: false,
          });
          verifyResult.push(result);
        });
      }
    } catch (e) {
      console.log('e', e);
    }
    return verifyResult;
  }
  async reviewProject() {
    const { boundGlobalActions, itemData, userInfo } = this.props;
    const { uidPk: customerId } = userInfo;
    const { projectId } = itemData;
    const reviewResult = await this.reviewAllProjectData();
    let checkCoverAndSheet = false;
    let [blankSheetNum, blankCoverNum] = [0, 0];
    const isCloudZno = location.host.includes('cloud.zno.com');
    if (reviewResult.length) {
      const { emptyPageArray, cover } = reviewResult[0];
      let message = '';
      checkCoverAndSheet = !!blankSheetNum || !!blankCoverNum;
      blankSheetNum += emptyPageArray.length || 0;
      blankCoverNum += cover.length || 0;
      const prefix = 'There are ';
      const and = ' and ';
      const [blankSheetMsg, blankCoverMsg, commonMsg] = [
        `${blankSheetNum} blank sheet(s)`,
        `${blankCoverNum} blank cover`,
        ' in your book. We will print and assemble your blank pages into your book. Would you like to continue?',
      ];
      // 空白页+空白封面
      if (blankSheetNum && blankCoverNum) {
        message = prefix + blankSheetMsg + and + blankCoverMsg + commonMsg;
      } else if (blankSheetNum) {
        // // 空白页
        message = prefix + blankSheetMsg + commonMsg;
      } else if (blankCoverNum) {
        // 空白封面
        message = prefix + blankCoverMsg + commonMsg;
      }
      if (emptyPageArray && emptyPageArray.length) {
        logEvent.addPageEvent({
          name: 'US_PC_MyProjects_Appear_BlankSheetPopUp',
          entrance: isCloudZno ? 'cloud' : 'zno',
          projectId,
          customerId,
        });
        const data = {
          close: () => {
            boundGlobalActions.hideConfirm();
            if (!__isCN__) {
              logEvent.addPageEvent({
                name: 'US_PC_MyProjects_Click_BlankSheetClose',
                entrance: isCloudZno ? 'cloud' : 'zno',
                projectId,
                customerId,
              });
            }
            this.setState({
              isAddingToCart: false,
            });
          },
          btnOpenClose: true,
          showRemindOption: true,
          remindOptionConfig: {
            text: 'I have read, understood, and agree to the above.',
          },
          className: 'review-project-confirm',
          message,
          buttons: [
            {
              text: t('CANCEL'),
              className: 'white',
              onClick: () => {
                if (!__isCN__) {
                  logEvent.addPageEvent({
                    name: 'US_PC_MyProjects_Click_BlankSheetCancel',
                    entrance: isCloudZno ? 'cloud' : 'zno',
                    projectId,
                    customerId,
                  });
                }
                boundGlobalActions.hideConfirm();
                this.setState({
                  isAddingToCart: false,
                });
              },
            },
            {
              className: 'black',
              text: t('CONTINUE'),
              disabled: true,
              onClick: () => {
                if (!__isCN__) {
                  logEvent.addPageEvent({
                    name: 'US_PC_MyProjects_Click_BlankSheetContinue',
                    entrance: isCloudZno ? 'cloud' : 'zno',
                    projectId,
                    customerId,
                  });
                }
                this.excuteAddToCart();
              },
            },
          ],
          logEventFn: () => {
            logEvent.addPageEvent({
              name: 'US_PC_MyProjects_Click_BlankSheetCheckbox',
              entrance: isCloudZno ? 'cloud' : 'zno',
              projectId,
              customerId,
            });
          },
        };
        boundGlobalActions.showConfirm(data);
      } else {
        this.excuteAddToCart();
      }
    }
  }
  excuteAddToCart() {
    const { itemData, baseUrl } = this.props;
    const { orderPath } = itemData;

    if (__SINGLE_SPA__) {
      const body = this.getOrderBody(orderPath);
      bus.dispatchLoading(true);
      addToCart(body, baseUrl, { enableNotify: false }).then(
        () => {
          bus.dispatchLoading(false);
          // this.props.history.push('/shopping-cart.html?from=saas')
          window.location.href = '/shopping-cart.html?from=saas';
        },
        err => {
          bus.dispatchLoading(false);
          bus.dispatchNotify({
            message: err,
            level: 'error',
            autoDismiss: 3,
          });
        }
      );
    } else {
      // 正常pc端页面的跳转.
      location.href = orderPath;
    }
  }

  async reviewNeedFixProjectData() {
    const { itemData, baseUrl, userInfo, boundGlobalActions, exportProject } = this.props;
    const { projectId } = itemData;
    const { uidPk: userId, securityToken, timestamp } = userInfo;
    const params = {
      baseUrl,
      userId,
      projectId,
      securityToken,
      timestamp,
    };
    const verifyResult = [];
    try {
      const res = await getVirtualProjectData(params);
      if (res && res.projectList) {
        const { projectList, projectInfo } = res;
        const { images, backgrounds, stickers } = projectInfo;
        for (let index = 0; index < projectList.length; index++) {
          const projectItem = projectList[index];
          const { project } = projectItem;
          let backgroundArrayJS = backgrounds;
          // 检测项目背景图数据是否有缺失
          const newBackgrounds = await checkProjectBackgrounds({
            pageArray: project.pages,
            backgroundArray: backgrounds,
            baseUrl,
          });
          if (newBackgrounds && newBackgrounds.length > 0) {
            // 修复项目背景图数据
            backgroundArrayJS = backgroundArrayJS.concat(newBackgrounds);
          }
          const result = checkProjectCropRatio({
            pageArray: project.pages,
            imageArray: images,
            backgroundArray: backgroundArrayJS,
            stickerArray: stickers,
            product: project.spec.product,
          });
          if (result.get('errorItems').size > 0) {
            verifyResult.push(result);
          }
        }
      }
    } catch (e) {
      console.log('e', e);
    }

    const linkParams = getLinkParams(this);
    if (verifyResult.length > 0) {
      const data = {
        className: 'fix-project-confirm-modal',
        close: boundGlobalActions.hideConfirm,
        message: t('FIX_PROJECT_GOTO_EDITOR_HINT'),
        buttons: [
          {
            text: t('FIX_PROJECT_GOTO_EDITOR'),
            onClick: () => this.onEditClick(linkParams.autofixlinkUrl),
          },
        ],
      };
      boundGlobalActions.showConfirm(data);
    } else {
      exportProject(itemData, baseUrl);
    }
  }

  onExport() {
    window.logEvent.addPageEvent({
      name: 'DesignerProjectList_Click_Export',
    });

    const { itemData, exportProject, baseUrl } = this.props;
    const { productType } = itemData;
    const isThirdProject = helper.checkIsThirdProject(productType);
    console.log('itemData', itemData);
    if (isThirdProject) {
      this.reviewNeedFixProjectData();
    } else {
      exportProject(itemData, baseUrl);
    }
  }

  async onAddParentBookToCart() {
    const { itemData, addParentBookToCart, baseUrl } = this.props;
    const { isStandard, productType, isVirtualType, parentBookOrderPath, editStatus, projectId } =
      itemData;

    // 检测是否老项目需要转换
    const isNeedConvert = await checkIsNeedConvert(projectId, baseUrl, true);
    if (isNeedConvert) {
      const linkParams = getLinkParams(this, true);
      return this.onEditClick(linkParams.linkUrl);
    }
    // if (isVirtualType && editStatus != 2) {
    //   window.alert('您的套系排版未完成，请排版完成后再加入购物车');
    //   return;
    // }

    // const traceName = isStandard ? 'CN_YX_MyProject_Click_PurchaseChildProdcut(TaoxiOnly)' : 'CN_YX_MyProject_Click_AddToCart';
    // goTracker(`${traceName},${productType},${projectId}`);
    logEvent.addPageEvent({
      name: 'DesignerProjectList_Click_Order',
      product: productType,
      projectId,
    });
    addParentBookToCart(itemData);
  }

  deleteProject() {
    logEvent.addPageEvent({
      name: 'DesignerProjectList_Click_Delete',
    });

    const { itemData, deleteProject } = this.props;
    const { proofStatus, inDesignService } = itemData;

    if (inDesignService || (proofStatus && proofStatus !== PROOF_STATUS_MAP.approved)) {
      this.toogleDeleteAlert({
        isShow: true,
        text: inDesignService ? t('DS_DELETE_TEXT') : t('PF_DELETE_TEXT'),
      });
      return;
    }
    deleteProject(itemData);
  }

  onCoverImageError() {
    this.setState({ useDefaultCoverImage: true });
  }

  showShareModal() {
    const { itemData, showShareModal } = this.props;
    const { productType, projectId } = itemData;
    // goTracker(`CN_YX_MyProject_Click_Share,${productType},${projectId}`);
    logEvent.addPageEvent({
      name: 'DesignerProjectList_Click_Share',
      product: productType,
      projectId,
    });
    showShareModal(itemData);
  }

  showChangeTitleModal() {
    const { showChangeTitleModal, itemData } = this.props;
    showChangeTitleModal && showChangeTitleModal(itemData);
  }

  showCloneProjectModal() {
    const { showCloneProjectModal, itemData } = this.props;
    showCloneProjectModal && showCloneProjectModal(itemData);
  }

  showErrTip() {
    this.setState({ isShowOrderPendingText: true });
  }

  hideErrTip() {
    this.setState({ isShowOrderPendingText: false });
  }

  getStatusText() {
    const { itemData, isSubProject } = this.props;
    const {
      nonPhysicalStatus,
      isInOrder,
      orderStatusName,
      checkStatus,
      proofStatus,
      isVirtualType,
      editStatus,
    } = itemData;
    if (checkStatus === 2) {
      return {
        statusClassName: 'red',
        statusText: t('ORDER_PENDING'),
      };
    }
    if (isInOrder) {
      return {
        statusClassName: '',
        statusText: orderStatusName,
      };
    }

    let statusText = t('PROJECT_STARTED');
    return {
      statusClassName: '',
      statusText: nonPhysicalStatus ? nonPhysicalStatus : statusText,
    };

    // let statusText = t('PROJECT_STARTED');
    // if(proofStatus === PROOF_STATUS_MAP.waitForShareFrom) {
    //   statusText += ` (${t('WAIT_FOR_PHOTOGRAPHER')})`;
    // }else if(proofStatus === PROOF_STATUS_MAP.waitForClient) {
    //   statusText += ` (${t('WAIT_FOR_CLIENT')})`;
    // }
    // return {
    //   statusClassName: '',
    //   statusText
    // };
  }

  getCoverImageLinkIsDisabled() {
    const { itemData, isSubProject } = this.props;
    const { isOffLine, isStandard, checkStatus } = itemData;

    return (isSubProject && checkStatus != 2) || isStandard || isOffLine;
  }

  onClickCoverImage({ target, href }) {
    const { itemData } = this.props;
    const { productType, projectId } = itemData;
    const isDisabled = this.getCoverImageLinkIsDisabled();
    if (!isDisabled) {
      location.href = href;
    }

    logEvent.addPageEvent({
      name: 'US_PC_MyProject_Click_View',
      product: productType,
      projectId,
    });
  }

  render() {
    const {
      delAlertModalData,
      orderAlertModalData,
      subProjectsOpen,
      useDefaultCoverImage,
      isShowOrderPendingText,
    } = this.state;
    const {
      itemData,
      isSubProject,
      deleteProject,
      showShareModal,
      projectIndex,
      showCloneProjectModal,
    } = this.props;
    const {
      projectId,
      projectName,
      coverImageUrl,
      skuName,
      createDate,
      createDateStr,
      productDisplayName,
      isOffLine,
      isVirtualType,
      updateDate,
      updateDateStr,
      subProjectList,
      isStandard,
      checkStatus,
      productCode,
      spec,
    } = itemData;
    const isEnableCopy = disableCopyList.indexOf(productCode) === -1;
    const containerClass = classNames('project-item-container', {
      'sub-project': isSubProject,
    });
    const switcherIconClass = classNames('switcher-icon', {
      open: subProjectsOpen,
    });

    const coverImageLinkDisabled = this.getCoverImageLinkIsDisabled();
    const coverImageContainerClass = classNames('cover-image-container', {
      'square-cover': isSubProject,
      disabled: coverImageLinkDisabled,
    });

    const linkParams = getLinkParams(this);
    const coverImageLink = coverImageLinkDisabled ? 'javascript: void(0)' : linkParams.linkUrl;

    const coverImageProps = {
      title: coverImageLinkDisabled ? '' : t('CLICK_TO_VIEW'),
      className: coverImageContainerClass,
      href: coverImageLink,
      useDefaultCoverImage,
      onClick: this.onClickCoverImage,
    };

    const { statusClassName, statusText } = this.getStatusText();

    const lang = getLanguageCode();
    let DEFAULT_COVER_IMAGE_URL = getImageByLanguage('defaultCoverImage', lang);
    const coverImageSrc = useDefaultCoverImage
      ? DEFAULT_COVER_IMAGE_URL
      : coverImageUrl || DEFAULT_COVER_IMAGE_URL;
    return (
      <div className={containerClass}>
        {orderAlertModalData.isShow && <AlertModal {...orderAlertModalData} />}
        {delAlertModalData.isShow && <AlertModal {...delAlertModalData} />}
        <div className="prime-project-item-container">
          <div className="cover-image-wrap">
            {isSubProject && <div className="subproject-index">{projectIndex + 1}</div>}
            <XLink {...coverImageProps}>
              <img className="cover-image" src={coverImageSrc} onError={this.onCoverImageError} />
            </XLink>
          </div>
          <div className="actions-container">{this.getRenderActionbar()}</div>
          <div className="project-desc-container">
            <div className="top-section">
              {isSubProject ? (
                <div>
                  <p
                    className="project-desc-item ell fw500"
                    title={productDisplayName}
                    dangerouslySetInnerHTML={{ __html: productDisplayName }}
                  />
                  <p
                    className="project-desc-item displayname-dark ell"
                    title={skuName}
                    dangerouslySetInnerHTML={{ __html: skuName }}
                  />
                </div>
              ) : (
                <div>
                  <p className="item-project-id">ID: {projectId}</p>
                  <div className="item-project-name-container">
                    <span className="item-project-name">{projectName}</span>
                    <img
                      className="modify-icon"
                      onClick={this.showChangeTitleModal}
                      src={editIcon}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="bottom-section">
              {!isSubProject && !spec ? (
                isVirtualType ? (
                  <p
                    className="project-desc-item ell fw500"
                    title={productDisplayName}
                    dangerouslySetInnerHTML={{ __html: productDisplayName }}
                  />
                ) : (
                  <p
                    className="project-desc-item displayname-dark ell"
                    title={skuName}
                    dangerouslySetInnerHTML={{ __html: skuName }}
                  />
                )
              ) : null}
              {/* 展示自定义spec的部分信息 */}
              {spec ? (
                <p
                  className="project-desc-item displayname-dark ell"
                  title={`${productDisplayName} ${spec.width} x ${spec.height} ${spec.unit}`}
                >
                  {`${productDisplayName}, ${spec.width} x ${spec.height} ${spec.unit}`}
                </p>
              ) : null}
              {createDate && (
                <p className="project-desc-item ell">{`${t('CREATION_DATE')}: ${createDateStr}`}</p>
              )}
              {!isStandard && (
                <p className="project-desc-item ell">
                  <span>{t('STATUS')}: </span>
                  <span className={statusClassName}>{statusText}</span>
                  {checkStatus === 2 && (
                    <a
                      className="order-err-tip"
                      onMouseOut={this.hideErrTip}
                      onMouseMove={this.showErrTip}
                    >
                      ?
                    </a>
                  )}
                </p>
              )}
              {updateDate && (
                <p className="project-desc-item ell">{`${t('LAST_EDIT')}: ${updateDateStr}`}</p>
              )}
              {isShowOrderPendingText && (
                <p className="order-pending-desc">{t('ORDER_PENDING_DESC')}</p>
              )}
              {/* {isSubProject && projectId && !isStandard && isEnableCopy && <p className="project-desc-item ell clone-tip">*复制单品后可加入购物车，单独购买</p>} */}
            </div>
          </div>

          {!isOffLine && isVirtualType && !isSubProject ? (
            <div className="subproject-switcher" onClick={this.toogleSubProject}>
              <span className="switcher">
                {subProjectsOpen ? t('COLLAPSE_ALL') : t('EXPAND_ALL')}
              </span>
              <img className={switcherIconClass} src={switcherIcon} />
            </div>
          ) : null}
        </div>

        {!isOffLine && subProjectsOpen && !isSubProject && subProjectList.length ? (
          <div className="subproject-container">
            <div className="arrow-top"></div>
            {subProjectList.map((item, index) => {
              return (
                <ProjectListItem
                  key={index}
                  isSubProject={true}
                  itemData={item}
                  projectIndex={index}
                  suiteId={projectId}
                  deleteProject={deleteProject}
                  showShareModal={showShareModal}
                  showCloneProjectModal={showCloneProjectModal}
                />
              );
            })}
          </div>
        ) : null}
        {isOffLine && !isSubProject && <div className="off-line-tip">{t('OFFLINE_TIP')}</div>}
      </div>
    );
  }
}

ProjectListItem.propTypes = {
  itemData: PropTypes.object.isRequired,
  isSubProject: PropTypes.bool,
  itemIndex: PropTypes.number,
  deleteProject: PropTypes.func,
  showShareModal: PropTypes.func,
};

ProjectListItem.defaultProps = {
  isSubProject: false,
  itemIndex: 0,
};
export default ProjectListItem;
