import React, { useEffect, useState } from 'react';

import { downImage as download } from '@resource/lib/utils/image';

import { XIcon } from '@common/components';

import completeIcon from '../../icon/complete.png';

import './index.scss';

const ReadyPage = props => {
  const { url, name, goToStep, boundProjectActions, isHasExistedZip, initialStep } = props;

  const goPreviousStep = () => {
    if (isHasExistedZip && (initialStep === 2 || initialStep === 1)) {
      goToStep(2);
      return;
    }
    goToStep(3);
  };
  const [newName, setNewName] = useState(name);
  const handleClick = () => {
    download(url, name);
    !__isCN__ && boundProjectActions.getLimitPhotoDownload();
  };
  useEffect(() => {
    if (name && name.length > 40) {
      let str = name.slice(0, 30) + `...` + name.slice(-4);
      setNewName(str);
    } else {
      setNewName(name);
    }
  }, [name]);

  return (
    <div className="ready-page-container">
      <div className="page-back-header">
        <XIcon
          className="back"
          type="back"
          onClick={goPreviousStep}
          iconWidth={16}
          iconHeight={16}
          fontSize={16}
          fontColor="#3A3A3A"
          text=""
        />
      </div>
      <div className="ready-page-desc">
        <img src={completeIcon} className="desc-icon" />
        <span className="desc-title">{t('ZIP_READY_PAGE_TITLE')}</span>
        <span className="desc-tip">{t('ZIP_READY_PAGE_DESC')}</span>
      </div>
      <div className="ready-page-btn" onClick={handleClick}>
        {newName}
      </div>
    </div>
  );
};

export default ReadyPage;
