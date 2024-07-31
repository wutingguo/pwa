import { fromJS } from 'immutable';
import { get, merge, template } from 'lodash';
import React, { Component, Fragment } from 'react';

import XPagePagination from '@resource/components/XPagePagination';
import FreeNotify from '@resource/components/freeNotify';
// import VideoModal from '@resource/components/modals/VideoModal';
import VideoModal from '@resource/components/modals/GroupsVideoModal';
import XExportModal from '@resource/components/modals/XExportModal';

import { getQs } from '@resource/lib/utils/url';

import {
  CANCEL_EXPORT_URL,
  CHECK_EXPORT_MEASURE,
  GET_CUSTOM_EXPORT_URL_CN,
} from '@resource/lib/constants/apiUrl';
import { exportErrorCode } from '@resource/lib/constants/exportErrorCode';
import * as modalTypes from '@resource/lib/constants/modalTypes';
import { packageListMapV2, saasProducts } from '@resource/lib/constants/strings';
import { vedioGroupsStr } from '@resource/lib/constants/vedioGroupsString';

import getQRCodeUrl from '@resource/lib/service/getQrcode';
import getRemainDay from '@resource/lib/service/remainDay';

import emptyPng from '@resource/static/icons/empty.png';
import XSelect from '@resource/websiteCommon/components/dom/XSelect';
import XShareModal from '@resource/websiteCommon/components/dom/modals/XShareModal';
import * as xhr from '@resource/websiteCommon/utils/xhr';

import ProjectListItem from '../../../components/ProjectListItem';
import QcCodeModal from '../../../components/QcCodeModal';
import TextInputModal from '../../../components/TextInputModal';
import {
  CLONE_PROJECT_BY_ID,
  DELETE_PROJECT,
  GET_CN_PRODUCT_CATEGORY_V3,
  GET_PROJECT_FILTERS,
  GET_PROJECT_LIST,
  GET_SHARE_URLS,
  SAVE_PROJECT_TITLE,
} from '../../../constants/apiUrl';
import { buildUrlParmas, getQueryStringObj } from '../../../utils/url';

import loadingGif from './images/loading.gif';
import searchIcon from './images/search.png';

import './index.scss';

const getHiddenProperty = () => {
  const hiddenProperty =
    'hidden' in document
      ? 'hidden'
      : 'webkitHidden' in document
      ? 'webkitHidden'
      : 'mozHidden' in document
      ? 'mozHidden'
      : null;
  return hiddenProperty;
};

