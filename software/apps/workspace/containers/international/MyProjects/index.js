import { fromJS } from 'immutable';
import { get, isEqual, merge, template } from 'lodash';
import React, { Component, Fragment } from 'react';

import UpgradeInfo from '@resource/components/UpgradeInfo';
import XPagePagination from '@resource/components/XPagePagination';

import { showTrialModal } from '@resource/lib/utils/modal';
import fbqLogEvent from '@resource/lib/utils/saasfbqLogEvent';
import { getQs } from '@resource/lib/utils/url';

import {
  CANCEL_EXPORT_URL,
  GET_CUSTOM_EXPORT_URL,
  GET_VIRTUAL_PROJECT_PROJECT,
} from '@resource/lib/constants/apiUrl';
import { exportErrorCode } from '@resource/lib/constants/exportErrorCode';
import * as modalTypes from '@resource/lib/constants/modalTypes';
import {
  EXPORT_TRIAL_MODAL,
  LABS_TRIAL_MODAL,
  PERMISSION_NAME_ENUM,
  productBundles,
  saasProducts,
} from '@resource/lib/constants/strings';

import XSelect from '@resource/websiteCommon/components/dom/XSelect';
import XShareModal from '@resource/websiteCommon/components/dom/modals/XShareModal';
import * as xhr from '@resource/websiteCommon/utils/xhr';

import AlertModal from '../../../components/AlertModal';
import TextInputModal from '../../../components/TextInputModal';
import ProjectListItem from '../../../components/en/ProjectListItem';
import {
  CLONE_PROJECT_BY_ID,
  DELETE_PROJECT,
  GET_PROJECT_FILTERS,
  GET_PROJECT_LIST,
  GET_SHARE_URLS,
  GET_US_PACKAGE_SHARE_URLS,
  SAVE_PROJECT_TITLE,
} from '../../../constants/apiUrl';
import { buildUrlParmas, getQueryStringObj } from '../../../utils/url';

import mainHandler from './handle/main';
import loadingGif from './images/loading.gif';
import searchIcon from './images/search.png';

import './index.scss';

const getHiddenProperty = () => {
  var hiddenProperty =
    'hidden' in document
      ? 'hidden'
      : 'webkitHidden' in document
      ? 'webkitHidden'
      : 'mozHidden' in document
      ? 'mozHidden'
      : null;
  return hiddenProperty;
};

