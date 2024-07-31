// 暂定 将产品的sku展示名称 作为 标准spu的名称 特点：书等 items只有一个
const selfProjectCategories = ['PB', 'WA', 'TT', 'CUSTOM'];

const noDescTriCategories = ['WA', 'TT', 'CUSTOM'];

// 禁止修改产品数量
const disableQuantityCategories = ['PP'];

// additionItem不需要displayName后面的X7 X1数量显示
const noAdditionalItemQuantityCategories = ['PP'];

// additionItem需要右侧的数量
const hasAdditionalItemRightQuantityCategories = ['PP'];

// 判定是否包含子产品 如套系、组合等  (价格下方的箭头)
const isHasChildProducts = ({ productCode = '' }) => {
  // FIXME: 之后上套系产品时更新
  return false;
};

const shopCartItemConfig = {
  selfProjectCategories,
  disableQuantityCategories,
  noAdditionalItemQuantityCategories,
  hasAdditionalItemRightQuantityCategories,
  noDescTriCategories,
  isHasChildProducts
};

export default shopCartItemConfig;
