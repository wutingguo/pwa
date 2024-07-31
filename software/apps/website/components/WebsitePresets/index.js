import cls from 'classnames';
import { merge, startCase } from 'lodash';
import qs from 'qs';
import React, { memo, useCallback, useEffect, useState } from 'react';

import { websiteRoleEnum } from '@resource/lib/constants/strings';

import { XLoading } from '@common/components';

import * as localModalTypes from '@apps/website/constants/modalTypes';

import Filter from './Filter';
import PresetItem from './PresetItem';
import Tabs from './Tabs';
import Button from './components/Button';
import Empty from './components/Empty';
import {
  deletePreset,
  editPreset,
  getPresetList,
  statusEnum,
  subjectEnum,
  updatePresetStatus,
} from './service';

import './index.scss';

const showConfirmModal = ({ boundGlobalActions, message, onConfirm }) => {
  const data = {
    close: boundGlobalActions.hideConfirm,
    title: 'Tips',
    message,
    buttons: [
      {
        className: 'white',
        text: t('CANCEL'),
        onClick: boundGlobalActions.hideConfirm,
      },
      {
        text: t('CONFIRM'),
        onClick: () => {
          onConfirm();
          boundGlobalActions.hideConfirm();
        },
      },
    ],
  };
  boundGlobalActions.showConfirm(data);
};

const prefixCls = `zno-website-designer-page`;

const tabs = [
  { key: subjectEnum.website, label: 'Websites' },
  { key: subjectEnum.page, label: 'Pages' },
  { key: subjectEnum.section, label: 'Sections' },
];

const WebsitePresets = ({ baseUrl, boundGlobalActions, boundProjectActions }) => {
  const [state, setHookState] = useState(() => {
    // 从url上获取选中的tab
    const searchParams = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    const { preset_type } = searchParams;
    const valid = Object.values(subjectEnum).includes(preset_type);

    return {
      subject: valid ? preset_type : subjectEnum.website,
      list: [],
      loading: false,
    };
  });

  const [filter, setFilter] = useState({ tagId: '', status: '' });

  const setState = useCallback(newState => {
    setHookState(s => ({ ...s, ...newState }));
  }, []);

  const fetchList = useCallback(async () => {
    setState({ loading: true });
    try {
      const list = await getPresetList({
        baseUrl,
        subject: state.subject,
        tagId: filter.tagId,
        status: filter.status,
      });
      setState({ list });
    } catch (e) {
      console.error(e);
      // alert(e.message);
    } finally {
      setState({ loading: false });
    }
  }, [baseUrl, state.subject, filter]);

  const handleTabChange = useCallback(key => {
    setState({
      subject: key,
    });
    const url = new URL(window.location.href);
    url.searchParams.set('preset_type', key);
    history.replaceState(null, '', url.href);
  }, []);

  const handleFilterChange = useCallback((name, value) => {
    setFilter(v => ({
      ...v,
      [name]: value,
    }));
  }, []);

  // 警告弹窗
  const showAlert = useCallback(
    message => {
      boundGlobalActions.showModal(localModalTypes.WEBSITE_ALERT_MODAL, {
        message,
        close: () => boundGlobalActions.hideModal(localModalTypes.WEBSITE_ALERT_MODAL),
      });
    },
    [boundGlobalActions]
  );

  // 添加
  const handAdd = useCallback(() => {
    boundGlobalActions.showModal(localModalTypes.ADD_PRESET_MODAL, {
      baseUrl,
      subject: state.subject,
      close: () => boundGlobalActions.hideModal(localModalTypes.ADD_PRESET_MODAL),
    });
  }, [baseUrl, state.subject, boundGlobalActions]);

  // 编辑
  const handleEdit = useCallback(
    item => {
      const { id } = item;
      editPreset({ subject: state.subject, id });
    },
    [state.subject, baseUrl]
  );

  // 改名
  const handleRename = useCallback(
    item => {
      const { id, name } = item;

      boundGlobalActions.showModal(localModalTypes.RENAME_PRESET_MODAL, {
        baseUrl,
        subject: state.subject,
        id,
        name,
        close: () => boundGlobalActions.hideModal(localModalTypes.RENAME_PRESET_MODAL),
        onAfterRename: fetchList,
      });
    },
    [boundGlobalActions, state.subject, baseUrl, fetchList]
  );

  // 删除
  const handleDelete = useCallback(
    item => {
      const { id } = item;

      const deleteItem = async () => {
        try {
          await deletePreset({
            baseUrl,
            subject: state.subject,
            id,
          });
          fetchList();
        } catch (e) {
          console.error(e);
          showAlert(e.message);
        }
      };

      showConfirmModal({
        boundGlobalActions,
        message: 'Are you sure you want to delete this preset?',
        onConfirm: deleteItem,
      });
    },
    [boundGlobalActions, baseUrl, state.subject, fetchList]
  );

  // 更新private、public状态
  const handleStatus = useCallback(
    item => {
      const { id, status } = item;

      const updateStatus = async () => {
        try {
          const newStatus =
            status === statusEnum.private ? statusEnum.published : statusEnum.private;
          await updatePresetStatus({
            baseUrl,
            id,
            status: newStatus,
            subject: state.subject,
          });
          await fetchList();

          const statusMessageText = {
            [statusEnum.published]: 'published',
            [statusEnum.private]: 'unpublished',
          };

          boundGlobalActions.addNotification({
            message: `Preset ${statusMessageText[newStatus]}.`,
            level: 'success',
            autoDismiss: 2,
          });
        } catch (e) {
          console.error(e);
          showAlert(e.message);
        }
      };

      showConfirmModal({
        boundGlobalActions,
        message: `Are you sure you want to make it ${
          item.status === statusEnum.private ? 'Public' : 'Private'
        }?`,
        onConfirm: updateStatus,
      });
    },
    [boundGlobalActions, state.subject, baseUrl, fetchList]
  );

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className={prefixCls}>
      {/* 顶部操作 */}
      <div className={`${prefixCls}-options-bar`}>
        <Tabs tabs={tabs} activeKey={state.subject} onChange={handleTabChange} />
        <Button className={`${prefixCls}-add-btn`} size="large" onClick={handAdd} black>
          + New {startCase(state.subject)}
        </Button>
      </div>

      {/* 过滤 */}
      <div className={`${prefixCls}-filters-bar`}>
        <Filter subject={state.subject} onChange={handleFilterChange} />
      </div>

      {/* 预设列表 */}
      <div className={`${prefixCls}-body`}>
        <XLoading
          type="imageLoading"
          zIndex={1}
          backgroundColor="rgba(255,255,255,1)"
          isShown={state.loading}
        />
        <div
          className={`${prefixCls}-scroll-container`}
          style={{
            overflow: state.loading ? 'hidden' : 'auto',
          }}
        >
          {state.list.length ? (
            <div className={`${prefixCls}-presets`}>
              {state.list.map(item => {
                const { id } = item || {};

                return (
                  <PresetItem
                    key={id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatus={handleStatus}
                    onRename={handleRename}
                  />
                );
              })}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </div>

      {/* 分页导航 需求暂时不需要 */}
      {/* <div className={`${prefixCls}-pagination-bar`}>
        <div style={{ flex: 1 }}></div>
        <Pagination />
      </div> */}
    </div>
  );
};

export default memo(WebsitePresets);
