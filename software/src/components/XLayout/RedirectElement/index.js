import React from 'react';
import { Redirect } from 'react-router-dom';

import { isBypassAccountAuthorityWithRedirect } from '@resource/pwa/utils';

export default function RedirectElement(props) {
  const { userInfo, to, from } = props;
  const isRedirect = isBypassAccountAuthorityWithRedirect(userInfo);
  if (isRedirect) {
    return <Redirect push to={to} from={from} />;
  }
  return null;
}
