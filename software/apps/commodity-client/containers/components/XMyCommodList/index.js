import { timeFormat } from 'appsCommon/utils/timeFormat';
import classNames from 'classnames';
import { isEqual, template } from 'lodash';
import React, { Component } from 'react';

import XPagePagination from '@resource/components/XPagePagination';
import XPureComponent from '@resource/components/XPureComponent';

import { PRODUCT_IMAGE_SRC } from '@resource/lib/constants/apiUrl';

import editIcon from '../../../icons/edit.png';
import { buildUrlParmas } from '../../../utils/url';

import './index.scss';

export default class XMyCommodList extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      paginationInfo: {},
    };

    this.renderList = this.renderList.bind(this);
    this.showChangeTitleModal = this.showChangeTitleModal.bind(this);
  }
  componentDidMount() {
    const { boundProjectActions, commodity } = this.props;
    boundProjectActions.getMycommodList().then(res => {
      const { data } = res;
      this.setState({
        paginationInfo: data,
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    const { commodity } = nextProps;
    const { commodity: prvCommodity } = this.props;
    const { myCommodList } = commodity.toJS();
    const { myCommodList: prvMyCommodList } = prvCommodity.toJS();
    if (!isEqual(myCommodList, prvMyCommodList)) {
      this.setState({
        paginationInfo: myCommodList,
      });
    }
  }

  renderList() {
    const { boundProjectActions, commodity } = this.props;
    const { paginationInfo } = this.state;
    const { records } = paginationInfo;
    const html = [];

    if (records && records.length) {
      records.forEach(item => {
        const { project_uid, project_name, cover_img, project_status, create_time, update_time } =
          item;
        const createDate = timeFormat(create_time, 'yyyy-mm-dd HH:II');
        const updateDate = timeFormat(update_time, 'yyyy-mm-dd HH:II');
        html.push(
          <div className="prime-project-item-container" key={project_uid}>
            <div className="cover-image-wrap">
              <a href="javascript:void(0);" className="cover-image-container" alt="" title="">
                <img className="cover-image" src={cover_img} />
              </a>
            </div>
            <div className="actions-container">
              <div
                className={classNames(`actionbar-item`, { disable: project_status === 2 })}
                onClick={() => this.handleEdit(item)}
              >
                编辑
              </div>
              <div
                className={classNames(`actionbar-item`, { disable: project_status === 2 })}
                onClick={() => this.handleSubmit(item)}
              >
                提交
              </div>
              <div className="actionbar-item" onClick={() => this.handleDelete(item)}>
                删除
              </div>
              <div className="actionbar-item" onClick={() => this.lookPrice(item)}>
                查看价格
              </div>
            </div>
            <div className="project-desc-container">
              <div className="top-section">
                <div>
                  <div className="item-project-id">ID: {project_uid}</div>
                  <div className="item-project-name-container">
                    <span className="item-project-name">{project_name}</span>
                    <img
                      className="modify-icon"
                      onClick={() => this.showChangeTitleModal(item)}
                      src={editIcon}
                    />
                  </div>
                </div>
              </div>
              <div className="bottom-section">
                <div className="project-desc-item ell">创建时间: {createDate}</div>
                <div className="project-desc-item ell">
                  <span>状态: </span>
                  <span className="">{project_status === 2 ? '作品已提交' : '作品排版中'}</span>
                </div>
                <div className="project-desc-item ell">修改时间: {updateDate}</div>
              </div>
            </div>
          </div>
        );
      });
    } else {
      html.push(
        <div className="no-data-container">
          <div className="no-data-text">暂无数据</div>
        </div>
      );
    }

    return html;
  }
  changeFilter = data => {
    const { boundGlobalActions, boundProjectActions } = this.props;
    if (!data || !data.keyName) return;
    boundProjectActions.getMycommodList(data.value);
    // this.collectionsRef.current.scrollTop = 0;
  };
  handleEdit = item => {
    const { project_uid, project_status, id } = item;
    const { boundProjectActions, qs, urls } = this.props;
    const { pstoreBaseUrl } = urls.toJS();
    const enc_sw_id = qs.get('enc_sw_id');
    if (project_status === 2) return;
    const urlQueryObj = {
      initGuid: project_uid,
      virtualProjectGuid: project_uid,
      packageType: 'single',
      languageCode: 'cn',
      enc_sw_id: enc_sw_id,
      backHref: encodeURIComponent(location.href),
      commodityLibrarySource: 1,
      listId: id,
      client_project_id: id,
    };

    const urlQueryString = buildUrlParmas(urlQueryObj, false);
    let productLinkUrl = `${pstoreBaseUrl}prod-assets/app/cxeditor/index.html?${urlQueryString}`;
    window.location.href = productLinkUrl;
  };
  handleSubmit = item => {
    const { id, project_status } = item;
    const { boundProjectActions, boundGlobalActions } = this.props;
    if (project_status === 2) return;
    const data = {
      close: boundGlobalActions.hideConfirm,
      message:
        '商品编辑完成提交后，商家会收到您提交的商品信息，同时会根据您设计的板式进行产品生产制作，提交后将不可编辑，是否继续提交？',
      buttons: [
        {
          className: 'white pwa-btn',
          text: t('CANCEL'),
          onClick: () => {
            boundGlobalActions.hideConfirm();
          },
        },
        {
          className: 'pwa-btn',
          text: '提交',
          onClick: () => {
            boundProjectActions.projectSubmit(id).then(res => {
              const { data, ret_code } = res;
              if (ret_code === 200000) {
                boundProjectActions.getMycommodList();
                boundGlobalActions.addNotification({
                  message: '提交成功',
                  level: 'success',
                  autoDismiss: 2,
                });
              }
              if (ret_code === 401810) {
                boundProjectActions.updateCommodityUserInfo({ isLogin: false });
                alert('登录信息过期,请重新登录!');

                return;
              }
            });
            boundGlobalActions.hideConfirm();
          },
        },
      ],
    };
    boundGlobalActions.showConfirm(data);
  };
  handleDelete = item => {
    const { id } = item;
    const { boundProjectActions, boundGlobalActions } = this.props;
    const data = {
      close: boundGlobalActions.hideConfirm,
      title: '温馨提示',
      message: '编辑的影像产品删除后，将无法恢复，确定删除？',
      buttons: [
        {
          className: 'white pwa-btn',
          text: t('CANCEL'),
          onClick: () => {
            boundGlobalActions.hideConfirm();
          },
        },
        {
          className: 'pwa-btn',
          text: '确定',
          onClick: () => {
            boundProjectActions.projectDelete(id).then(res => {
              const { data, ret_code } = res;
              if (ret_code === 200000) {
                boundProjectActions.getMycommodList();
                boundGlobalActions.addNotification({
                  message: '删除成功',
                  level: 'success',
                  autoDismiss: 2,
                });
              }
              if (ret_code === 401810) {
                boundProjectActions.updateCommodityUserInfo({ isLogin: false });
                alert('登录信息过期,请重新登录!');

                return;
              }
            });
            boundGlobalActions.hideConfirm();
          },
        },
      ],
    };
    boundGlobalActions.showConfirm(data);
  };
  lookPrice = item => {
    const { project_uid, project_name, id } = item;
    const { boundProjectActions, boundGlobalActions } = this.props;
    boundProjectActions.getPriceById(id).then(res => {
      const { data, ret_code } = res;
      if (ret_code === 401810) {
        boundProjectActions.updateCommodityUserInfo({ isLogin: false });
        alert('登录信息过期,请重新登录!');

        return;
      }
      boundGlobalActions.showModal('LOOK_PRICE_MODAL', {
        data,
        project_name,
        onClose: () => {
          boundGlobalActions.hideModal('LOOK_PRICE_MODAL');
        },
      });
    });
  };
  showChangeTitleModal(item) {
    const { boundGlobalActions, boundProjectActions } = this.props;
    const { project_name, id } = item;

    boundGlobalActions.showModal('CHANGE_TITLE_MODAL', {
      modalTitle: '修改作品名称',
      textLabel: '名称:',
      placeholder: '未命名',
      textValue: `${project_name}`,
      cancelText: '返回',
      confirmText: '确定',
      maxLength: 49,
      Invalidation: /[^\u4e00-\u9fa5a-zA-Z0-9`\s-_]/,
      onConfirm: projectName => {
        boundProjectActions.changeProjectTitle(id, projectName).then(res => {
          const { data, ret_code } = res;
          if (ret_code === 200000) {
            boundProjectActions.getMycommodList();
            boundGlobalActions.addNotification({
              message: '修改成功',
              level: 'success',
              autoDismiss: 2,
            });
          }
          if (ret_code === 401810) {
            boundProjectActions.updateCommodityUserInfo({ isLogin: false });
            alert('登录信息过期,请重新登录!');
            return;
          }
        });
        boundGlobalActions.hideModal('CHANGE_TITLE_MODAL');
      },
      closeModal: () => {
        boundGlobalActions.hideModal('CHANGE_TITLE_MODAL');
      },
    });
  }

  render() {
    const { boundProjectActions, commodity } = this.props;
    const { paginationInfo } = this.state;

    return (
      <div className="mycommodlist-list-container">
        <div className="project-item-container">{this.renderList()}</div>
        <div className="pagination-container">
          {paginationInfo.total > 20 && (
            <XPagePagination
              changeFilter={this.changeFilter}
              currentPage={paginationInfo.current_page}
              totalPage={Math.ceil(paginationInfo.total / paginationInfo.page_size)}
            />
          )}
        </div>
      </div>
    );
  }
}
