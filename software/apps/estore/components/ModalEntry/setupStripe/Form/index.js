import classnames from 'classnames';
import React, { forwardRef, memo, useCallback, useImperativeHandle } from 'react';

import { Input } from '@resource/components/XInput';

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
    name: 'testInput',
    filedPath: 'a.b.c',
    eventName: 'onChange',
    handler: event => {
      return { value: event.target.value };
    },
    formatters: [FORMATTER_PRESETS.TRIM],
  },
];

const StripeSetupForm = forwardRef(({ boundGlobalActions }, ref) => {
  const { estoreInfo, estoreBaseUrl } = useEnv();

  const { controllers, submitFormValues, errMsg, isPass } = useForm({
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
    console.log('values: ', values);
    if (!values) throw new Error('Invalid API credentials');
    const { userName, password } = values;
    console.log('userName, password: ', userName, password);
    if (userName === password) {
      throw new Error('Publishable Key and Secret Key are Duplicate.');
    }

    const res = await settingService.addPaymentMethod({
      baseUrl: estoreBaseUrl,
      storeId: estoreInfo?.id,
      paymentMethodCode: 'STRIPE',
      appId: userName,
      appSecret: password,
    });
    if (!res || res.ret_code !== 200000) throw new Error(res?.ret_msg);
  }, [submitFormValues]);

  useImperativeHandle(ref, () => {
    return {
      submit: handleSubmit,
    };
  });

  return (
    <div className="store-form-setup-stripe">
      {/* TODO: 此处formatter没有生效是因为公共的input组件value不受控 */}
      {/* userName */}
      <div className="store-form-setup-stripe__item">
        <div className="store-form-setup-stripe__item-label">
          {t('ESTORE_SETUP_PUBLISHABLE_KEY')}
        </div>
        <Input
          className={classnames('store-form-setup-stripe__item-input', [
            !isPass('userName') && 'store-form-error__input',
          ])}
          {...controllers.userNameInput}
        />
        <span className="store-form-error__message">{errMsg('userName', 'required', 'Key')}</span>
      </div>
      {/* password */}
      <div className="store-form-setup-stripe__item">
        <div className="store-form-setup-stripe__item-label">{t('ESTORE_SETUP_SECRET_KEY')}</div>
        <Input
          className={classnames('store-form-setup-stripe__item-input', [
            !isPass('password') && 'store-form-error__input',
          ])}
          {...controllers.passwordInput}
        />
        <span className="store-form-error__message">{errMsg('password', 'required', 'Key')}</span>
      </div>
    </div>
  );
});

export default memo(StripeSetupForm);
