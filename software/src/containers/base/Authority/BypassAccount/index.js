import React from 'react';

import { getQs } from '@resource/lib/utils/url';

import UpTeamImg from '@resource/static/image/1.png';
import noPowerImg from '@resource/static/image/2.png';

export default function BypassAccount(props) {
  const { userInfo } = props;
  const {
    accountInfo: { team_resource },
  } = userInfo.toJS();
  const fromRoute = getQs('from');

  let showUpTeam = false;
  if (fromRoute && fromRoute.indexOf('/software/designer') !== -1) {
    showUpTeam = true;
  }
  console.log(showUpTeam, 'showUpTeam');
  return (
    <div className="bypass-account-container">
      <div className="bypass-account-img">
        <img src={showUpTeam ? UpTeamImg : noPowerImg} alt="" />
      </div>
      <div className="bypass-account-text">
        {showUpTeam
          ? '子账号暂无访问权限，请将对应的企业账号升级订阅为“团队版”'
          : '子账户暂不支持访问该页面'}
      </div>
    </div>
  );
}
