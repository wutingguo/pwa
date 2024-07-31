import React, { Component } from 'react';

import {
  IMAGE_SRC,
  UPLOAD_IMG,
  ADD_STICKER,
  GET_GROUP_LIST,
  GET_STICKER_LIST,
  UPDATE_STICKER,
  DELETE_STICKER,
  ADD_STICKER_GROUP,
  CHANGE_STICKER_GROUP,
  DELETE_STICKER_GROUP,
  UPDATE_ELEMENT_GROUP
} from '../../constants/apiUrl';

import * as xhr from '@resource/websiteCommon/utils/xhr';
import getPuid from '@resource/websiteCommon/utils/getPuid';
import { template } from '../../utils/template';
import { guid } from '@resource/lib/utils/math';

import { getAlbumId } from '../../utils/upload';
import { pushState, getQs } from '../../utils/url';

import LoadingImg from '@common/components/LoadingImg';
import XUploadModal from '../XUploadModal';
import XPagePagination from '@resource/components/XPagePagination';

import EditStickerModal from './EditStickerModal';
import DeleteModal from './DeleteModal';
import EditGroupModal from './EditGroupModal';
import MoveGroupModal from './MoveGroupModal';
import classNames from 'classnames';
import './index.scss';


const pageSize = 30;

export default class Stickers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetched: true,
      list: [],
      isShowUploadModal: false,
      requestParams: {},
      uploadUrl: '',
      uploadingImages: [],
      selectedCatId: 0,
      editItem: null,
      name: '',
      editNameId: '',
      category: [],
      maxTextLength: 20,
      selectedStickers: [],
      deleteItemId: '',
      moveItemId: '',
      showDeleteSelected: false,
      showMoveSelected: false,
      showEditName: false,
      pageObj: {},
      showGroupDelete: false,
      showEditGrpName: false,
      editGrpItem: null,
      grpName: ''
    };

    this.getRenderList = this.getRenderList.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.addImages = this.addImages.bind(this);
    this.addGroup = this.addGroup.bind(this);
    this.changeGroup = this.changeGroup.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
    this.deleteSticker = this.deleteSticker.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.addSticker = this.addSticker.bind(this);
    this.updateSticker = this.updateSticker.bind(this);
    this.onCloseUploadModal = this.onCloseUploadModal.bind(this);
    this.onUploadSuccess = this.onUploadSuccess.bind(this);
    this.getRenderCategory = this.getRenderCategory.bind(this);
    this.onClickCategory = this.onClickCategory.bind(this);
    this.getCatrgories = this.getCatrgories.bind(this);
    this.onEditName = this.onEditName.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onNameBlur = this.onNameBlur.bind(this);
    this.onMoreClick = this.onMoreClick.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onPreventDefault = this.onPreventDefault.bind(this);
    this.onCloseDelete = this.onCloseDelete.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onCloseMove = this.onCloseMove.bind(this);
    this.selectOrUnSelectSticker = this.selectOrUnSelectSticker.bind(this);
    this.clearSelect = this.clearSelect.bind(this);
    this.selectOrUnSelectAll = this.selectOrUnSelectAll.bind(this);
    this.onDeleteSelected = this.onDeleteSelected.bind(this);
    this.onCloseDeleteSelected = this.onCloseDeleteSelected.bind(this);
    this.onMoveSelected = this.onMoveSelected.bind(this);
    this.onCloseMoveSelected = this.onCloseMoveSelected.bind(this);
    this.onShowEditName = this.onShowEditName.bind(this);
    this.onCloseEditName = this.onCloseEditName.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.onBackToAll = this.onBackToAll.bind(this);
    this.onShowGrpDelete = this.onShowGrpDelete.bind(this);
    this.onCloseGrpDelete = this.onCloseGrpDelete.bind(this);
    this.onEditGrpName = this.onEditGrpName.bind(this);
    this.onCloseEditGrpName = this.onCloseEditGrpName.bind(this);
    this.onGrpNameChange = this.onGrpNameChange.bind(this);
    this.onGrpNameBlur = this.onGrpNameBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onNameKeyUp = this.onNameKeyUp.bind(this);
    this.onGrpNameKeyUp = this.onGrpNameKeyUp.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleDeleteModal = this.handleDeleteModal.bind(this);
  }

  getUrl = url => `${this.props.baseUrl}${url}`;

  addSticker(image) {
    const { selectedCatId, category } = this.state;
    const { name, encImgId } = image;
    const groupUid =
      selectedCatId || (category && category.length ? category[0].uidpk : '');
    xhr
      .post(this.getUrl(ADD_STICKER), {
        name: name.replace(/\.\w+/g, ''),
        encImgId,
        groupUid
      })
      .then(res => {
        if (res && res.data && res.data.data) {
          this.getCatrgories();
          const t = setTimeout(() => {
            clearTimeout(t);
            const { list } = this.state;
            const newList = [res.data.data, ...list];
            this.setState({
              list: newList
            });
          });
        }
      });
  }

  updateSticker(params = {}) {
    const { list } = this.state;
    xhr
      .post(this.getUrl(UPDATE_STICKER), params)
      .then(res => {
        if (res && res.data && res.data.data) {
          this.getCatrgories();
          const newList = list.map(item => {
            if (res.data.data.uidpk === item.uidpk) {
              return Object.assign({}, item, res.data.data);
            }
            return item;
          });
          this.setState({
            name: '',
            editItem: null,
            editNameId: '',
            list: newList
          });
        } else {
          this.setState({
            name: '',
            editNameId: '',
            editItem: null
          });
        }
      })
      .catch(() => {
        this.setState({
          name: '',
          editNameId: '',
          editItem: null
        });
      });
  }

  deleteSticker(ids) {
    const { list, selectedStickers } = this.state;
    const materialId = ids.join(',');
    xhr
      .post(this.getUrl(DELETE_STICKER), {
        materialId
      })
      .then(res => {
        if (res && res.success) {
          this.getCatrgories();
          const newList = list.filter(o => ids.indexOf(o.uidpk) === -1);
          const newSelectedStickers = selectedStickers.filter(
            o => ids.indexOf(o) === -1
          );
          this.setState({
            list: newList,
            selectedStickers: newSelectedStickers
          });
        }
      });
  }

  addGroup(name) {
    const { category } = this.state;
    xhr
      .post(this.getUrl(ADD_STICKER_GROUP), {
        name
      })
      .then(res => {
        if (res && res.data) {
          this.getCatrgories();
        }
      });
  }

  changeGroup(ids, groupUid) {
    const { list, selectedStickers, category, selectedCatId } = this.state;
    xhr
      .post(this.getUrl(CHANGE_STICKER_GROUP), {
        materialId: ids.join(','),
        groupUid
      })
      .then(res => {
        if (res && res.success) {
          this.getCatrgories();
          const newList = selectedCatId
            ? list.filter(o => ids.indexOf(o.uidpk) === -1)
            : list;
          const newSelectedStickers = selectedStickers.filter(
            o => ids.indexOf(o) === -1
          );
          this.setState({
            list: newList,
            selectedStickers: newSelectedStickers
          });
        }
      });
  }

  deleteGroup(groupUid) {
    xhr
      .post(this.getUrl(DELETE_STICKER_GROUP), {
        groupUid
      })
      .then(res => {
        if (res && res.success) {
          this.getCatrgories();
          this.setState(
            {
              selectedCatId: 0
            },
            () => {
              pushState({
                catid: 0,
                page: 0
              });
              this.getList();
            }
          );
        }
      });
  }

  updateGroup(params) {
    xhr.post(this.getUrl(UPDATE_ELEMENT_GROUP), params).then(res => {
      if (res && res.success) {
        this.getCatrgories();
      }
      this.setState({
        editGrpItem: null,
        grpName: ''
      });
    }).catch(err => {
      this.setState({
        editGrpItem: null,
        grpName: ''
      });
    });
  }

  addImages(images) {
    if (images && images.length) {
      const { uploadingImages } = this.state;
      let newUploadingImages = [...uploadingImages];
      images.forEach(file => {
        file.guid = guid();
        newUploadingImages = newUploadingImages.concat({
          file
        });
      });
      this.setState({
        uploadingImages: newUploadingImages,
        isShowUploadModal: true
      });
    }
  }

  selectOrUnSelectSticker(uidpk) {
    const { selectedStickers } = this.state;
    const index = selectedStickers.findIndex(o => o === uidpk);
    let newSelectedStickers;
    if (index === -1) {
      newSelectedStickers = selectedStickers.concat(uidpk);
    } else {
      newSelectedStickers = selectedStickers.filter(o => o !== uidpk);
    }
    this.setState({
      selectedStickers: newSelectedStickers
    });
  }

  clearSelect() {
    this.setState({
      selectedStickers: []
    });
  }

  selectOrUnSelectAll() {
    const { list, selectedStickers } = this.state;

    let newSelectedStickers = [];
    if (selectedStickers.length < list.length) {
      newSelectedStickers = list.map(item => {
        return item.uidpk;
      });
    }
    this.setState({
      selectedStickers: newSelectedStickers
    });
  }

  getCatrgories() {
    xhr.post(this.getUrl(GET_GROUP_LIST)).then(res => {
      if (res && res.data) {
        this.setState({
          category: res.data
        });
      }
    });
  }

  handleDeleteModal = (selectedStickers) => {
    const { boundGlobalActions } = this.props;
    const { showConfirm, hideConfirm } = boundGlobalActions;
    const data = {
      message: '确定删除此素材吗？',
      close: () => hideConfirm(),
      buttons: [
        {
          text: t('DELETE'),
          className: 'pwa-btn',
          onClick: () => this.deleteSticker(selectedStickers)
        },
        {
          text: t('CANCEL'),
          className: 'pwa-btn white'
        }
      ]
    }
    showConfirm(data);
  }

  getList() {
    const { selectedCatId } = this.state;
    const page = getQs('page') || 0;
    this.setState({
      isFetched: false,
      selectedStickers: []
    });
    const groupUid = selectedCatId || '';
    // if (groupUid) {
    //   logEvent.addPageEvent({ name: 'YX_PC_StickerManager_Click_CustomGroup' });
    // } else {
    //   logEvent.addPageEvent({ name: 'YX_PC_StickerManager_Click_ReturnAll' });
    // }
    xhr
      .post(this.getUrl(GET_STICKER_LIST), {
        groupUid,
        pageSize,
        pageNum: page
      })
      .then(res => {
        if (res && res.data && res.data.list) {
          this.setState({
            list: res.data.list,
            pageObj: res.data.page,
            isFetched: true
          });
        }
      });
  }

  onPreventDefault(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  onClickCategory(uidpk = 0) {
    const { selectedCatId } = this.state;
    if (selectedCatId === uidpk) {
      return;
    }

    this.setState(
      {
        selectedCatId: uidpk
      },
      () => {
        pushState({
          catid: uidpk,
          page: 0
        });
        this.getList();
      }
    );
  }

  onUploadClick() {
    const { baseUrl, userInfo } = this.props;
    const { uidPk, securityToken, timestamp } = userInfo;
    const uploadBaseUrl = this.props.uploadBaseUrl;
    logEvent.addPageEvent({ name: 'DesignerMaterialMT_Click_UploadSticker' })
    this.uploadNode && this.uploadNode.click();
    getAlbumId({ baseUrl, userInfo }).then(albumId => {
      this.setState({
        requestParams: {
          uid: uidPk,
          token: securityToken,
          timestamp,
          albumId
        },
        uploadUrl: template(UPLOAD_IMG, {
          uploadBaseUrl,
          size: '',
          isNeedResize: false,
          isCheckDpi: false
        })
      });
    });
  }

  checkPNG = files => {
    let check = false;
    for (const file of files) {
      const parts = file.name.split('.');
      const filename = parts[parts.length - 1];
      if (filename.toUpperCase() !== 'PNG') {
        check = true;
        break
      }
    };
    return check
  }

  onFileChange(e) {
    if (e && e.target.files) {
      // 检测后缀名
      if (this.checkPNG(e.target.files)) {
        this.props.boundGlobalActions.addNotification({
          message: t('FILE_ERROR_PNG_ONLY'),
          level: 'error',
          autoDismiss: 2
        });
        return false;
      }

      this.addImages([].slice.call(e.target.files, 0));
      e.target.value = '';
    }
  }

  onUploadSuccess(image) {
    const { uploadingImages } = this.state;
    // 剔除已经上传好的
    const newUploadingImages = uploadingImages.filter(img => {
      return img.file.guid !== image.guid;
    });
    this.setState({
      uploadingImages: newUploadingImages
    });
    this.addSticker(image);
  }

  onCloseUploadModal() {
    this.setState({
      isShowUploadModal: false,
      uploadingImages: []
    });
  }

  onEditName(item, e) {
    const { name } = item;
    this.setState({
      editItem: item,
      editNameId: item.uidpk,
      name
    });

    this.onPreventDefault(e);
  }

  onNameChange(e) {
    const { value } = e.target;
    const { maxTextLength } = this.state;
    const reg = /[^\u4e00-\u9fa5a-zA-Z0-9`~!\\s@#$%^&*()+-_=|{}':;',\\[\\].<>?！@#￥……&*（）—|{}【】‘；：”“'。，、？]/gim;
    const newName = `${value}`
      .replace(reg, '')
      .substring(0, maxTextLength);
    this.setState({
      name: newName
    });
  }

  onNameBlur(e) {
    const { editItem, name } = this.state;
    const { uidpk, groupUid } = editItem;
    if (name !== editItem.name) {
      this.updateSticker({
        name: name.trim(),
        groupUid,
        materialId: uidpk
      });
    } else {
      this.setState({
        editItem: null,
        name: '',
        editNameId: ''
      });
    }
  }

  onMoreClick(editItem, e) {
    const oldItem = this.state.editItem;
    if (oldItem) {
      if (oldItem.uidpk !== editItem.uidpk) {
        this.setState({
          editItem
        });
      } else {
        this.setState({
          editItem: null
        });
      }
    } else {
      this.setState({
        editItem
      });
    }
    this.onPreventDefault(e);
  }

  onClear() {
    this.setState({
      editItem: null,
      name: '',
      editNameId: '',
      deleteItemId: '',
      moveItemId: '',
      showDeleteSelected: false,
      showMoveSelected: false,
      showEditName: false,
      showEditGrpName: false,
      showGroupDelete: false
    });
  }

  onDelete(item) {
    this.setState({
      editItem: null,
      deleteItemId: item.uidpk
    });
  }

  onCloseDelete(e) {
    this.setState({
      deleteItemId: ''
    });
    this.onPreventDefault(e);
  }

  onMove(item, e) {
    this.setState({
      editItem: null,
      moveItemId: item.uidpk
    });
    this.onPreventDefault(e);
  }

  onCloseMove(e) {
    this.setState({
      moveItemId: ''
    });
    this.onPreventDefault(e);
  }

  onDeleteSelected(e) {
    this.setState({
      showMoveSelected: false,
      showEditName: false,
      showDeleteSelected: true
    });
    this.onPreventDefault(e);
  }

  onCloseDeleteSelected(e) {
    this.setState({
      showDeleteSelected: false
    });
    this.onPreventDefault(e);
  }

  onMoveSelected(e) {
    this.setState({
      showDeleteSelected: false,
      showEditName: false,
      showMoveSelected: true
    });

    this.onPreventDefault(e);
  }

  onCloseMoveSelected(e) {
    this.setState({
      showMoveSelected: false
    });
    this.onPreventDefault(e);
  }

  onShowEditName(e) {
    this.setState({
      showMoveSelected: false,
      showDeleteSelected: false,
      showEditName: true
    });
    this.onPreventDefault(e);
  }

  onCloseEditName(e) {
    this.setState({
      showEditName: false
    });
    this.onPreventDefault(e);
  }

  onChangeFilter(data) {
    const { value } = data;
    pushState({
      page: value - 1
    });
    this.getList();
  }

  onBackToAll() {
    this.setState(
      {
        selectedCatId: 0
      },
      () => {
        pushState({
          catid: 0,
          page: 0
        });
        this.getList();
      }
    );
  }

  onShowGrpDelete(e) {
    this.setState({
      showEditGrpName: false,
      showGroupDelete: true
    });
    this.onPreventDefault(e);
  }

  onCloseGrpDelete(e) {
    this.setState({
      showGroupDelete: false
    });
    this.onPreventDefault(e);
  }

  onEditGrpName(editGrpItem, e) {
    this.setState({
      editGrpItem,
      showGroupDelete: false,
      grpName: editGrpItem.name
    });

    this.onPreventDefault(e);
  }

  onCloseEditGrpName(e) {
    this.setState({
      showEditGrpName: false
    });
    this.onPreventDefault(e);
  }

  onGrpNameChange(e) {
    const { value } = e.target;
    const { maxTextLength } = this.state;
    const reg = /[^\u4e00-\u9fa5a-zA-Z0-9`~!\\s@#$%^&*()+-_=|{}':;',\\[\\].<>?！@#￥……&*（）—|{}【】‘；：”“'。，、？]/gim;
    const newName = `${value}`
      .replace(reg, '')
      .substring(0, maxTextLength);
    this.setState({
      grpName: newName
    });
  }

  onGrpNameBlur(e) {
    const { editGrpItem, grpName } = this.state;
    const { uidpk } = editGrpItem;
    if (grpName !== editGrpItem.name) {
      this.updateGroup({
        name: grpName.trim(),
        groupUid: uidpk
      });
    } else {
      this.setState({
        editGrpItem: null,
        grpName: ''
      });
    }
  }

  loadData() {
    this.getCatrgories();

    const catid = getQs('catid');
    if (catid) {
      this.setState(
        {
          selectedCatId: parseInt(catid)
        },
        () => {
          this.getList();
        }
      );
    } else {
      this.getList();
    }
  }

  getRenderList() {
    const {
      list,
      category,
      selectedCatId,
      editItem,
      selectedStickers,
      editNameId,
      deleteItemId,
      moveItemId
    } = this.state;
    const html = [];
    const uploadBaseUrl = this.props.uploadBaseUrl;

    list.forEach((item, index) => {
      const { name, uidpk, isDeleted, relEntityUid, groupUid } = item;

      if (selectedCatId !== 0 && selectedCatId !== groupUid) {
        return;
      }

      const isEditName = editNameId && editNameId === uidpk;
      const isEditItem = editItem && editItem.uidpk === uidpk && !isEditName;
      const isSelected = selectedStickers.indexOf(uidpk) !== -1;
      const isDelete = deleteItemId === uidpk;
      const isMoveCategory = moveItemId === uidpk;
      const showName = isEditName ? this.state.name : name;
      const showCategory = selectedCatId
        ? category.filter(o => o.uidpk !== selectedCatId)
        : category;
      const src = template(IMAGE_SRC, {
        encImgId: getPuid(relEntityUid),
        uploadBaseUrl
      });
      const className = classNames('sticker-item', {
        selected: isSelected
      });

      const editStickerModalProps = {
        actions: {
          onRename: e => {
            this.onEditName(item, e);

          },
          onDelete: e => {
            this.onDelete(item, e);
          },
          onMoveCat: e => {
            this.onMove(item, e);
          }
        },
        isShowMove: showCategory.length || !selectedCatId
      };

      const deleteModalProps = {
        actions: {
          handleOk: e => {
            this.deleteSticker([uidpk], e);
            this.onCloseDelete(e);
          },
          handleClose: e => {
            this.onCloseDelete(e);
          }
        }
      };

      const moveModalProps = {
        actions: {
          handleOk: (groupUid, e) => {
            this.changeGroup([uidpk], groupUid, e);
            this.onCloseMove(e);
          },
          handleClose: e => {
            this.onCloseMove(e);
          }
        },
        category: showCategory
      };

      html.push(
        <li className={className} onMouseLeave={this.onMouseOutItem} key={`item-${index}`}>
          <div className="img-wrap" onClick={this.selectOrUnSelectSticker.bind(this, uidpk)}>
            <img src={src} />
            <div className="action">
              <div
                className="select-label"
              />
              <div
                className="edit-label"
                onClick={this.onMoreClick.bind(this, item)}
              >
                {isEditItem ? (
                  <EditStickerModal {...editStickerModalProps} />
                ) : null}
                {isDelete ? <DeleteModal {...deleteModalProps} /> : null}
                {isMoveCategory ? (
                  <MoveGroupModal {...moveModalProps} />
                ) : null}
              </div>
            </div>
          </div>
          <div className="name">
            {isEditName ? (
              <input
                type="text"
                value={showName}
                onClick={this.onPreventDefault}
                onChange={this.onNameChange}
                onBlur={this.onNameBlur}
                onFocus={this.onFocus}
                onKeyUp={this.onNameKeyUp}
                autoFocus
              />
            ) : (
              <div
                className="label"
                onClick={this.onEditName.bind(this, item)}
              >
                {name}
              </div>
            )}
          </div>
        </li>
      );
    });

    return html;
  }

  getRenderCategory() {
    const { list, selectedCatId, category, editGrpItem, grpName, showGroupDelete } = this.state;
    const html = [];

    const totalRecords = category.reduce((a, item) => {
      return a + (item.materialNum || 0);
    }, 0);

    const deleteGrpProps = {
      actions: {
        handleOk: (e) => {
          this.deleteGroup(selectedCatId);
          this.onCloseGrpDelete(e);
        },
        handleClose: (e) => {
          this.onCloseGrpDelete(e);
        }
      },
      text: '仅删除分组，不删除图片，组内图片自动归入未分组？'
    };

    const firstClass = classNames('', {
      selected: selectedCatId === 0
    });
    html.push(
      <li
        key="c0"
        className={firstClass}
        onClick={this.onClickCategory.bind(this, 0)}
      >
        所有照片（{totalRecords}）
      </li>
    );

    category.forEach((item, index) => {
      const { name, materialNum = 0, uidpk, type } = item;
      const className = classNames('', {
        selected: selectedCatId === uidpk
      });
      const isShowAction = type === 1 && selectedCatId === uidpk;
      const isEditItem = editGrpItem && editGrpItem.uidpk === uidpk;
      const isShowGrpDelete = showGroupDelete && selectedCatId === uidpk;

      html.push(
        <li
          key={`c-${index + 1}`}
          className={className}
          onClick={this.onClickCategory.bind(this, uidpk)}
        >
          {isEditItem ? (
            <input
              type="text"
              value={grpName}
              onClick={this.onPreventDefault}
              onChange={this.onGrpNameChange}
              onBlur={this.onGrpNameBlur}
              onKeyUp={this.onGrpNameKeyUp}
              onFocus={this.onFocus}
              autoFocus
            />
          ) : (
            `${name}（${materialNum}）`
          )}
          {isShowAction ? (
            <span className="grp-action">
              {!isEditItem ? (
                <a
                  href="javascript:;"
                  className="edit"
                  title="重命名"
                  onClick={this.onEditGrpName.bind(this, item)}
                />
              ) : null}
              <a href="javascript:;" className="del" title="删除" onClick={this.onShowGrpDelete}>
                {isShowGrpDelete ? <DeleteModal {...deleteGrpProps} /> : null}
              </a>
            </span>
          ) : null}
        </li>
      );
    });

    return html;
  }

  onFocus(e) {
    if (e.target) {
      const { value } = e.target;
      e.target.selectionStart = value.length;
      e.target.selectionEnd = value.length;
    }
  }

  onNameKeyUp(e) {
    if (e && e.keyCode && e.keyCode === 13) {
      this.onNameBlur(e);
    }
  }

  onGrpNameKeyUp(e) {
    if (e && e.keyCode && e.keyCode === 13) {
      this.onGrpNameBlur(e);
    }
  }

  componentDidMount() {
    this.loadData();
    window.addEventListener('click', this.onClear, false);
    window.addEventListener('popstate', this.loadData, false);
  }

  componentWillUnMount() {
    window.removeEventListener('click', this.onClear, false);
    window.removeEventListener('popstate', this.loadData, false);
  }

  render() {
    const {
      isFetched,
      list,
      requestParams,
      uploadUrl,
      category,
      uploadingImages,
      isShowUploadModal,
      selectedStickers,
      editNameId,
      editItem,
      showDeleteSelected,
      showMoveSelected,
      showEditName,
      pageObj,
      selectedCatId,
      showGroupDelete,
      showEditGrpName
    } = this.state;

    const currentGroup =
      category && category.length
        ? category.find(o => o.uidpk === selectedCatId)
        : null;
    const { count = 0, pageSize = 0, pageNum = 0 } = pageObj;
    const totalPages = Math.ceil(count / pageSize);

    const uploadModalProps = {
      isShown: isShowUploadModal,
      uploadingImages,
      requestParams,
      uploadUrl,
      subTitle: '请上传透明底png格式的图片',
      actions: {
        onCloseModal: this.onCloseUploadModal,
        onAddImages: this.addImages,
        onUploadSuccess: this.onUploadSuccess,
        onShowConfirm: () => { },
        onShowHelp: () => { }
      }
    };

    const isAllSeleced = selectedStickers.length === list.length;
    const selectToolClass = classNames('select-tool clearfix', {
      all: isAllSeleced
    });

    const showCategory = selectedCatId
      ? category.filter(o => o.uidpk !== selectedCatId)
      : category;
    const moveModalProps = {
      actions: {
        handleOk: (groupUid, e) => {
          this.changeGroup(selectedStickers, groupUid, e);
          this.onCloseMoveSelected(e);
        },
        handleClose: e => {
          this.onCloseMoveSelected(e);
        }
      },
      category: showCategory
    };

    const editModalProps = {
      actions: {
        handleOk: (name, e) => {
          this.addGroup(name, e);
          this.onCloseEditName(e);
        },
        handleClose: e => {
          this.onCloseEditName(e);
        }
      }
    };

    return (
      <div className="stickers">
        <div className="pannel-head clearfix">
          <div className="left">
            <div className="label">贴纸（共{count}条）</div>
            <ul className="category clearfix">
              <li>分组</li>
              {this.getRenderCategory()}
            </ul>
          </div>
          <div className="right">
            <div className="btn" onClick={this.onUploadClick}>
              上传
            </div>
            <div className="btn btn-white1" onClick={this.onShowEditName}>
              新建分组
              {showEditName ? <EditGroupModal {...editModalProps} /> : null}
            </div>
          </div>
          <input
            type="file"
            className="hidden"
            ref={node => (this.uploadNode = node)}
            onChange={this.onFileChange}
            accept="image/x-png,image/png"
            multiple
          />
        </div>
        {isFetched ? (
          !list.length ? (
            <div className="empty-tip">该分组暂时没有图片素材</div>
          ) : (
            <div className="stickers-content">
              {selectedStickers.length ? (
                <div className={selectToolClass}>
                  <div className="left">
                    已选择
                    {selectedStickers.length}项内容
                    {
                      selectedStickers.length !== list.length ?
                        <a
                          href="javascript:;"
                          onClick={this.selectOrUnSelectAll}
                        >
                          全选
                      </a> : null
                    }
                    <a
                      href="javascript:;"
                      onClick={this.clearSelect}
                    >
                      取消选择
                    </a>
                  </div>
                  <div className="right">
                    <a
                      href="javascript:;"
                      className="del"
                      title="删除"
                      onClick={() => this.handleDeleteModal(selectedStickers)}
                    >
                    </a>
                    {
                      showCategory.length ?
                        <a
                          href="javascript:;"
                          className="move"
                          title="移动分组"
                          onClick={this.onMoveSelected}
                        >
                          {showMoveSelected ? (
                            <MoveGroupModal {...moveModalProps} />
                          ) : null}
                        </a> : null
                    }
                  </div>
                </div>
              ) : null}
              <ul className="list clearfix">{this.getRenderList()}</ul>
              {totalPages > 1 ? (
                <div className="pagenation-container">
                  <XPagePagination
                    currentPage={pageNum + 1}
                    totalPage={totalPages}
                    changeFilter={this.onChangeFilter}
                  />
                </div>
              ) : null}
            </div>
          )
        ) : (
          <LoadingImg />
        )}
        {isShowUploadModal ? <XUploadModal {...uploadModalProps} /> : null}
      </div>
    );
  }
}

Stickers.propTypes = {};

Stickers.defaultProps = {};
