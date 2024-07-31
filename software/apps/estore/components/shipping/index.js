import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import XLoading from '@resource/components/XLoading';

import { SETUP_SHIPPING_MODAL } from '@apps/estore/constants/modalTypes';

import shippingService from '../../constants/service/shipping';
import useEnv from '../../hooks/useEnv';
import Button from '../common/Button';
import HeaderLayout from '../common/HeaderLayout';
import { TabPanel, Tabs, WithTabContext, useTabsContext } from '../common/Tabs';

import Table from './Table';
import TableEmpty from './TableEmpty';

import './index.scss';

const AddButton = memo(({ estoreInfo, estoreBaseUrl, boundGlobalActions, afterAdd }) => {
  const handleClickAdd = useCallback(() => {
    window.logEvent.addPageEvent({
      name: 'Estore_Shipping_Click_AddShippingMethod',
    });
    boundGlobalActions.showModal(SETUP_SHIPPING_MODAL, {
      title: t('EDIT_TAX_RATE'),
      close: () => {
        window.logEvent.addPageEvent({
          name: 'Estore_Shipping_EditShippingMethodPop_Click_Cancel',
        });
        boundGlobalActions.hideModal(SETUP_SHIPPING_MODAL);
      },
      estoreInfo,
      estoreBaseUrl,
      confirm: async obj => {
        const data = await shippingService.addShipping(obj);
        if (data && data.ret_code == 200000) {
          // 关闭弹窗
          boundGlobalActions.hideModal(SETUP_SHIPPING_MODAL);
          afterAdd && afterAdd();
        }
        window.logEvent.addPageEvent({
          name: 'Estore_Shipping_EditShippingMethodPop_Click_Save',
          region: obj.region_name,
          flat_shipping_fee: obj.flat_fee,
        });
      },
    });
  }, [afterAdd]);
  return (
    <Button
      type="primary"
      optionType="add"
      label={t('ADD_SHIPPING_METHOD')}
      onClick={handleClickAdd}
    />
  );
});

const Shipping = WithTabContext(
  props => {
    const { activeTabName, setActiveTabName } = useTabsContext();
    console.log('Shipping props', props);
    const { estoreInfo, boundGlobalActions } = props;
    const { estoreBaseUrl } = useEnv();
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);

    const init = useCallback(async () => {
      if (!estoreInfo?.id) {
        return;
      }
      setLoading(true);
      const data = await shippingService.shippingList({
        baseUrl: estoreBaseUrl,
        store_id: estoreInfo?.id,
      });
      console.log('setTableData', data.data);
      setLoading(false);
      data.data && setTableData(data.data.ship_method_entries);
    }, [estoreBaseUrl, estoreInfo?.id]);

    const handleTabSelect = useCallback(tab => {
      const { logEventName } = tab;
      window.logEvent.addPageEvent({
        name: logEventName,
      });
    }, []);

    const addButtonProps = {
      estoreInfo,
      estoreBaseUrl,
      boundGlobalActions,
      afterAdd: () => {
        init();
      },
    };
    tableData.sort((a, b) => {
      if (a.region_name == b.region_name) {
        return a.shipping_fee - b.shipping_fee;
      }
    });
    const tableProps = {
      boundGlobalActions,
      estoreInfo,
      estoreBaseUrl,
      tableData,
      afterEdit: () => {
        init();
      },
    };
    useEffect(() => {
      init();
    }, [estoreInfo?.id]);
    const SelfFulfillmentTable = {
      key: 'self',
      name: 'self-fulfillment',
      label: t('SELF_FULFILLMENT'),
      className: 'store-shipping-tab',
      logEventName: 'Estore_Shipping_Click_Self',
    };
    return (
      <div className="store-shipping">
        <HeaderLayout
          Title={
            <Tabs
              onSelect={handleTabSelect}
              tabs={[
                SelfFulfillmentTable,
                {
                  key: 'auto',
                  name: 'automatic-fulfillment',
                  label: t('AUTOMATIC_FULFILLMENT'),
                  className: 'store-shipping-tab',
                  logEventName: 'Estore_Shipping_Click_Auto',
                },
              ]}
            />
          }
          Options={
            activeTabName === 'self-fulfillment' && (
              <>
                <AddButton {...addButtonProps} />
              </>
            )
          }
        />

        <div className="store-shipping-content">
          {
            <TabPanel useFragment tabName="self-fulfillment">
              {tableData.length ? (
                <Table {...tableProps} />
              ) : (
                <TableEmpty
                  Options={
                    <>
                      {loading && <XLoading isShown={loading} />}
                      <AddButton {...addButtonProps} />
                    </>
                  }
                />
              )}
            </TabPanel>
          }

          <TabPanel useFragment tabName="automatic-fulfillment">
            <div className="store-shipping-content__automatic-fulfillment">
              <span
                dangerouslySetInnerHTML={{
                  __html: t('AUTOMATIC_FULFILLMENT_SHIPPING_METHODS'),
                }}
              />
            </div>
          </TabPanel>
        </div>
      </div>
    );
  },
  { defaultActiveTabName: 'self-fulfillment' }
);

export default memo(Shipping);
