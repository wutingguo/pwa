import React, { useMemo } from 'react';

import getLanguage from '../language';
import { LanguageContext } from '../utils';

export default React.memo(InternationalProvide);
function InternationalProvide(props) {
  const { lang, children, initLang = {} } = props;
  const value = useMemo(() => {
    const intl = initLanguage(lang);
    return {
      lang,
      intl,
    };
  }, [lang]);

  function initLanguage(type) {
    const data = new Language(type);
    if (!type) return data;

    const baseLanguage = getLanguage();
    const language = Object.assign(baseLanguage[type], initLang[type]);
    Object.keys(language).forEach(key => {
      data.add(key, language[key]);
    });
    return data;
  }
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

class Language {
  constructor(type) {
    this.data = new Map();
    this.type = type;
  }
  add(key, value) {
    this.data.set(key, value);
  }
  has(key) {
    return this.data.has(key);
  }
  tf(key) {
    return this.data.has(key) ? this.data.get(key) : key;
  }

  get lang() {
    return this.type;
  }
}
