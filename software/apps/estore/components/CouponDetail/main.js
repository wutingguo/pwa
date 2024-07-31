export const formatApiData = (data, customer_id) => {
  const {
    name,
    code,
    type,
    decrease_amount,
    minimum_amount,
    start_date,
    end_date,
    racks,
    rack_type,
  } = data;
  // 判断racks里是否有特定勾选
  let tempRacks = racks;
  if (rack_type === 1) {
    const haveSelect = racks.some(item => item.spu_list.length > 0);
    if (haveSelect) {
      // 如果做了选择 挑选出选择的数据 并将sku_scope_type改为1 （0-全部货架，1-指定货架）
      tempRacks = [];
      racks.forEach(item => {
        if (item.spu_list.length > 0) {
          tempRacks.push({ ...item, sku_scope_type: 1 });
        }
      });
    } else {
      // 当特定选择为空时 选出下拉框中选中项
      tempRacks = [racks.find(item => item.sku_scope_type === 0)];
    }
  }
  return {
    name: name.trim(),
    code,
    type,
    decrease_amount,
    minimum_amount,
    start_date,
    end_date,
    customer_id,
    apply_scope: {
      rack_type: rack_type,
      racks: tempRacks,
    },
  };
};

export const transFormData = (data, form, setEdRacks) => {
  const { name, code, type, decrease_amount, minimum_amount, start_date, end_date, apply_scope } =
    data;
  const { rack_type, racks = [] } = apply_scope;
  setEdRacks(racks || []);
  form.setFieldsValue({
    name,
    code,
    type,
    decrease_amount,
    minimum_amount,
    start_date,
    end_date,
    rack_type: rack_type,
    // racks
  });
};
