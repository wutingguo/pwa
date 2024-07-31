import { number } from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import estoreService from '@apps/estore/constants/service';

import { deleteMyProject, getMyProjectList, queryMyProject } from '../../../../services/project';

// 必要时可抽出到全局hook
const useMyProjects = ({ boundGlobalActions }) => {
  const { urls, store, qs } = useSelector(storeState => {
    return {
      urls: storeState.root.system.env.urls,
      qs: storeState.root.system.env.qs,
      store: storeState.store,
    };
  });

  const estoreBaseUrl = urls.get('estoreBaseUrl');

  const storeId = store.get('id');
  const collectionId = store.get('collectionId');
  const collectionUid = qs.get('collection_uid');
  // #R
  const [state, setState] = useState({
    projectList: [],
    loading: {
      list: false,
      del: false,
    },
  });
  // #ER
  const set = useCallback((payload = {}) => {
    setState(v => ({ ...v, ...payload }));
  }, []);

  const triggerLoading = useCallback(({ list, del }) => {
    setState(v => {
      const loading = v.loading;
      return { ...v, loading: { ...loading, ...{ list, del } } };
    });
  }, []);

  const fetchList = useCallback(async () => {
    triggerLoading({ list: true });
    try {
      const list = await getMyProjectList({ baseUrl: estoreBaseUrl });
      console.log('useMyProjects fetchList', list);
      set({ projectList: list });
    } catch (e) {
      console.error(e);
    }
    triggerLoading({ list: false });
  }, [set, triggerLoading]);

  const deleteProject = useCallback(
    async projectId => {
      triggerLoading({ del: true });
      try {
        await deleteMyProject({ baseUrl: estoreBaseUrl, projectId });
        // 无错误则删除成功 重新拉取project
        await fetchList();
      } catch (e) {
        console.error(e);
        console.log(e, typeof e);
        switch (e) {
          case 433001: {
            const errorMessage = 'Your project is in the cart.';
            boundGlobalActions.addNotification({
              message: errorMessage,
              level: 'success',
              autoDismiss: 2,
            });
            break;
          }

          default:
            break;
        }
      }
      triggerLoading({ del: false });
    },
    [fetchList, triggerLoading, estoreBaseUrl]
  );

  const buildEditorUrl = useCallback(
    async ({ projectId, parentCategoryCode }) => {
      const project = await queryMyProject({ baseUrl: estoreBaseUrl, projectId });

      console.log('project', project);
      const { projectInfo, rackId, rackSpuId, supplierCode } = project;
      const supplierSpuDetailRes = await estoreService.getSupplierSpuDetail({
        baseUrl: estoreBaseUrl,
        spu_uuid: projectInfo.product,
      });
      if (!supplierSpuDetailRes?.data) {
        console.error(new Error(`can't get supplier spu detail, product: ${projectInfo.product}`));
        return;
      }
      const { supplier_id } = supplierSpuDetailRes.data;
      const href = `${estoreBaseUrl}prod-assets/app/cxeditor/index.html?supplierId=${supplier_id}&entityId=${supplierCode}&rackId=${rackId}&rackSpuId=${rackSpuId}&categoryCode=${parentCategoryCode}&storeId=${storeId}&collectionUid=${collectionUid}&collectionId=${collectionId}&estoreSource=1&virtualProjectGuid=${
        projectInfo.guid
      }&packageType=single&initGuid=${
        projectInfo.guid
      }&estoreFrom=MY_PROJECT&backHref=${encodeURIComponent(location.href)}&esTK=${
        localStorage.getItem('_tk_') || ''
      }`;
      console.log('buildEditorUrl', href);
      return href;
    },
    [storeId, estoreBaseUrl, collectionId, collectionUid]
  );

  const createProjectImgByProjectId = useCallback(
    projectId => {
      return `${estoreBaseUrl}cloudapi/upload_platform/cover/view?projectId=${projectId}`;
    },
    [estoreBaseUrl]
  );

  useEffect(() => {
    fetchList();
  }, []);

  console.log('state', state);

  return {
    projectList: state.projectList,
    listLoading: state.loading.list,
    delLoading: state.loading.del,
    createProjectImgByProjectId,
    deleteProject,
    buildEditorUrl,
  };
};

export default useMyProjects;
