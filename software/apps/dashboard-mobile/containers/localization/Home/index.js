import { Map, List as imList } from 'immutable';
import React, { Fragment, createContext } from 'react';
import { connect } from 'react-redux';

// import { Dialog, Empty, List, PullRefresh, Sticky } from 'react-vant';
import XLoading from '@resource/components/XLoading';
import XPureComponent from '@resource/components/XPureComponent';

import CardList from '@apps/dashboard-mobile/components/CardList';
import Cell from '@apps/dashboard-mobile/components/vant/Cell';
import Dialog from '@apps/dashboard-mobile/components/vant/Dialog';
import Empty from '@apps/dashboard-mobile/components/vant/Empty';
import List from '@apps/dashboard-mobile/components/vant/List';
import PullRefresh from '@apps/dashboard-mobile/components/vant/PullRefresh';
import Search from '@apps/dashboard-mobile/components/vant/Search';
import Sticky from '@apps/dashboard-mobile/components/vant/Sticky';
import Tabs from '@apps/dashboard-mobile/components/vant/Tabs';
import mapDispatch from '@apps/dashboard-mobile/redux/selector/mapDispatch';
import mapState from '@apps/dashboard-mobile/redux/selector/mapState';

import mainHandle from './handle/main';

import './index.scss';

class Home extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      finished: false,
      isLoadingProject: false,
      searchText: '',
      list: [],
      paginationInfo: {},
      maxOrdering: 0,
      visibleShare: false,
    };
    this.myRef = React.createRef();
    // this.handleWatermark = this.handleWatermark.bind(this);
  }

  componentDidMount() {
    this.init();
    setTimeout(() => {
      this.init();
    }, 500);
  }

  handleWatermark = () => {
    this.props.history.push('/software/gallery/watermark-setting');
  };

  // onLoadRefresh = () => mainHandle.onLoadRefresh(this);
  onRefresh = () => mainHandle.onRefresh(this);
  onLoadMore = () => mainHandle.onLoadMore(this);
  handleDelete = item => {
    Dialog.confirm({
      title: '删除选片库',
      message: '您确定要删除选片库吗？此选片库中的照片也将删除',
      confirmButtonText: '删除',
      messageAlign: 'left',
      onCancel: () => console.log('cancel'),
      onConfirm: () => mainHandle.handleDelete(this, item),
    });
  };
  handleShare = item => mainHandle.handleShare(this, item);
  handleClick = item => mainHandle.handleClick(this, item);
  init = () => mainHandle.init(this);
  handleSearch = value => {
    if (!value) {
      value = this.state.searchText;
    }
    mainHandle.getCollectionList(this, value);
  };
  handleChange = value => {
    this.setState({
      searchText: value,
    });
  };
  handleCreat = () => {
    const { history } = this.props;
    history.push('/software/gallery/creatCollect');
  };

  render() {
    const { loading, collectionList = imList([]) } = this.props;
    // const { list = imList([]) } = collectionList;
    const {
      finished,
      searchText,
      paginationInfo = {},
      isLoadingProject,
      visibleShare,
    } = this.state;

    const listAction = {
      handleDelete: this.handleDelete,
      handleShare: this.handleShare,
      handleClick: this.handleClick,
    };
    return (
      <div className="home">
        <XLoading
          backgroundColor="transparent"
          type="imageLoading"
          size="lg"
          zIndex={99}
          isShown={isLoadingProject}
        />
        <Sticky>
          <div className="header">
            <Search
              clearTrigger="always"
              value={searchText}
              leftIcon={''}
              align="center"
              background="#222222"
              onChange={this.handleChange}
              onSearch={this.handleSearch}
              onClear={() => mainHandle.init(this)}
              placeholder="搜索选片库名称"
              action={
                <div onClick={() => this.handleSearch()} className="commonFlex btn">
                  搜索
                </div>
              }
            />
            <div className="creatCollect">
              <div style={{ display: 'inline' }} onClick={this.handleCreat}>
                <span>+</span>创建选片库
              </div>
              <div className="bootom"></div>
            </div>
          </div>
        </Sticky>
        <div className="content">
          <div className="tabs">
            <Tabs
              color="#222"
              titleInactiveColor="#2e2e2e"
              lineWidth={66}
              sticky={true}
              background="#F6F6F6"
              offsetTop={113}
            >
              <Tabs.TabPane title={`选片库 (${paginationInfo?.total || 0})`}>
                <PullRefresh successText="刷新成功" onRefresh={this.onRefresh}>
                  {collectionList.size ? (
                    <List
                      onLoad={this.onLoadMore}
                      finished={paginationInfo.current_page >= paginationInfo.page_count}
                    >
                      <div className="cardContanerList">
                        {collectionList.map(item => {
                          return (
                            <CardList
                              item={item}
                              action={listAction}
                              key={item.get('collection_uid')}
                            />
                          );
                        })}
                      </div>
                    </List>
                  ) : (
                    <Empty />
                  )}
                </PullRefresh>
              </Tabs.TabPane>
              <Tabs.TabPane title="设置">
                <Cell
                  style={{ marginTop: '20px' }}
                  title="水印设置"
                  value="水印设置"
                  isLink
                  onClick={this.handleWatermark}
                ></Cell>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
        {/* <Dialog
          visible={visibleShare}
          showCancelButton
          title='编辑自定义标签'
          onCancel={() => this.setState({ visibleShare: false })}
        // onConfirm={this.handleLabelConfirm}
        >
          <div style={{ padding: '20px' }}>
            123
          </div>
        </Dialog> */}
      </div>
    );
  }
}
export default Home;
