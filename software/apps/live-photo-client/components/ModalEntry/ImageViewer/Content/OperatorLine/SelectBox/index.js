import cls from 'classnames';
import Trigger from 'rc-trigger';
import 'rc-trigger/assets/index.css';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import IconLeft from '@apps/live/components/Icons/IconLeft';

import { Container, ContainerItem, Icon, List, Text } from './layout';

const SelectBoxContext = React.createContext();

export default function SelectBox(props) {
  const { onChange, value, children, width, className, defaultValue, trigger = 'click' } = props;
  const [store, setStore] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setStore({
        ...store,
        value,
      });
    }
  }, [value]);

  useEffect(() => {
    if (defaultValue !== undefined) {
      setStore({
        ...store,
        value: defaultValue,
      });
    }
  }, []);

  function handleChange(value, label) {
    onChange?.(value);
    setStore({
      ...store,
      value,
      label,
    });
  }

  function onPopupVisibleChange(v) {
    setVisible(v);
  }

  const providerValue = useMemo(() => {
    return {
      onChange: handleChange,
      store,
    };
  }, [store.value]);

  const text = store.label || store.value;
  return (
    <SelectBoxContext.Provider value={providerValue}>
      <Trigger
        forceRender
        popup={<List>{children}</List>}
        // popupPlacement="topLeft"
        action={[trigger]}
        stretch="minWidth"
        popupAlign={{
          points: ['bc', 'tc'],
        }}
        getPopupContainer={trigger => trigger.parentNode}
        popupVisible={visible}
        onPopupVisibleChange={onPopupVisibleChange}
      >
        <Container width={width} className={cls(className)}>
          <Text>{text}</Text>
          <Icon
            className={cls({
              down: visible,
              up: !visible,
            })}
          >
            <IconLeft fill="#fff" />
          </Icon>
        </Container>
      </Trigger>
    </SelectBoxContext.Provider>
  );
}

export function SelectItem(props) {
  const { store, onChange } = useContext(SelectBoxContext);
  const { value, children } = props;
  function handleClick() {
    onChange(value, children);
  }

  useEffect(() => {
    if (value === store.value) {
      onChange(value, children);
    }
  }, [store.value]);

  if (typeof children !== 'string') {
    console.error('children must be string');
    return null;
  }
  return (
    <ContainerItem
      className={cls({
        current: store.value === value,
      })}
      onClick={handleClick}
    >
      {children}
    </ContainerItem>
  );
}
