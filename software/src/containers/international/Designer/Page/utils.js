
export const getOptions = ({ min, max, step = 2 }) => {
    let currIndex = min;
    let options = [];
    currIndex <= max && options.push({ label: `${currIndex} pages`, value: currIndex });
    while (currIndex <= max) {
        const nextIndex = currIndex + step;
        if (nextIndex <= max) {
            options.push({ label: `${nextIndex} pages`, value: nextIndex });
        }
        currIndex = nextIndex;
    }
    return options;
}


export const format = ({
    state,
    projectId
}) => {

    let {
        coverArr,
        productConfirmat,
        currPage,
        sequence,
        coverDesign,
        favoriteArr,
        groupArr,
        instructions,
        useRebateJson
    } = state;
    sequence = (sequence.find(s => s.checked) || {}).label;
    favoriteArr = favoriteArr.filter(img => img.active).map(({ src, desc }) => ({ src, desc }));
    coverArr = coverDesign.specifyCoverPhoto.checked ? coverArr.filter(img => img.active).map(({ src, desc }) => ({ src, desc })) : [];
    coverDesign = Object.values(coverDesign).filter(s => s.checked).map(({ text, extra = "" }) => `${text} ${extra}`);
    return {
        // target_entity类型 默认是project
        target_entity_type: "project",
        // target_entity的id 默认是projectId
        target_entity_id: projectId,
        // 币种
        currency_code: "USD",

        // order form页面的数据
        user_order_form: {
            productConfirmat,
            currPage,
            sequence,
            coverDesign,
            favoriteArr,
            groupArr,
            instructions,
            coverArr,
            // 存储源数据，方便点击浏览器返回，显示原来的数据
            originData: state
        },
        // 使用积分的json
        use_rebate_json: useRebateJson
    }
}