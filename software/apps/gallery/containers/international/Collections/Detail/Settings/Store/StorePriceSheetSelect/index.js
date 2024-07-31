import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Select from '@common/components/Select';
import AlertTip from '@common/components/AlertTip';
import storeSettingService from '../service';
import loadingIcon from './loading.gif';
import './index.scss';

const StorePriceSheetSelect = ({
  containerClassName,
  className,
  collectionId,
  onFetchedPriceSheet,
  onSelectSuccess,
  priceSheetOptions,
  selectedPriceSheetOptionValue,
  style = {},
  ...rest
}) => {
  const [state, setState] = useState({
    options: null,
    selectedOption: null
  });

  const { baseUrl, estoreInfo, galleryBaseUrl, estoreBaseUrl } = useSelector(state => {
    const { urls } = state.root.system.env;
    const { estore } = state.root;
    return {
      baseUrl: urls.toJS().baseUrl,
      // baseUrl: urls.toJS().baseUrl.replace('zno', 'asovx'),
      galleryBaseUrl: urls.toJS().galleryBaseUrl,
      estoreBaseUrl: urls.toJS().estoreBaseUrl,
      estoreInfo: estore && estore.toJS().estoreInfo
    };
  });

  const getSelectOptions = useCallback(async () => {
    // 如果存在外定值 则为受控
    if (Array.isArray(priceSheetOptions)) {
      console.log(
        'selectedOption',
        selectedPriceSheetOptionValue,
        priceSheetOptions.find(o => o.value === selectedPriceSheetOptionValue)
      );
      setState({
        options: priceSheetOptions,
        selectedOption: priceSheetOptions.find(o => o.value === selectedPriceSheetOptionValue)
      });
      return;
    }
    try {
      const {
        options,
        selectedOption,
        priceSheetList
      } = await storeSettingService.composePriceSheetSelectOptions({
        baseUrl: estoreBaseUrl,
        galleryBaseUrl,
        storeId: estoreInfo?.id,
        collectionId
      });

      setState({
        options,
        selectedOption
      });
      console.log('getSelectOptions', options);
      onFetchedPriceSheet && onFetchedPriceSheet(priceSheetList);
    } catch (e) {
      console.error(e);
    }
  }, [estoreBaseUrl, estoreInfo?.id, galleryBaseUrl, collectionId]);

  const handleSelectPriceSheet = useCallback(
    async option => {
      window.logEvent.addPageEvent({
        name: 'GalleryStoreSetting_Click_SelectPriceSheet'
      });
      const err = await storeSettingService.bindPriceSheet({
        galleryBaseUrl,
        collectionId,
        priceSheetId: option.value,
        storeId: estoreInfo?.id
      });
      if (!err) {
        onSelectSuccess && onSelectSuccess(option);
        setState(v => ({ ...v, selectedOption: option }));
      }
    },
    [galleryBaseUrl, collectionId, estoreInfo]
  );

  useEffect(() => {
    getSelectOptions();
  }, []);

  const { options, selectedOption } = state;
  const showAlert = selectedOption && selectedOption.spu_price_abnormal;

  return (
    <div
      className={classNames('store-price-sheet-select-container', containerClassName)}
      style={style}
    >
      <Select
        className={classNames('store-price-sheet-select', className)}
        options={options}
        onChange={handleSelectPriceSheet}
        value={selectedOption}
        {...rest}
      />
      {!!showAlert && (
        <AlertTip
          className="store-price-sheet-select-alert"
          maxWidth="165px"
          message={t('EXIST_PRODUCTS_BUT_NOT_PRICED')}
        />
      )}
    </div>
  );
};

export default memo(StorePriceSheetSelect);
