import CreateForm from '../createForm';

export default function connectForm() {
  return WrapperElement => {
    const obj = new CreateForm();
    const form = obj.getForm();
    return props => {
      return <WrapperElement form={form} {...props} />;
    };
  };
}
