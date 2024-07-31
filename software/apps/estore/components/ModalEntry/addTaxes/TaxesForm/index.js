import classnames from 'classnames';
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

import Select from '@common/components/Select';

import taxesService from '../../../../constants/service/taxes';
import useEnv from '../../../../hooks/useEnv';
import useForm, { VALIDATOR_PRESETS } from '../../../../hooks/useForm';

import useTaxRegion from './useTaxRegion';

import './index.scss';

const controllerOptions = [
  {
    name: 'region',
    filedPath: 'region',
    eventName: 'onChange',
    handler: option => {
      return {
        value: {
          code: option.data.region_code,
          type: option.data.region_type,
          parentId: option.data.parent_id,
        },
      };
    },
  },
  {
    name: 'rates',
    filedPath: 'rates',
    eventName: 'onBlur',
    formatters: [
      v => {
        if (v === '') return '';
        const number = Math.max(Math.min(Number(v), 9999), 0);
        const str = number.toFixed(2);
        return isNaN(number) ? '' : str;
      },
    ],
    validators: [VALIDATOR_PRESETS.REQUIRED],
  },
  {
    name: 'usage',
    filedPath: 'usage',
    eventName: 'onClicked',
    handler: ({ checked }) => {
      return { value: checked ? 3 : 1 };
    },
    valueName: 'checked',
    valueHandle: v => v === 3,
  },
  {
    name: 'apply_digital',
    filedPath: 'apply_digital',
    eventName: 'onClicked',
    handler: ({ checked }) => {
      return { value: checked };
    },
    valueName: 'checked',
    valueHandle: v => v,
  },
];

const TaxesForm = forwardRef(
  ({ data, existCountryCodes = [], existCountryDashSubRegionCodes = [] }, ref) => {
    // 是否为编辑
    const isEdit = !!data;
    const countryRegionCodeFormData = data?.country?.region_code;
    const subRegionCodeFormData = data?.subRegion?.region_code;
    // 以子地区税优先
    const taxesRatesFromData = data?.subRegion?.tax_rates || data?.country?.tax_rates;
    const taxesUsageFromData = data?.subRegion?.tax_usage || data?.country?.tax_usage;
    const applyDigital = data?.subRegion?.apply_digital || data?.country?.apply_digital;

    const { controllers, getFormValue, errMsg, submitFormValues, isPass } = useForm({
      defaultValues: {
        rates: taxesRatesFromData || '0.00',
        usage: taxesUsageFromData || 3,
        apply_digital: applyDigital || false,
        region: {
          code: '',
          type: '',
          parentId: '',
        },
      },
      controllerOptions,
      valueControl: true,
    });

    const {
      regions = [],
      regionOptions = [],
      currentCountryOption,
      setCurrentCountryOption,
      subRegionOptions,
      currentSubRegionOption,
      setCurrentSubRegionOption,
    } = useTaxRegion({
      onSubRegionOptionChange: o => o && controllers.region.onChange(o),
      countryRegionCode: countryRegionCodeFormData,
      subRegionCode: subRegionCodeFormData,
      excludesCountryCodes: existCountryCodes,
      excludesCountryDashSubRegionCodes: existCountryDashSubRegionCodes,
    });

    const { baseUrl, estoreInfo, estoreBaseUrl } = useEnv();

    const handleSubmit = useCallback(async () => {
      const values = submitFormValues();
      if (!values) return false;
      const {
        rates,
        usage,
        apply_digital,
        region: { code, type, parentId },
      } = values;

      window.logEvent.addPageEvent({
        name: 'Estore_Taxes_EditTaxRatePop_Click_Save',
        region: currentCountryOption.label,
        tax_rate: `${rates}%`,
        apply_to_shipping: usage === 3 ? 'on' : 'off',
        apply_digital,
        apply_to_digital: apply_digital ? 'on' : ' off',
      });

      if (isEdit) {
        await taxesService.editTaxRate({
          baseUrl: estoreBaseUrl,
          store_id: estoreInfo?.id,
          tax_rates: rates,
          tax_usage: usage,
          country_code: countryRegionCodeFormData,
          province_code: subRegionCodeFormData,
          parent_id: parentId,
          apply_digital,
        });
      } else {
        await taxesService.addTaxRate({
          baseUrl: estoreBaseUrl,
          store_id: estoreInfo?.id,
          tax_rates: rates,
          tax_usage: usage,
          region_code: code,
          region_type: type,
          parent_id: parentId,
          apply_digital,
        });
      }
      return true;
    }, [
      submitFormValues,
      estoreBaseUrl,
      isEdit,
      countryRegionCodeFormData,
      subRegionCodeFormData,
      currentCountryOption,
    ]);

    useImperativeHandle(ref, () => {
      return {
        submit: handleSubmit,
      };
    });

    return (
      <div className="store-form-add-taxes">
        <div className="store-form-add-taxes__item">
          <div className="store-form-add-taxes__item_label">Clients' Country/Region</div>
          <Select
            className="store-form-add-taxes__item-select"
            value={currentCountryOption}
            options={regionOptions}
            onChange={o => {
              // parent_id为0的 是国家
              setCurrentCountryOption(o);
              controllers.region.onChange(o);
            }}
            disabled={isEdit}
          />
        </div>

        {!!subRegionOptions?.length && (
          <div className="store-form-add-taxes__item">
            <div className="store-form-add-taxes__item-label">Clients' Sub-region</div>
            <Select
              className="store-form-add-taxes__item-select"
              value={currentSubRegionOption}
              options={subRegionOptions}
              onChange={o => {
                setCurrentSubRegionOption(o);
                controllers.region.onChange(o);
              }}
              disabled={isEdit}
            />
          </div>
        )}

        <div className="store-form-add-taxes__item">
          <div className="store-form-add-taxes__item-label">Tax Rate (%)</div>
          {/* TODO: 受控input组件 */}
          <Input
            className={classnames('store-form-add-taxes__item-input', [
              !isPass('password') && 'store-form-error__input',
            ])}
            // type="number"
            value={getFormValue('rates')}
            // 负号
            willPrevent={v => {
              const suffix = String(v).split('.')[1];
              if (suffix) {
                return suffix.length > 2;
              }
              return isNaN(Number(v)) || Number(v) < 0;
            }}
            // 此处这样写是因为Input组件的onBlur的返回值会更新为input的value
            onBlur={v => {
              const { value } = controllers.rates.onBlur(v) || {};
              return Number(Number(value).toFixed(2));
            }}
          />
          <span className="store-form-error__message">
            {errMsg('rates', 'required', 'Tax Rate')}
          </span>
        </div>

        <div className="store-form-add-taxes__item">
          {/* 当不勾选Apply to Shipping时，tax_usage值为1； 当勾选了Apply to Shipping时，该值为3 */}
          <CheckBox
            className="store-form-add-taxes__item-checkBox black-theme"
            text="Apply to Shipping"
            {...controllers.usage}
          />
          <CheckBox
            style={{ marginTop: '10px' }}
            className="store-form-add-taxes__item-checkBox black-theme"
            text="Apply to Digital Photo Download"
            {...controllers.apply_digital}
          />
        </div>
      </div>
    );
  }
);

export default memo(TaxesForm);
