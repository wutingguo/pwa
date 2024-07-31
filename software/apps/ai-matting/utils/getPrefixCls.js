
export default function getPrefixCls(suffixCls, customizePrefixCls) {
    if (customizePrefixCls) return customizePrefixCls;

    return suffixCls ? `ai-matting-${suffixCls}` : 'ai-matting';
}