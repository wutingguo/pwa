import React from 'react';

import { LanguageContext } from '../utils';

export default function useLanguage() {
  const context = React.useContext(LanguageContext) || {};

  return { ...context };
}

export function combinLanguage(Component) {
  return React.memo(props => {
    const language = useLanguage();
    const newProps = {
      ...language,
      ...props,
    };
    return <Component {...newProps} />;
  });
}
