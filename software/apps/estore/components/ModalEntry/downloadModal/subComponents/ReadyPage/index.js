import React from 'react';
import { downImage as download } from '@resource/lib/utils/image';

import completeIcon from '../../icon/complete.png';

import './index.scss';

const ReadyPage = props => {
  const { url, name } = props;

  const handleClick = () => {
    download(url, name);
  };

  return (
    <div className="ready-page-container">
      <div className="ready-page-desc">
        <img src={completeIcon} className="desc-icon" />
        <span className="desc-title">{t('ZIP_READY_PAGE_TITLE')}</span>
        <span className="desc-tip">{t('ZIP_READY_PAGE_DESC')}</span>
      </div>
      <div className="ready-page-btn" onClick={handleClick}>
        {name}
      </div>
    </div>
  );
};

export default ReadyPage;
