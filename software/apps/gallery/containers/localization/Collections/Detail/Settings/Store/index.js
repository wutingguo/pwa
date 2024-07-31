import React, { Fragment } from 'react';

import equals from '@resource/lib/utils/compare';

import { XPureComponent } from '@common/components';

import Switch from '@apps/gallery/components/Switch';

import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';

import StorePriceSheetSelect from './StorePriceSheetSelect/index';
import mainHandler from './handle/main';
import storeSettingService from './service';

import './index.scss';

class SettingsStore extends XPureComponent {
  constructor(props) {
    super(props);
    const { collectionsSettings } = this.props;
    const store_status =
      collectionsSettings && collectionsSettings.getIn(['collection_setting', 'store_status']);

    this.state = {
      loading: false,
      storeStatusChecked: !!store_status,
      priceSheetOptions: [],
      selectedPriceSheetOption: null,
      selectedPriceSheetOptionValue: '',
      switchDisabled: false,
    };
  }

  async componentDidMount() {
    const { collectionsSettings } = this.props;

    if (collectionsSettings && collectionsSettings.size) {
      const storeStatusChecked = !!collectionsSettings.getIn([
        'collection_setting',
        'store_status',
      ]);

      if (storeStatusChecked) {
        this.init();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { collectionsSettings: preCollectionsSettings } = this.props;
    const { collectionsSettings } = nextProps;
    if (collectionsSettings?.size) {
      const storeStatusChecked = !!collectionsSettings.getIn([
        'collection_setting',
        'store_status',
      ]);

      this.setState({
        storeStatusChecked,
      });

      // 初次进入页面时（刷新） collectionsSettings为undefined
      if (!preCollectionsSettings?.size && storeStatusChecked) {
        this.init();
      }
    }
  }

  instantUpdate = (key, value, cb) => {
    const { collectionPresetSettings, boundProjectActions, envUrls } = this.props;
    const galleryBaseUrl = envUrls.get('galleryBaseUrl');
    const template_id = collectionPresetSettings.get('template_id');
    const template_name = collectionPresetSettings.get('template_name');
    const store_setting = collectionPresetSettings.get('store_setting').toJS();
    const setting_type = store_setting.setting_type;
    let bodyParams = {};
    if (typeof value === 'object' && !key) {
      bodyParams = {
        template_id,
        template_name,
        store_setting: {
          ...store_setting,
          ...value,
        },
      };
    } else {
      bodyParams = {
        template_id,
        template_name,
        store_setting: {
          ...store_setting,
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

  getStoreStatusSwitchProps = status => mainHandler.getStoreStatusSwitchProps(this, status);

  onBindPriceSheetSuccess = () => {
    const { collectionsSettings, boundProjectActions, boundGlobalActions } = this.props;
    const { addNotification } = boundGlobalActions;
    addNotification({
      message: t('SETTINGS_LOGOBRNDING_SAVE_SUCCESS_TOAST', 'Changes successfully saved.'),
      level: 'success',
      autoDismiss: 1,
    });
  };

  init = async () => {
    const { boundGlobalActions } = this.props;
    this.setState({ loading: true });
    const { data: estoreInfo } = await boundGlobalActions.getEstoreInfo();
    await this.fetchPriceSheet(estoreInfo);
    this.setState({ loading: false });
  };

  fetchPriceSheet = async estoreInfo => {
    const {
      // estoreInfo,
      urls,
      match: { params },
    } = this.props;
    const { id: collectionId } = params;
    const estoreBaseUrl = urls.get('estoreBaseUrl');
    const galleryBaseUrl = urls.get('galleryBaseUrl');

    const {
      options,
      selectedOption,
      priceSheetList = [],
    } = await storeSettingService.composePriceSheetSelectOptions({
      baseUrl: estoreBaseUrl,
      galleryBaseUrl,
      storeId: estoreInfo?.id,
      collectionId,
    });
    console.log('selectedPriceSheetOptionValue', selectedOption?.value);
    this.setState({
      priceSheetOptions: options,
      selectedPriceSheetOption: selectedOption,
      selectedPriceSheetOptionValue: selectedOption?.value,
    });
    return {
      priceSheetOptions: options,
      selectedPriceSheetOption: selectedOption,
      selectedPriceSheetOptionValue: selectedOption?.value,
    };
  };

  onlyFetchBindPriceSheet = async () => {
    const {
      urls,
      match: { params },
    } = this.props;
    const { id: collectionId } = params;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const { id } = await storeSettingService.getCollectionBindPriceSheetId({
      galleryBaseUrl,
      collectionId,
    });
    console.log('selectedPriceSheetOptionValue', id);
    this.setState({
      selectedPriceSheetOptionValue: id,
    });
  };

  render() {
    const {
      history,
      match: { params },
      collectionPreviewUrl,
      collectionsSettings,
      presetState,
      // 全局redux中获取
      estoreInfo = null,
    } = this.props;

    const { storeStatusChecked, loading, priceSheetOptions, selectedPriceSheetOptionValue } =
      this.state;

    // 这个是全局的store的状态 与collection无关
    // const { store_status } = estoreInfo || {};

    const collectionUid = collectionsSettings.get('enc_collection_uid');

    // settings header
    const { id } = params;
    const headerProps = {
      history,
      collectionPreviewUrl,
      collectionId: id,
      title: t('STORE_SETTINGS'),
      hasHandleBtns: false,
    };
    let curRackIdInPreset = null;
    if (presetState) {
      const store_setting = collectionsSettings.get('store_setting');
      curRackIdInPreset = store_setting.get('rack_id');
    }
    console.log('curRackIdInPreset: ', curRackIdInPreset);

    return (
      <Fragment>
        <div
          className={`gllery-collection-detail-settings-store ${
            presetState ? 'presetWrapper' : ''
          }`}
        >
          {/* 主渲染区域. */}
          <div className="content">
            {/* settings header */}
            {!presetState && <CollectionDetailHeader {...headerProps} />}
            {!loading && collectionsSettings && collectionsSettings.size ? (
              <div className="settings-store-wrap">
                <div className="store-item storeState">
                  <div className="item-name">{t('STORE_STATUS')}</div>
                  <div className="item-content">
                    <Switch {...this.getStoreStatusSwitchProps(!!storeStatusChecked)} />
                    <div className="tip-wrap">
                      <span
                        className="tip-msg"
                        title={t(presetState ? 'STORE_STATUS_TIP_1' : 'STORE_STATUS_TIP')}
                      >
                        {t(presetState ? 'STORE_STATUS_TIP_1' : 'STORE_STATUS_TIP')}
                      </span>
                    </div>
                  </div>
                </div>
                {!!storeStatusChecked && (
                  <div className="store-item">
                    <div className="item-name">{t('STORE_STATUS_PRICE_SHEET')}</div>
                    <div className="item-content">
                      {(!!selectedPriceSheetOptionValue || presetState) && (
                        <StorePriceSheetSelect
                          collectionId={collectionUid}
                          width="300px"
                          style={{ marginBottom: '16px' }}
                          onSelectSuccess={this.onBindPriceSheetSuccess}
                          priceSheetOptions={priceSheetOptions}
                          collectionsSettings={collectionsSettings}
                          selectedPriceSheetOptionValue={selectedPriceSheetOptionValue}
                          presetState={presetState}
                          curRackIdInPreset={curRackIdInPreset}
                          instantUpdate={this.instantUpdate}
                        />
                      )}
                      <div className="tip-wrap">
                        {__isCN__ ? (
                          <span className="tip-msg">
                            客户能够看到的在售商品取决于您所绑定的价格表，您可以在
                            <a href="/software/e-store/products">这里</a>
                            设置价格表。
                          </span>
                        ) : (
                          <span className="tip-msg">
                            {t(
                              presetState
                                ? 'STORE_STATUS_PRICE_SHEET_TIP_1'
                                : 'STORE_STATUS_PRICE_SHEET_TIP'
                            )}{' '}
                            Set up your Price Sheets <a href="/software/e-store/products">here.</a>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SettingsStore;
