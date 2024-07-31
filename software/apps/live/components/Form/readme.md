## Form组件的基本使用

- Form组件属性属性
| 名称     | 类型     | 描述                         | 枚举值             |
| -------- | -------- | ---------------------------- | ------------------ |
| form     | object   | form表单对象                 | object或 undefined |
| layout   | string   | 控制表单布局的默认是水平布局 | v或h               |
| onFinish | Function | 表单提交成功回调             |                    |


- Field组件属性属性
| 名称         | 类型    | 描述                       | 枚举值      |
| ------------ | ------- | -------------------------- | ----------- |
| name         | string  | 对象字段名称               |             |
| label        | string  | 表单label字段名称          |             |
| required     | boolean | 是否显示必填*符号          | true或false |
| rules        | array   | 校验规则，支持多个校验规则 |             |
| defaultValue | any     | 表单字段的默认值           |             |

- form对象中的方法使用
| 名称             | 类型                               | 描述                                           | 枚举值 |
| ---------------- | ---------------------------------- | ---------------------------------------------- | ------ |
| getFieldValue    | (name) => value或null              | 获取表单的某个字段                             |        |
| resetFieldsValue | (array[name] 或 undefined) => void | 重置表单某个字段，不传的重置所有绑定的表单字段 |        |
| setFieldValue    | (name, value) => value             | 设置表单的某个字段                             |        |
| setFieldsValue   | (object) => void                   | 设置表单多个字段                               |        |

### 简单用法
  
```js

import React from 'react';
import Form, { Field, useForm } from '@apps/live/components/Form';


function Dome() {
    const [form] = useForm();

    // 这是表单成功回调
    function onFinish(values) {
        console.log(values); // {name01: undefined, description: undefined}
    }
    return <Form form={form} onFinish={onFinish}>
        <Field label='名称' name='name01' rules={{ required: true, message: 'name01不能为空！' }}>
            <input />
        </Field>
        <Field label='描述' name='description'>
            <input />
        </Field>
        <button type='submit' value='提交' />
    </Form>
}
```

### 自定义提交
  
```js

import React from 'react';
import Form, { Field, useForm } from '@apps/live/components/Form';


function Dome() {
    const [form] = useForm();
    const formRef = useRef(null);
    // 这是表单成功回调
    function onFinish(values) {
        console.log(values); // {name01: undefined, description: undefined}
    }

    // 提交事件
    function submit() {
        formRef.current.submit();
    }
    return <div>
        <Form ref={formRef} form={form} onFinish={onFinish}>
            <Field label='名称' name='name01' rules={{ required: true, message: 'name01不能为空！' }}>
                <input />
            </Field>
            <Field label='描述' name='description'>
                <input />
            </Field>
        </Form>
        <div>
            <button type='button' onClick={submit} value='提交' />
        </div>
    </div>
}
```

### 自定义表单组件
  
```js

import React from 'react';
import Form, { Field, useForm } from '@apps/live/components/Form';

// 自定表单组件
function Input(props) {
    const {value, onChange} = props;

    return <div className=''>
        <input style={{}} value={value} onChange={onChange} />
    </div>
}

// 样例一
function Dome1() {
     const [form] = useForm();
    const formRef = useRef(null);
    // 这是表单成功回调
    function onFinish(values) {
        console.log(values); // {name01: undefined, description: undefined}
    }

    // 提交事件
    function submit() {
        formRef.current.submit();
    }
    return <div>
        <Form ref={formRef} form={form} onFinish={onFinish}>
            <Field label='名称' name='name01' rules={{ required: true, message: 'name01不能为空！' }}>
                <Input />
            </Field>
            <Field label='描述' name='description'>
                <Input />
            </Field>
        </Form>
        <div>
            <button type='button' onClick={submit} value='提交' />
        </div>
    </div>
};

// 样例二
function Dome2() {
    const [form] = useForm();
    const formRef = useRef(null);
    // 这是表单成功回调
    function onFinish(values) {
        console.log(values); // {name01: undefined, description: undefined}
    }

    // 提交事件
    function submit() {
        formRef.current.submit();
    }
    return <div>
        <Form ref={formRef} form={form} onFinish={onFinish}>
            <Field label='名称' name='name01' rules={{ required: true, message: 'name01不能为空！' }}>
                (value, onChange, {message, name}) => {
                    return <input onChange={onChange} value={value} />
                }
            </Field>
            <Field label='描述' name='description'>
                <Input />
            </Field>
        </Form>
        <div>
            <button type='button' onClick={submit} value='提交' />
        </div>
    </div>
};

```


### 自定义校验
  
```js

import React from 'react';
import Form, { Field, useForm } from '@apps/live/components/Form';


function Dome() {
    const [form] = useForm();
    const formRef = useRef(null);
    // 这是表单成功回调
    function onFinish(values) {
        console.log(values); // {name01: undefined, description: undefined}
    }

    // 提交事件
    function submit() {
        formRef.current.submit();
    }

    // 自定义验证
    function desValiditor(value) {
        // 只有返回true才算验证成功
        if(value !== '你很帅') {
            return false;
        }
        return true;
    }
    return <div>
        <Form ref={formRef} form={form} onFinish={onFinish}>
            <Field label='名称' name='name01' rules={{ required: true, message: 'name01不能为空！' }}>
                <input />
            </Field>
            <Field label='描述' name='description' rules={{validitor: desValiditor, message: '描述内容不正确'}}>
                <input />
            </Field>
        </Form>
        <div>
            <button type='button' onClick={submit} value='提交' />
        </div>
    </div>
}
```

### 给表单字段赋值
  
```js
import React, {useEffect} from 'react';
import Form, { Field, useForm } from '@apps/live/components/Form';


function Dome() {
    const [form] = useForm();

    // 这是表单成功回调
    function onFinish(values) {
        console.log(values); // {name01: fanfan, description: 这是一段描述}
    }

    useEffect(() => {
        // 模拟一下异步赋值
        setTimeout(() =>{
             form.setFieldsValue({name01: 'fanfan', description: '这是一段描述',});
        }, 3000);
    }, []);

    return <Form form={form} onFinish={onFinish}>
        <Field label='名称' name='name01' rules={{ required: true, message: 'name01不能为空！' }}>
            <input />
        </Field>
        <Field label='描述' name='description'>
            <input />
        </Field>
        <button type='submit' value='提交' />
    </Form>
}
```

### 功能完善中。。。