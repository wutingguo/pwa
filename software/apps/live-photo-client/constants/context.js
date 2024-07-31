import React from 'react';

export const SettingContext = React.createContext(null);

export const useSetting = () => {
  const setting = React.useContext(SettingContext);
  return setting;
};

export const connectSetting = Component => {
  return props => {
    const setting = useSetting();

    return <Component {...props} pageSetting={setting} />;
  };
};
