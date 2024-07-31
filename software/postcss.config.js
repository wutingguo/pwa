const excludes = [
  'base.scss',
  'common.scss',
  'fonts.scss',
  'mixin.scss',
  'rc-tooltip.scss',
  'variable.scss',
];
module.exports = () => {
  if (process.env.singleSpa) {
    return {
      plugins: {
        autoprefixer: {},
        'postcss-selector-namespace': {
          namespace: function (css) {
            // 样式不需要添加命名空间
            const isExcluded = !!excludes.find(v => css.includes(v));
            if (isExcluded) return '';

            return `.software-app`;
          },
        },
      },
    };
  }

  return {
    plugins: [require('autoprefixer')],
  };
};