export default class MyProjects extends Component {
  constructor(props) {
    super(props);

    this.parseUrlParams = this.parseUrlParams.bind(this);
    this.getProjectList = this.getProjectList.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.getShareUrls = this.getShareUrls.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
    this.showShareModal = this.showShareModal.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.getFilterOptions = this.getFilterOptions.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.closeTextInputModal = this.closeTextInputModal.bind(this);
    this.showChangeTitleModal = this.showChangeTitleModal.bind(this);
    this.changeProjectTitle = this.changeProjectTitle.bind(this);
    this.cloneProject = this.cloneProject.bind(this);
    this.showCloneProjectModal = this.showCloneProjectModal.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.doDeleteProject = this.doDeleteProject.bind(this);
    this.addParentBookToCart = this.addParentBookToCart.bind(this);
    this.doAddParentBookToCart = this.doAddParentBookToCart.bind(this);
    this.showAddParentBookAlert = this.showAddParentBookAlert.bind(this);
    this.showDeleteFailedAlert = this.showDeleteFailedAlert.bind(this);
    this.showDeleteNormalProjectAlert = this.showDeleteNormalProjectAlert.bind(this);
    this.showDeleteProjectInCartAlert = this.showDeleteProjectInCartAlert.bind(this);
    this.showUpdateTitleFailedAlert = this.showUpdateTitleFailedAlert.bind(this);
    this.showUpgradeProjectAlert = this.showUpgradeProjectAlert.bind(this);
    this.exportProject = this.exportProject.bind(this);
    this.showExportAlert = this.showExportAlert.bind(this);
    this.closeExportAlert = this.closeExportAlert.bind(this);
    this.toCreatProject = this.toCreatProject.bind(this);
    this.checkLevel = this.checkLevel.bind(this);
    this.inputedSearchRef = React.createRef();
    this.state = {
      filterParams: {
        currentPage: '1',
        isFlag: true,
        category: '',
        sortBy: '1',
        productName: '',
      },
      projectList: [],
      paginationInfo: {
        currentPage: 1,
        totalPage: 1,
      },
      categoryList: [],
      selectedCategory: null,
      sortByList: [],
      selectedSort: null,
      shareModalData: {
        isShow: false,
        znoUrl: '',
        anonymousUrl: '',
        projectId: '3223051',
        productType: 'V2_PAPERCOVERBOOK',
        baseUrl: this.getWWWorigin(),
        getShareUrls: this.getShareUrls,
        close: this.closeShareModal,
        urlCopyMessage: '',
        EmbedCopyMessage: '',
      },
      textInputModalData: {
        isShow: false,
        modalTitle: 'Change Project Title',
        textLabel: t('TITLE') + ':',
        placeholder: '',
        textValue: '',
        cancelText: t('CANCEL'),
        confirmText: t('SAVE'),
        Invalidation: /[~!@#$%^&*()/\|\\,.<>?"'();:+=\[\]{}]/,
        formatTip: t('SHARE_MODAL_FORMAT_TIP'),
        maxLength: 50,
        onConfirm: () => {
          console.log('确认修改作品');
        },
        closeModal: this.closeTextInputModal,
      },
      deleteAlertModalData: {
        isShow: false,
        text: t('SHARE_MODAL_DELETE_TEXT'),
        confirmBtnText: t('SHARE_MODAL_DELETE_BTN'),
        actions: {
          handleOk: this.closeDeleteAlert,
          handleClose: this.closeDeleteAlert,
        },
      },
      exportAlertModalData: {
        isShow: false,
        text: t('EXPORT_MODAL_GENERATING_TEXT'),
        confirmBtnText: t('EXPORT_MODAL_GENERATING_BTN'),
        actions: {
          handleOk: this.closeDeleteAlert,
          handleClose: this.closeDeleteAlert,
        },
      },
      searchText: '',
      inputedSearchText: '',
      isLoadingProject: true,
      isCloningProject: false,
      deletingItem: {},
    };
  }

  /**
   * 用户引导视频
   */
  openTutorialVideo = type => mainHandler.openTutorialVideo(this, type);
  componentDidMount() {
    const productName = getQs('productName');
    if (productName) {
      this.changeFilter({
        keyName: 'productName',
        value: productName,
      });
    } else {
      this.getProjectList();
    }
    // 初始化category数据
    this.getFilterOptions().then(() => this.parseUrlParams());
    window.onpopstate = this.handlePopState;
    const visibilityChangeEvent = getHiddenProperty().replace(/hidden/i, 'visibilitychange');
    document.addEventListener(visibilityChangeEvent, this.onVisibilityChange);
    // goTracker(`CN_YX_MyProject_Show`);
    logEvent.addPageEvent({
      name: 'US_PC_MyProject_Show',
    });
  }
  componentWillUnmount() {
    window.onpopstate = null;
    const visibilityChangeEvent = getHiddenProperty().replace(/hidden/i, 'visibilitychange');
    document.removeEventListener(visibilityChangeEvent, this.onVisibilityChange);
  }

  getWWWorigin = () => {
    const { envUrls } = this.props;
    const baseUrl = envUrls.get('baseUrl');
    return baseUrl;
  };

  onVisibilityChange() {
    if (!document[getHiddenProperty()]) {
      this.getProjectList(false, false);
    }
  }

  handlePopState() {
    this.parseUrlParams().then(() => this.getProjectList());
  }

  parseUrlParams() {
    const promise = new Promise((resolve, reject) => {
      const { filterParams, categoryList, sortByList } = this.state;
      const qs = getQueryStringObj();
      const mergedFilterParams = merge({}, filterParams, qs);
      const { productName, category, sortBy } = mergedFilterParams;
      const selectedCategory = categoryList.find(item => item.value == category) || {};
      const selectedSort = sortByList.find(item => item.value == sortBy) || {};

      this.setState(
        {
          filterParams: mergedFilterParams,
          searchText: productName,
          inputedSearchText: productName,
          selectedCategory,
          selectedSort,
        },
        resolve
      );
    });
    return promise;
  }

  getShareUrls(baseUrl, projectid, projectType, isVirtualType) {
    if (!isVirtualType) {
      return xhr.get(
        template(GET_SHARE_URLS)({
          baseUrl,
          projectid,
          projectType,
        })
      );
    }

    const url = template(GET_US_PACKAGE_SHARE_URLS)({ baseUrl: this.getWWWorigin() });
    return xhr.post(url, {
      auth: {
        customerId: this.props.userInfo.get('uidPk'),
        securityToken: this.props.userInfo.get('securityToken'),
        timestamp: this.props.userInfo.get('timestamp'),
      },
      projectId: projectid,
    });
  }

  getFilterOptions() {
    const promise = new Promise((resolve, reject) => {
      const url = template(GET_PROJECT_FILTERS)({ baseUrl: this.getWWWorigin() });
      const categoryList = [{ value: '', label: t('SHOW_ALL_PROJECTS') }];
      xhr
        .get(url)
        .then(result => {
          const { errorCode, data } = result;
          const { selectedCategory, selectedSort } = this.state;
          if (errorCode == 0) {
            const { category, sortBy } = data;
            category.forEach(item => {
              categoryList.push({
                value: String(item.value),
                label: item.name,
              });
            });
            const newSelectedCategory = selectedCategory || categoryList[0];
            const sortByList = [];
            sortBy.forEach(item => {
              sortByList.push({
                value: String(item.value),
                label: item.name,
              });
            });
            const newSelectedSort = selectedSort || sortByList[0];
            this.setState(
              {
                categoryList,
                selectedCategory: newSelectedCategory,
                sortByList,
                selectedSort: newSelectedSort,
              },
              resolve
            );
          } else {
            this.setState({
              categoryList: categoryList,
              selectedCategory: categoryList[0],
            });
          }

          return resolve();
        })
        .catch(error => {
          this.setState({
            categoryList: categoryList,
            selectedCategory: categoryList[0],
          });
          resolve();
        });
    });
    return promise;
  }

  getProjectList(shoulePushState = false, shouldShowLoading = true) {
    const { filterParams } = this.state;
    if (shouldShowLoading) {
      this.setState({
        isLoadingProject: true,
      });
    }
    const urlParams = buildUrlParmas(filterParams);
    if (shoulePushState) {
      history.pushState(null, null, urlParams);
    }
    const url = template(GET_PROJECT_LIST)({ baseUrl: this.getWWWorigin() });
    return xhr
      .post(url, {
        ...filterParams,
        editorVer: 'V4',
      })
      .then(result => {
        const { errorCode, data } = result;
        if (errorCode == 0) {
          const { paginationInfo, projectList } = data;
          if (
            paginationInfo.currentPage > paginationInfo.totalPage &&
            this.state.paginationInfo.currentPage !== 1
          ) {
            paginationInfo.currentPage = paginationInfo.currentPage - 1;
            this.setState({
              filterParams: {
                ...filterParams,
                currentPage: filterParams.currentPage - 1,
              },
              paginationInfo,
            });
            this.getProjectList();
            return;
          }
          this.setState({
            paginationInfo,
            projectList,
          });
        }
        this.setState({
          isLoadingProject: false,
        });
      })
      .catch(error => {
        this.setState({
          isLoadingProject: false,
        });
      });
  }

  changeFilter(data) {
    if (!data || !data.keyName) return;
    const { filterParams } = this.state;

    // 更改请求参数请求项目列表
    const newFilterParams = merge({}, filterParams, {
      [data.keyName]: data.value,
    });
    // 如果是更改 category、sortBy、productName 时，请求第一页
    if (data.keyName !== 'currentPage') {
      newFilterParams.currentPage = 1;
    }
    const tempPaginationInfo = merge({}, this.state.paginationInfo, {
      currentPage: newFilterParams.currentPage,
    });
    this.setState({ paginationInfo: tempPaginationInfo });
    this.setState({ filterParams: newFilterParams }, () => this.getProjectList(true));
  }

  onCategoryChange(category) {
    const { selectedCategory, isLoadingProject } = this.state;
    // 如果正在加载项目，不响应切换。
    if (isLoadingProject) return;
    // 如果切换前后的值相等，不响应切换
    if (selectedCategory && selectedCategory.value === category.value) return;
    this.setState(
      {
        selectedCategory: category,
      },
      () => {
        this.changeFilter({
          keyName: 'category',
          value: category.value,
        });
      }
    );
  }

  onSortChange(sortItem) {
    const { selectedSort, isLoadingProject } = this.state;
    // 如果正在加载项目，不响应切换。
    if (isLoadingProject) return;
    // 如果切换前后的值相等，不响应切换
    if (selectedSort && selectedSort.value === sortItem.value) return;
    this.setState(
      {
        selectedSort: sortItem,
      },
      () => {
        this.changeFilter({
          keyName: 'sortBy',
          value: sortItem.value,
        });
      }
    );
  }

  onKeyUp(e) {
    if (e && e.keyCode && e.keyCode === 13) {
      this.doSearch();
    }
  }

  handleSearchChange(event) {
    const { target } = event;
    this.setState({
      inputedSearchText: target.value,
    });
  }

  doSearch() {
    const { inputedSearchText, isLoadingProject } = this.state;
    if (isLoadingProject) return;
    this.setState({ searchText: inputedSearchText });
    this.changeFilter({
      keyName: 'productName',
      value: inputedSearchText,
    });
  }

  showShareModal(itemData) {
    const { shareModalData } = this.state;
    const { projectId, productType, isVirtualType } = itemData;
    this.setState({
      shareModalData: merge(shareModalData, {
        isShow: true,
        projectId,
        productType,
        isVirtualType,
      }),
    });
  }

  closeShareModal() {
    const { shareModalData } = this.state;
    this.setState({
      shareModalData: merge(shareModalData, { isShow: false }),
    });
  }

  changeProjectTitle(projectId, userId, projectName) {
    xhr
      .get(
        template(SAVE_PROJECT_TITLE)({
          baseUrl: this.getWWWorigin(),
          userId,
          projectId,
          projectName,
        })
      )
      .then(result => {
        const { respCode } = result;
        if (respCode == 200) {
          const { projectList, textInputModalData } = this.state;
          projectList.some(item => {
            if (item.projectId === projectId) {
              item.projectName = projectName;
              return true;
            } else if (item.subProjectList.length) {
              return item.subProjectList.some(subProjectItem => {
                if (subProjectItem.projectId === projectId) {
                  subProjectItem.projectName = projectName;
                  return true;
                }
              });
            }
          });
          this.setState({
            projectList,
            textInputModalData: merge({}, textInputModalData, { isShow: false }),
          });
        } else {
          this.showUpdateTitleFailedAlert();
        }
      })
      .catch(error => {
        this.showUpdateTitleFailedAlert();
      });
  }

  showChangeTitleModal(itemData) {
    const { textInputModalData } = this.state;
    const userId = this.props.userInfo.get('uidPk');
    const { projectId, projectName } = itemData;
    this.setState({
      textInputModalData: merge({}, textInputModalData, {
        isShow: true,
        modalTitle: t('CHANGE_PROJECT_TITLE'),
        textValue: projectName,
        onConfirm: projectName => this.changeProjectTitle(projectId, userId, projectName),
      }),
    });
  }

  cloneProject(projectId, projectName, productType) {
    const {
      textInputModalData,
      isCloningProject,
      categoryList,
      sortByList,
      selectedCategory,
      selectedSort,
    } = this.state;
    if (isCloningProject) return Promise.resolve();
    this.setState({ isCloningProject: true });
    const url = template(CLONE_PROJECT_BY_ID)({ baseUrl: this.getWWWorigin() });
    xhr
      .post(url, `projectUid=${Number(projectId)}&title=${projectName}`, {
        setJSON: false,
        setHead: true,
      })
      .then(result => {
        const { respCode } = result;
        if (respCode == 0) {
          const newFilterParams = {
            currentPage: '1',
            isFlag: true,
            category: '',
            sortBy: '2',
            productName: '',
          };

          const newSelectedCategory =
            categoryList.find(item => item.value == '') || selectedCategory || {};
          const newSelectedSort = sortByList.find(item => item.value == '2') || selectedSort || {};

          this.setState(
            {
              filterParams: newFilterParams,
              searchText: '',
              selectedCategory: newSelectedCategory,
              selectedSort: newSelectedSort,
              isCloningProject: false,
              textInputModalData: merge({}, textInputModalData, { isShow: false }),
            },
            () => this.getProjectList(true)
          );
        } else {
          this.setState({
            isCloningProject: false,
          });
          alert('复制项目失败，请重试');
        }
      })
      .catch(error => {
        this.setState({
          isCloningProject: false,
        });
        alert('复制项目失败，请重试');
      });
  }

  showCloneProjectModal(itemData) {
    const { textInputModalData } = this.state;
    const { projectId, productType } = itemData;
    this.setState({
      textInputModalData: merge({}, textInputModalData, {
        modalTitle: t('PLEASE_INPUT_NEW_TITLE'),
        isShow: true,
        textValue: '',
        onConfirm: projectName => this.cloneProject(projectId, projectName, productType),
      }),
    });
  }

  closeTextInputModal() {
    const { textInputModalData } = this.state;
    this.setState({
      textInputModalData: merge({}, textInputModalData, { isShow: false }),
    });
  }

  showDeleteProjectInCartAlert() {
    const alertData = {
      isShow: true,
      text: t('SHOW_DELETE_PROJECT_IN_CART_ALERT_TEXT'),
      confirmBtnText: t('SHOW_DELETE_PROJECT_IN_CART_ALERT_BTN'),
      actions: {
        handleOk: this.closeAlert,
        handleClose: this.closeAlert,
      },
    };
    this.showAlert(alertData);
  }

  showDeleteNormalProjectAlert() {
    const alertData = {
      isShow: true,
      text: t('SHOW_DELETE_NORMAL_PROJECT_ALERT_TEXT'),
      confirmBtnText: t('SHOW_DELETE_NORMAL_PROJECT_ALERT_CONFIRM_BTN'),
      cancelBtnText: t('SHOW_DELETE_NORMAL_PROJECT_ALERT_CANCLE_BTN'),
      isOkBtnHightLight: false,
      actions: {
        handleOk: this.doDeleteProject,
        handleClose: this.closeAlert,
      },
    };
    this.showAlert(alertData);
  }

  showUpdateTitleFailedAlert() {
    const alertData = {
      isShow: true,
      text: t('SHOW_UPDATE_TITLE_FAILED_ALERT_TEXT'),
      confirmBtnText: t('SHOW_UPDATE_TITLE_FAILED_ALERT_BTN'),
      actions: {
        handleOk: this.closeAlert,
        handleClose: this.closeAlert,
      },
    };
    this.showAlert(alertData);
  }

  showDeleteFailedAlert() {
    const alertData = {
      isShow: true,
      text: t('SHOW_DELETE_FAILED_ALERT_TEXT'),
      confirmBtnText: t('SHOW_DELETE_FAILED_ALERT_BTN'),
      actions: {
        handleOk: this.closeAlert,
        handleClose: this.closeAlert,
      },
    };
    this.showAlert(alertData);
  }

  openBookEditor(linkUrl) {
    window.location = linkUrl;
  }

  showUpgradeProjectAlert(linkUrl) {
    const alertData = {
      isShow: true,
      text: t('SHOW_UPGRADE_PROJECT_ALERT_TEXT'),
      confirmBtnText: t('SHOW_UPGRADE_PROJECT_ALERT_BTN'),
      actions: {
        handleOk: this.openBookEditor.bind(this, linkUrl),
        handleClose: this.closeAlert,
      },
    };
    this.showAlert(alertData);
  }

  showAddParentBookAlert(text) {
    const alertData = {
      isShow: true,
      text,
      confirmBtnText: t('SHOW_ADD_PARENT_BOOK_ALERT_CONFIRM_BTN'),
      cancelBtnText: t('SHOW_ADD_PARENT_BOOK_ALERT_CANCEL_BTN'),
      isCancelBtnHightLight: false,
      actions: {
        handleOk: this.doAddParentBookToCart,
        handleClose: this.closeAlert,
      },
    };
    this.showAlert(alertData);
  }

  showAlert(alertData) {
    const { deleteAlertModalData } = this.state;
    this.setState({
      deleteAlertModalData: merge({}, deleteAlertModalData, alertData),
    });
  }

  closeAlert() {
    const { deleteAlertModalData } = this.state;
    this.setState({
      deleteAlertModalData: merge({}, deleteAlertModalData, { isShow: false }),
    });
  }

  deleteProject(itemData) {
    const { enCodeProjectId, isInCart, productType, projectId } = itemData;
    if (isInCart) {
      this.showDeleteProjectInCartAlert();
      return;
    }
    this.setState({ itemData: itemData });
    this.showDeleteNormalProjectAlert();
  }

  handleShowExportModal = () => {
    const { boundGlobalActions } = this.props;
    const { showModal, hideModal } = boundGlobalActions;
    showModal(modalTypes.CUSTOM_EXPORT_MODAL, {
      close: () => {
        hideModal(modalTypes.CUSTOM_EXPORT_MODAL);
      },
      text: t('EXPORT_MODAL_GENERATING_TEXT1'),
    });
  };

  getSpecifiedProject = projectId => {
    const url = template(GET_VIRTUAL_PROJECT_PROJECT)({
      baseUrl: this.getWWWorigin(),
      isParentBook: false,
    });
    return xhr.post(url, {
      auth: {
        customerId: this.props.userInfo.get('uidPk'),
        securityToken: this.props.userInfo.get('securityToken'),
        timestamp: this.props.userInfo.get('timestamp'),
      },
      projectId,
    });
  };

  cancelExport = (customerId, projectId) => {
    const url = template(CANCEL_EXPORT_URL)({
      baseUrl: this.getWWWorigin(),
      customerId,
      projectId,
    });
    return xhr.get(url);
  };

  async exportProject(itemData, baseUrl) {
    const { boundGlobalActions, userInfo } = this.props;
    const specifiedProject = await this.getSpecifiedProject(get(itemData, 'projectId'));
    const { data = {} } = specifiedProject || {};
    const { projectInfo = {} } = data;
    const { pages = [] } = projectInfo;
    function realExport(that, itemData) {
      xhr
        .get(
          template(GET_CUSTOM_EXPORT_URL)({
            baseUrl: that.getWWWorigin(),
            customerId: that.props.userInfo.get('uidPk'),
            isQuery: true,
            projectId: get(itemData, 'projectId'),
            profile_type: '',
          })
        )
        .then(result => {
          const { ret_code, url, ret_msg, is_prj_update } = result;
          if (+ret_code === 200007) {
            boundGlobalActions.showModal(modalTypes.EXPORT_COLOR_PROFILE_MODAL, {
              itemData: itemData,
              baseUrl,
              userInfo,
              project: fromJS({
                pageArray: pages,
              }),
              close: () => {
                boundGlobalActions.hideModal(modalTypes.EXPORT_COLOR_PROFILE_MODAL);
              },
            });
          } else if (+ret_code === 200000) {
            boundGlobalActions.showModal(modalTypes.EXPORT_COLOR_PROFILE_MODAL, {
              itemData: itemData,
              hasExistedExport: true,
              baseUrl,
              exportExistedFile: () => {
                window.open(url, '_parent');
              },
              exportNewFile: (fn = () => {}) => {
                that
                  .cancelExport(that.props.userInfo.get('uidPk'), get(itemData, 'projectId'))
                  .then(result => {
                    const { ret_code } = result;
                    if (+ret_code === 200000) {
                      fn();
                    }
                  });
              },
              userInfo,
              project: fromJS({
                pageArray: pages,
              }),
              close: () => {
                boundGlobalActions.hideModal(modalTypes.EXPORT_COLOR_PROFILE_MODAL);
              },
            });
          } else if (+ret_code === 200005) {
            // that.showExportAlert();
            that.handleShowExportModal();
          } else if (exportErrorCode.includes(+ret_code)) {
            boundGlobalActions.showModal(modalTypes.CONFIRM_MODAL, {
              message: (
                <div>
                  <span>
                    The export file failed to be generated. But don't worry, please contact{' '}
                  </span>
                  <a href="mailto:zno@support.com" style={{ color: '#0077CC', cursor: 'pointer' }}>
                    zno@support.com
                  </a>
                  <span> for assistance.</span>
                </div>
              ),
              style: {
                width: 600,
              },
              close: () => boundGlobalActions.hideModal(modalTypes.CONFIRM_MODAL),
            });
          } else {
            console.log(ret_msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    const { hasCapcility, isTrial } = this.checkLevel();
    // todo 临时方案: 新老用户无论处于什么状态（未订阅/Free Plan/Pro Plan/Premium Plan/Power Plan），都可以正常无限制的使用Export相关功能
    //  所以提醒升级订阅和提示弹窗不需要通过订阅状态出现
    const isShowTrialModal = false; //临时变量控制
    if (isShowTrialModal && !hasCapcility && isTrial) {
      const modalProps = {
        close: () => {
          realExport(this);
        },
        buttons: [
          {
            text: t('I_KNOW'),
            onClick: () => {
              realExport(this);
            },
          },
        ],
      };
      const canShowTrial = showTrialModal(
        modalProps,
        this.props.boundGlobalActions,
        EXPORT_TRIAL_MODAL,
        true
      );
      if (canShowTrial) return;
    }
    if (isShowTrialModal && !hasCapcility && !isTrial) {
      logEvent.addPageEvent({
        name: 'DesignerExport_Click_Upgrade',
      });
      this.showUpdateModal(true);
      return;
    }

    realExport(this, itemData);
  }

  showExportAlert() {
    const { exportAlertModalData } = this.state;
    const alertData = {
      isShow: true,
      actions: {
        handleOk: this.closeExportAlert,
        handleClose: this.closeExportAlert,
      },
    };
    this.setState({
      exportAlertModalData: merge({}, exportAlertModalData, alertData),
    });
  }

  closeExportAlert() {
    const { exportAlertModalData } = this.state;
    this.setState({
      exportAlertModalData: merge({}, exportAlertModalData, { isShow: false }),
    });
  }

  addParentBookToCart(itemData) {
    const { parentBookTipType } = itemData;
    let text = '';
    if (parentBookTipType == 1) {
      text = t('ADD_PARENT_BOOK_TO_CART_TEXT1');
    } else if (parentBookTipType == 2) {
      text = t('ADD_PARENT_BOOK_TO_CART_TEXT2');
    }
    const nextFun = () => {
      if (text) {
        this.showAddParentBookAlert(text);
      } else {
        this.doAddParentBookToCart();
      }
    };
    this.setState({ itemData: itemData }, nextFun);
  }

  doAddParentBookToCart() {
    this.closeAlert();
    const { parentBookOrderPath } = this.state.itemData;
    window.location = parentBookOrderPath;
  }

  doDeleteProject() {
    // goTracker(`CN_YX_MyProject_Click_Delete,${productType},${projectId}`);
    this.closeAlert();
    const { enCodeProjectId, productType, projectId } = this.state.itemData;
    logEvent.addPageEvent({
      name: 'US_PC_MyProject_Click_Delete',
      product: productType,
      projectId,
    });
    const url = template(DELETE_PROJECT)({ baseUrl: this.getWWWorigin() });
    return xhr.post(url, { projectId: enCodeProjectId }).then(result => {
      const { errorCode } = result;
      if (errorCode == 0) {
        this.getProjectList();
      } else if (errorCode == 6) {
        this.showDeleteProjectInCartAlert();
      } else {
        this.showDeleteFailedAlert();
      }
    });
  }

  checkLevel() {
    const { mySubscription } = this.props;
    const items = mySubscription.get('items').toJS();
    let designerSubscription;
    designerSubscription = items.find(item => item.product_id === saasProducts.designer);
    let hasCapcility = false;
    let isTrial = false;
    if (designerSubscription) {
      if (designerSubscription) {
        const { plan_level, trial_plan_level } = designerSubscription;
        if (plan_level === 40) {
          hasCapcility = true;
        } else if (trial_plan_level > plan_level) {
          isTrial = true;
        }
      }
    }
    return {
      hasCapcility,
      isTrial,
    };
  }

  toCreatProject(tabIndex) {
    const logEventName = tabIndex === 1 ? 'Designer_Click_Labs' : 'Designer_Click_CreatNewProject';
    logEvent.addPageEvent({
      name: logEventName,
    });
    fbqLogEvent('click_Create', 'ws_designer', this.props.userInfo);
    function switchTabs(that) {
      const { history } = that.props;
      history.push(`/software/designer/labs?tabs=${tabIndex}`);
    }
    if (tabIndex === 1) {
      const { hasCapcility, isTrial } = this.checkLevel();
      // todo 临时方案: 新老用户无论处于什么状态（未订阅/Free Plan/Pro Plan/Premium Plan/Power Plan），都可以正常无限制的使用Export相关功能
      //  所以弹窗不需要出现
      const isShowTrialModal = false;
      if (isShowTrialModal && !hasCapcility && isTrial) {
        const modalProps = {
          close: () => {
            switchTabs(this);
          },
          buttons: [
            {
              text: t('I_KNOW'),
              onClick: () => {
                switchTabs(this);
              },
            },
          ],
        };
        const canShowTrial = showTrialModal(
          modalProps,
          this.props.boundGlobalActions,
          LABS_TRIAL_MODAL,
          true
        );
        if (canShowTrial) return;
      }
      if (isShowTrialModal && !hasCapcility && !isTrial) {
        logEvent.addPageEvent({
          name: 'DesignerLabs_Click_Upgrade',
        });
        this.showUpdateModal();
        return;
      }
    }
    switchTabs(this);
  }

  showUpdateModal = isExport => {
    const {
      boundGlobalActions: { showConfirm, hideConfirm },
    } = this.props;
    const messageKey = isExport ? 'UPGRADE_TO_USE_EXPORT_MSG' : 'UPGRADE_TO_USE_LABS_MSG';
    const data = {
      message: t(messageKey),
      close: () => hideConfirm(),
      buttons: [
        {
          text: t('UPGRADE'),
          className: 'pwa-btn',
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'DesignerLabs_Click_Upgrade',
            });

            location.href = `/saascheckout.html?from=saas&product_id=${saasProducts.designer}&right_name=${PERMISSION_NAME_ENUM.labs}`;
          },
        },
      ],
    };
    showConfirm(data);
  };

  //打开  弹窗表格
  openTablePriceModal = () => {
    const { boundProjectActions, boundGlobalActions } = this.props;
    let data = {
      tableTitle: 'Designer Plan Comparison',
      product_id: saasProducts.designer,
    };
    boundGlobalActions
      .getTablePriceList({ product_id: saasProducts.designer })
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

  // free 用户升级提示组件
  renderUpgradeInfo = () => {
    let { mySubscription } = this.props;
    const { activityInformation, statusAndHistory } = mySubscription.toJS();
    if (!activityInformation || !statusAndHistory) return;
    const information = activityInformation.find(i => i.product_id === saasProducts.designer);
    let showUpgrade = false;
    // if (mySubscription && mySubscription.isLoadCompleted) {
    //   if (mySubscription.items && mySubscription.items.length) {
    //     const curInfo = mySubscription.items.find(i => i.product_id === saasProducts.designer);
    //     if (curInfo) {
    //       const { plan_level, trial_plan_level } = curInfo;
    //       showUpgrade = plan_level === 10 && trial_plan_level <= 10;
    //     } else {
    //       // 没有 这一项，表示未订阅designer
    //       showUpgrade = true;
    //     }
    //   } else {
    //     showUpgrade = true;
    //   }
    // }
    const { activity_desc, code, code_status, expired_time_display } = information || {};
    const { fee_current, fee_history } = statusAndHistory || {};
    if (fee_current) {
      showUpgrade = !fee_current.SAAS_BUNDLE && !fee_current.SAAS_DESIGNER;
      productBundles.forEach(item => {
        if (fee_current[item.productId]) {
          const productsInBundle = item.included;
          const isSubscribed = productsInBundle.find(
            prod => prod.productId === saasProducts.designer
          );
          showUpgrade = !isSubscribed;
        }
      });
    }
    console.log('showUpgrade: ', showUpgrade);
    let showCode = false;
    if (code && fee_current) {
      showCode =
        code_status === 0 &&
        !fee_current[saasProducts.bundle] &&
        !fee_history[saasProducts.designer];
    }
    const param = {
      id: saasProducts.designer,
      showUpgrade,
      text: 'Upgrade to Designer Paid Plans for advanced features such as Proofing, Unlimited Album Design Exports To Third Party Labs and',
      url: '/saascheckout.html?level=30&cycle=1&product_id=SAAS_DESIGNER',
      eventName: 'DesignerUpgradeBanner_Click_Upgrade',
      code,
      expired_time: expired_time_display,
      codeDesc: `${activity_desc}, Ends`,
      showCode,
      onClick: () => {
        this.openTablePriceModal();
      },
    };
    return <UpgradeInfo {...param} />;
  };

  render() {
    const {
      projectList,
      shareModalData,
      deleteAlertModalData,
      exportAlertModalData,
      paginationInfo,
      filterParams,
      categoryList,
      selectedCategory,
      sortByList,
      selectedSort,
      searchText,
      inputedSearchText,
      isLoadingProject,
      textInputModalData,
    } = this.state;
    // console.log("this.state....", this.state, )

    let categoryLabel = '';
    categoryList.some(item => {
      if (selectedCategory.value == item.value) {
        categoryLabel = item.label;
        return true;
      }
    });

    return (
      <Fragment>
        <div className="projects-content-wrapper-saas">
          {/* {this.renderTableModal()} */}
          {this.renderUpgradeInfo()}
          <div className="my-projects-header">
            <div className="title">{t('PROJECTS')}</div>
            <div className="btns">
              <span className="video-btn" onClick={() => this.openTutorialVideo(1)}>
                {t('TUTORIAL_VIDEO')}
              </span>
              <div className="item" onClick={() => this.toCreatProject(1)}>
                {t('CUSTOM_LABS')}
              </div>
              <div className="item black" onClick={() => this.toCreatProject(0)}>
                {t('CREATE_NEW_PROJECT')}
              </div>
            </div>
          </div>
          <div className="pagination-container">
            {paginationInfo.totalPage > 1 && (
              <XPagePagination
                changeFilter={this.changeFilter}
                currentPage={paginationInfo.currentPage}
                totalPage={paginationInfo.totalPage}
              />
            )}
          </div>
          {projectList.length <= 0 &&
          !searchText &&
          !(selectedCategory && selectedCategory.value) ? null : (
            <div className="filter-container">
              <div className="group-item">
                <div className="select-label">{t('PRO_DISPLAY')}</div>
                <div className="select-container">
                  <XSelect
                    searchable={false}
                    options={categoryList}
                    value={selectedCategory}
                    clearable={false}
                    onChanged={value => this.onCategoryChange(value)}
                  />
                </div>
              </div>
              <div className="group-item">
                <div className="select-label">{t('SORTBY')}</div>
                <div className="select-container">
                  <XSelect
                    searchable={false}
                    options={sortByList}
                    value={selectedSort}
                    clearable={false}
                    onChanged={value => this.onSortChange(value)}
                  />
                </div>
              </div>
              <div className="search-container-with-create">
                <input
                  type="text"
                  name="searchbox"
                  className="search-input"
                  placeholder={t('PROJECT_TITLE')}
                  value={inputedSearchText}
                  autoComplete="on"
                  onChange={this.handleSearchChange}
                  onKeyUp={this.onKeyUp}
                  ref={this.inputedSearchRef}
                />
                <div className="search-icon-container" onClick={this.doSearch}>
                  <img src={searchIcon} className="search-icon" />
                </div>
              </div>
            </div>
          )}

          <div
            className={
              projectList.length <= 0 &&
              !searchText &&
              !(selectedCategory && selectedCategory.value)
                ? 'projects-content no-border'
                : 'projects-content'
            }
          >
            {isLoadingProject ? (
              <div className="content-loading">
                <img className="my-projects-loading" src={loadingGif} />
              </div>
            ) : projectList.length ? (
              projectList.map((item, index) => (
                <ProjectListItem
                  itemData={item}
                  baseUrl={this.getWWWorigin()}
                  key={item.projectId || index}
                  exportProject={this.exportProject}
                  deleteProject={this.deleteProject}
                  addParentBookToCart={this.addParentBookToCart}
                  showShareModal={this.showShareModal}
                  showChangeTitleModal={this.showChangeTitleModal}
                  showCloneProjectModal={this.showCloneProjectModal}
                  showUpgradeProjectAlert={this.showUpgradeProjectAlert}
                  history={this.props.history}
                  boundGlobalActions={this.props.boundGlobalActions}
                  userInfo={this.props.userInfo.toJS()}
                />
              ))
            ) : (selectedCategory && selectedCategory.value) || searchText ? (
              <div className="empty-project-list">
                {t('NO_RESULTES_FOUND_FOR', { searchText: categoryLabel })}
              </div>
            ) : (
              <div className="empty-project-container">
                <p className="empty-tip" dangerouslySetInnerHTML={{ __html: t('EMPTY_TIPS') }} />

                <p className="make-new-btn">
                  <span className="video-btn" onClick={() => this.openTutorialVideo(2)}>
                    {t('TUTORIAL_VIDEO')}
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="pagination-container">
            {paginationInfo.totalPage > 1 && (
              <XPagePagination
                changeFilter={this.changeFilter}
                currentPage={paginationInfo.currentPage}
                totalPage={paginationInfo.totalPage}
              />
            )}
          </div>
        </div>
        <div className="modals">
          {shareModalData.isShow && <XShareModal {...shareModalData} />}
          {textInputModalData.isShow && <TextInputModal {...textInputModalData} />}
          {deleteAlertModalData.isShow && <AlertModal {...deleteAlertModalData} />}
          {exportAlertModalData.isShow && <AlertModal {...exportAlertModalData} />}
        </div>
      </Fragment>
    );
  }
}
