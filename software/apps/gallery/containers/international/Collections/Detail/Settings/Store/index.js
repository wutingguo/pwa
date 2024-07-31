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

    return (
      <Fragment>
        <div className="gllery-collection-detail-settings-store">
          {/* 主渲染区域. */}
          <div className="content">
            {/* settings header */}
            <CollectionDetailHeader {...headerProps} />
            {!loading && collectionsSettings && collectionsSettings.size ? (
              <div className="settings-store-wrap">
                <div className="store-item">
                  <div className="item-name">{t('STORE_STATUS')}</div>
                  <div className="item-content">
                    <Switch {...this.getStoreStatusSwitchProps(!!storeStatusChecked)} />
                    <div className="tip-wrap">
                      <span className="tip-msg ellipsis" title={t('STORE_STATUS_TIP')}>
                        {t('STORE_STATUS_TIP')}
                      </span>
                    </div>
                  </div>
                </div>
                {!!storeStatusChecked && (
                  <div className="store-item">
                    <div className="item-name">{t('STORE_STATUS_PRICE_SHEET')}</div>
                    <div className="item-content">
                      {!!selectedPriceSheetOptionValue && (
                        <StorePriceSheetSelect
                          collectionId={collectionUid}
                          width="300px"
                          style={{ marginBottom: '16px' }}
                          onSelectSuccess={this.onBindPriceSheetSuccess}
                          priceSheetOptions={priceSheetOptions}
                          selectedPriceSheetOptionValue={selectedPriceSheetOptionValue}
                        />
                      )}
                      <div className="tip-wrap">
                        <span className="tip-msg ellipsis">
                          {t('STORE_STATUS_PRICE_SHEET_TIP')} Set up your Price Sheets{' '}
                          <a href="/software/e-store/products">here.</a>
                        </span>
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
