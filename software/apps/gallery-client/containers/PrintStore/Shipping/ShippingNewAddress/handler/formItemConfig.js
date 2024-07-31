import { emailReg } from '@resource/lib/constants/reg';

export const formItemNames = {
  fullname: 'fullname',
  street1: 'street1',
  street2: 'street2',
  country: 'country',
  subCountry: 'subCountry',
  city: 'city',
  subCity: 'subCity',
  postalCode: 'postalCode',
  phoneNumber: 'phoneNumber',
  email: 'email',
  certId: 'certId',
  certType: 'certType',
};

const getRegExp = languageCode => {
  switch (languageCode) {
    case 'en':
      return new RegExp("^[a-zA-Z0-9'! @#$&%*()-=_+{}:;,\\[\\].<>/\\\\?]+$");
    case 'ja':
      return new RegExp("^[a-zA-Z0-9'! @#$&%*()-=_+{}:;,\\[\\].<>/\\\\?]+$");
    // return new RegExp("^[a-zA-Z0-9'! @#$&%*()-=_+{}:;,\\[\\].<>/\\\\?\u0800-\u9fa5\uFF10-\uFF19]+$");
    case 'de':
      return new RegExp("^[a-zA-Z0-9'! @#$&%*()-=_+{}:;,\\[\\].<>/\\\\?\u007E-\u00FF]+$");
    default:
      return new RegExp("^[a-zA-Z0-9'! @#$&%*()-=_+{}:;,\\[\\].<>/\\\\?]+$");
  }
};

export const getFormItemOptions = (languageCode, countryCode) => {
  const regExp = getRegExp(languageCode, countryCode);
  const phoneNumberRequired = true;
  const emailRequired = languageCode === 'de' || countryCode === 'DE' ? true : false;
  const certIdRequired =
    countryCode === 'TR' || countryCode === 'ID' || countryCode === 'QA' ? true : false;
  return {
    [formItemNames.fullname]: {
      label: t('FULL_NAME'),
      rules: [
        { required: true, message: t('FULLNAME_QEQUIRE_TIP_ADDRESS') },
        { pattern: regExp, message: t('ADDRESS_CONMON_INVALID_TIP') },
      ],
      required: true,
      inputProps: {
        maxLength: 99,
      },
    },
    [formItemNames.street1]: {
      label: t('ADDRESS_LINE_1'),
      rules: [
        { required: true, message: t('ADDRESS1_REQUIRE_TIP') },
        { pattern: regExp, message: `${t('ADDRESS1_REQUIRE_TIP')}` },
        {
          pattern: new RegExp(/\bBOX\b|\bAPO\b|\bFPO\b/, 'i'),
          message: t('ADDRESS_PO_BOX_TIP'),
          matchWarning: true,
        },
      ],
      defaultTip: t('ADDRESS_PO_BOX_TIP'),
      required: true,
      inputProps: {
        maxLength: 199,
        placeholder: t('ADDRESS_LINE_1_PLACEHOLDER'),
      },
    },
    [formItemNames.street2]: {
      label: t('ADDRESS_LINE_2'),
      rules: [{ pattern: regExp, message: t('ADDRESS_CONMON_INVALID_TIP') }],
      required: false,
      inputProps: {
        maxLength: 199,
        placeholder: t('ADDRESS_LINE_2_PLACEHOLDER'),
      },
    },
    [formItemNames.country]: {
      label: t('COUNTRY_REGION'),
      rules: [
        { required: true, message: t('COUNTRY_TIP') },
        { pattern: regExp, message: t('ADDRESS_CONMON_INVALID_TIP') },
      ],
      required: true,
      inputProps: {
        maxLength: 199,
      },
    },
    [formItemNames.subCountry]: {
      label: t('STATE_PROVINCE'),
      rules: [
        { required: true, message: t('SUBCOUNTRY_REQUIRE_TIP') },
        { pattern: regExp, message: t('ADDRESS_CONMON_INVALID_TIP') },
      ],
      required: true,
      inputProps: {
        maxLength: 199,
      },
    },
    [formItemNames.city]: {
      label: t('CITY'),
      rules: [
        { required: true, message: t('CITY_REQUIRE_TIP') },
        { pattern: regExp, message: t('ADDRESS_CONMON_INVALID_TIP') },
      ],
      required: true,
      inputProps: {
        maxLength: 199,
      },
    },
    [formItemNames.postalCode]: {
      label: t('ZIP_POSTAL_CODE'),
      rules: [
        { required: true, message: t('POSTAL_CODE_REQUIRE_TIP') },
        { pattern: regExp, message: t('ADDRESS_CONMON_INVALID_TIP') },
      ],
      required: true,
      inputProps: {
        maxLength: 49,
        // placeholder: t('ZIP_POSTAL_CODE_PLACEHOLDER')
        placeholder: '',
      },
    },
    [formItemNames.phoneNumber]: {
      label: t('PHONE'),
      rules: [
        { required: phoneNumberRequired, message: t('PHONE_REQUIRE_TIP') },
        { pattern: regExp, message: t('PHONE_REQUIRE_TIP') },
      ],
      required: phoneNumberRequired,
      inputProps: {
        maxLength: 49,
      },
    },
    [formItemNames.email]: {
      label: t('EMAIL_ADDRESS'),
      rules: [
        { required: emailRequired, message: t('ERROR_EMAIL_EMPTY') },
        { pattern: emailReg, message: t('ERROR_EMAIL_INVALID') },
      ],
      required: emailRequired,
      inputProps: {
        maxLength: 49,
      },
    },
    [formItemNames.certId]: {
      label: t('PASSPORT_NUMBER'),
      rules: [
        { required: certIdRequired, message: t('ERROR_PASSPORT_NUMBER_EMPTY') },
        { pattern: regExp, message: t('ADDRESS_CONMON_INVALID_TIP') },
      ],
      required: certIdRequired,
      inputProps: {
        maxLength: 49,
        // placeholder: t("PASSPORT_NUMBER_PLACEHOLDER")
      },
    },
    [formItemNames.certType]: {
      label: 'Docunment',
      rules: [
        { required: true, message: t('SUBCOUNTRY_REQUIRE_TIP') },
        { pattern: regExp, message: t('ADDRESS_CONMON_INVALID_TIP') },
      ],
      required: true,
      inputProps: {
        maxLength: 199,
      },
    },
  };
};
