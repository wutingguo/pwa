/**
 * 通用表单hook
 * -eg: software\apps\estore\components\ModalEntry\setupPaypal\Form\index.js
 */

import { useCallback, useMemo, useReducer, SyntheticEvent } from 'react';
import { fromJS } from 'immutable';
import { memoize, set } from 'lodash';

export const MESSAGE_LABEL_CHAR = `{label}`;

export const FORMATTER_PRESETS = {
  TRIM: Symbol('trim'),
  NUMBER: Symbol('number')
};

export const VALIDATOR_PRESETS = {
  REQUIRED: Symbol('required'),
  EMAIL: Symbol('email')
};

// Formatters
const formatterPresets = {
  [FORMATTER_PRESETS.TRIM]: (v, oldV) => String(v).trim(),
  [FORMATTER_PRESETS.NUMBER]: (v, oldV) => Number(v)
};

// Validators 校验通过则返回true
const validatorPresets = {
  [VALIDATOR_PRESETS.REQUIRED]: ({ value, filedPath }) => ({
    name: 'required',
    pass: !!value || typeof value === 'number',
    message: `${MESSAGE_LABEL_CHAR} is required.`
  }),
  [VALIDATOR_PRESETS.EMAIL]: ({ value, filedPath }) => ({
    name: 'email',
    pass: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    ),
    message: `${MESSAGE_LABEL_CHAR} is not email`
  })
};

const createPathArr = (path = []) => {
  return Array.isArray(path) ? path : String(path).split('.');
};

const formatPipe = ({ initValue, formatters = [] }) => {
  const formatted = formatters.reduce((value, formatter) => {
    if (typeof formatter === 'function') {
      return formatter(value);
    }
    const formatterFunc = formatterPresets[formatter];
    return formatterFunc ? formatterFunc(value) : value;
  }, initValue);
  return formatted;
};

// 为全校验 会把所有的validator结果返回  注意这里是单个字段的全部validators校验
const execValidates = ({ value, validators = [], filedPath }) => {
  const initRs = { pass: true };
  const results = validators.reduce((rs, validator) => {
    let validatorFunc = undefined;
    if (typeof validator === 'function') {
      validatorFunc = validator;
    } else {
      validatorFunc = validatorPresets[validator];
    }
    // 此处没有validatorFunc则说明validators有值填错了 校验不通过
    if (!validatorFunc) {
      rs.pass = false;
      return rs;
    }
    // 每个validator相互独立 结果只与value有关
    const result = validatorFunc({ value, filedPath });
    // 校验没有结果 或validator返回值不符合规范 无视此validator
    if (!result || !result.name) {
      return rs;
    }
    const { name, pass, message } = result;
    if (!pass) rs.pass = false;
    rs[name] = {
      name,
      pass: !!pass,
      // message与pass无关
      message
    };
    return rs;
  }, initRs);

  return results;
};

// 控制器 直接与input等输入组件交互
const useControllers = ({ controllerOptions, updateIn }) => {
  // 注册控制器 生成input的props用于完成双向绑定
  const reg = useCallback(
    memoize(
      ({
        filedPath = [],
        eventName = 'onChange',
        handler = (...args) => ({ value: args && args[0] }),
        formatters = [],
        validators = [],
        updater = (formattedV, oldV) => ({ value: formattedV }),
        valueName = 'value',
        valueHandle = v => v
      }) => {
        return {
          [eventName]: (...args) => {
            const filedArr = createPathArr(filedPath);
            if (!filedArr?.length) {
              const err = new Error(
                `hooks useForm: 字段路径无效, ${{ filedPath: JSON.stringify(filedPath) }}`
              );
              console.error(err);
              throw err;
            }
            const handlerResult = handler(...args);
            if (!handlerResult) return null;

            const formattedV = formatPipe({ initValue: handlerResult.value, formatters });
            const validateResults = execValidates({ value: formattedV, validators, filedPath });

            // 更新value
            updateIn({
              filedPathArr: ['values', ...filedArr],
              payload: oldValue => {
                const result = updater(formattedV, oldValue);
                return result ? result.value : formattedV;
              }
            });

            updateIn({
              filedPathArr: ['validates', ...filedArr],
              payload: oldValue => {
                return validateResults;
              }
            });

            return { value: formattedV };
          }
        };
      }
      // TODO: key resolver
    ),
    [updateIn]
  );

  // 用于辅助批量生成controllers
  const controllers = useMemo(() => {
    const r = {};
    controllerOptions.forEach((option, index) => {
      const { name = index } = option;
      r[name] = reg(option);
    });
    return r;
  }, [reg, controllerOptions]);

  return { reg, controllers };
};

