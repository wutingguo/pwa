import classNames from 'classnames';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, { Component } from 'react';

import XLink from '@resource/components/XLink';
import { beforeEndClientLayout } from '@resource/components/modals/ClientLayoutModal/privateOperation';
import { queryLayoutRecord } from '@resource/components/modals/ClientLayoutModal/service';

import bus from '@resource/lib/utils/bus';
import { checkProjectBackgrounds, checkProjectCropRatio } from '@resource/lib/utils/checkProject';

import { PROOF_STATUS_MAP, comboSetTypes, orderType } from '@resource/lib/constants/strings';

import * as helper from '@resource/lib/project/helper';

import cartService from '@resource/pwa/services/cart';

import { timeFormat } from '@resource/websiteCommon/utils/timeFormat';

import { DEFAULT_COVER_IMAGE_URL } from '../../constants/apiUrl';
import {
  PRODUCTMAPS,
  customUnitLabelMap,
  disableCopyList,
  firstOrderProducts,
  newSuiteTypes,
} from '../../constants/strings';
import { getVirtualProjectData } from '../../utils/projectService';
import reviewProjectData from '../../utils/review';
import { template } from '../../utils/template';
import AlertModal from '../AlertModal';
import DoubleConfirmModal from '../DoubleConfirmModal';

import { getLinkParams, getRenderActionbar } from './handler/actionbar';
import editIcon from './icons/edit.png';
import switcherIcon from './icons/floder-switcher.png';

import './index.scss';

class ProjectListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subProjectsOpen: true,
      useDefaultCoverImage: false,
      isShowAlert: false,
      isShowDoubleConfirmModal: false,
      alertModalProps: {
        confirmBtnText: '确定',
        html: `
          <div style="margin-bottom: 20px;">温馨提示</div>
          <div style="text-indent: 30px; text-align: justify;">尊敬的客户，您的寸心影像专享会员尚未审核认证通过，认证通过后才能进行下单，如有疑问请联系销售经理：<br />021-50315335，感谢您的配合与支持！</div>
          `,
        actions: {
          handleClose: () => {
            this.setState({
              isShowAlert: false,
            });
          },
          handleOk: () => {
            this.setState({
              isShowAlert: false,
            });
          },
        },
      },
      orderAlertModalData: {
        isShow: false,
        text: t('PF_ORDER_TEXT'),
        confirmBtnText: t('OK'),
        actions: {
          handleOk: () => this.toogleOrderAlert({ isShow: false }),
          handleClose: () => this.toogleOrderAlert({ isShow: false }),
        },
      },
      delAlertModalData: {
        isShow: false,
        text: t('PF_DELETE_TEXT'),
        confirmBtnText: t('OK'),
        actions: {
          handleOk: () => this.toogleDeleteAlert({ isShow: false }),
          handleClose: () => this.toogleDeleteAlert({ isShow: false }),
        },
      },
      doubleConfirmModalProps: {},
      showMoreDownBox: false,
    };
    this.toogleSubProject = this.toogleSubProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.showShareModal = this.showShareModal.bind(this);
    this.getStatusText = this.getStatusText.bind(this);
    this.showChangeTitleModal = this.showChangeTitleModal.bind(this);
    this.showCloneProjectModal = this.showCloneProjectModal.bind(this);
    this.onCoverImageError = this.onCoverImageError.bind(this);
    this.onAddToCart = this.onAddToCart.bind(this);
    this.onExport = this.onExport.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.isBook = this.isBook.bind(this);
    this.reviewProject = this.reviewProject.bind(this);
    this.reviewAllProjectData = this.reviewAllProjectData.bind(this);
    this.getRenderActionbar = () => getRenderActionbar(this);
    this.excuteAddToCart = this.excuteAddToCart.bind(this);
    this.hideDoubleConfirmModal = this.hideDoubleConfirmModal.bind(this);
    this.showMoreDown = this.showMoreDown.bind(this);
    this.hideMoreDown = this.hideMoreDown.bind(this);
  }

  showMoreDown() {
    this.setState({
      showMoreDownBox: true,
    });
  }

  hideMoreDown() {
    this.setState({
      showMoreDownBox: false,
    });
  }

  toogleSubProject() {
    const { subProjectsOpen } = this.state;
    this.setState({
      subProjectsOpen: !subProjectsOpen,
    });
  }

  onEditClick(linkUrl) {
    const { itemData, history } = this.props;
    const { productType, projectId } = itemData;
    location.href = linkUrl;
    logEvent.addPageEvent({
      name: 'DesignerProjectList_Click_Edit',
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

  toogleOrderAlert = ({ isShow, text }) => {
    this.setState(state => {
      const { orderAlertModalData } = state;
      return Object.assign(orderAlertModalData, { isShow, text });
    });
  };

  toogleDeleteAlert = ({ isShow, text }) => {
    this.setState(state => {
      const { delAlertModalData } = state;
      return Object.assign(delAlertModalData, { isShow, text });
    });
  };

  isBook(type) {
    return PRODUCTMAPS.photobook.indexOf(type) !== -1;
  }

  onAddToCart() {
    const { itemData, baseUrl } = this.props;
    const { isAddingToCart } = this.state;
    const {
      proofStatus,
      isStandard,
      productType,
      isVirtualType,
      orderPath,
      editStatus,
      projectId,
      linkUrl,
    } = itemData;

    if (isAddingToCart) return;

    if (this.props.userInfo && !this.props.userInfo.isPlannerPlan) {
      this.setState({
        isShowAlert: true,
      });
      return;
    }

    if (proofStatus && proofStatus !== PROOF_STATUS_MAP.approved) {
      this.toogleOrderAlert({
        isShow: true,
        text: t('PF_ORDER_TEXT'),
      });
      return;
    }

    // if (isVirtualType && editStatus != 2 && newSuiteTypes.indexOf(productType) === -1) {
    //   window.alert('您的套系排版未完成，请排版完成后再加入购物车');
    //   return;
    // }

    const traceName = isStandard
      ? 'CN_YX_MyProject_Click_PurchaseChildProdcut(TaoxiOnly)'
      : 'CN_YX_MyProject_Click_AddToCart';
    // goTracker(`${traceName},${productType},${projectId}`);
    logEvent.addPageEvent({
      name: 'CN_YX_MyProject_Click_View',
      product: productType,
      projectId,
    });
    // 针对V2 书类产品判断空页提醒
    if (!isVirtualType && linkUrl.indexOf('designer') !== -1) {
      return this.reviewProject();
    }
    this.excuteAddToCart();
  }

  excuteAddToCart() {
    const { itemData, baseUrl } = this.props;
    const { orderPath } = itemData;

    if (__SINGLE_SPA__) {
      const body = this.getOrderBody(orderPath);
      bus.dispatchLoading(true);
      cartService.addToCart(body, baseUrl, { enableNotify: false }).then(
        () => {
          bus.dispatchLoading(false);
          this.props.history.push('/software/shopping-cart');
          // navigateToWwwOrSoftware('/shopping-cart.html', true);
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

  hideDoubleConfirmModal() {
    this.setState({
      isShowDoubleConfirmModal: false,
    });
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
    const reviewResult = await this.reviewAllProjectData();
    if (reviewResult.length) {
      const { emptyPageArray } = reviewResult[0];
      if (emptyPageArray && emptyPageArray.length) {
        this.setState({
          isShowDoubleConfirmModal: true,
          doubleConfirmModalProps: {
            isShown: true,
            okButtonText: '继续',
            cancelButtonText: '取消',
            confirmTitle: '重要提示',
            closeConfirmModal: this.hideDoubleConfirmModal,
            closeConfirmModalByX: this.hideDoubleConfirmModal,
            confirmMessage: (
              <div>
                您的作品中有<span className="red">空白页</span>
                ，空白页将打印在您的作品中，<span className="red">操作后不可恢复</span>
                ，若不需要空白页，请在编辑器中修改，请确认。
              </div>
            ),
            onOkClick: () => {
              this.hideDoubleConfirmModal();
              this.excuteAddToCart();
            },
            onCancelClick: () => {
              console.log('cancel ');
            },
          },
        });
      } else {
        this.excuteAddToCart();
      }
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
      exportProject(itemData);
    }
  }

  onExport() {
    const { itemData, exportProject } = this.props;
    const { productType } = itemData;
    const isThirdProject = helper.checkIsThirdProject(productType);
    //判断是否是实物单册，中台无法提供，只能通过前缀判断
    const isBook = itemData.productCode.split('_')[0] === 'PB';
    const eventName = isBook
      ? 'DesignerProjectList_Click_YXExport'
      : 'DesignerProjectList_Click_Export';
    window.logEvent.addPageEvent({
      name: eventName,
    });

    if (isThirdProject) {
      this.reviewNeedFixProjectData();
    } else {
      exportProject(itemData);
    }
  }

  async deleteProject() {
    const { itemData, deleteProject, boundGlobalActions, baseUrl } = this.props;
    const { proofStatus, layoutStatus, projectId } = itemData;

    if (proofStatus && proofStatus !== PROOF_STATUS_MAP.approved) {
      this.toogleDeleteAlert({
        isShow: true,
        text: t('PF_DELETE_TEXT'),
      });
      return;
    }
    if (layoutStatus === 1 || layoutStatus === 2) {
      const { data } = await queryLayoutRecord({ baseUrl, project_id: projectId });
      const { layout_status } = data;
      if (layout_status === 1 || layout_status === 2) {
        beforeEndClientLayout({ boundGlobalActions, baseUrl, project_id: projectId });
        return;
      }
    }
    deleteProject(itemData);
  }

  onCoverImageError() {
    this.setState({ useDefaultCoverImage: true });
  }

  showShareModal() {
    const { itemData, showShareModal } = this.props;
    const { productType, projectId } = itemData;

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

  getStatusText() {
    const { itemData, isSubProject } = this.props;
    const {
      nonPhysicalStatus,
      isInOrder,
      orderStatusName,
      checkStatus,
      isVirtualType,
      editStatus,
      sliceStatus,
      proofStatus,
      layoutStatus,
    } = itemData;
    if (proofStatus === PROOF_STATUS_MAP.waitForClient) {
      return {
        statusClassName: 'red',
        statusText: '作品排版中(等待客户回复)',
      };
    }
    if (layoutStatus === 1 || layoutStatus === 2) {
      return {
        statusClassName: 'red',
        statusText: '作品排版中(等待客户排版)',
      };
    }
    if (checkStatus === 2) {
      return {
        statusClassName: 'red',
        statusText: '订单处理中',
      };
    }
    if (sliceStatus === 1) {
      return {
        statusClassName: '',
        statusText: '作品出图中',
      };
    }
    if (sliceStatus === 2) {
      return {
        statusClassName: '',
        statusText: '作品出图成功',
      };
    }
    if (sliceStatus === 3) {
      return {
        statusClassName: 'red',
        statusText: '作品出图失败',
      };
    }
    if (!isSubProject && isInOrder) {
      return {
        statusClassName: '',
        statusText: orderStatusName,
      };
    }
    if (isVirtualType || isSubProject) {
      switch (editStatus) {
        case 0: {
          return {
            statusClassName: '',
            statusText: '未排版',
          };
        }
        case 1: {
          return {
            statusClassName: '',
            statusText: '作品排版中',
          };
        }
        case 2: {
          return {
            statusClassName: '',
            statusText: '排版已完成',
          };
        }
        default: {
          return {
            statusClassName: '',
            statusText: '未排版',
          };
        }
      }
    } else {
      return {
        statusClassName: '',
        statusText: nonPhysicalStatus || '作品排版中',
      };
    }
  }

  onClickCoverImage(href) {
    const { itemData, history } = this.props;
    const { productType, projectId } = itemData;

    if (!href) {
      return;
    }
    location.href = href;

    logEvent.addPageEvent({
      name: 'US_PC_MyProject_Click_View',
      product: productType,
      projectId,
    });
  }

  render() {
    const {
      subProjectsOpen,
      useDefaultCoverImage,
      isShowAlert,
      alertModalProps,
      isShowDoubleConfirmModal,
      doubleConfirmModalProps,
      orderAlertModalData,
      delAlertModalData,
    } = this.state;
    const {
      itemData,
      isSubProject,
      deleteProject,
      showShareModal,
      projectIndex,
      showCloneProjectModal,
      parentProductType,
      baseUrl,
      sortByTypeUpdate,
    } = this.props;
    const {
      projectId,
      projectName,
      coverImageUrl,
      skuName,
      createDate,
      productDisplayName,
      isOffLine,
      isVirtualType,
      updateDate,
      subProjectList,
      isStandard,
      productCode,
      productType,
      spec,
    } = itemData;
    const { sheetNumberRange } = spec || {};
    const { current = 0 } = sheetNumberRange || {};
    const isEnableCopy = disableCopyList.indexOf(productCode) === -1;

    // 后期不再往newSuiteTypes 里面添加产品,统一在comboSetTypes维护
    const newComboSets = [].concat.apply(Object.values(comboSetTypes), newSuiteTypes);
    const isBelongToNewSuit = newComboSets.indexOf(parentProductType) !== -1;

    const containerClass = classNames('project-item-container', {
      'sub-project': isSubProject,
    });
    const switcherIconClass = classNames('switcher-icon', {
      open: subProjectsOpen,
    });

    const createTime = timeFormat(createDate, 'yyyy-mm-dd HH:II');
    const updateTime = timeFormat(updateDate, 'yyyy-mm-dd HH:II');

    const coverImageLinkDisabled = isVirtualType || isStandard || isOffLine || isSubProject;
    const coverImageContainerClass = classNames('cover-image-container', {
      'square-cover': isSubProject,
      disabled: coverImageLinkDisabled,
    });
    const coverImageTitle = {
      title: coverImageLinkDisabled ? '' : '点击查看',
    };
    const linkParams = getLinkParams(this);
    const coverImageLink = coverImageLinkDisabled ? '' : linkParams.linkUrl;

    const { statusClassName, statusText } = this.getStatusText();

    const coverImageProps = {
      title: coverImageLinkDisabled ? '' : '点击查看',
      className: coverImageContainerClass,
      onClick: params => {
        this.onClickCoverImage(coverImageLink);
      },
    };
    const defaultImage = template(DEFAULT_COVER_IMAGE_URL, { baseUrl });

    return (
      <div className={containerClass}>
        {isShowAlert ? <AlertModal {...alertModalProps} /> : null}
        {orderAlertModalData.isShow && <AlertModal {...orderAlertModalData} />}
        {delAlertModalData.isShow && <AlertModal {...delAlertModalData} />}
        {isShowDoubleConfirmModal && <DoubleConfirmModal {...doubleConfirmModalProps} />}

        <div className="prime-project-item-container">
          <div className="cover-image-wrap">
            {isSubProject && <div className="subproject-index">{projectIndex + 1}</div>}
            <XLink {...coverImageProps}>
              <img
                className="cover-image"
                src={useDefaultCoverImage ? defaultImage : coverImageUrl || defaultImage}
                onError={this.onCoverImageError}
              />
            </XLink>
          </div>
          <div className="actions-container">{this.getRenderActionbar()}</div>
          <div className="project-desc-container">
            <div className="top-section">
              {isSubProject ? (
                <div>
                  <p className="project-desc-item ell fw500" title={productDisplayName}>
                    {productDisplayName}
                  </p>
                  <p className="project-desc-item displayname-dark ell" title={skuName}>
                    {skuName}
                  </p>
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
                  <p className="project-desc-item ell fw500" title={productDisplayName}>
                    {productDisplayName}
                  </p>
                ) : (
                  <p className="project-desc-item displayname-dark ell" title={skuName}>
                    {skuName}
                  </p>
                )
              ) : null}
              {/* 展示自定义spec的部分信息 */}
              {spec ? (
                <p
                  className="project-desc-item displayname-dark ell"
                  title={`${productDisplayName} ${spec.height} x ${spec.width} ${spec.unit}`}
                >
                  {`${productDisplayName}，${spec.height} x ${spec.width} ${
                    customUnitLabelMap[spec.unit] || spec.unit
                  }，${current}P（${current * 2}页）`}
                </p>
              ) : null}
              {createDate && !sortByTypeUpdate && (
                <p className="project-desc-item ell">创建时间: {createTime}</p>
              )}
              {updateDate && sortByTypeUpdate && (
                <p className="project-desc-item ell">修改时间: {updateTime}</p>
              )}
              {!isStandard && (
                <p className="project-desc-item ell">
                  <span>状态: </span>
                  <span className={statusClassName}>{statusText}</span>
                </p>
              )}
              {isSubProject && projectId && !isStandard && isEnableCopy && !isBelongToNewSuit && (
                <p className="project-desc-item ell clone-tip">*复制单品后可加入购物车，单独购买</p>
              )}
            </div>
          </div>
          {isOffLine && <div className="off-line-tip">抱歉，该产品已下架，请创建新作品!</div>}
        </div>
        {!isOffLine && isVirtualType && !isSubProject ? (
          <div className="subproject-switcher" onClick={this.toogleSubProject}>
            <span className="switcher">{subProjectsOpen ? '收起' : '展开'}</span>
            <img className={switcherIconClass} src={switcherIcon} />
          </div>
        ) : null}
        {!isOffLine && subProjectsOpen && !isSubProject && subProjectList.length ? (
          <div className="subproject-container">
            <div className="arrow-top" />
            {subProjectList.map((item, index) => {
              return (
                <ProjectListItem
                  key={index}
                  isSubProject
                  parentProductType={productType}
                  itemData={item}
                  projectIndex={index}
                  suiteId={projectId}
                  deleteProject={deleteProject}
                  showShareModal={showShareModal}
                  showCloneProjectModal={showCloneProjectModal}
                  baseUrl={this.props.baseUrl}
                  history={this.props.history}
                  sortByTypeUpdate={sortByTypeUpdate}
                  userInfo={this.props.userInfo}
                />
              );
            })}
          </div>
        ) : null}
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
