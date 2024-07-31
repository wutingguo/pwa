import { fromJS } from 'immutable';

import {
  COVER_DESIGN,
  EDGE_DESIGN,
  IMAGE_SELECTION,
  LINING_DESIGN,
} from '@src/containers/international/Designer/Page/constant.js';

const defaultState = fromJS({
  // 订单号
  serviceOrderId: 0,

  isLoading: true,
  // 不显示积分弹窗
  open: false,
  // 开始支付
  isButton1Loading: true,

  isButton2Loading: true,
  // 显示弹窗
  showAlert: false,
  // 弹窗中获取的积分信息
  useRebateJson: [],
  // [{
  //     // 积分类型
  //     type: "PRO_PLAN",
  //     // 当前积分类型兑换金额
  //     amount: 0
  // }]
  priceCount: {
    // 使用积分兑换金额
    appliedCredit: 0,
    // 总金额
    totalPaymentMmount: 0,
    // 实际需要支付的金额（总金额-积分兑换金额）
    realPaymentAmount: 0,
    // 货币code
    currencyCode: 'USD',
    // 货币符号
    currencySymbol: '$',
  },

  // 是否包含积分
  hasPoints: 0,

  // productConfirmat
  productConfirmat: '',
  // 排序顺序
  sequence: '',
  // Design
  coverDesign: COVER_DESIGN,
  liningDesign: LINING_DESIGN,
  edgeDesign: EDGE_DESIGN,
  imageSelection: IMAGE_SELECTION,
  // 页码参数
  currPage: 0,
  // Specify the cover photo
  coverArr: [],
  // Favorite images
  favoriteArr: [],
  // Image Groupings
  originGroupArr: [],
  // 分组后的数据
  groupArr: [
    // {
    //     groupName: "group1",
    //     imageList: fromJS(list).toJS()
    // }
  ],
  // 说明
  instructions: '',

  // 检查输入项目
  hasSequenceError: {
    isShow: false,
    text: 'Photo Sequence',
  },

  hasCoverDesignError: {
    isShow: false,
    text: 'Cover Design',
  },
  hasLiningDesignError: {
    isShow: false,
    text: 'Cover Design',
  },
  hasEdgeDesignError: {
    isShow: false,
    text: 'Cover Design',
  },
});

// ORDER_CREATE
export default (state = defaultState, action) => {
  const { payload: data } = action || {};
  switch (action.type) {
    case 'INIT_DS_STATE':
      return state.merge(data);
    case 'UPDATE_DS_STATE':
      return state.merge(data); //Object.assign(state, data)
    case 'TOGGLE_MODAL':
      return state.merge(data);
    case 'TOGGLE_ALERT':
      return state.merge(data);
    case 'TOGGLE_PAGE_CONFIRM':
      return state.merge(data);
    case 'SET_STORE_CREDIT':
      return state.merge(data);
    case 'SET_SEQUENCE':
      return state.merge(data);
    case 'SET_COVER_DESIGN': // coverDesign
      return state.merge(data);
    case 'SET_GROUP':
      return state.merge(data);
    case 'SET_DESIGN':
      return state.merge(data);
    // case "SET_BACK":
    //     return state.merge(data);
    default:
      return state.merge(data);
  }
};
