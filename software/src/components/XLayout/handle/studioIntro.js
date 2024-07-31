import React from 'react';
import cookie from 'react-cookies';
import { HAS_SHOW_GET_STUDIO_KEY } from '@resource/lib/constants/strings';

const showStudioIntro = that => {
  const hasShowGetStarted = !!cookie.load(HAS_SHOW_GET_STUDIO_KEY);

  // 如果没有显示指引. 就显示第一次.
  if (!hasShowGetStarted) {
    // 显示指引.
    that.setState({
      isShowStudio: true
    });
  }
};

const updateStudioIntro = that => {
  // 过期为2星期.
  const expires = new Date();
  expires.setDate(expires.getDate() + 14);

  // 更新cookie.
  cookie.save(HAS_SHOW_GET_STUDIO_KEY, true, {
    expires,
    // https
    secure: true,
    path: '/',
  });

  that.setState({
    isShowStudio: false
  });
};

const closeStudioIntro = that => {
  updateStudioIntro(that);
  window.logEvent.addPageEvent({
    name: 'TopNavigation_Click_NotRemind',
  });
}

const toStudio = that => {
  updateStudioIntro(that);
  window.logEvent.addPageEvent({
    name: 'TopNavigation_Click_InfoSetting',
  });
  that.props.history.push('/software/account?tabs=1')
}

const renderStudioIntro = that => {
  return (
    <div className="studio-intro">
      <div className="back-color" />
      <div className="content">
        <div className="title">您可以在资料中设置LOGO/工作室名称</div>
        <div className="btns">
          <div className="cancel" onClick={() => closeStudioIntro(that)} >
            不再显示
          </div>
          <div onClick={() => toStudio(that)}>
            资料设置
          </div>
        </div>
      </div>
    </div>
  )
}


export default {
  renderStudioIntro,
  showStudioIntro
}
