import { aiMattingMessageType } from '@resource/lib/constants/strings';

import { sendMessageToWindow } from '@apps/ai-matting/utils/window';

const onBeforePageUnload = e => {
  e.preventDefault();
  e.returnValue = '请注意：您当前编辑的数据将会丢失';
};

const removeBeforeUnload = () => {
  window.removeEventListener('beforeunload', onBeforePageUnload);
};

const willMount = that => {};

const didMount = that => {
  window.addEventListener('resize', that.onresize);
  window.addEventListener('message', that.onReceiveMessage);
  window.addEventListener('beforeunload', onBeforePageUnload);
  window.removeBeforeUnload = removeBeforeUnload;
  //发送消息到父窗口，告知已经准备好
  sendMessageToWindow({
    type: aiMattingMessageType.IMAGE_MATTING_READY,
  });
};

const willUnmount = that => {
  window.removeEventListener('resize', that.onresize);
  window.removeEventListener('message', that.onReceiveMessage);
  removeBeforeUnload();
};

const didUpdate = that => {};

const showRetryModal = (that, { title, message, onConfirm }) => {
  const { boundGlobalActions, boundProjectActions } = that.props;
  function handleClose() {
    exitImageMatting();
  }
  const confirmData = {
    className: 'ai-matting-confirm-modal',
    close: handleClose,
    btnOpenClose: true,
    title,
    message,
    buttons: [
      // {
      //   className: 'white pwa-btn',
      //   text: t('CANCEL'),
      //   onClick: () => {
      //     exitImageMatting;
      //   }
      // },
      {
        className: 'pwa-btn',
        text: t('RETRY'),
        onClick: () => {
          boundGlobalActions.hideConfirm();
          onConfirm?.();
        },
      },
    ],
  };
  boundGlobalActions.showConfirm(confirmData);
};

//退出抠图界面
const exitImageMatting = that => {
  sendMessageToWindow({
    type: aiMattingMessageType.EXIT_IMAGE_MATTING,
  });
};

export {
  willMount,
  didMount,
  willUnmount,
  didUpdate,
  showRetryModal,
  exitImageMatting,
  sendMessageToWindow,
};
