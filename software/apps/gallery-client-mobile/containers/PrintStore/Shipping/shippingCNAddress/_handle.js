import Validator from '@common/utils/Validator';

import { getAddressDetail } from '@common/servers';

import { getAutomatic } from '@apps/gallery-client/services/cart';

const handleChange = (that, e) => {
  // const needVerifyEmptyFields = ['street1', 'full_name', 'phone_number'];
  const target = e.target;
  const name = target.name;
  const val = target.value;
  that.setState({
    [name]: val,
  });
};

const handleSelectAddress = (that, address) => {
  console.log('address: ************', address);
  const { province, city, area, street, streets, province_code } = address;
  that.setState(
    {
      streets,
      sub_country: province,
      city: city,
      sub_city: area,
      town: street,
      province_code,
      // warnText: ''
    },
    async () => {
      if (province && city && area && street) {
        await that.props.saveAddressData();
        that.props.getAutomaticData();
      }
    }
  );
};

const initData = that => {
  that.getAddressDetailData();
};

const didMount = that => {
  initData(that);
};

// TODO: UI和逻辑需分离
const getAddressDetailData = that => {
  const { address_id, order_number } = that.state;
  const fetchAddress = address_id ? getAddressDetail.bind(undefined, address_id) : () => {};
  if (address_id || order_number) {
    that.setState({
      isShowLoading: true,
    });
    fetchAddress().then(res => {
      if (res) {
        // const { country, full_name, phone_number, address_id, street1, street2, sub_city, sub_country, town, zip_or_postal_code} = res;
        const { id, valid, ...rest } = res;
        that.setState({
          ...rest,
          address_id: id,
          isShowLoading: false,
        });
      }
    });
  }
};

const validatorFunc = that => {
  const validator = new Validator();
  const Form = that.form;
  if (Form) {
    // validator.add(Form.address, [
    //   {
    //     strategy: 'isNonEmpty',
    //     errorMsg: '所在地区不能为空'
    //   }
    // ]);
    validator.add(Form.street1, [
      {
        strategy: 'isNonEmpty',
        errorMsg: '详细地区不能为空',
      },
    ]);
    validator.add(Form.full_name, [
      {
        strategy: 'isNonEmpty',
        errorMsg: '收货人不能为空',
      },
    ]);
    validator.add(Form.phone_number, [
      {
        strategy: 'isNonEmpty',
        errorMsg: '手机号不能为空',
      },
    ]);

    validator.add(Form.zip_or_postal_code, [
      {
        strategy: 'isPostalCode',
        errorMsg: '请输入正确邮政编码格式',
      },
    ]);

    return validator.start();
  }
};

const onCreate = that => {
  const { handleOk, handleClose, getAddressList } = that.props;
  const { a_type, address_id, isShowLoading, warnText, order_number, streets, ...rest } =
    that.state;
  const { sub_country, city, sub_city, town } = rest;
  const postData = {
    a_type,
    address_id,
    order_number,
    address: {
      ...rest,
    },
  };
  if (sub_country === '') {
    return that.setState({
      warnText: '省不能为空',
    });
  }
  if (city === '') {
    return that.setState({
      warnText: '市不能为空',
    });
  }
  if (sub_city === '') {
    return that.setState({
      warnText: '区不能为空',
    });
  }

  // if(sub_city && streets.length !== 0 && town === '') {
  //   return that.setState({
  //     warnText: '街道不能为空'
  //   });
  // }

  const errorMsg = that.validatorFunc();

  if (!errorMsg) {
    handleOk && handleOk(postData);

    handleClose && handleClose();
  } else {
    that.setState({
      warnText: errorMsg,
    });
  }
};

const onTagClick = (that, e) => {
  const target = e.target;
  const text = target.textContent;
  that.setState({
    street2: text,
  });
};
export {
  didMount,
  onCreate,
  handleChange,
  handleSelectAddress,
  getAddressDetailData,
  onTagClick,
  validatorFunc,
};
