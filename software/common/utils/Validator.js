/**
 * @file: Validator.js
 * @description: 表单验证类
 * @author: hyg
 * @date: 2020/4/2
 */
class Validator {
  constructor() {
    this.cache = [];
    /**
     * @description: 表单的验证规则
     * @type {{minLength: Validator.strategies.minLength, isEmail: Validator.strategies.isEmail, isNonEmpty: Validator.strategies.isNonEmpty, isMobile: Validator.strategies.isMobile}}
     */
    this.strategies = {
      isNonEmpty: (value, errorMsg) => {
        if (value === '') {
          return errorMsg;
        }
      },
      minLength: (value, length, errorMsg) => {
        if (value.length < length) {
          return errorMsg;
        }
      },
      isMobile: (value, errorMsg) => {
        const val = value.replace(/[^\d]/g, '');
        if (!(val.length === 11)) {
          return errorMsg;
        }
      },
      isEmail: (value, errorMsg) => {
        const reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
        if (value && !reg.test(value)) {
          return errorMsg;
        }
      },
      isPostalCode: (value, errorMsg) => {
        // 检验邮政编码
        const reg = /^[0-9]{5,6}$/;
        if (value && !reg.test(value)) {
          return errorMsg;
        }
      }
    };
  }

  /**
   * @description: 向表单实例添加验证规则
   * @param dom 输入框dom对象
   * @param rules 验证规则
   */
  add(dom, rules) {
    const self = this;
    for (let i = 0, rule; (rule = rules[i++]); ) {
      (function(rule) {
        let strategyAry = rule.strategy.split(':');
        const errorMsg = rule.errorMsg;

        self.cache.push(() => {
          const strategy = strategyAry.shift();
          strategyAry.unshift(dom.value);
          strategyAry.push(errorMsg);
          return self.strategies[strategy].apply(dom, strategyAry);
        });
      })(rule);
    }
  }

  /**
   * @description: 开始验证规则
   * @returns 错误信息
   */
  start() {
    for (let i = 0, validatorFunc; (validatorFunc = this.cache[i++]); ) {
      const errorMsg = validatorFunc();
      if (errorMsg) {
        return errorMsg;
      }
    }
  }
}

export default Validator;
