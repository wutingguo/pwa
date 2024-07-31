import request from '@resource/websiteCommon/utils/ajax';

const SESSIONLOGINBYAUTHTOKEN = '/cloudapi/sessionLogin/sessionLoginByAuthToken';

export const miniProgramLogin = obj => {
  return new Promise((resolve, reject) => {
    request({
      url: `${obj.baseUrl}${SESSIONLOGINBYAUTHTOKEN}`,
      // url: SESSIONLOGINBYAUTHTOKEN,
      async: false,
      header: {
        'X-AS-AUTH-TOKEN': obj.auth_token || '',
        'X-AS-APP-ID': '21001',
        'X-AS-DEVICE': 'xcx',
      },
      method: 'post',
      setJSON: true,
      data: {},
      success: result => {
        if (result.ret_code === 401000) {
          // 小程序重新授权
          // window.wx && window.wx.miniProgram.postMessage({ data: { noLogin: true } });
        }
        // todo 在产品页，春节活动需要跳到指定页面(在小程序打开产品列表页面可能会传递这个参数)
        // if (getQs('miniProductCategory')) {
        //   //sourceFrom:'mp', isFromOuter:'true',
        //   location.href = `${decodeURIComponent(getQs('miniProductCategory'))}&sourceFrom=mp&isFromOuter=true`;
        // }
        resolve();
      },
      error: err => {
        reject(err);
      },
    });
  });
};
