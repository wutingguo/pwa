import { fromJS } from 'immutable';
import { isEqual, get } from 'lodash';
import { create as createrPaypalFields } from 'braintree-web/paypal';

// 公共配置
import { DS_CACHE_KEY } from '@resource/pwa/utils/strings.js';
import * as cache from '@resource/lib/utils/cache';
// 自定义方法
import braintreeClient from '../braintreeUtil';
import { format } from '../utils';
// 自定义配置
import { SEQUENCE } from '../constant';

// 获取编辑器带过来的数据
const getCxeditorData = that => {
  const { history } = that.props;
  const xeditorData = cache.getItem(DS_CACHE_KEY.EDITOR_DATA);
  if (!xeditorData) {
    history.push(`/software/projects`);
  }
  const {
    needCameo,
    baseOptions,
    images,
    currPages,
    photoSort,
    projectId,
    sheetNumberRange
  } = xeditorData;
  const pages = {
    min: sheetNumberRange.min * 2,
    max: sheetNumberRange.max * 2,
    step: 2,
    currPage: currPages
  };
  const sequence = SEQUENCE.map(s => ({ ...s, checked: isEqual(s.value, photoSort) }));
  const imageArr = images.map(img => ({ ...img, active: false, disabled: false }));
  let productConfirmat = [];
  Object.entries(baseOptions).forEach(opt => {
    const [label = '', values] = opt;
    const value = get(values, '[0].name', '') || get(values, '[0].title', '');
    if (value != 'none') {
      productConfirmat.push({ label: label.replace(/^\w/g, w => w.toUpperCase()), value });
    }
  });

  return { productConfirmat, pages, sequence, imageArr, projectId, needCameo };
};

// 关闭积分弹窗
function closeModal() {
  const { boundProjectActions } = this.props;
  boundProjectActions.toggleModal({ open: false });
}

// 打开积分弹窗
function openModal() {
  const { boundProjectActions } = this.props;
  boundProjectActions.toggleModal({ open: true });
}

// 通过价格计算器获取价格
function getPrice(currPage, useRebateJson = []) {
  const { boundProjectActions } = this.props;
  boundProjectActions
    .getPrice({
      purchase_num: currPage,
      use_rebate_json: useRebateJson
    })
    .then(({ data, ret_code }) => {
      if (ret_code == 200000) {
        const priceCount = {
          // 货币code
          currencyCode: data.currency_code,
          // 货币符号
          currencySymbol: data.currency_symbol,
          // 使用积分兑换金额
          appliedCredit: Number(data.applied_credit).toFixed(2),
          // 总金额
          totalPaymentMmount: Number(data.total_payment_amount).toFixed(2),
          // 实际需要支付的金额（总金额-积分兑换金额）
          realPaymentAmount: Number(data.real_payment_amount).toFixed(2)
        };
        boundProjectActions.setStoreCredit({ priceCount });
      }
    })
    .catch(err => {
      this.showNotification();
    });
}

// 关闭  Alert
function handleAlertClose() {
  const { boundProjectActions } = this.props;
  boundProjectActions.updateDSData({ showAlert: false });
}

function getAlerModalProps() {
  return {
    html: t('CHECKOUT_PAYPAL_DECLINED_TIP'),
    btnText: 'Ok',
    actions: {
      handleClose: this.handleAlertClose,
      handleOk: this.handleAlertClose
    }
  };
}

// handlerSelectChange
function handlerSelectChange(page, useRebateJson = []) {
  const { boundProjectActions } = this.props;
  boundProjectActions.updateDSData({ currPage: page.value });
  this.getPrice(page.value, useRebateJson);
}

// 排序规则
function handlerSequence(val) {
  const { boundProjectActions, designService } = this.props;
  const sequence = designService.get('sequence');
  const newSequence = sequence.map(s => ({ ...s, checked: isEqual(s.value, val) }));
  boundProjectActions.setSequence({
    sequence: newSequence,
    hasSequenceError: { isShow: false, text: 'Photo Sequence' }
  });
}