class MyProjects extends Component {
  constructor(props) {
    super(props);
    const data = props.pathContext || {};

    this.parseUrlParams = this.parseUrlParams.bind(this);
    this.getProductList = this.getProductList.bind(this);
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
    this.exportProject = this.exportProject.bind(this);
    this.showExportAlert = this.showExportAlert.bind(this);
    this.closeExportAlert = this.closeExportAlert.bind(this);
    this.toCreatProject = this.toCreatProject.bind(this);
    this.toCheckoutPlan = this.toCheckoutPlan.bind(this);
    this.checkLevel = this.checkLevel.bind(this);
    this.state = {
      data,
      remainDay: {},
      filterParams: {
        currentPage: '1',
        isFlag: true,
        category: '',
        sortBy: '1',
        productName: '',
      },
      isShowVideoModal: false,
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
        urlCopyMessage: '链接已复制到粘贴板',
        EmbedCopyMessage: '代码已复制到粘贴板',
      },
      exportAlertModalShow: false,
      textInputModalData: {
        isShow: false,
        modalTitle: '修改作品名称',
        textLabel: '名称:',
        placeholder: '未命名',
        textValue: '',
        cancelText: '返回',
        confirmText: '确定',
        maxLength: 49,
        onConfirm: () => {
          console.log('确认修改作品');
        },
        closeModal: this.closeTextInputModal,
      },
      searchText: '',
      showSearchText: '',
      isLoadingProject: true,
      isCloningProject: false,
      isShowFreeAlert: false,
      showFreeDays: '14',
    };
  }

  componentDidMount() {
    const { urls } = this.props;
    const userId = this.props.userInfo.get('id');
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    getRemainDay({
      customer_id: userId,
      galleryBaseUrl,
      product_scope: saasProducts.designer,
    }).then(res => {
      this.setState({
        remainDay: res,
      });
    });
    let productName = '';
    if (getQs('productName')) {
      productName = decodeURIComponent(decodeURIComponent(getQs('productName')));
    }
    if (productName) {
      this.changeFilter({
        keyName: 'productName',
        value: productName,
      });
    } else {
      this.getProductList();
    }
    // 初始化category数据
    this.getFilterOptions().then(() => this.parseUrlParams());

    // 监听popstate操作
    window.onpopstate = this.handlePopState;
    const visibilityChangeEvent = getHiddenProperty().replace(/hidden/i, 'visibilitychange');
    document.addEventListener(visibilityChangeEvent, this.onVisibilityChange);
    const scene = 'rightSideOfWebsit';
    getQRCodeUrl('', scene).then(qrcodeUrl => {
      this.setState({
        qrcodeUrl,
      });
    });
  }

  componentWillUnmount() {
    window.onpopstate = null;
    const visibilityChangeEvent = getHiddenProperty().replace(/hidden/i, 'visibilitychange');
    document.removeEventListener(visibilityChangeEvent, this.onVisibilityChange);
  }

  componentDidUpdate(preProps) {
    const userId = this.props.userInfo.get('id');
    const PreUserId = preProps.userInfo.get('id');
    if (userId !== PreUserId && userId !== -1) {
      const { urls } = this.props;
      const galleryBaseUrl = urls.get('galleryBaseUrl');
      getRemainDay({
        customer_id: userId,
        galleryBaseUrl,
        product_scope: saasProducts.designer,
      }).then(res => {
        this.setState({
          remainDay: res,
        });
      });
    }
  }

  getWWWorigin = () => {
    const { envUrls } = this.props;
    const baseUrl = envUrls.get('baseUrl');
    return baseUrl;
  };

  hideModal = () => {
    this.setState({
      isShowVideoModal: false,
    });
  };

  onVisibilityChange() {
    if (!document[getHiddenProperty()]) {
      this.getProductList(false, false);
    }
  }

  handlePopState() {
    this.parseUrlParams().then(() => this.getProductList());
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
          selectedCategory,
          selectedSort,
        },
        resolve
      );
    });
    return promise;
  }

  getShareUrls(baseUrl, projectid, projectType) {
    return xhr.get(
      template(GET_SHARE_URLS)({
        baseUrl,
        projectid,
        projectType,
      })
    );
  }

  getFilterOptions() {
    // const promiseCategory = new Promise((resolve, reject) => {
    //   const url = template(GET_CN_PRODUCT_CATEGORY_V3)({ baseUrl: this.getWWWorigin() });
    //   const defaultCategory = [{ value: '', label: '显示所有作品' }];
    //   xhr
    //     .get(url)
    //     .then(result => {
    //       const { success, data } = result;
    //       const { selectedCategory } = this.state;
    //       if (success) {
    //         const categoryList = defaultCategory.concat(
    //             data.filter(i => !productCategorysFilter.includes(i.code))
    //               .map(i => ({
    //                 value: i.code,
    //                 label: i.displayName
    //               }))
    //           )

    //         this.setState(
    //           {
    //             categoryList,
    //             selectedCategory: selectedCategory || categoryList[0],
    //           },
    //           resolve
    //         );
    //       } else {
    //         this.setState({
    //           categoryList: defaultCategory,
    //           selectedCategory: defaultCategory[0],
    //         });
    //       }

    //       return resolve();
    //     })
    //     .catch(error => {
    //       this.setState({
    //         categoryList: defaultCategory,
    //         selectedCategory: defaultCategory[0],
    //       });
    //       resolve()
    //     });
    // });

    const promiseSort = new Promise((resolve, reject) => {
      const url = template(GET_PROJECT_FILTERS)({ baseUrl: this.getWWWorigin() });
      const defaultCategory = [{ value: '', label: '显示所有作品' }];
      xhr
        .get(url)
        .then(result => {
          const { errorCode, data } = result;
          const { selectedSort, selectedCategory } = this.state;
          if (errorCode == 0) {
            const { sortBy, category } = data;
            const sortByList = sortBy.map(item => ({
              value: String(item.value),
              label: item.name,
            }));
            const categoryList = defaultCategory.concat(
              category.map(i => ({
                value: i.value,
                label: i.name,
              }))
            );
            this.setState(
              {
                sortByList,
                selectedSort: selectedSort || sortByList[0],
                categoryList,
                selectedCategory: selectedCategory || categoryList[0],
              },
              resolve
            );
          }

          return resolve();
        })
        .catch(error => resolve());
    });
    return Promise.all([promiseSort]);
  }

  getProductList(shoulePushState = false, shouldShowLoading = true) {
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
        editorVer: '',
      })
      .then(result => {
        const { errorCode, data } = result;
        if (errorCode == 0) {
          const { paginationInfo, projectList } = data;
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
    if (data.value === filterParams[data.keyName]) return;

    // 更改请求参数请求项目列表
    const newFilterParams = merge({}, filterParams, {
      [data.keyName]: data.value,
    });
    // 如果是更改 category、sortBy、productName 时，请求第一页
    if (data.keyName !== 'currentPage') {
      newFilterParams.currentPage = 1;
    }
    this.setState({ filterParams: newFilterParams }, () => this.getProductList(true));
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
      searchText: target.value.trim(),
    });
  }

  doSearch() {
    const { searchText, isLoadingProject } = this.state;
    if (isLoadingProject) return;
    this.changeFilter({
      keyName: 'productName',
      value: searchText,
    });
    this.setState({
      showSearchText: searchText,
    });
  }

  openTutorialVideo = () => {
    window.logEvent.addPageEvent({
      name: 'Designer_Click_Beginner',
    });
    this.setState({
      isShowVideoModal: true,
    });
  };

  showShareModal(itemData) {
    const { shareModalData } = this.state;
    const { projectId, productType } = itemData;
    this.setState(
      {
        shareModalData: merge(shareModalData, {
          isShow: true,
          projectId,
          productType,
        }),
      },
      () => {
        console.log('this.state.mofal', this.state.shareModalData);
      }
    );
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
          alert('更改作品名称失败，请重试');
        }
      })
      .catch(error => {
        alert('更改作品名称失败，请重试');
      });
  }

  showChangeTitleModal(itemData) {
    const { textInputModalData } = this.state;
    const userId = this.props.userInfo.get('uidPk');
    const { projectId, projectName } = itemData;
    this.setState({
      textInputModalData: merge({}, textInputModalData, {
        isShow: true,
        modalTitle: '修改作品名称',
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
      filterParams,
    } = this.state;
    const { sortBy } = filterParams;
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
            sortBy,
            currentPage: '1',
            isFlag: true,
            category: '',
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
            () => this.getProductList(true)
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
        modalTitle: '输入作品名称',
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

  deleteProject(itemData) {
    const { enCodeProjectId, isInCart, productType, projectId } = itemData;
    if (isInCart) {
      window.alert('该作品已添加到您的购物车中。 在删除之前，请先从购物车中移除');
      return;
    }
    const confirmResult = window.confirm('删除作品照片也会被删除，确定要删除此作品吗?');
    if (!confirmResult) return;

    logEvent.addPageEvent({
      name: 'DesignerProjectList_Click_Delete',
      product: productType,
      projectId,
    });
    const url = template(DELETE_PROJECT)({ baseUrl: this.getWWWorigin() });
    return xhr.post(url, { projectId: enCodeProjectId }).then(result => {
      const { errorCode } = result;
      if (errorCode == 0) {
        this.getProductList();
      } else if (errorCode == 6) {
        window.alert('该作品已添加到您的购物车中。 在删除之前，请先从购物车中移除');
      } else {
        alert('删除项目失败,请重试');
      }
    });
  }

  renderLimit = () => (
    <div className="limitToUse">
      <div className="title">
        {t(
          'UPGRADE_TO_LIMIT',
          '您导出的作品数已超试用版最大限制，请升级您的订阅版本以使用此功能。'
        )}
      </div>
      <div className="qrWrapper">
        {this.state.qrcodeUrl && <img src={this.state.qrcodeUrl} className="qrcodeImg" />}
        <div className="text">
          扫码即可领取大额<span>福利</span>优惠
        </div>
      </div>
    </div>
  );

  async exportProject(itemData, showExportLoding = true) {
    const { userInfo, urls, boundGlobalActions } = this.props;
    const { showConfirm, hideConfirm, showModal } = this.props.boundGlobalActions;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    //判断是否是实物单册，中台无法提供，只能通过前缀判断
    const isBook = itemData.productCode.split('_')[0] === 'PB';
    if (!this.checkLevel(isBook)) {
      logEvent.addPageEvent({
        name: 'DesignerExport_Click_Upgrade',
      });
      this.showUpdateModal();
      return false;
    }
    let isTry = false;

    this.checkLevel(isBook, _try => {
      isTry = _try;
    });

    const open = url => {
      const fn = () => {
        try {
          localStorage.setItem(`downloadUrl_${itemData.projectId}`, url);
        } catch (err) {
          console.log('err:*********** ', err);
        }
        const { userInfo } = this.props;
        const id = userInfo.get('id');
        const saasBaseUrl = urls.get('saasBaseUrl');
        const openUrl = `${saasBaseUrl}software/designer/download?project_name=${itemData.projectName}&id=${id}&project_id=${itemData.projectId}&reGetDownloadLink=no`;
        window.open(openUrl, '__blank');
      };
      fn();
    };

    xhr
      .get(
        template(GET_CUSTOM_EXPORT_URL_CN)({
          baseUrl: this.getWWWorigin(),
          customerId: userInfo.get('uidPk'),
          isQuery: false,
          is_trial_subscribe: isTry ? 1 : 0,
          projectId: get(itemData, 'projectId'),
        })
      )
      .then(async result => {
        const { ret_code, url, ret_msg, is_prj_update = 0 } = result;
        if (+ret_code === 200000) {
          if (!!Number(is_prj_update)) {
            showConfirm({
              close: hideConfirm,
              message: t('CUSTOM_EXPORT_MODAL_TIP_2'),
              buttons: [
                {
                  onClick: () => {
                    hideConfirm();
                    open(url);
                  },
                  text: t('CUSTOM_EXPORT_MODAL_BTN_1'),
                  className: 'white',
                },
                {
                  onClick: () => {
                    hideConfirm();
                    //删除导出记录
                    xhr
                      .get(
                        template(CANCEL_EXPORT_URL)({
                          baseUrl: this.getWWWorigin(),
                          customerId: userInfo.get('uidPk'),
                          projectId: get(itemData, 'projectId'),
                        })
                      )
                      .then(res => {
                        const { ret_code } = res;
                        if (+ret_code === 200000) {
                          //重新导出
                          this.exportProject(itemData, false);
                        }
                      });
                  },
                  text: t('CUSTOM_EXPORT_MODAL_BTN_2'),
                },
              ],
            });
          } else {
            open(url);
          }
        } else if (+ret_code === 200005) {
          if (showExportLoding) {
            this.showExportAlert();
          }
        } else if (+ret_code === 200008) {
          const modalData = {
            message: this.renderLimit(),
            close: () => hideConfirm(),
            buttons: [
              {
                text: t('UPGRADE'),
                className: 'pwa-btn',
                onClick: () => {
                  boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
                    product_id: saasProducts.designer,
                    level: packageListMapV2.standard,
                    cycle: 1,
                    escapeClose: true,
                    onClosed: () => {
                      boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
                      boundGlobalActions.getMySubscription(galleryBaseUrl);
                    },
                  });
                },
              },
            ],
          };
          this.showUpdateModal(modalData);
        } else if (exportErrorCode.includes(+ret_code)) {
          const QRCodeUrl = await getQRCodeUrl('', 'customerService');
          const textStyle = {
            color: '#222',
            fontSize: 20,
          };
          showModal(modalTypes.CONFIRM_MODAL, {
            message: (
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div style={textStyle}>作品导出失败，请联系您的专属顾问为您排查问题并处理！</div>
                <img style={{ width: 200, margin: '20px 0' }} src={QRCodeUrl} />
                <div style={textStyle}>微信扫一扫</div>
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

  showExportAlert() {
    this.setState({
      exportAlertModalShow: true,
    });
  }

  closeExportAlert() {
    this.setState({
      exportAlertModalShow: false,
    });
  }

  toCreatProject(tabIndex) {
    const logEventName = tabIndex === 1 ? 'Designer_Click_Labs' : 'Designer_Click_CreatNewProject';
    logEvent.addPageEvent({
      name: logEventName,
    });

    // if (tabIndex === 1 && !this.checkLevel()) {
    //   logEvent.addPageEvent({
    //     name: 'DesignerLabs_Click_Upgrade'
    //   });
    //   this.showUpdateModal();
    //   return false;
    // }

    const { history } = this.props;
    history.push(`/software/designer/labs?tabs=${tabIndex}`);
  }

  checkLevel(isBook = false, cb) {
    const { mySubscription } = this.props;
    const items = mySubscription.get('items').toJS();
    let isLevel = false;
    for (const item of items) {
      if (
        item.product_id === saasProducts.designer &&
        item.plan_level >= 30 &&
        item.try_out &&
        typeof cb === 'function'
      ) {
        cb(true);
      }
      if (
        item.product_id === saasProducts.designer &&
        item.plan_level >= 30 &&
        (!isBook || (isBook && !item.try_out))
      ) {
        isLevel = true;
        break;
      }
    }
    return isLevel;
  }

  toCheckoutPlan() {
    const { boundGlobalActions, urls } = this.props;
    const saasBaseUrl = urls.get('saasBaseUrl');
    logEvent.addPageEvent({
      name: 'Click_DesignerBuyNow',
    });
    const { history } = this.props;
    boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
      product_id: saasProducts.designer,
      escapeClose: true,
      level: 30,
      cycle: 2,
      onClosed: () => {
        boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
        boundGlobalActions.getMySubscription(saasBaseUrl);
      },
    });
  }

  showUpdateModal = modalData => {
    const { boundGlobalActions, urls } = this.props;
    const { showConfirm, hideConfirm } = boundGlobalActions;
    const saasBaseUrl = urls && urls.get('saasBaseUrl');
    const data = modalData || {
      message: t('UPGRADE_TO_USE_LABS_MSG_2'),
      close: () => hideConfirm(),
      buttons: [
        {
          text: t('UPGRADE'),
          className: 'pwa-btn',
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'DesignerLabs_Click_Upgrade',
            });
            boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
              product_id: saasProducts.designer,
              level: packageListMapV2.standard,
              cycle: 1,
              escapeClose: true,
              onClosed: () => {
                boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
                boundGlobalActions.getMySubscription(saasBaseUrl);
              },
            });

            // this.props.history.push(`/software/checkout-plan`);
          },
        },
      ],
    };
    showConfirm(data);
  };

  // payIntroduce = (style) => {
  //   return (
  //     <span style={style} className="payIntroduce">
  //       付费功能
  //       <div className="introduce">
  //         <div className="introduceHeader">付费功能</div>
  //         <div className="introduceContent">
  //           <div>试用付费功能包括：</div>
  //           <div>自定义厂商规格、自由导出作品、工作室水印设置、自定义LOGO。</div>
  //           <div>*试用期结束后，以上需要付费才能使用</div>
  //         </div>
  //       </div>
  //     </span>
  //   );
  // }

  render() {
    const {
      projectList,
      shareModalData,
      paginationInfo,
      categoryList,
      selectedCategory,
      sortByList,
      selectedSort,
      searchText,
      showSearchText,
      isLoadingProject,
      textInputModalData,
      exportAlertModalShow,
      isShowVideoModal,
      remainDay,
    } = this.state;

    const { is_subscribed, remain_days } = remainDay;

    const { tryOutDetail, mySubscription } = this.props;
    // saasProducts.designer
    const { isShowFreeAlert, showFreeDays } = tryOutDetail;

    const sortByTypeUpdate = selectedSort && selectedSort.value == 1;
    const exportAlertModalData = fromJS({
      close: this.closeExportAlert,
    });

    const groupVideos = vedioGroupsStr('designer');

    const style = {
      color: '#0077CC',
      cursor: 'pointer',
      marginLeft: 5,
      textDecoration: 'underline',
    };
    const isNearLimit = is_subscribed && remain_days <= 5;
    const text = isNearLimit
      ? `您的设计软件付费版还剩${remain_days}天可用，到期后仅可使用免费功能，建议您尽快续费，查看`
      : '您当前为设计软件【免费版】，建议尽快购买付费版本，享主题套版、自由导出等高级功能，点击查看';

    // 期间可试用{this.payIntroduce({ ...style, textDecoration: 'none' })}，
    return (
      <Fragment>
        {isShowFreeAlert && parseInt(showFreeDays, 10) > 0 && !is_subscribed ? (
          <div className="free-alert">
            <div className="content">
              <div>
                试用期仅剩{showFreeDays}天， 到期后仅可使用免费功能，建议尽快购买正式版本，点击查看
                <span
                  style={style}
                  onClick={() => {
                    window.location.href = '/software/account?tabs=3';
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
        ) : (
          <FreeNotify
            subscriptionInfo={mySubscription.toJS()}
            softwareType={saasProducts.designer}
            remainDay={remainDay}
          >
            <div className="free-alert">
              <div className="content">
                <div>
                  {text}
                  <span
                    style={style}
                    onClick={() => {
                      window.location.href = '/software/account?tabs=3';
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
        )}

        <div className="my-projects-header">
          <div className="title">设计软件{'>'}全部作品</div>
          <div className="btns">
            {__isCN__ && (
              <div className="tutorialVideo" onClick={this.openTutorialVideo}>
                新手教程
              </div>
            )}
            <div className="item" onClick={() => this.toCreatProject(1)}>
              自定义厂商产品
            </div>
            <div className="item black" onClick={() => this.toCreatProject(1)}>
              + 创建新作品
            </div>
          </div>
        </div>
        <div className="my-projects-container">
          <div className="filter-container">
            <div className="group-item">
              <div className="select-label">筛选</div>
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
              <div className="select-label">排序</div>
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

            <div className="search-container">
              <input
                type="text"
                name="searchbox"
                className="search-input"
                placeholder="作品名、作品ID或订单号查询"
                value={searchText}
                autoComplete="on"
                onChange={this.handleSearchChange}
                onKeyUp={this.onKeyUp}
              />
              <div className="search-icon-container" onClick={this.doSearch}>
                <img src={searchIcon} className="search-icon" />
              </div>
            </div>
          </div>

          <div className="projects-content">
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
                  showShareModal={this.showShareModal}
                  showChangeTitleModal={this.showChangeTitleModal}
                  showCloneProjectModal={this.showCloneProjectModal}
                  history={this.props.history}
                  boundGlobalActions={this.props.boundGlobalActions}
                  sortByTypeUpdate={sortByTypeUpdate}
                  userInfo={this.props.userInfo.toJS()}
                />
              ))
            ) : (
              <Fragment>
                <div className="empty-project-list">
                  <img src={emptyPng} width="70px" />
                  <span>
                    {showSearchText ? `查询"${showSearchText}"没有结果!` : '暂无作品记录!'}
                  </span>
                </div>
                <div className="createNewProject" onClick={() => this.toCreatProject(1)}>
                  + 创建新作品
                </div>
                {__isCN__ && (
                  <div className="tutorialVideo">
                    <span onClick={this.openTutorialVideo}>新手教程</span>
                  </div>
                )}
              </Fragment>
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
          {exportAlertModalShow && <XExportModal modal={exportAlertModalData} />}
        </div>
        {isShowVideoModal && (
          <VideoModal
            style={{
              padding: 0,
            }}
            videoSrc="/clientassets-cunxin-saas/portal/groupVideos/designer/设计软件快速入门.mov"
            groupVideos={groupVideos}
            handleClose={this.hideModal}
          />
        )}
      </Fragment>
    );
  }
}

export default MyProjects;
