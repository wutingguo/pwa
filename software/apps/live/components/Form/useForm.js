import { useRef } from 'react';
import CreateForm from './createForm';

export default function useForm() {
  const form = useRef(null);

  if (form.current === null) {
    form.current = new CreateForm().getForm();
  }

  return [form.current];
}
