import { formItemNames } from './formItemConfig';

const enItemOrder = [
  formItemNames.fullname,
  formItemNames.street1,
  formItemNames.street2,
  formItemNames.city,
  formItemNames.subCountry,
  formItemNames.country,
  formItemNames.postalCode,
  formItemNames.phoneNumber
];

const enItemOrderNoSubCountry = [
  formItemNames.fullname,
  formItemNames.street1,
  formItemNames.street2,
  formItemNames.city,
  formItemNames.country,
  formItemNames.postalCode,
  formItemNames.phoneNumber
];

const trItemOrder = [
  formItemNames.fullname,
  formItemNames.street1,
  formItemNames.street2,
  formItemNames.city,
  formItemNames.subCountry,
  formItemNames.postalCode,
  formItemNames.country,
  formItemNames.phoneNumber,
  formItemNames.certType,
  formItemNames.certId
];

const jaItemOrder = [
  formItemNames.fullname,
  formItemNames.phoneNumber,
  formItemNames.postalCode,
  formItemNames.country,
  formItemNames.subCountry,
  formItemNames.city,
  formItemNames.street1,
  formItemNames.street2
];

const deItemOrder = [
  formItemNames.fullname,
  formItemNames.street1,
  formItemNames.street2,
  formItemNames.city,
  formItemNames.subCountry,
  formItemNames.country,
  formItemNames.postalCode,
  formItemNames.phoneNumber,
  formItemNames.email
];

export const getFormItemOrder = (languageCode = 'en', countryCode) => {
  switch (languageCode) {
    case 'en':
      switch (countryCode) {
        case 'DE':
          return deItemOrder;
        case 'TR':
        case 'QA':
        case 'ID':
          return trItemOrder;
        // 只有美国和加拿大支持地区级别的税率
        case 'CA':
          return enItemOrder;
        case 'US':
          return enItemOrder;
        default:
          return enItemOrderNoSubCountry;
      }
    // case 'ja':
    //   return jaItemOrder;
    case 'de':
      switch (countryCode) {
        case 'DE':
          return deItemOrder;
        default:
          return deItemOrder.slice(0, -1);
      }
    default:
      return enItemOrder;
  }
};
