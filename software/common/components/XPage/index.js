// import "babel-polyfill";
import React, { Component } from 'react';
import { template, get } from 'lodash';
import { isBrowserEnv } from '@resource/lib/utils/env';

import XLogEvent from 'appsCommon/components/dom/XLogEvent';

const getTranslates = props => {
  const i18n = get(props, 'i18n') || get(props, 'pathContext.i18n');
  const { translates } =
    i18n || (isBrowserEnv() ? window.i18n : global.i18n) || {};

  return translates;
};

// global
class XPage extends XLogEvent {
  constructor(props) {
    super(props);

    this.translates = getTranslates(props);

    this.t = (key, opt) => {
      if (!this.translates) {
        return key;
      }
      return template(this.translates[key] || key)(opt);
    };

    // 将i18n的方法挂载到window下.
    if (isBrowserEnv()) {
      window.t = this.t;
    } else {
      // build时, node环境.
      global.t = this.t;
    }
  }
}

export default XPage;
