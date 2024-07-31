import { object } from 'prop-types';
import React, { Component, Fragment } from 'react';

import equals from '@resource/lib/utils/compare';

import { XButton, XInput, XPureComponent } from '@common/components';

import Switch from '@apps/gallery/components/Switch';

import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';

import '../Collection/index.scss';

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
    };
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

    console.log('bodyParams: ', bodyParams);
    boundProjectActions
      .presetSettingUpdate({ bodyParams, type: setting_type, galleryBaseUrl })
      .then(() => {
        cb && cb();
      });
  };

  getSelectionNumProps = () => mainHandler.getSelectionNumProps(this);
  getSelectionAddChargeProps = () => mainHandler.getSelectionAddChargeProps(this);
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

    const { collectSettingCheck } = this.state;
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
                <div className="item-content">
                  <Switch {...this.getSwitchProps()} />
                </div>
              </div>

              {collectSettingCheck && (
                <Fragment>
                  <div className="settings-item">
                    <div className="item-name">{t('SELECTION_NUM_FREE')}</div>
                    <div className="item-content clear-input-num-style">
                      <XInput {...this.getSelectionNumProps()} />
                    </div>
                  </div>

                  <div className="settings-item">
                    <div className="item-name">{t('SELECTION_ADD_CHARGE')}</div>
                    <div className="item-content add-charge clear-input-num-style">
                      <span>超过选片张数，每加片1张 收费</span>
                      <XInput {...this.getSelectionAddChargeProps()} />
                      <span>元</span>
                    </div>
                  </div>

                  <div className="settings-item selection-setting-save">
                    <XButton onClicked={this.onSave}>{t('SAVE')}</XButton>
                  </div>
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
