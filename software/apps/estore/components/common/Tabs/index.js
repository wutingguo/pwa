import classNames from 'classnames';
import React, { memo, createContext, useReducer, useContext, useCallback, useMemo } from 'react';
import { assignWith, isUndefined } from 'lodash';
import './index.scss';

const TabsContext = createContext({});

const useTabsContext = () => {
  const {
    state: { activeTabName },
    setActiveTabName
  } = useContext(TabsContext);
  return {
    activeTabName,
    setActiveTabName
  };
};

const reducer = (state, { type, fieldName, payload }) => {
  const isFunc = typeof payload === 'function';
  switch (type) {
    case 'setState': {
      return {
        ...state,
        [fieldName]: payload
      };
    }
    default:
      break;
  }
};

const TabContext = memo(({ children, defaultActiveTabName = '' }) => {
  const [state, dispatch] = useReducer(reducer, {
    activeTabName: defaultActiveTabName
  });

  const setActiveTabName = useCallback(payload => {
    dispatch({
      type: 'setState',
      fieldName: 'activeTabName',
      payload
    });
  }, []);

  const context = useMemo(() => {
    return { state, setActiveTabName };
  }, [state]);

  return <TabsContext.Provider value={context}>{children}</TabsContext.Provider>;
});

const WithTabContext = (Component, contextStaticProps = {}) => {
  return ({ defaultActiveTabName, ...rest }) => {
    const tabContextOtherProps = {
      defaultActiveTabName
    };
    const tabContextProps = assignWith(
      {},
      // 其次
      contextStaticProps,
      // 优先
      tabContextOtherProps,
      (objValue, srcValue) => (isUndefined(srcValue) ? objValue : srcValue)
    );
    return (
      <TabContext {...tabContextProps}>
        <Component {...rest} />
      </TabContext>
    );
  };
};

// 可使用children优先支持完全定制   tabs： [{key, name, label, className, style}]
const Tabs = memo(({ children, tabs = [], onSelect }) => {
  const context = useTabsContext();
  if (!context) return null;
  const { activeTabName, setActiveTabName } = context;
  const handleClickTab = useCallback(
    tab => {
      tab && setActiveTabName(tab.name);
      if (typeof onSelect === 'function') {
        onSelect(tab);
      }
    },
    [setActiveTabName]
  );

  return typeof children === 'function' ? (
    children(context, tabs)
  ) : (
    <div className="store-components-tabs">
      {tabs.map(tab => (
        <div
          key={tab.key}
          className={classNames('store-components-tabs__tab', tab.className, {
            active: tab.name === activeTabName
          })}
          style={tab.style}
          onClick={() => handleClickTab(tab)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
});

const TabPanel = memo(({ children, className, style, tabName, useFragment = false }) => {
  const context = useTabsContext();
  if (!context) return null;

  if (tabName !== context.activeTabName) return null;

  if (typeof children === 'function') {
    return children(tabName, context);
  }

  if (useFragment) {
    return <>{children}</>;
  }

  return (
    <div className={classNames('store-components-tabs__panel', className)} style={style}>
      {children}
    </div>
  );
});

export { Tabs, TabContext, TabPanel, WithTabContext, useTabsContext };
