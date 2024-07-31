import React, { memo, useCallback, useMemo, useState } from 'react';
import classnames from 'classnames';
import { debounce } from 'lodash';
import XLoading from '@resource/components/XLoading';
import { CONFIRM_MODAL } from '../../../constants/modalTypes';
import useMyProjects from './useMyProjects';
import Empty from './empty';
import noimageImg from './noimage_pc.png';

import './index.scss';

const ProjectHeader = memo(({ projectImg }) => {
  const [isErr, setIsErr] = useState(false);

  const handleError = useCallback(() => {
    setIsErr(true);
  }, []);

  return (
    <div className="print-store-my-project__header">
      <img src={isErr ? noimageImg : projectImg} onError={handleError} />
    </div>
  );
});

const MyProjectList = ({ closePop, boundGlobalActions }) => {
  const {
    listLoading,
    projectList,
    createProjectImgByProjectId,
    deleteProject,
    buildEditorUrl
  } = useMyProjects({ boundGlobalActions });

  const [shakeDisabledTextProjectId, setShakeDisabledTextProjectId] = useState('NO');

  const cancelShakeDisabledText = useMemo(() => {
    return debounce(() => {
      setShakeDisabledTextProjectId('NO');
    }, 500);
  }, [setShakeDisabledTextProjectId]);

  const handleDelete = useCallback(
    async ({ id, status }) => {
      window.logEvent.addPageEvent({
        name: 'ClientEstore_SavedDesigns_Click_Delete'
      });
      // 1已经加入购物车  2 已经下单
      let message = t('WANT_TO_DELETE_THIS_PROJECT');
      let buttons = [
        {
          text: t('CANCEL'),
          style: {
            color: '#222',
            backgroundColor: '#FFF',
            border: '1px solid #222'
          },
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'ClientEstore_SavedDesignsDeletePop_Click_Cancel'
            });
          }
        },
        {
          text: t('CONTINUE'),
          onClick: async () => {
            window.logEvent.addPageEvent({
              name: 'ClientEstore_SavedDesignsDeletePop_Click_Continue'
            });
            await deleteProject(id);
          }
        }
      ];
      switch (status) {
        case 1: {
          message = t(
            'DELETED_TIPS',
            'This project has been added to your shopping cart. Please remove it from cart before deleting.'
          );
          buttons = [
            {
              text: t('OK1')
            }
          ];
          break;
        }
        default:
          break;
      }
      boundGlobalActions.showModal(CONFIRM_MODAL, {
        // title: "Info",
        className: 'print-store-delete-my-project-confirm-modal',
        message,
        close: () => boundGlobalActions.hideModal(CONFIRM_MODAL),
        buttons
      });
    },
    [deleteProject, boundGlobalActions]
  );

  const handleContinue = useCallback(
    async project => {
      window.logEvent.addPageEvent({
        name: 'ClientEstore_SavedDesigns_Click_Continue'
      });
      const { project_id, parent_category_code, disabled } = project;
      if (!disabled) {
        const href = await buildEditorUrl({
          projectId: project_id,
          parentCategoryCode: parent_category_code
        });
        href && (location.href = href);
      } else {
        // 抖动红字 提示已经不可以再继续编辑
        setShakeDisabledTextProjectId(project_id);
        cancelShakeDisabledText();
      }
    },
    [buildEditorUrl]
  );

  if (listLoading) {
    return (
      <div className="print-store-my-projects-list-other-container loading">
        <XLoading isShown={listLoading} />
      </div>
    );
  }
  // https://www.asovx.com.t/prod-assets/app/cxeditor/index.html?entityId=ZNO&rackId=130&rackSkuId=22825&rackSpuId=1701&categoryCode=PP&storeId=47&collectionId=3904&estoreSource=1&virtualProjectGuid=873&packageType=single#/print

  if (!listLoading && !projectList?.length) {
    return <Empty closePop={closePop} />;
  }

  return (
    <div className="print-store-my-projects-list">
      {projectList.map((project, index) => {
        const { disabled, project_id, display_name, status } = project;

        const projectImg = createProjectImgByProjectId(project.project_id);

        return (
          <div className={classnames('print-store-my-projects-list__item', { disabled })}>
            <div className="print-store-my-project">
              <ProjectHeader projectImg={projectImg} />
              <div className="print-store-my-project__body">
                <div className="title">{display_name}</div>
                <div className="options">
                  {/*  1已经加入购物车  2 已经下单 */}
                  {status === 2 ? (
                    <div className="options-item" onClick={() => handleContinue(project)}>
                      {t('VIEW')}
                    </div>
                  ) : (
                    <>
                      <div
                        className="options-item"
                        onClick={() => handleDelete({ id: project_id, status })}
                      >
                        {t('DELETE')}
                      </div>

                      <div className="options-item" onClick={() => handleContinue(project)}>
                        {t('CONTINUE')}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {!!disabled && (
              <div
                className={classnames('tips error', {
                  [`shake`]: shakeDisabledTextProjectId === project_id
                })}
              >
                {t('PRODUCT_HAS_BEEN_DISABLED')}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(MyProjectList);
