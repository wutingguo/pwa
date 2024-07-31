import React from 'react';

import { FormContext } from './formContext';

export default function useFormInstance() {
  const { form } = React.useContext(FormContext);

  return form;
}
