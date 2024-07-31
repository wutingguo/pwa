import { appActionStorageKey, appActionNamesEnum, appActionModuleNamesEnum } from '../strings';

const checkActionIsValid = ({ actionName, moduleName }) =>
  Object.values(appActionNamesEnum).includes(actionName) &&
  Object.values(appActionModuleNamesEnum).includes(moduleName);

const getAppActions = () => JSON.parse(localStorage.getItem(appActionStorageKey) || '[]');

const setAppActions = (appActions = []) =>
  localStorage.setItem(appActionStorageKey, JSON.stringify(appActions));

const createKey = ({ actionName, moduleName }) => `${actionName}-${moduleName}`;

const isExist = (actionName, moduleName) => {
  const arr = getAppActions();
  const key = createKey({ actionName, moduleName });
  return arr.some(item => item.key === key);
};

const setData = (actionName, moduleName, data = {}) => {
  if (!isExist(actionName, moduleName)) return;
  const arr = getAppActions();
  const key = createKey({ actionName, moduleName });
  const newArr = arr.map(item => {
    if (item.key === key) {
      item.data = data === null ? null : Object.assign({}, item.data, data);
    }
    return item;
  });
  setAppActions(newArr);
};

const add = (actionName, moduleName, data = {}) => {
  const isActionValid = checkActionIsValid({ actionName, moduleName });
  if (!isActionValid) {
    throw new Error('App Action Error:  Invalid action name or module name');
  }
  // 只更新数据 不重复添加
  if (isExist(actionName, moduleName)) {
    return setData(actionName, moduleName, data);
  }
  const arr = getAppActions();
  const temp = { actionName, moduleName, data };
  arr.push({ key: createKey(temp), ...temp });
  setAppActions(arr);
};

const get = (actionName, moduleName) => {
  if (!isExist(actionName, moduleName)) return undefined;
  const key = createKey({ actionName, moduleName });
  return getAppActions().find(item => item.key === key);
};

const getDataValueByKey = (actionName, moduleName, dataKey) => {
  const action = get(actionName, moduleName);
  return action?.data && action.data[dataKey];
};

const remove = (actionName, moduleName) => {
  const arr = getAppActions();
  const key = createKey({ actionName, moduleName });
  const newArr = arr.filter(item => item.key !== key);
  setAppActions(newArr);
};

const switchDataValueByKey = (actionName, moduleName, dataKey, forceValue) => {
  const value = getDataValueByKey(actionName, moduleName, dataKey);
  if (typeof value !== 'undefined' && value !== null) {
    setData(actionName, moduleName, { [dataKey]: forceValue || !value });
  }
};

const appActionsService = {
  getAppActions,
  setAppActions,
  add,
  remove,
  isExist,
  get,
  setData,
  getDataValueByKey,
  switchDataValueByKey
};

export default appActionsService;
