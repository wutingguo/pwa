export const formatApiData = (submitData, web_info) => {
  const {
    // 主体信息
    //主体信息差异字段
    license_copy,
    license_number,
    license_address,

    cert_copy,
    cert_type,
    cert_number,
    company_address,
    id_doc_type,
    //-----身份证
    id_card_copy,
    id_card_national,
    id_card_name,
    id_card_number,
    id_card_address, //主体类型为企业时，需要填写
    card_period_begin,
    card_period_end,
    period_end_id_card_long, //判断是否是长期有效
    // web_info,//此字段改为前端自动上传
    // 非身份证 其他类型证件信息
    id_doc_copy,
    id_doc_copy_back, //若证件类型为护照，无需上传反面照片
    id_doc_name,
    id_doc_number,
    id_doc_address, //主体类型为企业时，需要填写
    doc_period_begin,
    doc_period_end,
    period_end_doc_long, //判断是否是长期有效
    //主体信息公共字段
    subject_type,
    merchant_name,
    merchant_shortname,
    legal_person,
    period_begin,
    period_end,
    period_end_long, //判断是否是长期有效
    // 超级管理员信息字段
    contact_type,
    contact_name,
    mobile_phone, //经营资料电话和客户电话共用一个
    contact_email,
    // 结算账户信息字段
    bank_account_type,
    account_name,
    account_bank,
    bank_address_code,
    account_number,
  } = submitData;
  return {
    contact_info: {
      //超级管理员信息
      contact_email,
      contact_type, //超级管理员类型
      mobile_phone,
      contact_name,
    },
    subject_info: {
      //主体资料
      subject_type: subject_type, //主体类型
      business_license_info: {
        //营业执照
        legal_person: legal_person, //个体户经营者/法人姓名
        license_address: license_address, //注册地址
        license_copy: license_copy.media_id, //营业执照照片
        enc_license_copy_image_id: license_copy.enc_image_id, //营业执照照片ID
        license_number: license_number, //注册号/统一社会信用代码
        merchant_name: merchant_name, //商户名称
        period_begin: period_begin, //有效期限开始日期
        period_end: period_end_long ? '长期' : period_end, //有效期限结束日期
      },
      // "certificate_letter_copy": "",
      identity_info: {
        //经营者/法人身份证件
        // "authorize_letter_copy": "",
        id_card_info: {
          //身份证信息
          card_period_begin: card_period_begin, //身份证有效期开始时间
          card_period_end: period_end_id_card_long ? '长期' : card_period_end, //身份证有效期结束时间
          id_card_address: id_card_address, //身份证居住地址
          id_card_copy: id_card_copy.media_id, //身份证人像面照片
          enc_id_card_copy_image_id: id_card_copy.enc_image_id, //身份证人像面照片ID
          id_card_name: id_card_name, //身份证姓名
          id_card_national: id_card_national.media_id, //身份证国徽面照片
          enc_id_card_national_image_id: id_card_national.enc_image_id, //身份证国徽面照片ID
          id_card_number: id_card_number, //身份证号码
        },
        id_doc_type: id_doc_type, //证件类型
        id_holder_type: 'LEGAL', //证件持有人类型
      },
    },
    business_info: {
      //经营资料
      merchant_shortname, //商户简称
      sales_info: {
        web_info: {
          enc_web_authorisation_image_id: '', //网站授权函ID
          web_authorisation: '', //网站授权函
        },
      },
    },
    bank_account_info: {
      //结算银行账户
      account_bank, //开户银行
      account_name, //开户名称
      account_number, //银行账号
      bank_account_type, //账户类型
      bank_address_code, //开户银行省市编码
    },
  };
};
//测试数据
// const tempData = {
//   customer_id: 2062738,
//   contact_info: {
//     contact_type: 'LEGAL',
//     contact_name: '付建华',
//     contact_id_doc_type: '',
//     contact_id_number: '',
//     contact_id_doc_copy: '',
//     doc_copy_image_id: 0,
//     contact_id_doc_copy_back: '',
//     doc_copy_back_image_id: 0,
//     contact_period_begin: '2024-06-05',
//     contact_period_end: '2024-06-05',
//     mobile_phone: '15900996746',
//     contact_email: 'sdsdsd@qq.com',
//   },
//   subject_info: {
//     subject_type: 'SUBJECT_TYPE_ENTERPRISE',
//     business_license_info: {
//       license_copy: '',
//       enc_license_copy_image_id: '9JgVJ%2FqHL3TvjSGQFpEYvZooPnWiEZt9',
//       license_copy_image_id: 0,
//       license_number: '123',
//       merchant_name: '公司全称',
//       legal_person: '公司法人',
//       period_begin: '2024-06-05',
//       period_end: '长期',
//     },
//     certificate_info: {
//       cert_copy: null,
//       enc_cert_copy_image_id: null,
//       cert_copy_image_id: null,
//       cert_type: null,
//       cert_number: null,
//       merchant_name: null,
//       company_address: null,
//       legal_person: null,
//       period_begin: null,
//       period_end: null,
//     },
//     identity_info: {
//       id_holder_type: null,
//       id_doc_type: 'IDENTIFICATION_TYPE_IDCARD',
//       id_card_info: {
//         id_card_copy:
//           'V1_PJocQuHpO9KdIs85nUmv5x5NAfI0DmHZw73pDw8TJ4m_PeJnagPMaiWcjB0b2eoDDFCLAyYRXXTE843EpCIDl87hCQxYfQ9hsKcnyfisSnBL',
//         enc_id_card_copy_image_id: 'f3v9LMr6V8fPCt6D%2FuFZ%2BLywL9DKSq4A',
//         id_card_copy_image_id: 0,
//         id_card_national:
//           'V1_ZelitqlgitkLWpomawleeB5NAfI0DmHZixEyIHGONyApkFvmB_uMWiXblxwb2eoDDMx5kytRhYf1lLTrvy934RDhCQxYfQ9hsKcnyfisSnBL',
//         enc_id_card_national_image_id: 'f3v9LMr6V8fPCt6D%2FuFZ%2BLywL9DKSq4A',
//         id_card_national_image_id: 0,
//         id_card_name: '付建华',
//         id_card_number: '231027195710060021',
//         id_card_address: '河北省秦皇岛市经济技术开发区船厂路44栋1单元2号',
//         card_period_begin: '2020-11-11',
//         card_period_end: '2024-06-05',
//       },
//     },
//   },
//   business_info: {
//     merchant_shortname: '张三餐饮店',
//     sales_info: {
//       web_info: {
//         enc_web_authorisation_image_id: 'f3v9LMr6V8fPCt6D%2FuFZ%2BLywL9DKSq4A', //网站授权函ID
//         web_authorisation:
//           'V1_arQ5QM6pifGk5WW4QGgccx5NAfI0DmHZKk7E8YYCC1xJk_0tycFuoyW88GkzpekDDHyOTTB2D4u1CDdMpgfxiaHhCQxYfQ9hsKcnyfisSnBL', //网站授权函
//       },
//     },
//   },
//   bank_account_info: {
//     bank_account_type: 'BANK_ACCOUNT_TYPE_CORPORATE',
//     account_name: '开发区锦枫旅拍百货综合经营工作室',
//     account_bank: '中国银行',
//     bank_address_code: '310115',
//     account_number: '444269147490',
//   },
// };
export const transFormData = (data, form, setWeb_info) => {
  const { bank_account_info, business_info, subject_info, contact_info } = data;
  const { merchant_shortname, service_phone, sales_info } = business_info;
  const { bank_account_type, account_name, account_bank, bank_address_code, account_number } =
    bank_account_info;
  const { contact_type, contact_name, mobile_phone, contact_email } = contact_info;
  const {
    subject_type,
    business_license_info = {},
    certificate_info = {},
    identity_info = {},
  } = subject_info;
  const {
    enc_license_copy_image_id,
    license_copy,
    license_number,
    license_address,
    merchant_name,
    legal_person,
    period_begin,
    period_end,
  } = business_license_info;
  const { cert_copy = {}, cert_type, cert_number, company_address } = certificate_info;
  const { id_doc_type, id_card_info } = identity_info;
  const {
    // 身份证
    id_card_copy,
    enc_id_card_copy_image_id,
    id_card_national,
    enc_id_card_national_image_id,
    id_card_name,
    id_card_number,
    card_period_begin,
    card_period_end,
    id_card_address,
    //其他类型证件信息
    id_doc_copy,
    id_doc_copy_back, //若证件类型为护照，无需上传反面照片
    id_doc_name,
    id_doc_number,
    doc_period_begin,
    doc_period_end,
  } = id_card_info;
  const {
    web_info: { enc_web_authorisation_image_id, web_authorisation },
  } = sales_info;
  // setWeb_info({
  //   enc_image_id: enc_web_authorisation_image_id,
  //   media_id: web_authorisation,
  // });
  form.setFieldsValue({
    // 主体信息
    //主体信息差异字段
    license_copy: {
      media_id: license_copy,
      enc_image_id: enc_license_copy_image_id,
    },
    license_number,
    license_address,

    // cert_copy,
    // cert_type,
    // cert_number,
    // company_address,
    id_doc_type,
    // //-----身份证
    id_card_copy: {
      media_id: id_card_copy,
      enc_image_id: enc_id_card_copy_image_id,
    },
    id_card_national: {
      media_id: id_card_national,
      enc_image_id: enc_id_card_national_image_id,
    },
    id_card_name,
    id_card_number,
    id_card_address, //主体类型为企业时，需要填写
    card_period_begin,
    card_period_end,
    period_end_id_card_long: card_period_end === '长期' ? true : false, //判断是否是长期有效
    // // 非身份证 其他类型证件信息
    // id_doc_copy,
    // id_doc_copy_back,//若证件类型为护照，无需上传反面照片
    // id_doc_name,
    // id_doc_number,
    // id_doc_address,//主体类型为企业时，需要填写
    // doc_period_begin,
    // doc_period_end,
    // period_end_doc_long,//判断是否是长期有效
    // //主体信息公共字段
    subject_type,
    merchant_name,
    merchant_shortname,
    legal_person,
    period_begin,
    period_end,
    period_end_long: period_end === '长期' ? true : false, //判断是否是长期有效
    // web_info: {
    //     media_id: enc_web_authorisation_image_id,
    //     enc_image_id: enc_web_authorisation_image_id,
    // },
    // 超级管理员信息字段
    contact_type,
    contact_name,
    mobile_phone, //经营资料电话和客户电话共用一个
    contact_email,
    // 结算账户信息字段
    bank_account_type,
    account_name,
    account_bank,
    bank_address_code,
    account_number,
  });
};
