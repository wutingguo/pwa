import { formatDateToHours } from '@apps/gallery/utils/helper';

export const getTableColumns = () => [
  {
    title: '订单编号',
    key: 'order_number',
    dataIndex: 'order_number',
    align: 'center',
  },
  {
    title: '订单金额（元）',
    key: 'price',
    dataIndex: 'price',
    align: 'center',
    render(value, item) {
      return `￥${value}`;
    },
  },
  {
    title: '支付方式',
    key: 'order_type',
    dataIndex: 'order_type',
    align: 'center',
    render(value, item) {
      return value === 0 ? '线下支付' : '微信支付';
    },
  },
  {
    title: '订单状态',
    key: 'order_status',
    dataIndex: 'order_status',
    align: 'center',
    render(value, item) {
      const { order_type } = item;
      let res = '';
      if (order_type === 0) {
        return '-';
      }
      switch (value) {
        case 0:
        case 1:
          res = '待支付';
          break;
        case 2:
          res = '支付成功';
          break;
        case 3:
          res = '已退款';
          break;
        case -1:
          res = '已取消';
          break;
        case -2:
          res = '支付失败';
          break;
        default:
          break;
      }
      return res;
    },
  },
  {
    title: '支付时间',
    dataIndex: 'pay_time',
    key: 'pay_time',
    align: 'center',
    render: (value, item) => {
      const { order_type, order_status } = item;
      if (order_type === 0) {
        return '-';
      }
      if ([0, 1, -1].includes(order_status)) {
        return '-';
      }
      return formatDateToHours(value);
    },
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    align: 'center',
    render: value => formatDateToHours(value),
  },
];
