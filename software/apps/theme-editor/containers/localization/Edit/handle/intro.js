import React from 'react';
import cookie from 'react-cookies';

import StepDescription from '@resource/components/StepDescription';
import XStep from '@resource/components/XStep';

import * as modalTypes from '@resource/lib/constants/modalTypes';

// export const showIntro = that => {
//   // const hasShowGetStarted = !!cookie.load('HAS_SHOW_ESTORE_INTRO_KEY');
//   const hasShowGetStarted = !!localStorage.getItem('HAS_SHOW_ESTORE_INTRO_KEY');
//   // 如果没有显示新手指引. 就显示第一次.
//   if (!hasShowGetStarted) {
//     // 显示新手指引.
//     that.showIntroModal();

//     // 过期为一年.
//     // const expires = new Date();
//     // expires.setDate(expires.getDate() + 365);

//     // 更新cookie.
//     // cookie.save('HAS_SHOW_ESTORE_INTRO_KEY', true, {
//     //   expires,

//     //   // https
//     //   secure: true
//     // });
//     localStorage.setItem('HAS_SHOW_ESTORE_INTRO_KEY', true);
//   }
// };

const getSteps = that => {
  const { pageArray, pagination, ratios } = that.props;
  const page = pageArray?.toJS()[0];
  const ratio = ratios.get('innerWorkspace');
  const sheetStyle = {
    width: page.width * ratio,
    height: page.height * ratio,
  };
  const tooltipStyle = {
    style: {
      backgroundColor: '#fff',
      zIndex: 10000000000,
      borderRadius: '6px',
      boxShadow: 'none',
    },
    arrowStyle: {
      color: '#fff',
      borderColor: false,
      left: '40%',
    },
  };

  // 第一个提示：查看产品
  const productStep1 = {
    ele: (
      <XStep
        onPrevious={that.onIntroPrevious}
        onNext={that.onIntroNext}
        onSkip={that.onIntroSkip}
        skipText={'跳过'}
        nextText={'下一步'}
      >
        <StepDescription
          activeIcon={0}
          iconsCount={3}
          title="欢迎上传主题"
          description="确认上传页面，可新增、删除、调整页面顺序"
          iconClass="store-icon-list"
        />
      </XStep>
    ),
    parent: '#addpage',
    position: 'top',
    arrow: 'left',
    style: {
      style: { ...tooltipStyle.style, width: '324px' },
      arrowStyle: tooltipStyle.arrowStyle,
    },
    tooltipTimeout: 0,
  };

  // 第二个提示
  const productStep2 = {
    ele: (
      <XStep
        onNext={that.onIntroNext}
        onSkip={that.onIntroSkip}
        skipText={'跳过'}
        nextText={'下一步'}
      >
        <div className="set-photo-video">
          <div className="video-box" style={sheetStyle}>
            <video
              autoPlay
              muted
              loop
              src="/clientassets-cunxin-saas/portal/videos/psd.mp4"
            ></video>
          </div>
        </div>
        <StepDescription
          activeIcon={1}
          iconsCount={3}
          title="设置照片框"
          descriptionIsHTML={true}
          description="选中照片区域，点击“设为照片框”按钮，完成照片框设置<br/>“Ctrl + 左键”，多选照片框一键设置"
          iconClass="store-icon-list"
        ></StepDescription>
      </XStep>
    ),
    parent: '#editContainer',
    position: 'right',
    arrow: 'top',
    style: {
      style: { ...tooltipStyle.style, width: '230px' },
      arrowStyle: tooltipStyle.arrowStyle,
    },
    tooltipTimeout: 0,
  };
  // 第三个提示
  const productStep3 = {
    ele: (
      <XStep
        onNext={that.onIntroDone}
        onSkip={that.onIntroSkip}
        skipText={''}
        nextText={'立即体验'}
      >
        <StepDescription
          activeIcon={2}
          iconsCount={3}
          title="保存主题"
          description={`点击“保存”，完成主题上传 <br/> <br /> 
          请确认所有页面完成照片框设置~`}
          iconClass="store-icon-list"
          descriptionIsHTML={true}
        />
      </XStep>
    ),
    parent: '#save-theme',
    position: 'bottom',
    arrow: 'right',
    style: {
      style: { ...tooltipStyle.style },
      arrowStyle: tooltipStyle.arrowStyle,
    },
    tooltipTimeout: 0,
  };

  return [productStep1, productStep2, productStep3];
};

const getIntroModal = that => {
  const { modals } = that.props;
  return modals ? modals.find(m => m.get('modalType') === modalTypes.INTRO_MODAL) : undefined;
};

export const trace = (that, tagName, isSkipParam = false) => {
  const introModal = getIntroModal(that);
  if (tagName && introModal) {
    const steps = getSteps(that);
    const currentStep = introModal.get('current');
    // 如果有值, 并且不是-1.
    if (!isNaN(currentStep) && currentStep !== -1 && currentStep < steps.length) {
      window.logEvent.addPageEvent({
        name: tagName,
      });
    }
  }
};

export const onOrderStep = that => {
  // 埋点.
  // trace(that, 'ClickAddPhotosViaGuide', true);

  onGoto(that, -1);
};

export const onGoto = (that, stepIndex) => {
  const { boundGlobalActions } = that.props;
  const introModal = getIntroModal(that);
  if (introModal) {
    const data = introModal.toJS();
    boundGlobalActions.gotoStep(stepIndex);
    if (stepIndex === -1) {
      boundGlobalActions.hideIntro(data);
    }
  }
};

export const onSkip = that => {
  const introModal = getIntroModal(that);
  // const currentStep = introModal.get('current');
  // if (currentStep) {
  //   trace(that, 'Estore_QuickStartPop_Click_Done');
  // } else {
  //   trace(that, 'Estore_QuickStartPop_Click_Skip');
  // }
  onGoto(that, -1);
};

export const onDone = that => {
  // 埋点.
  // trace(that, 'Estore_QuickStartPop_Click_SetupProducts', true);
  onGoto(that, -1);
};

export const onNext = that => {
  const introModal = getIntroModal(that);
  const currentStep = introModal.get('current');
  const stepCounts = introModal.get('stepCounts');
  if (stepCounts > currentStep + 1) {
    onGoto(that, currentStep + 1);
  }
  // trace(that, 'Estore_QuickStartPop_Click_Next', true);
};

export const onPrevious = that => {
  const introModal = getIntroModal(that);
  const currentStep = introModal.get('current');

  if (currentStep - 1 >= 0) {
    onGoto(that, currentStep - 1);
  }
};

export const showIntroModal = that => {
  const { boundGlobalActions } = that.props;
  const steps = getSteps(that);
  boundGlobalActions.showIntro({
    current: 0,
    stepCounts: steps.length,
    steps,
    className: 'theme-editor-steps-modal',
  });
};