/** useForm 参数定义
 *
interface IUseFormProps {
  defaultValues?: Object;
  controllerOptions?: IUseFormControllerOption[];
  valueControl?: boolean; // 默认关闭 控制使用范围
}

interface IUseFormControllerOption {
  name?: string | number;
  filedPath?: string[] | string;
  eventName?: string;
  handler?: (...args: any[]) => { value: any };
  formatters?: UseFormFormatter[];
  validators?: UseFormValidator[];
  updater?: (formattedV: any, oldV: any) => { value: any };   // 为了与字段值区分 updater的返回值必须满足格式 否则updater无效 默认使用format后的值更新
  valueName?: string; // default: 'value' 在 valueControl 为true时生效
  valueDisplay?: (v) => any ;//在 valueControl 为true时生效
}

type UseFormFormatter = string | ((v: any) => any);
type UseFormValidator =
  | string
  | ((args: { v: any; filedPath?: string[] | string }) => {
      name: string;
      pass: boolean;
      message: string;
    }); // message与pass无关


*/

const useForm = ({ defaultValues = {}, controllerOptions = [], valueControl = false }) => {
  const [formState, dispatch] = useReducer(
    (state, { type, payload, filedPathArr = [] }) => {
      switch (type) {
        case 'deepSet':
          return state.mergeDeep(payload);
        // 调用时严格注意filedPathArr的更新范围 此reducer限制在内部使用
        case 'updateIn':
          return state.updateIn([...filedPathArr], payload);

        default:
          throw new Error('no reducer matched');
      }
    },
    fromJS({
      values: defaultValues,
      validates: {}
    })
  );

  // hook内部使用
  const updateIn = useCallback(
    ({ filedPathArr, payload }) => {
      dispatch({
        type: 'updateIn',
        filedPathArr,
        payload
      });
    },
    [dispatch]
  );

  // hook内部使用
  const deepSet = useCallback(
    payload => {
      dispatch({
        type: 'deepSet',
        payload
      });
    },
    [dispatch]
  );

  const getForm = useCallback(
    (valuePath, filedPath) => {
      const values = formState.getIn(createPathArr(valuePath));
      if (!values) return undefined;
      return values.getIn(createPathArr(filedPath));
    },
    [formState]
  );

  // 尽量减少调用次数
  const parseForm = useCallback(
    path => {
      if (!path) return formState.toJS();
      return formState.getIn(createPathArr(path)).toJS();
    },
    [formState]
  );

  const getFormValue = useCallback(
    (filedPath = []) => {
      return getForm('values', filedPath);
    },
    [getForm]
  );

  // 所有字段初始取值 均为{pass: true}
  const getValidate = useCallback(
    (filedPath = [], key = '') => {
      const tempPathArr = createPathArr(filedPath);
      const pathArr = key ? [...tempPathArr, key] : tempPathArr;
      return getForm('validates', pathArr) || { pass: true };
    },
    [getForm]
  );

  // 是否通过
  const isPass = useCallback(
    (filedPath = [], key = '') => {
      const validate = getValidate(filedPath, key);
      return !!validate.pass;
    },
    [getValidate]
  );

  // 只在校验没有通过时返回信息
  const errMsg = useCallback(
    (filedPath = [], key = '', label = '') => {
      const validate = getValidate(filedPath, key);
      return validate.pass
        ? ''
        : validate.message.replace(MESSAGE_LABEL_CHAR, label || String(filedPath));
    },
    [getValidate]
  );

  // 全字段校验函数
  const validatesFormValues = useCallback(() => {
    // const validates = parse('validates');
    const newValidates = { pass: true };
    controllerOptions.forEach((option, index) => {
      // 解构controllerOption时 注意reg函数处的默认值
      const { filedPath, validators } = option;
      const value = getFormValue(filedPath);
      const validateResults = execValidates({ value, validators, filedPath });
      // 合并校验结果
      if (!validateResults.pass) newValidates.pass = false;
      set(newValidates, createPathArr(filedPath), validateResults);
    });

    deepSet({ validates: newValidates });
    console.log('validatesFormValues', { newValidates });
    return newValidates;
  }, [parseForm, controllerOptions, getFormValue, deepSet]);

  const parseFormValues = useCallback(() => {
    const values = parseForm('values');
    console.log('parseFormValues', { values });
    return values;
  }, [parseForm]);

  const submitFormValues = useCallback(() => {
    const validates = validatesFormValues();
    if (validates.pass) {
      return parseFormValues();
    }
    return null;
  }, [validatesFormValues, parseFormValues]);

  const fillFormValues = useCallback(
    values => {
      if (!values) return;
      deepSet({
        values
      });
    },
    [deepSet]
  );

  const { reg, controllers } = useControllers({ controllerOptions, updateIn, valueControl });

  // 在使用valueControl时 每次渲染中为controller带上value字段 省去输入组件value取值的代码
  if (valueControl) {
    controllerOptions.forEach((option, index) => {
      const { name = index, filedPath = [], valueName = 'value', valueHandle = v => v } = option;
      const controller = controllers[name];
      controller[valueName] = valueHandle(getFormValue(filedPath));
    });
  }

  return {
    getFormValue,
    getValidate,
    errMsg,
    isPass,
    validatesFormValues,
    parseFormValues,
    submitFormValues,
    fillFormValues,
    reg,
    controllers
  };
};

export default useForm;
