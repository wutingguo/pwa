import doPrepare from './prepare';

/**
 * 组件挂载之前.
 */
const willMount = that => {
  doPrepare(that);

  window.addEventListener('appinstalled', (evt) => {
    window.logEvent.addPageEvent({
      name: 'GalleryPageAppInstalled'
    });
  });
};

/**
 * 组件更新之后
 */
const didUpdate = that => {};

const willReceiveProps = async (that, nextProps) => {};

/**
 * 组件挂载之后.
 */
const didMount = (that) => {
  const { boundGlobalActions } = that.props;

  // 初始化notification的节点.
  boundGlobalActions.initNotificationSystem(that.notificationSystem.current);
};

export default {
  willMount,
  didMount,
  didUpdate,
  willReceiveProps
};
