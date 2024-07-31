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
  full_name: 'full_name',
  phone_number: 'phone_number',
  sub_city: 'sub_city',
  sub_country: 'sub_country',
  town: 'town'
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
    case 'cn':
      return new RegExp("^[a-zA-Z0-9'! @#$&%*()-=_+{}:;,\\[\\].<>/\\\\?\u4e00-\u9fa5]+$");
    default:
      return new RegExp("^[a-zA-Z0-9'! @#$&%*()-=_+{}:;,\\[\\].<>/\\\\?]+$");
  }
};

export const getFormItemOptions = (languageCode, countryCode) => {
  const regExp = getRegExp(languageCode, countryCode);
  const phoneNumberRequired = true;
  return {
    [formItemNames.full_name]: {
      label: t('FULL_NAME'),
      rules: [
        { required: true, message: t('FULLNAME_QEQUIRE_TIP_ADDRESS') },
        { pattern: regExp, message: t('ADDRESS_CONMON_INVALID_TIP') }
      ],
      required: true,
      inputProps: {
        maxLength: 99
      }
    },
    [formItemNames.street1]: {
      label: t('ADDRESS_LINE_1'),
      rules: [
        { required: true, message: t('ADDRESS1_REQUIRE_TIP') },
        { pattern: regExp, message: `${t('ADDRESS1_REQUIRE_TIP')}` },
        {
          pattern: new RegExp(/\bBOX\b|\bAPO\b|\bFPO\b/, 'i'),
          message: t('ADDRESS_PO_BOX_TIP'),
          matchWarning: true
        }
      ],
      defaultTip: t('ADDRESS_PO_BOX_TIP'),
      required: true,
      inputProps: {
        maxLength: 199,
        placeholder: t('ADDRESS_LINE_1_PLACEHOLDER')
      }
    },
    [formItemNames.country]: {
      label: t('COUNTRY_REGION'),
      rules: [
        { required: true, message: '' },
        { pattern: regExp, message: t('ADDRESS_CONMON_INVALID_TIP') }
      ],
      required: true,
      inputProps: {
        maxLength: 199
      }
    },
    [formItemNames.town]: {
      label: t('STATE_PROVINCE'),
      rules: [
        { required: false, message: t('town_TIP') },
        { pattern: regExp, message: t('ADDRESS_CONMON_INVALID_TIP') }
      ],
      required: true,
      inputProps: {
        maxLength: 199
      }
    },
    [formItemNames.sub_country]: {
      label: t('STATE_PROVINCE'),
      rules: [
        { required: true, message: t('SUBCOUNTRY_REQUIRE_TIP') },
        { pattern: regExp, message: t('ADDRESS_CONMON_INVALID_TIP') }
      ],
      required: true,
      inputProps: {
        maxLength: 199
      }
    },
    [formItemNames.sub_city]: {
      label: t('STATE_PROVINCE'),
      rules: [
        { required: true, message: t('SUBCOUNTRY_REQUIRE_TIP') },
        { pattern: regExp, message: t('ADDRESS_CONMON_INVALID_TIP') }
      ],
      required: true,
      inputProps: {
        maxLength: 199
      }
    },
    [formItemNames.city]: {
      label: t('CITY'),
      rules: [
        { required: true, message: t('CITY_REQUIRE_TIP') },
        { pattern: regExp, message: t('ADDRESS_CONMON_INVALID_TIP') }
      ],
      required: true,
      inputProps: {
        maxLength: 199
      }
    },
    [formItemNames.phone_number]: {
      label: t('PHONE'),
      rules: [
        { required: phoneNumberRequired, message: t('PHONE_REQUIRE_TIP') },
        { pattern: regExp, message: t('PHONE_REQUIRE_TIP') }
      ],
      required: phoneNumberRequired,
      inputProps: {
        maxLength: 49
      }
    }
  };
};