// 检查选中项目
function checkCoverDesign(newCoverDesign) {
  // 筛选所有选中项
  const checkedCoverDesignList = Object.values(newCoverDesign).filter(c => c.checked);
  // 选中项中包含了额外属性的选项 并且没有填写值
  const checkedAndHasExtraProps = checkedCoverDesignList.find(
    c => c.hasOwnProperty('extra') && !Boolean(c['extra'])
  );

  const hasChecked = checkedCoverDesignList.length > 0 && checkedAndHasExtraProps == undefined;
  return {
    hasChecked,
    checkedAndHasExtraProps: checkedAndHasExtraProps || {}
  };
}

//  Cover Design 设计选项
function handlerCoverDesign(key, val) {
  const { boundProjectActions, designService } = this.props;
  const { coverDesign } = designService.toJS();

  // 清空文本框的值
  if (coverDesign[key].hasOwnProperty('extra') && !val) {
    coverDesign[key].extra = '';
  }
  const newObj = { ...coverDesign[key], checked: val };
  const newCoverDesign = {
    ...coverDesign,
    [key]: newObj
  };
  const { hasChecked, checkedAndHasExtraProps } = this.checkCoverDesign(newCoverDesign);

  boundProjectActions.setCoverDesign({
    coverDesign: newCoverDesign,
    hasCoverDesignError: {
      isShow: !hasChecked,
      text: checkedAndHasExtraProps.hasOwnProperty('extra') ? 'Text' : 'Cover Design'
    }
  });
}

// 勾选特殊选项后 填写文本
function handlerChange(key, _value) {
  const value = _value.trim();
  const { boundProjectActions, designService } = this.props;
  const { coverDesign } = designService.toJS();
  const newObj = { ...coverDesign[key], extra: value };
  boundProjectActions.setCoverDesign({
    coverDesign: {
      ...coverDesign,
      [key]: newObj
    },
    hasCoverDesignError: { isShow: !value, text: 'Text' }
  });
}

function handlerBlur(e) {
  const labelMap = ['spineText', 'coverText'];
  const { boundProjectActions, designService } = this.props;
  const { coverDesign } = designService.toJS();
  const hasEmpty = labelMap.some(label => coverDesign[label].checked && !coverDesign[label].extra);
  boundProjectActions.setCoverDesign({
    hasCoverDesignError: { isShow: hasEmpty, text: 'Text' }
  });
}

// 选中图片
function handlerImageClick(type, item) {
  const { boundProjectActions, designService } = this.props;
  const key = `${type}Arr`;
  const arr = designService.get(key);
  const newArr = arr.map(oldItem => {
    return oldItem.id == item.id ? { ...item, active: !item.active } : oldItem;
  });
  boundProjectActions.updateDSData({ [key]: newArr });
}

// 分组按钮被单击
function handlerGroup() {
  const { boundProjectActions, designService } = this.props;
  const { originGroupArr, groupArr } = designService.toJS();

  const checkedImgArr = originGroupArr
    .filter(img => img.active === true)
    .map(img => ({ ...img, active: false }));
  const groupName = `Group${groupArr.length + 1}`;
  groupArr.push({ groupName, imageList: checkedImgArr });

  boundProjectActions.setGroup({
    originGroupArr: fromJS(this.xeditorData.imageArr).toJS(),
    groupArr: fromJS(groupArr).toJS()
  });
}

// 解散分组按钮被单击
function handlerUngroup(groupName) {
  const { boundProjectActions, designService } = this.props;
  const groupArr = designService.get('groupArr');
  const newGroupArr = groupArr
    .filter(group => group.groupName != groupName)
    .map((group, index) => ({ ...group, groupName: `Group${index + 1}` }));
  boundProjectActions.setGroup({ groupArr: newGroupArr });
}

// Additional Instructions
function handlerInstructionsChange(val) {
  const { boundProjectActions } = this.props;
  boundProjectActions.updateDSData({ instructions: val });
}

