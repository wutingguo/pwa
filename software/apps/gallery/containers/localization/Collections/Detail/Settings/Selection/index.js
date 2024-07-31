import { object } from 'prop-types';
import React, { Component, Fragment } from 'react';

import equals from '@resource/lib/utils/compare';

import { XButton, XInput, XPureComponent } from '@common/components';

import Switch from '@apps/gallery/components/Switch';

import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';

import '../Collection/index.scss';

import Rule from './components/Rule';
import mainHandler from './handle/main';

import './index.scss';

class SettingsDesign extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      isShowSuffix: false,
      isShowTip: false,
      tipContent: '',

      inputValueCharge: '',
      isShowSuffixCharge: false,
      isShowTipCharge: false,
      tipContentCharge: '',

      collectSettingCheck: false,
      selectionSetting: {},
    };
    this.handlePresetRuleSave = this.handlePresetRuleSave.bind(this)
  }

  componentDidMount() {
    this.willReceiveProps();
  }

  componentWillReceiveProps(nextProps) {
    const isEqual = equals(this.props, nextProps);
    if (!isEqual) {
      this.willReceiveProps(nextProps);
    }
  }

  willReceiveProps = nextProps => mainHandler.willReceiveProps(this, nextProps);

  instantUpdate = (key, value, cb) => {
    const { collectionPresetSettings, boundProjectActions, envUrls } = this.props;
    const galleryBaseUrl = envUrls.get('galleryBaseUrl');
    const template_id = collectionPresetSettings.get('template_id');
    const template_name = collectionPresetSettings.get('template_name');
    const rule_setting = collectionPresetSettings.get('rule_setting').toJS();
    const setting_type = rule_setting.setting_type;
    let bodyParams = {};
    if (typeof value === 'object' && !key) {
      bodyParams = {
        template_id,
        template_name,
        rule_setting: {
          ...rule_setting,
          ...value,
        },
      };
    } else {
      bodyParams = {
        template_id,
        template_name,
        rule_setting: {
          ...rule_setting,
          [key]: value,
        },
      };
    }

    boundProjectActions
      .presetSettingUpdate({ bodyParams, type: setting_type, galleryBaseUrl })
      .then(() => {
        cb && cb();
      });
  };

  handlePresetRuleSave = (params) => {
    const { boundGlobalActions } = this.props
    this.instantUpdate('', params.collection_rule_setting, () => {
      boundGlobalActions.addNotification({
        message: '加片规则设置 成功',
        level: 'success',
        autoDismiss: 2,
      });
    });
  }

  // getSelectionNumProps = () => mainHandler.getSelectionNumProps(this);
  // getSelectionAddChargeProps = () => mainHandler.getSelectionAddChargeProps(this);
  getSwitchProps = () => mainHandler.getSwitchProps(this);
  onSave = () => mainHandler.onSave(this);

  render() {
    const {
      history,
      match: { params },
      collectionPreviewUrl,
      collectionsSettings,
      presetState,
    } = this.props;

    // settings header
    const { id } = params;
    const headerProps = {
      history,
      collectionPreviewUrl,
      collectionId: id,
      title: t('SELECTION_SETTINGS'),
      hasHandleBtns: false,
    };

    const { collectSettingCheck, selectionSetting } = this.state;
    console.log('selection settings********************');

    return (
      <div
        className={`gllery-collection-detail-collection-settings selection-setting ${
          presetState ? 'presetWrapper' : ''
        }`}
      >
        {/* 主渲染区域. */}
        <div className="content">
          {/* settings header */}
          {!presetState && <CollectionDetailHeader {...headerProps} />}

          {/* collection settings 区域 */}
          {collectionsSettings && collectionsSettings.size ? (
            <div className="collection-settings-wrap">
              <div className="settings-item">
                <div className="item-name">{t('SETTING_STATUS')}</div>
                <div className="item-content" style={{ position: 'relative', left: '-13px' }}>
                  <Switch {...this.getSwitchProps()} />
                </div>
                <p class="desc">
                  开启后，将按照配置的加片规则向客户收取选片费用，支持多种支付方式。
                </p>
              </div>

              {collectSettingCheck && (
                <Fragment>
                  <Rule {...this.props} settings={selectionSetting} onPresetSave={this.handlePresetRuleSave} />
                  {/* <div className="settings-item selection-setting-save">
                    <XButton onClicked={this.onSave}>{t('SAVE')}</XButton>
                  </div> */}
                </Fragment>
              )}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default SettingsDesign;
