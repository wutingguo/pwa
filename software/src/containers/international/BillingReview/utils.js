export function getAddress(address = {}) {
    const { street1, street2, city, sub_country, zip_or_postal_code, country } = address;
    const addressArr = [street1, street2, city, sub_country, zip_or_postal_code, country].filter(item => !!item);
    return addressArr.join(', ');
  }
  