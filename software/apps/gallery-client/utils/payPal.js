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
  const windowOptions = {
    width: 800,
    height: 800,
    scrollbars: 'yes',
    status: 'no',
    location: 'no',
    menubar: 'no',
    toolbar: 'no',
  };
  // windowOptionStr -eg: 'width=420,height=230,resizable,scrollbars=yes,status=1'
  const left = (window.screen.availWidth - 30 - windowOptions.width) / 2;
  const top = (window.screen.availHeight - 10 - windowOptions.height) / 2;
  windowOptions.left = left;
  windowOptions.top = top;
  const windowOptionStr = Object.keys(windowOptions)
    .map(k => `${k}=${windowOptions[k]}`)
    .join(',');

  if (enableMock) {
    const path = `/gallery-client/index.html?orderNo=1213213#/payment/failed`;
    paypalWindowObj = window.open(path, PAYPAL_WINDOW_NAME, windowOptionStr);
    return;
  }
  if (!token) return;

  // 通过是否以.d .t结尾判断开发环境
  const isDev = /(\.d$)|(\.t$)|(\.tt$)/i.test(location.host);

  paypalWindowObj = window.open(
    `https://www${
      isDev ? '.sandbox' : ''
    }.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=${token}`,
    PAYPAL_WINDOW_NAME,
    windowOptionStr
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
