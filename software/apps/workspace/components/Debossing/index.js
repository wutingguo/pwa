import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  GET_MATERIAL_LIST,
  GET_COMMON_MATERIAL_LIST,
  IMAGE_SRC,
  DELETE_MATERIAL
} from '../../constants/apiUrl';

import * as xhr from '@resource/websiteCommon/utils/xhr';
import getPuid from '@resource/websiteCommon/utils/getPuid';
import { template } from '../../utils/template';

import LoadingImg from '@common/components/LoadingImg';
import AddMaterialModal from '../AddMaterialModal';
import CustomTabs from '../CustomTabs';
import ConfirmModal from '../ConfirmModal';

import deleteImg from './delete.png';
import './index.scss';

export default class Debossing extends Component {
  constructor(props) {
    super(props);

    const tabs = [
      {
        key: 'common',
        name: '通用烫金压印',
        canDelete: false
      },
      {
        key: 'my',
        name: '我的烫金压印',
        canDelete: true
      }
    ];

    this.state = {
      list: [],
      data: {},
      isFetched: false,
      showAddModal: false,
      showConfirmModal: false,
      selectedMaterialId: '',
      currentTab: tabs[0],
      tabs
    };

    this.handleAddMaterial = this.handleAddMaterial.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.getRenderList = this.getRenderList.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.getMaterialList = this.getMaterialList.bind(this);
    this.getQueryAPI = this.getQueryAPI.bind(this);
    this.getList = this.getList.bind(this);
    this.deleteMaterial = this.deleteMaterial.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(currentTab) {
    this.setState(
      {
        currentTab
      },
      () => {
        this.getList();
      }
    );
  }

  getQueryAPI(key) {
    const { baseUrl } = this.props;
    switch (key) {
      case 'common':
        return `${baseUrl}${GET_COMMON_MATERIAL_LIST}`;
      default:
        return `${baseUrl}${GET_MATERIAL_LIST}`;
    }
  }

  getList() {
    const { currentTab, data } = this.state;
    const { key } = currentTab;
    if (!data[key]) {
      const API = this.getQueryAPI(key);
      this.getMaterialList(API).then(data => {
        this.setState({
          ...data,
          data: {
            ...this.state.data,
            [key]: data.list
          }
        });
      });
    } else {
      this.setState({
        list: data[key]
      });
    }
  }

  getMaterialList(API) {
    return new Promise((resolve, reject) => {
      xhr
        .get(API)
        .then(res => {
          if (res && res.data && res.data.materialDebossingList) {
            resolve({
              list: res.data.materialDebossingList,
              isFetched: true
            });
          } else {
            resolve({
              list: [],
              isFetched: true
            });
          }
        })
        .catch(err => {
          resolve({
            list: [],
            isFetched: true
          });
        });
    });
  }

  handleAddMaterial() {
    this.setState({
      showAddModal: true
    });

    logEvent.addPageEvent({
      name: 'DesignerMaterialMT_Click_CreatNewGoldstamp'
    });
  }

  handleModalClose(hideAddModal = false) {
    this.setState({
      showAddModal: false,
      showConfirmModal: false
    });
  }

  getRenderList() {
    const uploadBaseUrl = this.props.envUrls.get('uploadBaseUrl');
    const { list, selectedId, currentTab, tabs } = this.state;
    const canDelete = tabs.find(t => {
      return t.key === currentTab.key && t.canDelete;
    });

    const html = [];

    list.forEach((item, index) => {
      const { encImgId, name, size, materialId } = item;
      const isSelected = selectedId === materialId;
      const src = template(IMAGE_SRC, {
        encImgId: getPuid(encImgId),
        uploadBaseUrl
      });
      html.push(
        <li key={index}>
          <div className="img-box">
            <img src={src} />
            <div className="status" />
          </div>
          <div className="ltitle">{name}</div>
          <div className="stitle">{size.toLowerCase()}厘米</div>
          {canDelete ? (
            <a
              className="delete"
              href="javascript:;"
              onClick={this.handleDelete.bind(this, materialId)}
            >
              <img src={deleteImg} />
            </a>
          ) : null}
        </li>
      );
    });

    return html;
  }

  handleDelete(selectedMaterialId, e) {
    this.setState({
      selectedMaterialId,
      showConfirmModal: true
    });
    e.preventDefault();
    e.stopPropagation();
  }

  componentDidMount() {
    this.getList();
  }

  deleteMaterial() {
    const { list, selectedMaterialId } = this.state;
    const { baseUrl } = this.props;
    if (selectedMaterialId) {
      xhr
        .post(`${baseUrl}${DELETE_MATERIAL}`, {
          materialId: selectedMaterialId
        })
        .then(res => {
          if (res && res.data && res.data.materialId) {
            const newList = list.filter(item => {
              return item.materialId !== res.data.materialId;
            });
            this.setState({
              list: newList
            });
          }
        });
    }
    this.setState({
      showConfirmModal: false
    });
  }

  render() {
    const { showAddModal, showConfirmModal, isFetched, list, tabs } = this.state;

    const { userInfo, envUrls, history } = this.props;
    const addModalProps = {
      userInfo,
      envUrls,
      history
    };

    const comfirmModalProps = {
      text: '删除不可恢复，确定删除吗？',
      actions: {
        handleClose: this.handleModalClose,
        handleOk: this.deleteMaterial,
        handleCancel: this.handleModalClose
      }
    };

    return (
      <div className="debossing">
        <div className="pannel-head clearfix">
          {list.length ? <div className="label">烫金压印（共{list.length}条）</div> : null}
          <div className="btn" onClick={this.handleAddMaterial}>
            新建烫印LOGO
          </div>
        </div>

        <CustomTabs tabs={tabs} onTabChange={this.onTabChange} />

        {isFetched ? (
          !list.length ? (
            <div className="empty-tip">暂无烫金压印素材</div>
          ) : (
            <ul className="list">{this.getRenderList()}</ul>
          )
        ) : (
          <LoadingImg />
        )}
        {showAddModal ? (
          <AddMaterialModal {...addModalProps} handleClose={this.handleModalClose} />
        ) : null}
        {showConfirmModal ? <ConfirmModal {...comfirmModalProps} /> : null}
      </div>
    );
  }
}

Debossing.propTypes = {};

Debossing.defaultProps = {};
