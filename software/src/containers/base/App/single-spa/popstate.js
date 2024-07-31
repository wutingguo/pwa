import { saasProducts, packageListMap } from '@resource/lib/constants/strings';
import { paymentForSubscrible } from '@resource/pwa/services/payment';
import singleSpaNavbar from './action';

const createFreeOrder = ({ plan_id, product_id, galleryBaseUrl }) => {
  const body = {
    subscribe_orders: [{ product_id, plan_id }],
    nonce: '',
    payment_gateway: 'BRAINTREE',
    save_card: true
  };

  return paymentForSubscrible(body, galleryBaseUrl);
};

const findFreePackageId = (planList, product_id) => {
  const packageList = planList.get(product_id);

  if (packageList) {
    const freePackage = packageList.find(el => el.get('level_name') === packageListMap.free);

    if (freePackage) {
      return freePackage.get('id');
    }
  }

  return '';
}

/**
 * 当location跳转到/software/projects时. 
 * 检查designer订阅. 如果没有订阅, 就订阅一个freed的plan.
 * @param {*} that 
 */
const verifyDesignerSubscription = that => {
  const { location, mySubscription, urls, planList, boundGlobalActions } = that.props;
  const { pathname } = location;

  if (pathname === '/software/projects') {
    const items = mySubscription.get('items');

    if (items) {
      const isSubscriptDesigner = items.find(v => v.get('product_id') === saasProducts.designer);
      if (!isSubscriptDesigner) {
        const plan_id = findFreePackageId(planList, saasProducts.designer);

        if (plan_id) {
          createFreeOrder({
            galleryBaseUrl: urls.get('galleryBaseUrl'),
            product_id: saasProducts.designer,
            plan_id
          }).then(() => {
            boundGlobalActions.getMySubscription(urls.get('galleryBaseUrl'));
          })
        } else {
          console.log('the plan_id is empty when createFreeOrder for designer');
        }
      }
    }
  }
};

const onPopstate = (that, event) => {
  singleSpaNavbar.updateNavbarItems(that);

  // 检查designer订阅. 如果没有订阅, 就订阅一个freed的plan.
  verifyDesignerSubscription(that);
};

export default {
  onPopstate,
  verifyDesignerSubscription
};