// 检查输入项
function checkInput() {
  const { boundProjectActions, designService } = this.props;
  const { sequence, coverDesign } = designService.toJS();

  // Photo Sequence
  const isSequenceChecked = sequence.find(s => s.checked) != undefined;
  // Cover Design
  const { hasChecked, checkedAndHasExtraProps } = this.checkCoverDesign(coverDesign);

  boundProjectActions.updateDSData({
    hasSequenceError: { isShow: !isSequenceChecked, text: 'Photo Sequence' },
    hasCoverDesignError: {
      isShow: !hasChecked,
      text: checkedAndHasExtraProps.hasOwnProperty('extra') ? 'Text' : 'Cover Design'
    }
  });

  if (!isSequenceChecked || !hasChecked) {
    if (!isSequenceChecked) {
      document.getElementById('domRadio').scrollIntoView();
    } else {
      document.getElementById('domCheckBox').scrollIntoView();
    }
    return false;
  }
  return true;
}

// 创建订单
async function handleCreateOrder(isPayPal) {
  const { designService, boundProjectActions } = this.props;
  const buttonIndex = isPayPal ? 2 : 1;

  const payload = format({
    state: designService.toJS(),
    projectId: this.xeditorData.projectId
  });

  const { originData, ...rest } = payload.user_order_form;
  const params = { ...rest, projectId: this.xeditorData.projectId };
  if (isPayPal) {
    // 添加埋点
    window.logEvent.addPageEvent({
      name: 'DSOrderForm_Click_PayPal',
      ...params
    });
  } else {
    // 添加埋点
    window.logEvent.addPageEvent({
      name: 'DSOrderForm_Click_CreditCard',
      ...params
    });
  }

  boundProjectActions.updateDSData({ [`isButton${buttonIndex}Loading`]: true });

  let service_order_id;
  try {
    const res = await boundProjectActions.orderCreate(payload);
    const { data, isRequestSuccess } = res;
    service_order_id = data ? data.service_order_id : 0;
    if (!isRequestSuccess) {
      service_order_id = 0;
      // this.showNotification(ret_msg);
    }
  } catch (error) {
    console.log('error', error);
    service_order_id = 0;
    // this.showNotification();
  }
  boundProjectActions.updateDSData({ [`isButton${buttonIndex}Loading`]: false });
  return service_order_id;
}

// Paypal付款
function handlerPaypal(service_order_id) {
  const { boundProjectActions, designService } = this.props;
  const paypalInstance = designService.get('paypalInstance');
  const priceCount = designService.get('priceCount');

  if (priceCount.realPaymentAmount <= 0) {
    return;
  }

  boundProjectActions.updateDSData({ isButton2Loading: true });

  // paypal 实例调用
  paypalInstance.tokenize(
    {
      flow: 'checkout',
      amount: priceCount.realPaymentAmount,
      currency: priceCount.currencyCode
    },
    async (tokenizeErr, payload) => {
      if (tokenizeErr) {
        if (tokenizeErr.type !== 'CUSTOMER') {
          console.error('Error tokenizing:', tokenizeErr);
          return;
        }
        switch (tokenizeErr.code) {
          case 'PAYPAL_POPUP_CLOSED':
            boundProjectActions.updateDSData({
              isButton1Loading: false,
              isButton2Loading: false
            });
            return;
          case 'PAYPAL_ACCOUNT_TOKENIZATION_FAILED':
            boundProjectActions.updateDSData({
              isButton1Loading: false,
              isButton2Loading: false,
              showAlert: true
            });
            console.error('PayPal tokenization failed. See details:', tokenizeErr.details);
            return;
          case 'PAYPAL_FLOW_FAILED':
            boundProjectActions.updateDSData({
              isButton1Loading: false,
              isButton2Loading: false,
              showAlert: true
            });
            console.error(
              'Unable to initialize PayPal flow. Are your options correct?',
              tokenizeErr.details
            );
            return;
          default:
            boundProjectActions.updateDSData({
              isButton1Loading: false,
              isButton2Loading: false,
              showAlert: true
            });
            console.error('Error!', tokenizeErr);
            return;
        }
      }

      let params = {
        service_order_id: service_order_id,
        payment_gateway: 'BRAINTREE',
        payment_channel: 'paypal',
        card_nonce: payload.nonce,
        save_card: false
      };

      try {
        let { ret_code, data = {} } = (await boundProjectActions.submitOrder(params)) || {};
        data = data || {};
        if (ret_code === 200000) {
          this.props.history.push(
            `/software/ds-order-confirm?service_order_id=${data.service_order_id}`
          );
        } else {
          this.showNotification('Create order fail, please try again.');
        }
      } catch (err) {
        this.showNotification('Create order fail, please try again.');
      }
      boundProjectActions.updateDSData({ isButton2Loading: false });
    }
  );
}

