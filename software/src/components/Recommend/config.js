import { formatDateToHours } from '@apps/gallery/utils/helper';
import React from 'react';
export const getTableColumns = () => {
  const colums = [
    {
      title: '推荐名单',
      dataIndex: 'invitePhone',
      key: 'invitePhone',
      render: value => (value ? value : '-')
    },
    {
      title: '注册时间',
      dataIndex: 'inviteRegisterTime',
      key: 'inviteRegisterTime',
      render: value => formatDateToHours(value)
    },
    {
      title: '订阅软件',
      dataIndex: 'subscriptionPlan',
      key: 'subscriptionPlan',
      render(value, item) {
        switch (value) {
          case 'SAAS_DESIGNER':
            return `设计软件`;
          default:
            return ``;
        }
      }
    },
    {
      title: '订阅时间',
      dataIndex: 'subscriptionTime',
      key: 'subscriptionTime',
      render: value => formatDateToHours(value)
    },
    {
      title: '是否注册后7天内订阅',
      dataIndex: 'isRegisterRange',
      key: 'isRegisterRange',
      render: value => {
        if (typeof value === 'boolean') {
          return value ? '是' : '否';
        }
        return '';
      }
    },
    {
      title: '订阅周期',
      dataIndex: 'subscriptionCycle',
      key: 'subscriptionCycle',
      render: value => {
        if (typeof value === 'number') {
          return value === 1 ? '年' : '月';
        }
        return '';
      }
    },
    {
      title: '是否活动时间内订阅',
      dataIndex: 'isTimeRange',
      key: 'isTimeRange',
      render: value => {
        if (typeof value === 'boolean') {
          return value ? '是' : '否';
        }
        return '';
      }
    },
    {
      title: '',
      dataIndex: 'isExchange',
      key: 'isExchange',
      render(value, item) {
        console.log('item: ', value, item);
        if (value) {
          return <div className="have-cashed">已兑</div>;
        }
        return ``;
      }
    }
  ];

  return colums;
};
