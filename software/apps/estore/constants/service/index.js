import cart from './cart';
import coupon from './coupon';
import customPricing from './customPricing';
import digitalPricing from './digitalPricing';
import order from './order';
import pricing from './pricing';
import products from './products';
import setting from './setting';
import shipping from './shipping';
import taxes from './taxes';

export default {
  ...products,
  ...pricing,
  ...taxes,
  ...cart,
  ...order,
  ...setting,
  ...shipping,
  ...customPricing,
  ...digitalPricing,
  ...coupon,
};
