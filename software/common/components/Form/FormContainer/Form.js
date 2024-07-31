import React, { useEffect, useLayoutEffect, useMemo } from 'react';

import CreateForm from '../createForm';
import { FormContext } from '../formContext';

export default React.forwardRef(Form);

function Form(props, ref) {
  const { children, form, onFinish, style, layout, wrapCol, formStateChange } = props;

  const value = useMemo(() => {
    if (form === undefined) {
      return { form: new CreateForm(), layout };
    }

    return { form, layout, wrapCol, formStateChange };
  }, [form, layout]);

  useLayoutEffect(() => {
    value.form.boundToFormElementProps({ onFinish });
  }, [value.form, onFinish]);

  React.useImperativeHandle(ref, () => ({
    submit: onSubmit,
  }));

  function onSubmit(e) {
    e?.preventDefault();
    const data = form.getFormData();
    if (data !== null && typeof onFinish === 'function') {
      onFinish(data);
    }
  }
  return (
    <form onSubmit={onSubmit} style={style}>
      <FormContext.Provider value={value}>{children}</FormContext.Provider>
    </form>
  );
}
