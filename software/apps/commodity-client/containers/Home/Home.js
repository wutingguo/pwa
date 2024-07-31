import React, { Component } from 'react'
import XPureComponent from '@resource/components/XPureComponent';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import XProductList from '../components/XProductList'
import XMyCommodList from '../components/XMyCommodList'

export default class Home extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0
    };
  }
  setTabIndex = index => {
    this.setState({
      selectedTab: index,
    });
  };
  render() {
    return (
      <div className='commodity-home' >
        <Tabs
          selectedIndex={this.state.selectedTab}
          onSelect={index => this.setTabIndex(index)}
        >
          <div className="commodity-home-header">
            <TabList>
              <Tab>
                <span className="watermark-label">我的商品</span>
              </Tab>
              <Tab>
                <span className="email-label">我的编辑</span>
              </Tab>
            </TabList>
          </div>
          <TabPanel>
            <XProductList {...this.props} />
          </TabPanel>
          <TabPanel>
            <XMyCommodList {...this.props} />
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}
