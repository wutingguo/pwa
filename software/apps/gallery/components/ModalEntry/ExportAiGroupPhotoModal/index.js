import { template } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { SAAS_GET_IMAGE_WITH_ORIENTATION_URL } from '@resource/lib/constants/apiUrl';

import { XButton, XCheckBox, XModal, XRadio } from '@common/components';
import { getPhotos } from '@common/utils/photos'

import './index.scss';

const ExportAiGroupPhotoModal = props => {
  const { closeModal, data, group, boundGlobalActions } = props;

  const [checkedType, setCheckedType] = useState(1);
  const [groupCollection, setGroupCollection] = useState(group || []);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const onExport = () => {
    const selectGroup = groupCollection.find(i => i.is_choose);
    if (!selectGroup) {
      boundGlobalActions.addNotification({
        message: t('没有选择导出人物，请选择后导出。'),
        level: 'error',
        autoDismiss: 2,
      });
      return;
    }
    const exportPhoto = data.get('exportPhoto');
    exportPhoto && exportPhoto(checkedType, groupCollection);
    closeModal();
  };
  const onCancle = () => {
    closeModal();
  };
  const updateGroups = (chooseItem, name) => {
    const newGroup = group.map(item => {
      if (item.groupId === chooseItem.groupId) {
        item.is_choose = !chooseItem.is_choose;
        item.name = name;
      }
      return item;
    });
    setGroupCollection(newGroup);
    setIsSelectAll(newGroup.every(item => item.is_choose));
  };
  const handleSelectAll = useCallback(() => {
    setIsSelectAll(!isSelectAll);
    const newGroup = group.map((item, index) => {
      const name = item.name
        ? item.name
        : index === groupCollection.length - 1
        ? '合照'
        : `人物${index + 1}`;
      item.is_choose = !isSelectAll;
      item.name = name;
      return item;
    });
    setGroupCollection(newGroup);
  }, [isSelectAll, groupCollection]);

  const onSelect = index => {
    setCurrentTab(index)
  };

  const handleDownload = () => {
    getPhotos(groupCollection)
  }

  const renderDownCont = () => {
    return (
      <div>
        <div className="export-text">系统将按人物分类导出:</div>
        <div className="click-filter-export">
          <div className="click-container">
            <div className="click-select-all" onClick={handleSelectAll}>
              {isSelectAll ? '取消全选' : '全选'}
            </div>
            <span className="tips-text">图片数量较多，建议分批下载</span>
          </div>
          <div className="click-select">
            {groupCollection.map((item, index) => {
              const name = item.name
                ? item.name
                : index === groupCollection.length - 1
                ? '合照'
                : `人物${index + 1}`;
              return (
                <div className="choose-checkbox-container" key={item.groupId}>
                  <XCheckBox
                    checked={item.is_choose}
                    className={'black-theme'}
                    subText={name}
                    value={item.groupId}
                    onClicked={() => updateGroups(item, name)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="export-text download">下载选中人物的:</div>
        <div className="download-filter-radio-content">
          <div className="choose-radio-item">
            <XRadio
              skin="black-theme"
              checked={checkedType === 1}
              text={'全部照片'}
              value={checkedType}
              onClicked={() => setCheckedType(1)}
            />
          </div>
          <div className="choose-radio-item">
            <XRadio
              skin="black-theme"
              checked={checkedType === 2}
              text={'单人照片'}
              value={checkedType}
              onClicked={() => setCheckedType(2)}
            />
          </div>
          <div className="choose-radio-item">
            <XRadio
              skin="black-theme"
              checked={checkedType === 3}
              text={'多人照片'}
              value={checkedType}
              onClicked={() => setCheckedType(3)}
            />
          </div>
        </div>
        <div className="footer-btn">
          <XButton className="white pwa-btn" onClicked={onCancle}>
            取消
          </XButton>
          <XButton className="pwa-btn" onClicked={onExport}>
            确认
          </XButton>
        </div>
      </div>
    )
  }

  const isWindows = navigator.platform.includes('Win');

  return (
    <XModal className="export_ai_groups_modal" opened onClosed={closeModal} styles={{ height: isWindows ? '510px': '460px'}}>
      <div style={{ width: '100%', height: '100%'}}>
      {
        isWindows ? <Tabs onSelect={onSelect} selectedIndex={currentTab}>
        <TabList>
          <Tab>分片工具</Tab>
          <Tab>普通下载</Tab>
        </TabList>
        <TabPanel>
        <div className="sharding-tool">
            提示：&nbsp;&nbsp;图片较多时，建议使用分片工具来获取分片结果，节省时间。<br /> <br /> 请按照操作手册将分片工具置于正确位置，双击运行即可协助您再本地快速完成人物分片。
          </div>
          <div className="footer-btn">
            <XButton className="white pwa-btn" onClicked={onCancle}>
              取消
            </XButton>
            <XButton className="pwa-btn" onClicked={handleDownload}>
              确认
            </XButton>
          </div>
        </TabPanel>
        <TabPanel>
        {renderDownCont()}
        </TabPanel>
      </Tabs>: renderDownCont()
      }
      </div>
    </XModal>
  );
};

export default ExportAiGroupPhotoModal;