//信用卡 付款
async function handlerPaymentClick(isPayPal) {
  const { boundProjectActions } = this.props;

  // 检查输入项目
  const isOk = this.checkInput();
  if (!isOk) {
    return;
  }
  const service_order_id = await this.handleCreateOrder(isPayPal);
  if (service_order_id <= 0) {
    return;
  }

  boundProjectActions.updateDSData({ serviceOrderId: service_order_id });

  if (isPayPal) {
    this.handlerPaypal(service_order_id);
  } else {
    this.props.history.push(`/software/ds-billing-review?service_order_id=${service_order_id}`);
  }
}

// 获取积分抵现
function getStoreCreditHandler(data, useRebateJson) {
  const { boundProjectActions } = this.props;
  const payload = {
    priceCount: {
      // 货币code
      currencyCode: data.currency_code,
      // 货币符号
      currencySymbol: data.currency_symbol,
      // 使用积分兑换金额
      appliedCredit: Number(data.applied_credit).toFixed(2),
      // 总金额
      totalPaymentMmount: Number(data.total_payment_amount).toFixed(2),
      // 实际需要支付的金额（总金额-积分兑换金额）
      realPaymentAmount: Number(data.real_payment_amount).toFixed(2)
    },
    useRebateJson
  };

  boundProjectActions.setStoreCredit(payload);

  this.closeModal();
}

// 挂载dom
async function didMount() {
  const { boundProjectActions, designService, baseUrl } = this.props;
  const serviceOrderId = designService.get('serviceOrderId') || 0;
  const useRebateJson = designService.get('useRebateJson') || [];

  let initData = {};
  if (!Boolean(serviceOrderId)) {
    initData = {
      // productConfirmat
      productConfirmat: this.xeditorData.productConfirmat,
      // 排序顺序
      sequence: this.xeditorData.sequence,
      // 页码参数
      currPage: this.xeditorData.pages.currPage,
      // Specify the cover photo
      coverArr: fromJS(this.xeditorData.imageArr).toJS(),
      // Favorite images
      favoriteArr: fromJS(this.xeditorData.imageArr).toJS(),
      // Image Groupings
      originGroupArr: fromJS(this.xeditorData.imageArr).toJS()
    };
  } else {
    const { isRequestSuccess, data } = await boundProjectActions.getConfirmInfo({ serviceOrderId });
    const { originData } = data || {};
    initData = isRequestSuccess ? originData : {};
  }

  // 是否包含积分
  const { data, isRequestSuccess } = await boundProjectActions.getCartCreditShow({ baseUrl });
  initData.hasPoints = isRequestSuccess ? data : false;
  boundProjectActions.initDsState(initData);

  braintreeClient
    .getClientInstance()
    .then(instance => {
      createrPaypalFields({ client: instance }, (paypalErr, paypalInstance) => {
        console.log('paypalInstance: ', paypalInstance);
        if (paypalErr) {
          console.error('Error creating PayPal:', paypalErr);
          return;
        }
        boundProjectActions.updateDSData({
          //
          isBack: false,
          paypalInstance,
          isButton1Loading: false,
          isButton2Loading: false
        });
      });
    })
    .catch(err => {
      this.showNotification();
    })
    .finally(() => {
      boundProjectActions.updateDSData({ isLoading: false });
    });

  this.getPrice(initData.currPage, useRebateJson);
}

export {
  didMount,
  getCxeditorData,
  closeModal,
  openModal,
  getPrice,
  handleAlertClose,
  getAlerModalProps,
  handlerSelectChange,
  handlerSequence,
  checkCoverDesign,
  handlerCoverDesign,
  handlerChange,
  handlerBlur,
  handlerImageClick,
  handlerGroup,
  handlerUngroup,
  handlerInstructionsChange,
  checkInput,
  handleCreateOrder,
  handlerPaypal,
  handlerPaymentClick,
  getStoreCreditHandler
};
