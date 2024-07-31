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
import { RcRadioGroup } from '@resource/components/XRadio';

import Select from '@common/components/Select';

import settingService from '../../../../constants/service/setting';
import useEnv from '../../../../hooks/useEnv';
import useForm, { FORMATTER_PRESETS, VALIDATOR_PRESETS } from '../../../../hooks/useForm';

import './index.scss';

const controllerOptions = [
  {
    name: 'userNameInput',
    filedPath: ['userName'],
    eventName: 'onChange',
    // 与默认的handler相同
    handler: (...args) => {
      return { value: args && args[0] };
    },
    formatters: [FORMATTER_PRESETS.TRIM],
    validators: [VALIDATOR_PRESETS.REQUIRED],
  },
  {
    name: 'passwordInput',
    filedPath: ['password'],
    eventName: 'onChange',
    formatters: [FORMATTER_PRESETS.TRIM],
    validators: [VALIDATOR_PRESETS.REQUIRED],
  },
  {
    name: 'signatureInput',
    filedPath: ['signature'],
    eventName: 'onChange',
    formatters: [FORMATTER_PRESETS.TRIM],
    validators: [VALIDATOR_PRESETS.REQUIRED],
  },
  {
    name: 'testInput',
    filedPath: 'a.b.c',
    eventName: 'onChange',
    handler: event => {
      return { value: event.target.value };
    },
    formatters: [FORMATTER_PRESETS.TRIM],
    // validators: [
    //   VALIDATOR_PRESETS.REQUIRED,
    //   ({ value }) => ({
    //     name: 'isEmail',
    //     pass: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    //       value
    //     ),
    //     message: 'this is not email'
    //   })
    // ]
  },
];

const PaypalSetupForm = forwardRef(({}, ref) => {
  const { estoreInfo, estoreBaseUrl } = useEnv();

  const {
    reg,
    controllers,
    getFormValue,
    getValidate,
    validatesFormValues,
    submitFormValues,
    errMsg,
    isPass,
  } = useForm({
    defaultValues: {
      userName: '',
      password: '',
      signature: '',
      a: {
        b: {
          c: '',
        },
      },
    },
    controllerOptions,
    valueControl: true,
  });

  const handleSubmit = useCallback(async () => {
    const values = submitFormValues();
    if (!values) throw new Error();
    const { userName, password, signature } = values;

    const res = await settingService.addPaymentMethod({
      baseUrl: estoreBaseUrl,
      storeId: estoreInfo?.id,
      paymentMethodCode: 'PAYPAL',
      appId: userName,
      appSecret: password,
      credentials: signature,
    });
    if (!res || res.ret_code !== 200000) throw new Error(res?.ret_msg);
  }, [submitFormValues]);

  useImperativeHandle(ref, () => {
    return {
      submit: handleSubmit,
    };
  });

  return (
    <div className="store-form-setup-paypal">
      {/* TODO: 此处formatter没有生效是因为公共的input组件value不受控 */}
      {/* userName */}
      <div className="store-form-setup-paypal__item">
        <div className="store-form-add-taxes__item-label">
          {t('ESTORE_SETUP_PAYPAL_FILED_USERNAME')}
        </div>
        <Input
          className={classnames('store-form-add-taxes__item-input', [
            !isPass('userName') && 'store-form-error__input',
          ])}
          {...controllers.userNameInput}
        />
        <span className="store-form-error__message">
          {errMsg('userName', 'required', 'Username')}
        </span>
      </div>
      {/* password */}
      <div className="store-form-setup-paypal__item">
        <div className="store-form-add-taxes__item-label">
          {t('ESTORE_SETUP_PAYPAL_FILED_PASSWORD')}
        </div>
        <Input
          className={classnames('store-form-add-taxes__item-input', [
            !isPass('password') && 'store-form-error__input',
          ])}
          {...controllers.passwordInput}
        />
        <span className="store-form-error__message">
          {errMsg('password', 'required', 'Password')}
        </span>
      </div>
      {/* signature */}
      <div className="store-form-setup-paypal__item">
        <div className="store-form-add-taxes__item-label">
          {t('ESTORE_SETUP_PAYPAL_FILED_SIGNATURE')}
        </div>
        <Input
          className={classnames('store-form-add-taxes__item-input', [
            !isPass('signature') && 'store-form-error__input',
          ])}
          {...controllers.signatureInput}
        />
        <span className="store-form-error__message">
          {errMsg('signature', 'required', 'Signature')}
        </span>
      </div>
      {/* <div className="store-form-setup-paypal__item">
        <div className="store-form-add-taxes__item-label">test</div>
        <input
          className="store-form-add-taxes__item-input"
          {...controllers.testInput}
        />
        <span>{errMsg('a.b.c', 'required')}</span>
        <span>{errMsg('a.b.c', 'isEmail')}</span>
      </div> */}
    </div>
  );
});

export default memo(PaypalSetupForm);
