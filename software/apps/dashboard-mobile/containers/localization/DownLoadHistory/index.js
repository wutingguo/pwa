import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Empty from '@apps/dashboard-mobile/components/vant/Empty';
import List from '@apps/dashboard-mobile/components/vant/List';
import PullRefresh from '@apps/dashboard-mobile/components/vant/PullRefresh';
import Search from '@apps/dashboard-mobile/components/vant/Search';
import Sticky from '@apps/dashboard-mobile/components/vant/Sticky';
import Tabs from '@apps/dashboard-mobile/components/vant/Tabs';
import mapDispatch from '@apps/dashboard-mobile/redux/selector/mapDispatch';
import mapState from '@apps/dashboard-mobile/redux/selector/mapState';

import main from './handle/main';

import './index.scss';

const DownLoadHistory = props => {
  const { boundGlobalActions, boundProjectActions, urls } = props;
  const [packageList, setPackageList] = useState([]);
  const [imgList, setImgList] = useState([]);
  const onRefresh = () => {
    const { match } = props;
    const { params } = match;
    boundProjectActions.getPackageDownloadRecords(params.id).then(res => {
      setPackageList(res.data);
    });
    boundProjectActions.getSingleDownloadRecords(params.id).then(res => {
      setImgList(res.data);
    });
  };
  useEffect(() => {
    props.setPageHeaders(5);
    onRefresh();
  }, []);
  return (
    <div className="DownLoadHistory">
      <Tabs
        color="#222"
        titleInactiveColor="#2e2e2e"
        lineWidth={66}
        sticky={true}
        background="#f0f0f0"
        // offsetTop={112}
      >
        <Tabs.TabPane title="图库">
          <PullRefresh successText="刷新成功" onRefresh={onRefresh}>
            {packageList.length ? main.packageListCard(packageList, props.history) : <Empty />}
          </PullRefresh>
        </Tabs.TabPane>
        <Tabs.TabPane title="单张照片">
          <PullRefresh successText="刷新成功" onRefresh={onRefresh}>
            {imgList.length ? main.imgListCard(imgList, urls.get('galleryBaseUrl')) : <Empty />}
          </PullRefresh>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default memo(connect(mapState, mapDispatch)(DownLoadHistory));
