import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ADD_TAXES_MODAL } from '@apps/estore/constants/modalTypes';
import XLoading from '@resource/components/XLoading';
import HeaderLayout from '../common/HeaderLayout';
import Button from '../common/Button';
import TableEmpty from '../common/TableEmpty';
import Table from './Table';
import taxes from '../../constants/service/taxes';
import useEnv from '../../hooks/useEnv';
import './index.scss';

const AddTaxesButton = memo(
  ({
    estoreInfo,
    boundGlobalActions,
    afterAdd,
    existCountryCodes = [],
    existCountryDashSubRegionCodes = []
  }) => {
    const handleClickAdd = useCallback(() => {
      window.logEvent.addPageEvent({
        name: 'Estore_Taxes_Click_AddTaxRate'
      });
      boundGlobalActions.showModal(ADD_TAXES_MODAL, {
        title: t('EDIT_TAX_RATE'),
        close: () => {
          window.logEvent.addPageEvent({
            name: 'Estore_Taxes_EditTaxRatePop_Click_Cancel'
          });
          boundGlobalActions.hideModal(ADD_TAXES_MODAL);
        },
        estoreInfo,
        afterOk: () => {
          afterAdd && afterAdd();
        },
        onError: () => {
          boundGlobalActions.addNotification({
            message: `Params error`,
            level: 'error',
            autoDismiss: 2
          });
        },
        existCountryCodes,
        existCountryDashSubRegionCodes
      });
    }, [afterAdd, existCountryCodes, existCountryDashSubRegionCodes]);

    return (
      <Button
        type="primary"
        optionType="add"
        label={t('ADD_TAXES_RATE')}
        onClick={handleClickAdd}
      />
    );
  }
);

const Taxes = props => {
  console.log('Taxes props', props);
  const { boundGlobalActions } = props;

  const { estoreInfo, estoreBaseUrl } = useEnv();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 已经设置过taxes的地区code
  const { existCountryCodes, existCountryDashSubRegionCodes } = useMemo(() => {
    if (!tableData?.length) return [];
    // 只取到第一层children
    const existCountryCodes = new Set();
    const existCountryDashSubRegionCodes = new Set();

    tableData.forEach(country => {
      if (country.tax_rates !== null) {
        existCountryCodes.add(country.region_code);
      } else if (country.children?.length) {
        country.children.forEach(subRegion => {
          existCountryDashSubRegionCodes.add(
            [country.region_code, subRegion.region_code].join('-')
          );
        });
      }
    });

    return {
      existCountryCodes: Array.from(existCountryCodes),
      existCountryDashSubRegionCodes: Array.from(existCountryDashSubRegionCodes)
    };
  }, [tableData]);

  const init = useCallback(async () => {
    if (!estoreInfo?.id) {
      return;
    }
    setLoading(true);
    const data = await taxes.taxList({
      baseUrl: estoreBaseUrl,
      store_id: estoreInfo?.id
    });
    data.data && setTableData(data.data);
    setLoading(false);
  }, [estoreBaseUrl, estoreInfo?.id]);

  const handleEdit = useCallback(
    ({ country, subRegion }) => {
      window.logEvent.addPageEvent({
        name: 'Estore_Taxes_Click_EditTaxRate'
      });
      boundGlobalActions.showModal(ADD_TAXES_MODAL, {
        title: t('EDIT_TAX_RATE'),
        close: () => boundGlobalActions.hideModal(ADD_TAXES_MODAL),
        estoreInfo,
        afterOk: () => {
          init();
        },
        onError: () => {
          boundGlobalActions.addNotification({
            message: `Params error`,
            level: 'error',
            autoDismiss: 2
          });
        },
        formData: {
          country,
          subRegion
        }
      });
    },
    [boundGlobalActions, init]
  );

  const handleRemove = useCallback(
    ({ country, subRegion }) => {
      window.logEvent.addPageEvent({
        name: 'Estore_Taxes_Click_DeleteTaxRate'
      });
      const cancelAndLog = () => {
        window.logEvent.addPageEvent({
          name: 'Estore_Taxes_DeleteTaxRate_Click_Cancel'
        });
        boundGlobalActions.hideConfirm();
      };
      const data = {
        close: cancelAndLog,
        message: t('Are you sure you want to delete this tax rate ?'),
        buttons: [
          {
            className: 'white pwa-btn',
            text: t('CANCEL'),
            onClick: cancelAndLog
          },
          {
            className: 'pwa-btn',
            text: t('DELETE'),
            onClick: async () => {
              window.logEvent.addPageEvent({
                name: 'Estore_Taxes_DeleteTaxRate_Click_Delete'
              });
              await taxes.removeTaxRate({
                baseUrl: estoreBaseUrl,
                store_id: estoreInfo?.id,
                country_code: country?.region_code,
                province_code: subRegion?.region_code
              });
              // await settingService.disablePaymentMethod({
              //   baseUrl: estoreBaseUrl,
              //   storeId: storeId,
              //   paymentMethod: 'PAYPAL'
              // });

              boundGlobalActions.addNotification({
                message: `Successfully deleted.`,
                level: 'success',
                autoDismiss: 1
              });

              init();
            }
          }
        ]
      };
      boundGlobalActions.showConfirm(data);
    },
    [estoreBaseUrl, boundGlobalActions, init]
  );

  const addTaxesButtonProps = {
    estoreInfo,
    boundGlobalActions,
    existCountryCodes,
    existCountryDashSubRegionCodes,
    afterAdd: () => {
      init();
    }
  };

  useEffect(() => {
    init();
  }, [estoreInfo?.id]);

  return (
    <div className="store-taxes">
      <HeaderLayout
        title="Taxes"
        Options={
          <>
            <AddTaxesButton {...addTaxesButtonProps} />
          </>
        }
      />

      <div className="store-taxes-content">
        {tableData.length ? (
          <Table data={tableData} onEdit={handleEdit} onRemove={handleRemove} />
        ) : (
          <TableEmpty
            Options={
              <>
                {loading && <XLoading isShown={loading} />}
                <AddTaxesButton {...addTaxesButtonProps} />
              </>
            }
            text={`You are responsible for collecting the appropriate taxes from your clients for each location.
If the customer's shipping address falls under these locations, they will be charged sales tax you have specified.`}
          />
        )}
      </div>
    </div>
  );
};

export default memo(Taxes);
