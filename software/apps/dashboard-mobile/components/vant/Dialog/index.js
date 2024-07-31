import { Dialog } from 'react-vant';

const defaultConfirm = Dialog.confirm;
const confirm = reset => {
  defaultConfirm({
    confirmButtonColor: '#000',
    cancelButtonColor: '#666',
    ...reset,
  });
};

Dialog.confirm = confirm;

export default Dialog;
