import { get } from 'lodash';
import {
  getPlanList,
  getPlanSummary,
  getOrderConfirm,
  subscribeOrderPayment,
  getSubscribeOrderDetail,
} from '@resource/pwa/services/subscription';
import { packageListMapV2 as packageListMap } from '@resource/lib/constants/strings';

const formatSelectData = list => {
  return list.map(item => {
    return {
      label: item.name,
      value: item.id,
      ...item
    }
  });
}

/**
 * 更新plans的周期, 周期更改, 则所有的plan都要重新计算.
 * @param {*} param0
 */
const changePlanCycle = ({
  plans,
  cycleId
}) => {
  if (!plans || !cycleId) {
    return plans;
  }

  return plans.map(plan => {
    const {
      cycle_list,
      priceInfos,

      currentLevel,
      currentCycle,
    } = plan;
    const cycle = cycle_list.find(v => v.id === cycleId) || currentCycle;
    const price = priceInfos.find(v => v.cycle === cycle.id && v.level === currentLevel.id);

    return Object.assign({}, plan, {
      currentPrice: price,
      currentCycle: cycle
    });
  });
};

/**
 * 更改指定plan的等级.
 * @param {*} param0
 */
const changePlanLevel = ({
  plans,
  planId,
  levelId
}) => {
  if (!plans || !planId || !levelId) {
    return plans;
  }

  const index = plans.findIndex(m => m.product_id === planId);
  if (index !== -1) {
    const plan = plans[index];
    const {
      level_list,
      cycle_list,
      priceInfos,

      currentPrice,
      currentLevel,
      currentCycle,
    } = plan;
    const level = levelId ? level_list.find(v => v.id === levelId) : currentLevel;
    const price = priceInfos.find(v => v.cycle === currentCycle.id && v.level === level.id);

    const newPlan = Object.assign({}, plan, {
      currentPrice: price,
      currentLevel: level
    });

    return [
      ...plans.slice(0, index),
      newPlan,
      ...plans.slice(index + 1)
    ];
  }

  return plans;
};

const formatPlanData = ({
  cycle_list,
  level_list,
  products,
  urlParams
}) => {
  const { level: qLevel, cycle: qCycle, product_id: qProduct_id} = urlParams || {};

  const plans = products.map(m => {
    const {
      current_plan_cycle,
      current_plan_level,
      cycle_list: cycle_ids,
      level_list: level_ids,
      price_infos,
      product_code,
      product_id,
      product_name
    } = m;
    const isMatchedProduct = qProduct_id === product_id;
    const usedCycleId = isMatchedProduct ? qCycle: current_plan_cycle;
    const usedLevelId = isMatchedProduct ? qLevel : current_plan_level;

    const levels = level_ids.map(id => level_list.find(item => item.id === id)).filter(v => v);
    const cycles = cycle_ids.map(id => cycle_list.find(item => item.id === id)).filter(v => v);

    const selectLevelData = formatSelectData(levels);
    const selectCycleData = formatSelectData(cycles);
    const priceInfos = price_infos;
    const currentCycle = selectCycleData.find(v => v.id === usedCycleId) || selectCycleData.find(v => v.id === 1);

    const standardLevel = selectLevelData.find(v => v.id === packageListMap.standard);
    const freeLevel = selectLevelData.find(v => v.id === packageListMap.free);
    const currentLevel = usedLevelId === packageListMap.free
     ? (!!standardLevel ? standardLevel : freeLevel)
     : selectLevelData.find(v => v.id === usedLevelId);

    const standardPrice = priceInfos.find(v => v.cycle === 1 && v.level === packageListMap.standard);
    const freePrice = priceInfos.find(v => v.cycle === 1 && v.level === packageListMap.free);
    const currentPrice = usedLevelId === packageListMap.free
     ? (!!standardPrice ? standardPrice : freePrice)
     : priceInfos.find(v => v.cycle === 1 && v.level === usedLevelId);

    return {
      product_code,
      product_id,
      product_name,

      currentPrice: currentPrice || {},
      currentLevel: currentLevel || {},
      currentCycle,

      priceInfos,
      level_list: selectLevelData,
      cycle_list: selectCycleData
    };
  });
  return plans;
};

const getSummary = (that) => {
  const { urls } = that.props;
  const galleryBaseUrl = urls.get('galleryBaseUrl');

  const { plans, cycle_list } = that.state;
  const plan_list = plans.map(m => get(m, 'currentPrice.plan_id'));

  getPlanSummary({ plan_list }, galleryBaseUrl).then(result => {
    const { summary_total, product_plan_list, current_cycle, currency } = result;
    const currentCycle = cycle_list.find(v => v.id === current_cycle);

    that.setState({
      summary: {
        summary_total,
        summaryCurrentCycle: currentCycle,
        summaryCurrency: currency,
        summaryProducts: product_plan_list
      }
    })
  });
};

const getPlanInfo = that => {
  const { urls } = that.props;
  const galleryBaseUrl = urls.get('galleryBaseUrl');

  const { urlParams } = that.state;

  getPlanList(galleryBaseUrl).then(result => {
    const { cycle_list, level_list, products } = result;

    const plans = formatPlanData({
      cycle_list,
      level_list,
      products,
      urlParams
    });

    that.setState({
      plans,
      cycle_list,
      cycleOptions: formatSelectData(cycle_list),
      level_list,
      products
    }, () => {
      getSummary(that);
    });
  })
};

const createPlanOrder = that => {
  const { urls, history} = that.props;
  const galleryBaseUrl = urls.get('galleryBaseUrl');

  const logEventParams = [];

  const { plans } = that.state;
  const subscribe_orders = plans.map(m => {
    const { product_id, currentPrice, currentCycle, currentLevel, product_name } = m;

    logEventParams.push({
      ProductName: product_name,
      Level: currentLevel.name,
      Cycle: currentCycle.name,
      Price: currentPrice.price,
      Currency: currentPrice.currency,
    });

    return {
      product_id,
      plan_id: currentPrice.plan_id
    };
  });

  window.logEvent.addPageEvent({
    name: 'SubscribePlan_Click_Continue',
    page_name: 'saascheckout',
    Plans: logEventParams
  });

  subscribeOrderPayment({ subscribe_orders }, galleryBaseUrl)
    .then(result => {
      const { order_number } = result;
      history.push(`/software/saas-billing-review?oID=${order_number}`);
    });
};

export {
  changePlanCycle,
  changePlanLevel,
  formatPlanData,
  getPlanInfo,
  getSummary,
  createPlanOrder
};
