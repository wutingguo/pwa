import React from 'react';
import XButton from '@resource/components/XButton';
import CommonModal from '../commonModal/index';
import './index.scss';

const DoubleCheckAssign = props => {
  const { data } = props;
  const handleAssign = data.get('handleAssign');

  const modalProps = {
    hideBtnList: true,
    title: t('ASSIGN_TO_COLLECTIONS')
  };

  return (
    <CommonModal className="doubleCheckAssignModal" {...props} {...modalProps}>
      <div className="doubleCheckAssignBody">
        {t('DOUBLE_CHECK_TIPS')}
        <div className="storeStatusBtn">
          <XButton onClick={() => handleAssign(true)}>{t('ASSIGN_TURN_ON_STATUS')}</XButton>
          <XButton onClick={() => handleAssign(false)}>{t('ASSIGN_KEEP_STATUS')}</XButton>
        </div>
      </div>
    </CommonModal>
  );
};

export default DoubleCheckAssign;
