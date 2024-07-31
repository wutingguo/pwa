import React, { Component, Fragment, memo, useCallback, useRef, useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import XPureComponent from '@resource/components/XPureComponent';
import { estoreModule, getEsModule } from '../../../constants/estoreModule';
import Popover from '@resource/components/Popover';
import { cnEstoreTutorialVideos } from '@apps/estore/constants/strings';
import { VIDEO_MODAL_STATUS } from '@resource/lib/constants/modalTypes';

import './index.scss';

// 教程
const Tutorial = memo(({ boundGlobalActions }) => {
  const [popVisible, setPopVisible] = useState(false);

  const handlePopVisible = useCallback(v => {
    setPopVisible(!!v);
  }, []);

  const handleClickVideos = useCallback(() => {
    setPopVisible(false);
    window.logEvent.addPageEvent({
      name: `Estore_Click_Beginner`
    });

    const { showModal } = boundGlobalActions;

    showModal(VIDEO_MODAL_STATUS, {
      className: 'estore-tutorial-videos-wrapper',
      groupVideos: cnEstoreTutorialVideos
    });
  }, [boundGlobalActions]);

  return (
    <Popover
      className="estore-tutorial-popover"
      visible={popVisible}
      onVisibleChange={handlePopVisible}
      offsetTop={6}
      rectToEdge={30}
      theme="white"
      Target={
        <div className="estore-tutorial" onClick={handleClickVideos}>
          新手教程
        </div>
      }
    ></Popover>
  );
});

class Home extends XPureComponent {
  state = {
    data: [],
    selectedIndex: 0,
    initEsModules: []
  };
  _initEsModules() {
    const pathSplit = location.pathname.split('e-store');
    const moduleArr = pathSplit[pathSplit.length - 1].split('/');
    const moduleName = moduleArr && moduleArr[1];
    const moduleId = moduleArr && moduleArr[2];
    const idx = estoreModule.findIndex(item => `${item.key}` === moduleName);
    const initEsModules = getEsModule(idx, moduleId);
    this.setState({
      selectedIndex: idx === -1 ? 0 : idx,
      initEsModules
    });
  }

  componentDidMount() {
    const { boundGlobalActions } = this.props;
    boundGlobalActions.getEstoreInfo().then(() => {
      this._initEsModules();
    });
  }
  componentWillReceiveProps() {
    this._initEsModules();
  }

  onSelect = idx => {
    const module = estoreModule[idx];
    window.logEvent.addPageEvent({
      name: module.logEventName
    });
    this.props.history.push(estoreModule[idx].path);
    this.setState({
      selectedIndex: idx
    });
  };

  render() {
    const { boundGlobalActions } = this.props;
    const { selectedIndex, initEsModules } = this.state;
    return (
      <div className="estore-wrapper" id="estore-wrapper">
        {/* <h1>This is estore dashboard, everything starts from here!</h1> */}
        <Tabs onSelect={this.onSelect} selectedIndex={selectedIndex}>
          <div className="estore-header">
            <TabList>
              {initEsModules.length > 0 &&
                initEsModules.map(item => (
                  <Tab key={item.key}>
                    <span className="estore-label">{item.label}</span>
                  </Tab>
                ))}
            </TabList>
            <Tutorial boundGlobalActions={boundGlobalActions} />
          </div>
          {initEsModules.length > 0 &&
            initEsModules.map(item => {
              const EstoreModule = item.module;
              return (
                <TabPanel key={`${item.key}_TabPanel`}>
                  <EstoreModule {...this.props} />
                </TabPanel>
              );
            })}
        </Tabs>
      </div>
    );
  }
}

export default Home;
