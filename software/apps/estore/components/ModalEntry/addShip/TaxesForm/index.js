import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import CheckBox from '@resource/components/XCheckBox';
import { Input } from '@resource/components/XInput';
import { RcRadioGroup } from '@resource/components/XRadio';

import Select from '@common/components/Select';

import estoreService from '@apps/estore/constants/service';

import useEnv from '../../../../hooks/useEnv';

import './index.scss';

const isShowSubRegion = regionCode => {
  return !!regionCode && (regionCode === 'US' || regionCode === 'CA');
};

const TaxesForm = forwardRef((props, ref) => {
  const [formState, setFormState] = useState({
    carrier: '',
    trackingNumber: '',
    noShip: false,
  });
  const [carrierList, setCarrierList] = useState([]);
  const [formError, setFormError] = useState(false);
  const [currentCarrierSelect, setCurrentCarrierSelect] = useState([]);
  const { title } = props;

  const { estoreInfo, estoreBaseUrl } = useEnv();
  const handleSubmit = useCallback(async () => {
    const { close, onLogMarkAsShipped } = props;
    const { carrier, trackingNumber, noShip } = formState;
    if ((!carrier || !trackingNumber) && !noShip) {
      setFormError(true);
      return;
    }
    onLogMarkAsShipped && onLogMarkAsShipped({ carrier, trackingNumber, noShip });
    const { order_no, getEstoreDetail } = props;

    await estoreService.shippingOrder({
      baseUrl: estoreBaseUrl,
      shipment_number: trackingNumber,
      courier: carrier,
      order_no,
    });
    getEstoreDetail && getEstoreDetail();
    close();
  }, [formState, estoreBaseUrl]);

  useImperativeHandle(ref, () => {
    return {
      submit: handleSubmit,
    };
  });
  useEffect(() => {
    estoreService.getTrackList({ baseUrl: estoreBaseUrl }).then(res => {
      if (res.ret_code === 200000 && res.data) {
        const carrierList = res.data.map((item, index) => {
          return {
            key: index,
            value: item,
            label: t(`${item}`),
          };
        });
        carrierList.push({
          key: -1,
          value: 'Others',
          label: t('OTHERS'),
        });
        setCarrierList(carrierList);
      }
    });
  }, []);

  return (
    <div className="store-form-add-taxes">
      <div className="title">{title}</div>
      {!formState.noShip && (
        <React.Fragment>
          <div className="store-form-add-taxes__item">
            <div className="store-form-add-taxes__item-label">{t('CARRIER')}</div>
            <Select
              className="store-form-add-taxes__item-select"
              value={currentCarrierSelect}
              options={carrierList}
              onChange={v => {
                setCurrentCarrierSelect(v.value);
                setFormError(false);
                setFormState(s => ({
                  ...s,
                  carrier: v.key === -1 ? '' : v.value,
                }));
              }}
            />
          </div>
          {currentCarrierSelect === 'Others' && (
            <div className="store-form-add-taxes__item">
              <div className="store-form-add-taxes__item-label">{t('CARRIER_NAME')}</div>
              <Input
                className="store-form-add-taxes__item-input"
                // value={formState.tax_rates}
                value={formState.carrier}
                onBlur={v => {
                  setFormError(false);
                  setFormState(s => ({
                    ...s,
                    carrier: v,
                  }));
                }}
              />
            </div>
          )}
          <div className="store-form-add-taxes__item">
            <div className="store-form-add-taxes__item-label">{t('TRACKING_NUMBER')}</div>
            <Input
              className="store-form-add-taxes__item-input"
              // value={formState.tax_rates}
              value={formState.trackingNumber}
              onBlur={v => {
                // 为初始值时不更新
                if (v === '') return;
                setFormError(false);
                setFormState(s => ({
                  ...s,
                  trackingNumber: v,
                }));
              }}
            />
          </div>
          {formError && <div className="error">{t('SHIPPING_INFO_TIPS')}</div>}
        </React.Fragment>
      )}

      <div className="store-form-add-taxes__item">
        {/* 当不勾选Apply to Shipping时，tax_usage值为1； 当勾选了Apply to Shipping时，该值为3 */}
        <CheckBox
          className="store-form-add-taxes__item-checkBox black-theme"
          text={t('NO_SHIPPING_NEEDED')}
          checked={formState.noShip}
          onClicked={({ checked }) => {
            if (checked) {
              setFormState({
                trackingNumber: '',
                carrier: '',
              });
            }
            setFormState(s => ({
              ...s,
              noShip: checked,
            }));
          }}
        />
      </div>
    </div>
  );
});

export default memo(TaxesForm);
