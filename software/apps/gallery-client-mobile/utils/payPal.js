const PAYPAL_WINDOW_NAME = 'estore-paypal-window';
const PAYPAL_WINDOW_CHANNEL_NAME = 'estore-paypal-window-channel';
let crossWindowChannel = window;
try {
  crossWindowChannel = new BroadcastChannel(PAYPAL_WINDOW_CHANNEL_NAME);
} catch {
  console.error('BroadcastChannel  error');
}
// 主窗口只保持一个子window的引用
let paypalWindowObj = null;

// token -g: EC-8X860296DF6679648
const openPayPalWindow = ({ token, enableMock = false }) => {
  if (paypalWindowObj) {
    paypalWindowObj.close();
  }

  if (!token) return;

  // 通过是否以.d .t结尾判断开发环境
  const isDev = /(\.d$)|(\.t$)|(\.tt$)/i.test(location.host);

  paypalWindowObj = window.open(
    `https://www${
      isDev ? '.sandbox' : ''
    }.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=${token}`,
    '_self',
    PAYPAL_WINDOW_NAME
  );
};

const onMessage = ({ listener }) => {
  console.log('reg onMessage');
  crossWindowChannel.addEventListener('message', e => {
    console.log(`paypalUtil onMessage`, e);
    if (e.origin !== window.location.origin) return;
    listener && listener(e.data || {});
  });
};

const postMessage = data => {
  crossWindowChannel.postMessage(data);
};

const paypalUtil = {
  openPayPalWindow,
  onMessage,
  postMessage,
};

export default paypalUtil;
