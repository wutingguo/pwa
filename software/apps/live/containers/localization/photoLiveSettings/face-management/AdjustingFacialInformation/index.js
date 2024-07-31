import React, { useEffect, useRef, useState } from 'react';

import InformationContent from './InformationContent';
import InformationSide from './InformationSide';
import { Container } from './layout';

export default function AdjustingFacialInformation(props) {
  const { goToStep, users, queryUser, record } = props;
  const [value, setValue] = useState([]);
  const defaultValues = useRef(null);

  useEffect(() => {
    if (!record) return;
    handleChange(record?.detail_id);
  }, [record]);
  function onBack() {
    goToStep(1);
  }

  function handleChange(id) {
    const values = [...value];
    const index = values.indexOf(id);
    if (index === -1) {
      values.push(id);
    } else {
      values.splice(index, 1);
    }
    if (!defaultValues.current) {
      defaultValues.current = values;
    }
    setValue(values);
  }

  function onSubmit() {
    setValue([]);
    queryUser?.();
    goToStep(1);
  }
  return (
    <Container>
      <InformationSide
        onBack={onBack}
        values={value}
        onChange={handleChange}
        onClear={() => setValue([])}
        onSubmit={onSubmit}
        queryUser={queryUser}
        users={users}
        defaultValues={defaultValues.current}
        record={record}
      />
      <InformationContent record={record} />
    </Container>
  );
}
