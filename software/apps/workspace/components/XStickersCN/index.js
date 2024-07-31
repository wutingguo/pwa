import React from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import Stickers from '../Stickers';
import ThemeStickersGroups from '@resource/components/XStickersCN/ThemeStickersGroups';
import CollectStickers from '@resource/components/XStickersCN/CollectStickers';
import {
  STICKER_TOTAL_THEME,
  STICKER_TOTAL_COLLECT,
  STICKER_TOTAL_UPLOAD
} from '@resource/lib/constants/apiUrl';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import CustomTabs from '@resource/components/XDebossingCN/CustomTabs';
import './index.scss';
import { template } from 'lodash';

export default class XStickersCN extends XPureComponent {
  constructor(props) {
    super(props);
    const { baseUrl } = props;
    const tabs = [
      {
        key: 0,
        name: '推荐贴纸',
        url: template(STICKER_TOTAL_THEME)({ baseUrl }),
        type: 'get',
        params: {}
      },
      {
        key: 1,
        name: '收藏贴纸',
        url: template(STICKER_TOTAL_COLLECT)({ baseUrl }),
        type: 'get',
        params: {}
      },
      {
        key: 2,
        name: '上传贴纸',
        url: template(STICKER_TOTAL_UPLOAD)({ baseUrl }),
        type: 'post',
        params: { groupUid: '', pageSize: 18, pageNum: 0 }
      }
    ];

    this.state = {
      tabIndex: 0,
      tabs
    };
  }

  componentDidMount() {
    this.getTotal();
  }

  getTotal = () => {
    const tabPromise = this.state.tabs.map(tab => {
      return new Promise((resolve, reject) => {
        xhr[tab.type](tab.url, tab.params).then(({ data }) => {
          const total = tab.key === 2 ? data.count : data
          resolve({ ...tab, total });
        });
      });
    });

    Promise.all(tabPromise).then(values => {
      this.setState({ tabs: values });
    });
  };

  onTabChange = currentTab => {
    const eventName = [
      'YX_PC_DesignerMaterialMT_Click_StickerDefault',
      'YX_PC_DesignerMaterialMT_Click_StickerCollect',
      'YX_PC_DesignerMaterialMT_Click_StickerUpload'
    ];
    window.logEvent.addPageEvent({
      name: eventName[currentTab.key]
    });
    this.setState({
      tabIndex: currentTab.key
    });
  };

  renderTab = tabIndex => {
    let tabCont = null;
    const itemProps = {
      ...this.props,
      getTotal: this.getTotal
    };
    switch (tabIndex) {
      case 0:
        tabCont = <ThemeStickersGroups {...itemProps} />;
        break;
      case 1:
        tabCont = <CollectStickers {...itemProps} />;
        break;
      case 2:
        tabCont = <Stickers {...itemProps} />;
        break;
    }
    return tabCont;
  };

  render() {
    const { tabIndex, tabs } = this.state;
    return (
      <div className="web-stickers-container">
        <CustomTabs tabs={tabs} onTabChange={this.onTabChange} />
        {this.renderTab(tabIndex)}
      </div>
    );
  }
}
