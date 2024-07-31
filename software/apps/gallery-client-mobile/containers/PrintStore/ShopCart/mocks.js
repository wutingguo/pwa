export default {
  cartDataDoc: {
    //收件信息
    shipping: {
      //收件地址
      address: {
        id: 576831,
        email: '',
        full_name: 'y222134567 xy123',
        phone_number: '1',
        street1: '1',
        street2: '',
        city: '1',
        sub_country: '22222',
        zip_or_postal_code: '1',
        country: 'Turkey',
        sub_city: '',
        town: null,
        valid: true,
        cert_id: '22222222222',
        document: ''
      },
      //物流方式
      method: {
        id: 200300,
        code: 'FES'
      }
    },
    //货币信息（保留，前期先写死）,货币精度
    currency: {
      rate: '1.00',
      code: 'USD',
      symbol: '$'
    },
    //购物车价格信息，价格精度跟据货币来
    price: {
      //商品总价(原价，折扣前价格)
      item_total: '160.20',
      //商品折扣总额(在商品上的促销折扣，区别于购物车满减)
      item_discount: '0.30',
      //购物车商品整体折扣价(购物车级别的满减，不包含商品折扣)
      subtotal_discount: '0.00',
      //购物车商品整体优惠金额=item_discount + subtotal_discount
      total_discount: '0.30',
      //购物车商品实付金额=item_total-total_discount
      total_money: '159.90',

      //购物车纳税金额
      tax: '1.00',

      //运费折扣
      shipping_discount: '1.00',
      //购物车实际运费
      shipping_fee: '10.08',

      //购物车实际支付金额=total_money+tax+shippingFee
      payable_amount: '169.98'
    },
    cart_items: [
      {
        //供应商id
        supplier_id: 1,
        supplier_code: 'ZNO',
        //商品大类信息
        std_spu_info: {
          spu_name: 'Flush Mount Album',
          spu_code: 'PB_FMA',
          category_code: 'PB',
          thumbnail_image: 'https://www.zno.com/a.jpg',

          //商品价格汇总信息
          //商品原价，折扣前价格
          unit_price: '1.20',
          //商品折扣后价格
          sale_price: '0.90',
          //商品折扣后总金额
          total_price: '0.90',
          //商品折扣总金额
          total_discount: '0.30'
        },

        //商品明细
        //book结构： item_detail内只有一个对象，此对象中有一个book main_sku, n个 add_on_sku（烫金、加页...）
        //prints结构：item_detail内包含N个对象，每个对象有一个print main_sku，n个（烫金、圆角...）
        item_details: [
          {
            //主sku
            main_sku: {
              item_id: 2869446,
              //产品类型：1: project 2: 标品sku
              item_target_type: 2,
              //project id
              project_id: 1,
              //显示顺序
              item_index: 0,
              //显示名称
              display_name:
                '(Square) 6x6" / 15x15cm Flush Mount Album (Paper Cover, Lustre Print, Standard Page)',
              //封面图片由前端生成，跟据item_target_type来动态生成，有project就使用下面的规则拼URL，标品使用spu的thumbnail_image
              // ---"cover_img_url": "https://upload.zno.com.t/upload/servlet/ProofBookCoverServlet?projectId=2181507&coverType=frontCover&sizeType=3&mode=shoppingCartMode&random=1663745520911&targetSize=184",
              //是否已下线
              is_offline: false,
              //已选中，默认选中
              item_checked: true,
              //商品数量
              quantity: 1,
              //最小购买数量,默认1
              min_qty: 1,
              //是否能修改数量
              can_change_qty: false,

              //商品原价，折扣前价格
              unit_price: '1.20',
              //商品折扣后价格
              sale_price: '0.90',
              //商品折扣后总金额
              total_price: '0.90',
              //商品折扣总金额
              total_discount: '0.30'
            },
            //附属sku
            add_on_sku: [
              {
                item_id: 0,
                //产品类型：1: project 2: 标品sku
                item_target_type: 2,
                project_id: 1,
                //顺序
                item_index: 0,
                //显示名称
                display_name: 'Add page',
                //是否已下线
                is_offline: false,
                //已选中，默认选中
                item_checked: true,
                //商品数量
                quantity: 1,
                //最小购买数量
                min_qty: 1,
                //是否能修改数量
                can_change_qty: false,
                //商品原价，折扣前价格
                unit_price: '1.20',
                //商品折扣后价格
                sale_price: '0.90',
                //商品折扣后总金额
                total_price: '0.90',
                //商品折扣总金额
                total_discount: '0.30'
              },
              {}
            ]
          }
          // ...
          // {}
        ]
      },
      {
        //供应商id
        supplier_id: 1,
        supplier_code: 'ZNO',
        //商品大类信息
        std_spu_info: {
          spu_name: 'Standard Photo Print',
          spu_code: 'PB_FMA',
          category_code: 'PB',
          thumbnail_image: 'https://www.zno.com/a.jpg',

          //商品价格汇总信息
          //商品原价，折扣前价格
          unit_price: '1.20',
          //商品折扣后价格
          sale_price: '0.90',
          //商品折扣后总金额
          total_price: '0.90',
          //商品折扣总金额
          total_discount: '0.30'
        },

        //商品明细
        //book结构： item_detail内只有一个对象，此对象中有一个book main_sku, n个 add_on_sku（烫金、加页...）
        //prints结构：item_detail内包含N个对象，每个对象有一个print main_sku，n个（烫金、圆角...）
        item_detail: [
          {
            //主sku
            main_sku: {
              item_id: 2869446,
              //产品类型：1: project 2: 标品sku
              item_target_type: 2,
              //project id
              project_id: 1,
              //显示顺序
              item_index: 0,
              //显示名称
              display_name: 'Standard Photo Print',
              //封面图片由前端生成，跟据item_target_type来动态生成，有project就使用下面的规则拼URL，标品使用spu的thumbnail_image
              // ---"cover_img_url": "https://upload.zno.com.t/upload/servlet/ProofBookCoverServlet?projectId=2181507&coverType=frontCover&sizeType=3&mode=shoppingCartMode&random=1663745520911&targetSize=184",
              //是否已下线
              is_offline: false,
              //已选中，默认选中
              item_checked: true,
              //商品数量
              quantity: 1,
              //最小购买数量,默认1
              min_qty: 1,
              //是否能修改数量
              can_change_qty: false,

              //商品原价，折扣前价格
              unit_price: '1.20',
              //商品折扣后价格
              sale_price: '0.90',
              //商品折扣后总金额
              total_price: '0.90',
              //商品折扣总金额
              total_discount: '0.30'
            },
            //附属sku
            add_on_sku: [
              {
                item_id: 0,
                //产品类型：1: project 2: 标品sku
                item_target_type: 2,
                project_id: 1,
                //顺序
                item_index: 0,
                //显示名称
                display_name: 'Add page',
                //是否已下线
                is_offline: false,
                //已选中，默认选中
                item_checked: true,
                //商品数量
                quantity: 1,
                //最小购买数量
                min_qty: 1,
                //是否能修改数量
                can_change_qty: false,
                //商品原价，折扣前价格
                unit_price: '1.20',
                //商品折扣后价格
                sale_price: '0.90',
                //商品折扣后总金额
                total_price: '0.90',
                //商品折扣总金额
                total_discount: '0.30'
              },
              {}
            ]
          },
          {
            //主sku
            main_sku: {
              item_id: 2869446,
              //产品类型：1: project 2: 标品sku
              item_target_type: 2,
              //project id
              project_id: 1,
              //显示顺序
              item_index: 0,
              //显示名称
              display_name: 'Standard Photo Print',
              //封面图片由前端生成，跟据item_target_type来动态生成，有project就使用下面的规则拼URL，标品使用spu的thumbnail_image
              // ---"cover_img_url": "https://upload.zno.com.t/upload/servlet/ProofBookCoverServlet?projectId=2181507&coverType=frontCover&sizeType=3&mode=shoppingCartMode&random=1663745520911&targetSize=184",
              //是否已下线
              is_offline: false,
              //已选中，默认选中
              item_checked: true,
              //商品数量
              quantity: 1,
              //最小购买数量,默认1
              min_qty: 1,
              //是否能修改数量
              can_change_qty: false,

              //商品原价，折扣前价格
              unit_price: '1.20',
              //商品折扣后价格
              sale_price: '0.90',
              //商品折扣后总金额
              total_price: '0.90',
              //商品折扣总金额
              total_discount: '0.30'
            },
            //附属sku
            add_on_sku: [
              {
                item_id: 0,
                //产品类型：1: project 2: 标品sku
                item_target_type: 2,
                project_id: 1,
                //顺序
                item_index: 0,
                //显示名称
                display_name: 'Add page',
                //是否已下线
                is_offline: false,
                //已选中，默认选中
                item_checked: true,
                //商品数量
                quantity: 1,
                //最小购买数量
                min_qty: 1,
                //是否能修改数量
                can_change_qty: false,
                //商品原价，折扣前价格
                unit_price: '1.20',
                //商品折扣后价格
                sale_price: '0.90',
                //商品折扣后总金额
                total_price: '0.90',
                //商品折扣总金额
                total_discount: '0.30'
              },
              {}
            ]
          }
          // ...
          // {}
        ]
      }
    ]
  },
  cartData: {
    price: {
      item_total: 344.4,
      item_discount: 0,
      subtotal_discount: 0,
      total_discount: 0,
      total_money: 344.4,
      tax: 0,
      shipping_discount: 1,
      shipping_fee: 15.08,
      payable_amount: 359.48
    },
    currency: { rate: 1.0, code: 'USD', symbol: '$' },
    shipping: { address: null, method: { method_id: 92, method_code: 'FES' } },
    cart_items: [
      {
        supplier_id: 1,
        supplier_code: 'ZNO',
        std_spu_info: {
          target_item_display_name: 'Untitled',
          spu_name: 'Fine Art Album',
          spu_code: 'PB_FINE_ART_ALBUM',
          category_code: 'PB_FINE_ART_ALBUM',
          parent_category_code: 'PB',
          thumbnail_image: null,
          quantity: 1,
          unit_price: 276.0,
          sale_price: 276.0,
          discount: 0,
          total_discount: 0,
          total_sale_price: 276.0,
          total_unit_price: 276.0
        },
        cart_item_id: 106,
        disabled: true,
        item_details: [
          {
            main_sku: {
              item_id: 106,
              item_target_type: 1,
              project_id: 527,
              item_index: null,
              display_name: 'Fine Art Album,(Square) 10x10",Linen,(Plush)Black',
              is_offline: false,
              item_checked: true,
              quantity: 1,
              min_qty: 1,
              can_change_qty: false,
              unit_price: 276.0,
              sale_price: 276.0,
              total_discount: 0,
              total_sale_price: 276.0,
              total_unit_price: 276.0
            },
            add_on_sku: []
          }
        ]
      },
      {
        supplier_id: 1,
        supplier_code: 'ZNO',
        std_spu_info: {
          target_item_display_name: 'Untitled',
          spu_name: 'Canvas Gallery Wrap',
          spu_code: 'WA_CANVASPRINT',
          category_code: 'WA_CANVASPRINT',
          parent_category_code: 'WA',
          thumbnail_image: null,
          quantity: 1,
          unit_price: 66.0,
          sale_price: 66.0,
          discount: 0,
          total_discount: 0,
          total_sale_price: 66.0,
          total_unit_price: 66.0
        },
        cart_item_id: 105,
        disabled: true,
        item_details: [
          {
            main_sku: {
              item_id: 105,
              item_target_type: 1,
              project_id: 525,
              item_index: null,
              display_name: 'Canvas Gallery Wrap,8x10',
              is_offline: false,
              item_checked: true,
              quantity: 1,
              min_qty: 1,
              can_change_qty: false,
              unit_price: 66.0,
              sale_price: 66.0,
              total_discount: 0,
              total_sale_price: 66.0,
              total_unit_price: 66.0
            },
            add_on_sku: []
          }
        ]
      },
      {
        supplier_id: 1,
        supplier_code: 'ZNO',
        std_spu_info: {
          target_item_display_name: 'Untitled',
          spu_name: 'Standard Photo Print',
          spu_code: 'PP_STANDARD_PHOTO',
          category_code: 'PP_STANDARD_PRINT',
          parent_category_code: 'PP',
          thumbnail_image: null,
          quantity: 1,
          unit_price: 2.4,
          sale_price: 2.4,
          discount: 0,
          total_discount: 0,
          total_sale_price: 2.4,
          total_unit_price: 2.4
        },
        cart_item_id: 88,
        disabled: false,
        item_details: [
          {
            main_sku: {
              item_id: 88,
              item_target_type: 1,
              project_id: 483,
              item_index: null,
              display_name: 'Standard Photo Print,4x6",Matte',
              is_offline: false,
              item_checked: true,
              quantity: 4,
              min_qty: 1,
              can_change_qty: false,
              unit_price: 0.6,
              sale_price: 0.6,
              total_discount: 0,
              total_sale_price: 2.4,
              total_unit_price: 2.4
            },
            add_on_sku: []
          }
        ]
      }
    ]
  }
};
