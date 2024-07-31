import CouponList from '../components/CouponList';
import Order from '../components/order';
import OrderDetail from '../components/order/orderDetail';
import Products from '../components/products';
import Settings from '../components/settings';
import Shipping from '../components/shipping';
import Taxes from '../components/taxes';

export const getEsModule = (index, id) => {
  const modules = estoreModule.map((item, idx) => {
    if (id && idx === index) {
      switch (item.key) {
        case 'orders':
          return {
            ...item,
            module: OrderDetail,
            path: `/software/e-store/${item.key}/${id}`,
          };
      }
    } else {
      return item;
    }
  });
  return modules;
};

const cnModule = ['orders', 'products', 'shipping', 'settings'];

export const estoreModule = [
  {
    label: t('ESTPRE_ORDERS', 'Orders'),
    key: 'orders',
    pageName: 'ESTORE_DASHBOARD_ORDERS',
    module: Order,
    logEventName: 'Estore_Click_Orders',
  },
  {
    label: t('ESTORE_PRODUCT', 'Products'),
    key: 'products',
    pageName: 'ESTORE_DASHBOARD_PRODUCTS',
    module: Products,
    logEventName: 'Estore_Click_Products',
  },
  {
    label: t('ESTORE_TAXES', 'Taxes'),
    key: 'taxes',
    pageName: 'ESTORE_DASHBOARD_TAXES',
    module: Taxes,
    logEventName: 'Estore_Click_Taxes',
  },
  {
    label: t('ESTORE_SHIPPING', 'Shipping'),
    key: 'shipping',
    pageName: 'ESTORE_DASHBOARD_SHIPPING',
    module: Shipping,
    logEventName: 'Estore_Click_Shipping',
  },
  {
    label: t('ESTORE_COUPON', 'Coupon'),
    key: 'coupon',
    pageName: 'ESTORE_DASHBOARD_COUPON',
    module: CouponList,
    logEventName: 'Estore_Click_Coupon',
  },
  {
    label: t('ESTORE_SETTINGS', 'Settings'),
    key: 'settings',
    pageName: 'ESTORE_DASHBOARD_SETTINGS',
    module: Settings,
    logEventName: 'Estore_Click_Settings',
  },
]
  .map(item => ({
    ...item,
    path: `/software/e-store/${item.key}`,
  }))
  .filter(item => {
    if (__isCN__) {
      return cnModule.includes(item.key);
    }
    return true;
  });

export default estoreModule;
