import React, { Fragment, useMemo } from 'react';

import useLanguage from '../useLanguage';

export default function IntlText(props) {
  const { children } = props;
  const { intl, lang } = useLanguage();
  const text = useMemo(() => {
    if (typeof children === 'string') {
      return intl.has(children) ? intl.tf(children) : children;
    } else if (typeof children === 'function') {
      return children(lang, intl);
    }
    return children;
  }, [children, lang]);
  return <Fragment>{text}</Fragment>;
}

export function IntlConditionalDisplay(props) {
  const { children, reveals, ...rest } = props;
  const { lang } = useLanguage();
  const el = useMemo(() => {
    if (reveals && reveals.includes(lang)) {
      return React.cloneElement(children, { ...rest });
    }
    return null;
  }, [reveals, lang]);
  return <Fragment>{el}</Fragment>;
}
