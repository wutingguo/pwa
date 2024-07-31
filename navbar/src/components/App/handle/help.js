import { template } from 'lodash';
import { FAQ_ADDRESS, FAQ_ADDRESS_CN } from '@resource/lib/constants/apiUrl';
import { getLanguageCode } from '@resource/lib/utils/language';

const onHowThisWorks = that => {
  window.logEvent.addPageEvent({
    name: 'ProductEditor_Click_HowThisWorks'
  });

  const { boundGlobalActions } = that.props;
  boundGlobalActions.showHowThisWorks();
};

const onGuidlineTips = that => {
  const { boundGlobalActions } = that.props;
  boundGlobalActions.showGuildLineTips();
};

const onFAQ = that => {
  window.logEvent.addPageEvent({
    name: 'ProductEditor_Click_FAQ'
  });

  let faqAddress;
  if (__isCN__) {
    faqAddress = FAQ_ADDRESS_CN;
  } else {
    let languageCode = getLanguageCode();
    if (languageCode === 'en') {
      languageCode = 'en-us';
    }
    faqAddress = template(FAQ_ADDRESS)({
      languageCode
    });
  }
  window.open(faqAddress, '_blank');
};

const onFeedback = that => {
  window.logEvent.addPageEvent({
    name: 'ProductEditor_Click_Feedback'
  });
  const { boundGlobalActions, productCode } = that.props;
  boundGlobalActions.showFeedback({ sku: productCode });
};

const onLogout = (that, { isGalleryLayoutPage }) => {
  const { history, boundGlobalActions, baseUrl } = that.props;
  boundGlobalActions.logout().then(() => {
    let pathname = location.pathname;

    // designer 中登出，再次登入跳转projcts
    if (location.pathname === '/designer') {
      pathname = '/software/designer/projects';
    }
    if (location.pathname === '/software/designer/order-details') {
      pathname = '/software/designer/my-orders';
    }
    //collection子页面登出，跳转相关列表页
    if (isGalleryLayoutPage) {
      for (let page of isGalleryLayoutPage) {
        if (pathname.indexOf(page) > -1) {
          pathname = page;
          break;
        }
      }
    }

    const url = encodeURIComponent(pathname);

    window.location.href = __isCN__
      ? `/passport.html?url=${url}&from=saas`
      : `/sign-in.html?url=${url}&from=saas`;
  });
};

export default {
  onHowThisWorks,
  onGuidlineTips,
  onFAQ,
  onFeedback,
  onLogout
};
