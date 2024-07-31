import React, { Component } from 'react';

import XButton from '@resource/components/XButton';

import { NAME_CN_REG, NAME_REG } from '@resource/lib/constants/reg';

import deletePng from '@resource/static/icons/handleIcon/delet_1.png';
import editorPng from '@resource/static/icons/handleIcon/editor.png';
import presetPng from '@resource/static/icons/preset.png';

import * as localModalTypes from '@apps/gallery/constants/modalTypes';

import './index.scss';

class CollectionPreset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      presetList: [],
    };
  }

  componentDidMount() {
    this.getPresetList();
  }
  getPresetList = () => {
    const {
      boundProjectActions,
      urls,
      userAuth: { customerId },
    } = this.props;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    boundProjectActions.getPresetList({ customer_id: customerId, galleryBaseUrl }).then(res => {
      const { data = [] } = res;
      console.log('data: ', data);
      this.setState({
        presetList: data,
      });
    });
  };

  createPreset = () => {
    const { boundGlobalActions, userInfo } = this.props;
    window.logEvent.addPageEvent({
      name: 'GalleryPhotos_Settings_AddPreset',
    });
    boundGlobalActions.showModal(localModalTypes.SHOW_COLLECTION_PRESET_MODAL, {
      userInfo,
      onClose: () => {
        this.getPresetList();
        boundGlobalActions.hideModal(localModalTypes.SHOW_COLLECTION_PRESET_MODAL);
      },
    });
  };

  openPreset = template_id => {
    const { boundGlobalActions, userInfo } = this.props;
    boundGlobalActions.showModal(localModalTypes.SHOW_COLLECTION_PRESET_MODAL, {
      template_id,
      userAuth: this.props.userAuth,
      userInfo,
      onClose: () => {
        this.getPresetList();
        boundGlobalActions.hideModal(localModalTypes.SHOW_COLLECTION_PRESET_MODAL);
      },
    });
  };
  editPresetName = (item, event) => {
    event.stopPropagation();
    const { presetList } = this.state;
    const { template_id, template_name } = item;
    const list = presetList.map(preset => {
      return Object.assign({}, preset, { isEditing: template_id === preset.template_id });
    });
    this.setState({
      presetList: list,
      curTemplateName: template_name,
    });
  };
  deletePreset = item => {
    const { boundGlobalActions, boundProjectActions, urls } = this.props;
    const { showConfirm, hideConfirm } = boundGlobalActions;
    const { template_id } = item;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const data = {
      className: 'delete-collection-modal',
      close: hideConfirm,
      title: `${t('DELETE_PRESET')}?`,
      message: t('DELETE_PRESET_WARN'),
      buttons: [
        {
          className: 'white pwa-btn',
          text: t('CANCEL'),
          onClick: () => {
            hideConfirm();
          },
        },
        {
          className: 'pwa-btn',
          text: t('DELETE'),
          onClick: () => {
            boundProjectActions.deletePreset({ template_id, galleryBaseUrl }).then(res => {
              if (res.ret_code === 200000) {
                this.getPresetList();
              }
            });
          },
        },
      ],
    };
    showConfirm(data);
  };
  resetPresetListStatus = () => {
    const { presetList } = this.state;
    const list = presetList.map(item => {
      return { ...item, isEditing: false };
    });
    this.setState({
      presetList: list,
    });
  };
  changePresetName = (item, event, type) => {
    const {
      boundProjectActions,
      urls,
      userAuth: { customerId },
      boundGlobalActions,
    } = this.props;
    const { curTemplateName } = this.state;
    const galleryBaseUrl = urls.get('galleryBaseUrl');

    const { template_id, template_name } = item;
    const value = event.target.value;
    const nameReg = __isCN__ ? NAME_CN_REG : NAME_REG;

    const isLegal = nameReg.test(value);

    if (!value) {
      this.resetPresetListStatus();
      return;
    }
    if (!isLegal) {
      boundGlobalActions.addNotification({
        message: t('CREATE_COLLECTION_ILLEGAL_TIP'),
        level: 'error',
        autoDismiss: 3,
      });
      return;
    }
    if (value && value.length >= 20) return;
    if (type === 'change') {
      this.setState({
        curTemplateName: value,
      });
      return;
    }
    if (curTemplateName === template_name) {
      this.resetPresetListStatus();
      return;
    }

    boundProjectActions
      .renamePreset({ bodyParams: { template_id, template_name: value }, galleryBaseUrl })
      .then(res => {
        if (res.ret_code === 200000) {
          this.getPresetList();
        }
      });
  };

  render() {
    const { presetList } = this.state;
    return (
      <div className="presetListWrap">
        {presetList &&
          presetList.map(item => (
            <div className="itemPresetWrap" onClick={() => this.openPreset(item.template_id)}>
              <div className="imgwrap">
                <img src={presetPng} />
              </div>
              <div className="handleBar">
                {item.isEditing ? (
                  <input
                    className="edit_input"
                    value={this.state.curTemplateName}
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    autoFocus
                    onChange={event => {
                      this.changePresetName(item, event, 'change');
                    }}
                    onBlur={event => {
                      event.stopPropagation();
                      this.changePresetName(item, event, 'blur');
                    }}
                  />
                ) : (
                  <div className="name">{item.template_name}</div>
                )}
                <div className="actions">
                  {!item.isEditing && (
                    <img
                      src={editorPng}
                      onClick={event => {
                        this.editPresetName(item, event);
                      }}
                    />
                  )}
                  <img
                    src={deletePng}
                    onClick={e => {
                      e.stopPropagation();
                      this.deletePreset(item);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        <div className="itemPresetWrap btnWrapper">
          <XButton className="btn" onClick={this.createPreset}>
            + {t('ADD_COLLECTION_PRESET')}
          </XButton>
        </div>
      </div>
    );
  }
}

export default CollectionPreset;
