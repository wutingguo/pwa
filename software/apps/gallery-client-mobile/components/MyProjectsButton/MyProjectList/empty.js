import React, { memo, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router';
import { XButton } from '@common/components';
import classnames from 'classnames';

const Empty = ({ closePop }) => {
  const { pathname } = useLocation();
  const history = useHistory();

  const isPrintStore = pathname.startsWith('/printStore/categories');

  const handleClick = useCallback(() => {
    window.logEvent.addPageEvent({
      name: 'ClientEstore_SavedDesigns_Click_ViewPrintStore'
    });
    if (!isPrintStore) {
      history.push('/printStore/categories');
    } else {
      closePop();
    }
  }, [isPrintStore]);

  console.log('location', location);
  return (
    <div className="print-store-my-projects-list-other-container empty">
      <div className="empty-center">
        <span className="desc">{t('NO_SAVED_DESIGNS')}</span>
      </div>
      <div className="empty-footer">
        <XButton
          className={classnames('black button', 'width-145')}
          height="40"
          onClick={handleClick}
        >
          {/* {isPrintStore ? 'Close' : 'View Print Store'} */}
          {t('VIEW_PRINT_STORE')}
        </XButton>
      </div>
    </div>
  );
};

export default memo(Empty);
