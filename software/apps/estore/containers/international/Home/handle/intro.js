import React from 'react';
import cookie from 'react-cookies';
import { checkIsThirdProject } from '@resource/lib/project/helper';
import XStep from '@resource/components/XStep';
import StepDescription from '@resource/components/StepDescription';
import * as modalTypes from '@resource/lib/constants/modalTypes';

export const showIntro = that => {
  // const hasShowGetStarted = !!cookie.load('HAS_SHOW_ESTORE_INTRO_KEY');
  const hasShowGetStarted = !!localStorage.getItem('HAS_SHOW_ESTORE_INTRO_KEY');
  // 如果没有显示新手指引. 就显示第一次.
  if (!hasShowGetStarted) {
    // 显示新手指引.
    that.showIntroModal();

    // 过期为一年.
    // const expires = new Date();
    // expires.setDate(expires.getDate() + 365);

    // 更新cookie.
    // cookie.save('HAS_SHOW_ESTORE_INTRO_KEY', true, {
    //   expires,

    //   // https
    //   secure: true
    // });
    localStorage.setItem('HAS_SHOW_ESTORE_INTRO_KEY', true);
  }
};

const getSteps = that => {
  const { selectedProjectItem } = that.props;

  const tooltipStyle = {
    style: {
      backgroundColor: '#fff',
      zIndex: 10000000000,
      borderRadius: '6px',
      boxShadow: 'none',
      width: '422px'
    },
    arrowStyle: {
      color: '#fff',
      borderColor: false,
      left: '40%'
    }
  };

  // 第一个提示：查看产品
  const productStep = {
    ele: (
      <XStep onPrevious={that.onIntroPrevious} onNext={that.onIntroNext} onSkip={that.onIntroSkip}>
        <div className="store-step">2 Steps to Launch Your Store!</div>
        <StepDescription
          activeIcon={0}
          iconsCount={2}
          title="Setup Products"
          description="Manage your products and adjust pricing. "
          iconClass="store-icon-list"
        />
      </XStep>
    ),
    parent: '#products',
    position: 'bottom',
    arrow: 'center',
    style: tooltipStyle,
    tooltipTimeout: 0
  };

  // 第二个提示
  const settingStep = {
    ele: (
      <XStep
        onNext={that.onIntroDone}
        onSkip={that.onIntroSkip}
        skipText={'Done'}
        nextText={'Now setup your products!'}
      >
        <div className="store-step">2 Steps to Launch Your Store!</div>
        <StepDescription
          activeIcon={1}
          iconsCount={2}
          title="Setup Checkout"
          description="Select a payment method to enable checkout."
          iconClass="store-icon-list"
        />
      </XStep>
    ),
    parent: '#settings',
    position: 'bottom',
    arrow: 'center',
    style: tooltipStyle,
    tooltipTimeout: 0
  };

  return [productStep, settingStep];
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
        name: tagName
      });
    }
  }
};

export const onOrderStep = that => {
  // 埋点.
  trace(that, 'ClickAddPhotosViaGuide', true);

  onGoto(that, -1);
};

export const onGoto = (that, stepIndex) => {
  const { boundGlobalActions } = that.props;
  const introModal = getIntroModal(that);
  const data = introModal.toJS();
  boundGlobalActions.gotoStep(stepIndex);
  if (stepIndex === -1) {
    boundGlobalActions.hideIntro(data);
  }
};

export const onSkip = that => {
  const introModal = getIntroModal(that);
  const currentStep = introModal.get('current');
  if (currentStep) {
    trace(that, 'Estore_QuickStartPop_Click_Done');
  } else {
    trace(that, 'Estore_QuickStartPop_Click_Skip');
  }
  onGoto(that, -1);
};

export const onDone = that => {
  // 埋点.
  trace(that, 'Estore_QuickStartPop_Click_SetupProducts', true);
  onGoto(that, -1);
  that.onSelect(1);
};

export const onNext = that => {
  const introModal = getIntroModal(that);
  const currentStep = introModal.get('current');
  const stepCounts = introModal.get('stepCounts');
  if (stepCounts > currentStep + 1) {
    onGoto(that, currentStep + 1);
  }
  trace(that, 'Estore_QuickStartPop_Click_Next', true);
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
    className: 'estore-steps-modal'
  });
};
