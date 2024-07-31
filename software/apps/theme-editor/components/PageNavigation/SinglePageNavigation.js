import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useState } from 'react';
import LazyLoad from 'react-lazy-load';

import XDeleteIcon from '@resource/components/XDeleteIcon';
import XDrag from '@resource/components/XDrag';
import XDrop from '@resource/components/XDrop';

import { getTransferData, setTransferData } from '@resource/lib/utils/drag';

import BookSheet from '@apps/theme-editor/components/BookSheet';
import DragLine from '@apps/theme-editor/components/DragLine';
import PageNumberSimple from '@apps/theme-editor/components/PageNumberSimple';

const SinglePageNavigation = props => {
  const { ratio, pagination, page, pageArray, boundGlobalActions, boundProjectActions } = props;
  const { current } = pagination.toJS();
  const { hideConfirm, showConfirm, addNotification } = boundGlobalActions;
  const sheetIndex = pageArray.findIndex(item => page.get('id') === item.get('id'));
  const currentPaginationPage = pageArray.get(current);

  const [isActive, setIsActive] = useState(
    currentPaginationPage && currentPaginationPage.get('id') === page.get('id')
  );
  const [dropPageId, setDropPageId] = useState(null);

  useEffect(() => {
    setIsActive(currentPaginationPage.get('id') === page.get('id'));
  }, [currentPaginationPage, page]);

  const onMouseOver = e => {
    setIsActive(true);
  };

  const onMouseOut = e => {
    const isCurrent = currentPaginationPage.get('id') === page.get('id');
    !isCurrent && setIsActive(false);
  };

  const onDropPage = useCallback(e => {
    e.preventDefault();
    const dragData = getTransferData(e);
    const dragPageId = (dragData && dragData.pageId) || '';

    if (dragPageId === dropPageId) return;

    boundProjectActions.movePageBefore(dragPageId, dropPageId);
    setTransferData(e, {});
    setDropPageId(null);
  });

  const onDragOvered = useCallback(e => {
    const currentPageId = page.get('id');
    setDropPageId(currentPageId);
  });

  const onDragLeaved = useCallback(e => {
    setDropPageId(null);
  });

  const onDragStarted = useCallback(
    e => {
      setTransferData(e, {
        pageId: page.get('id'),
      });
    },
    [page]
  );

  const onDragEnded = useCallback(e => {
    setTransferData(e, {});
    setDropPageId(null);
  });
  const pageNumberProps = {
    page,
    pageArray,
    isActive,
  };
  const sheetProps = {
    ratio,
    page,
    pageArray,
    pagination,
    eventsDisabled: true,
    boundGlobalActions,
    boundProjectActions,
  };
  const draLineProps = {
    isShow: dropPageId === page.get('id'),
  };
  const dragProps = {
    ...sheetProps,
    onDragStarted,
    onDragEnded,
  };
  const dropProps = {
    ...sheetProps,
    onDroped: onDropPage,
    onDragOvered,
    onDragLeaved,
  };

  const onPageItemClick = e => {
    boundProjectActions.switchSheet(sheetIndex);
  };
  const handleDeletePage = () => {
    const data = {
      className: 'delete-page-modal',
      close: () => {
        hideConfirm();
      },
      btnOpenClose: true,
      message: t('您确定要删除该页面么？'),
      buttons: [
        {
          className: 'white pwa-btn',
          text: t('CANCEL'),
          onClick: () => {
            hideConfirm();
          },
        },
        {
          className: ' black pwa-btn',
          text: t('确定'),
          onClick: () => {
            boundProjectActions.deletePage(page.get('id'));
            addNotification({
              message: t('已成功删除'),
              level: 'success',
              autoDismiss: 2,
            });
            hideConfirm();
          },
        },
      ],
    };
    showConfirm(data);
  };
  const sheetItemClass = classNames('sheet-item', {
    selected: isActive,
  });
  const deleteIconProps = {
    className: 'delete-page',
    style: {},
    title: t('DELETE_PAGES'),
    onClicked: e => {
      e.stopPropagation();
      handleDeletePage();
    },
    isShow:
      pageArray.size > 1 &&
      isActive &&
      currentPaginationPage &&
      currentPaginationPage.get('id') === page.get('id'),
    isBlack: true,
  };
  const lazyLoadProps = {
    width: page.get('width') * ratio,
    height: page.get('height') * ratio,
  };
  return (
    <div
      key={page.get('id')}
      className={sheetItemClass}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onPageItemClick}
      title={'拖拽页面以调整顺序'}
      // style={{width: `${width}px`}}
    >
      <PageNumberSimple {...pageNumberProps} />
      <XDrag {...dragProps}>
        <XDrop {...dropProps}>
          <LazyLoad {...lazyLoadProps}>
            <BookSheet {...sheetProps} />
          </LazyLoad>
        </XDrop>
      </XDrag>
      <DragLine {...draLineProps} />
      <XDeleteIcon {...deleteIconProps} />
    </div>
  );
};

export default memo(SinglePageNavigation);
