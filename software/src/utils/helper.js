export function getAddress(address = {}) {
  // console.log("address....",address)
  let {
    street1,
    street2,
    city,
    sub_country,
    zip_or_postal_code,
    country,
    cert_id,
    document
  } = address;
  if (document) {
    cert_id = `${document} ${cert_id}`;
  }
  const addressArr = [
    street1,
    street2,
    city,
    sub_country,
    zip_or_postal_code,
    country,
    cert_id
  ].filter(item => !!item);
  return addressArr.join(', ');
}
