import { Map, fromJS } from 'immutable';

const initField = {
  value: undefined,
  isInputed: false,
  message: {
    status: 'done',
    value: '',
  },
  subscribe: null,
  rules: [],
  node: null,
};

function getId() {
  return `${Math.random().toString(36).substr(2, 9)}`;
}

export default class CreateForm {
  constructor() {
    this.form = Map({});
    this.formElementProps = Map({});
    this.effects = [];
  }
  // 获取字段值
  getFieldValue = name => {
    if (this.form.has(name)) {
      const value = this.form.getIn([name, 'value']);
      return value;
    }
    return null;
  };
  // 重置字段
  resetFieldsValue = names => {
    if (!names) {
      const form = this.form.toJS();
      const keys = Object.keys(form);
      for (const name of keys) {
        this.resetFieldValue(name);
      }
      return;
    }

    for (const name of names) {
      this.resetFieldValue(name);
    }
  };
  resetFieldValue = name => {
    if (this.form.has(name)) {
      const oldNode = this.form.getIn([name, 'node']);
      const subscribe = this.form.getIn([name, 'subscribe']);
      const rules = this.form.getIn([name, 'rules']);
      const field = {
        ...initField,
        node: oldNode,
        subscribe,
        rules,
      };
      this.form = this.form.set(name, fromJS(field));
      subscribe();
    }
  };
  // 设置字段值
  setFieldValue = (name, value) => {
    if (this.form.has(name)) {
      this.form = this.form.setIn([name, 'value'], value);
      const subscribe = this.form.getIn([name, 'subscribe']);
      subscribe();
      this.runEffect();
      return this.form.getIn([name, value]);
    }
    console.error(`not find ${name} key`);
  };

  // 批量设置字段值
  setFieldsValue = values => {
    for (let key in values) {
      this.setFieldValue(key, values[key]);
    }
  };
  // 绑定字段
  boundField = (name, options) => {
    const { subscribe, rules, node = null, defaultValue } = options;
    const field = {
      ...initField,
      value: typeof defaultValue === 'undefined' ? undefined : defaultValue,
      subscribe,
      rules,
      node,
    };
    this.form = this.form.set(name, fromJS(field));
    subscribe();
    this.runEffect();
  };
  updateProperty = (name, key, value) => {
    if (this.form.has(name)) {
      this.form = this.form.setIn([name, key], value);
    }
  };
  // 校验函数
  verifyField = name => {
    const field = this.form.get(name).toJS();
    // console.log('field: ', field);
    const { value, rules = [], subscribe, message } = field;

    for (let i = 0; i < rules.length; i++) {
      const item = rules[i];
      if (item.required) {
        if (this.isEmpty(value)) {
          this.form = this.form.setIn([name, 'message', 'value'], item.message);
          this.form = this.form.setIn([name, 'message', 'status'], 'error');
          subscribe();
          return false;
        }
      } else if (item.pattern && item.pattern instanceof RegExp) {
        if (!item.pattern.test(value)) {
          this.form = this.form.setIn([name, 'message', 'value'], item.message);
          this.form = this.form.setIn([name, 'message', 'status'], 'error');
          subscribe();
          return false;
        }
      } else if (item.validitor && typeof item.validitor === 'function') {
        const flag = item.validitor(value);
        if (!flag) {
          this.form = this.form.setIn([name, 'message', 'value'], item.message);
          this.form = this.form.setIn([name, 'message', 'status'], 'error');
          subscribe();
          return false;
        }
      }
    }

    if (message) {
      this.form = this.form.setIn([name, 'message', 'value'], undefined);
      this.form = this.form.setIn([name, 'message', 'status'], 'done');
      subscribe();
    }

    return true;
  };
  // 判断值是否为空
  isEmpty = value => {
    if (typeof value === 'string' && !value.trim()) {
      return true;
    } else if (value instanceof Array && value.length === 0) {
      return true;
    } else if (value === undefined || value === null) {
      return true;
    }
    return false;
  };
  // 获取报错信息
  getFieldError = name => {
    if (this.form.has(name)) {
      const message = this.form.getIn([name, 'message']).toJS();
      return message;
    }
  };
  // 设置报错信息
  setFieldError = (name, value) => {
    if (this.form.has(name)) {
      this.form = this.form.setIn([name, 'message'], fromJS(value));
    }
  };
  // 卸载字段
  unountField = name => {
    if (this.form.has(name)) {
      this.form = this.form.delete(name);
    }
  };
  // 校验获取数据
  getFormData = () => {
    const form = this.form.toJS();
    const keys = Object.keys(form);
    const data = Object.create(null);
    for (let key of keys) {
      const isVerifySucess = this.verifyField(key);
      if (isVerifySucess) {
        data[key] = form[key].value;
      } else {
        return null;
      }
    }

    return data;
  };

  boundToFormElementProps = (props = {}) => {
    this.formElementProps = Map(props);
  };

  submit = () => {
    if (this.formElementProps.has('onFinish')) {
      const data = this.getFormData();
      if (!data) return;
      this.formElementProps.get('onFinish')(data);
    }
  };

  // 执行副作用
  runEffect = () => {
    if (this.effects.length === 0) return;
    const form = this.form.toJS();
    const keys = Object.keys(form);
    const data = Object.create(null);
    for (let key of keys) {
      data[key] = form[key].value;
    }
    this.effects.forEach(effect => {
      effect.fn(data);
    });
  };

  // 监听函数
  registerWatch = (type, fn) => {
    let id = getId();
    this.effects.push({
      id,
      type,
      fn: (...arg) => fn(...arg),
    });
    return () => {
      this.effects = this.effects.filter(item => item.id !== id);
    };
  };
  // 创建自定义hooks
  getInternalHooks = type => {
    return {
      registerWatch: (...args) => this.registerWatch(type, ...args),
    };
  };

  getForm = () => {
    return {
      getFieldValue: (...args) => this.getFieldValue(...args),
      setFieldValue: (...args) => this.setFieldValue(...args),
      boundField: (...args) => this.boundField(...args),
      getFormData: (...args) => this.getFormData(...args),
      getFieldError: (...args) => this.getFieldError(...args),
      setFieldError: (...args) => this.setFieldError(...args),
      unountField: (...args) => this.unountField(...args),
      setFieldsValue: (...args) => this.setFieldsValue(...args),
      resetFieldsValue: (...args) => this.resetFieldsValue(...args),
      boundToFormElementProps: (...args) => this.boundToFormElementProps(...args),
      submit: this.submit,
      updateProperty: (...args) => this.updateProperty(...args),
      getInternalHooks: (...args) => this.getInternalHooks(...args),
    };
  };
}
