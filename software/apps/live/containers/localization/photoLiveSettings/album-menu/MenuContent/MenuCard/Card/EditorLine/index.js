import { template } from 'lodash';
import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import XButton from '@resource/components/XButton';
import { RcRadioGroup } from '@resource/components/XRadio';

import { guid } from '@resource/lib/utils/math';

import { UPLOAD_MODAL } from '@resource/lib/constants/modalTypes';

import { useMessage } from '@common/hooks';

import FInput from '@apps/live/components/FInput';
import { ALBUM_LIVE_IMAGE_URL } from '@apps/live/constants/api';
import { PhotoLiveSettingContext } from '@apps/live/context';
import {
  queryActivityInfo, // uploadFiles
  updateActivityInfo,
} from '@apps/live/services/photoLiveSettings';

// 引入编辑器组件
import Editor from '../Editor';

import { Bottom, Label, Line, Tip } from './layout';

const groupOptions = [
  {
    value: 'TEXT',
    label: '文章',
  },
  {
    value: 'LINK',
    label: '链接',
  },
];

function getModules({ handlerImage }) {
  return {
    toolbar: {
      container: [
        [
          'bold',
          'italic',
          'underline',
          'strike',
          { header: 1 },
          { header: 2 },
          { header: [1, 2, 3, 4, 5, 6, false] },
          { list: 'ordered' },
          { list: 'bullet' },
          { script: 'sub' },
          { script: 'super' },
          { indent: '-1' },
          { indent: '+1' },
          {
            color: [],
          },
          {
            background: [],
          },
          { align: [] },
          'link',
          'image',
          'clean',
          { size: ['small', 'large', 'huge'] },
        ],
      ],
      handlers: {
        image: handlerImage,
      },
    },
  };
}

const maxTextLength = 10000;
const maxImageLength = 20;
export default React.forwardRef((props, myRef) => {
  useImperativeHandle(myRef, () => ({
    onSave,
  }));
  const { task, data, save } = props;
  const { baseInfo, urls, boundGlobalActions } = useContext(PhotoLiveSettingContext);

  const baseUrl = urls.get('galleryBaseUrl');
  const editorRef = useRef(null);
  const [placeholder, msgContext] = useMessage();
  const [message, setMessage] = useState({
    visible: false,
    text: '',
  });
  const [formData, setFormData] = useState({
    name: task.name,
    menu_type: 'TEXT',
    linkUrl: '',
    activity_desc: ' ',
  });
  const [count, setCount] = useState({
    imageLen: 0,
    textLen: 0,
  });

  useEffect(() => {
    if (baseInfo) {
      queryInfo();
    }
  }, [baseInfo?.broadcast_id]);

  // 校验
  function verify() {
    const { menu_type, linkUrl } = formData;
    const text = editorRef.current?.getEditor()?.getText().trim() || '';
    const imgs = document.getElementById('editor')?.getElementsByTagName('img') || [];
    const imageLen = Array.from(imgs).length || 0;
    const textLen = text.length;
    if (menu_type !== 'TEXT' && !linkUrl.trim()) {
      setMessage({
        ...message,
        visible: true,
        text: `未填写链接`,
      });
      return false;
    }
    if (textLen > maxTextLength) {
      setMessage({
        ...message,
        visible: true,
        text: `保存失败，文字请控制在${maxTextLength}字`,
      });
      return false;
    }

    if (imageLen > maxImageLength) {
      setMessage({
        ...message,
        visible: true,
        text: `保存失败，图片上传请控制${maxImageLength}张图片`,
      });
      return false;
    }

    setMessage({
      ...message,
      visible: false,
    });
    return true;
  }
  // 保存按钮
  async function onSave() {
    const { menu_type, activity_desc, linkUrl, name } = formData;
    const { broadcast_id } = baseInfo;

    const params = {
      menu_type,
      activity_desc: menu_type === 'TEXT' ? activity_desc : linkUrl,
      broadcast_id,
      baseUrl,
    };
    data[task.id].name = name || task.name;
    const flag = verify();
    if (!flag) return;
    // save({ nextData: data });
    await updateActivityInfo(params);
    return data;
  }

  // 获取详情
  async function queryInfo() {
    const { broadcast_id } = baseInfo;
    const params = {
      baseUrl,
      id: broadcast_id,
    };
    const res = await queryActivityInfo(params);
    const { activity_desc, menu_type } = res;
    const initData = {
      menu_type: menu_type || 'TEXT',
    };
    if (initData.menu_type === 'TEXT') {
      initData.activity_desc = activity_desc ? activity_desc.trim() : '';
    } else {
      initData.linkUrl = activity_desc ? activity_desc.trim() : '';
    }
    setFormData({ ...formData, ...initData });
  }

  useEffect(() => {
    if (formData.menu_type !== 'TEXT') return;

    const text = editorRef.current.getEditor().getText().trim();
    const imgs = document.getElementById('editor').getElementsByTagName('img');
    const imageLen = Array.from(imgs).length;
    // console.log('imgs', imgs);
    setCount({
      textLen: text.length,
      imageLen: imageLen,
    });
  }, [formData.activity_desc, formData.menu_type]);

  function dataChange(key, value) {
    formData[key] = value;
    setFormData({ ...formData });
  }

  function editorChange(value) {
    // if(count.textLen > 100) return setFormData({ ...formData });
    formData['activity_desc'] = value;
    setFormData({ ...formData });
  }

  // 图片事件
  function handlerImage() {
    console.log('handlerImage::', editorRef);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg, image/jpg';
    input.click();
    input.addEventListener('change', async e => {
      const names = [];

      const files = Array.from(e.target.files).map(file => {
        file.guid = guid();

        names.push({ client_file_name: file.name });
        return { file };
      });
      // const url = URL.createObjectURL([files[0]]);
      // const img = new Image();
      // img.src = url;
      // img.onload = () => {
      //   debugger
      // }
      verifyImg(files[0].file)
        .then(() => {
          const params = {
            uploadFilesByS3: true,
            upload_filenames: names,
            uploadingImages: files,
            getUploadedImgs,
          };
          boundGlobalActions.showModal(UPLOAD_MODAL, params);
        })
        .catch(() => {
          msgContext.error(`图片上传失败，图片宽高 不超过4096px，大小在20MB以内`);
        });
    });
  }

  // 校验图片信息
  function verifyImg(file) {
    return new Promise((resolve, reject) => {
      const size = file.size / 1024 / 1024;
      if (size > 20) {
        reject();
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(reader.result);
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          if (img.width > 4096) {
            reject();
            return;
          }
          resolve();
        };
      };
    });
  }

  // 文件上传回调
  function getUploadedImgs(successInfo) {
    const { upload_complete } = successInfo;
    const { enc_image_id } = upload_complete[0].image_data;
    const index = editorRef.current.getEditor().getSelection().index;
    const url = template(ALBUM_LIVE_IMAGE_URL)({ baseUrl, enc_image_id, size: 1 });
    editorRef.current.getEditor().insertEmbed(index, 'image', url);
  }

  const modules = useMemo(() => {
    const opts = getModules({ handlerImage });
    return opts;
  }, []);

  return (
    <>
      <Line>
        <Label>自定义名称</Label>
        <div className="input" style={{ width: 256 }}>
          <FInput
            value={formData.name}
            onChange={({ target: { value } }) => dataChange('name', value)}
            max={20}
            placeholder={task.name}
          />
        </div>
      </Line>
      <Line>
        <Label>菜单类型</Label>
        <RcRadioGroup
          wrapperClass="znoRadio"
          onChange={({ target: { value } }) => dataChange('menu_type', value)}
          value={formData.menu_type}
          options={groupOptions}
        />
      </Line>
      <Line className="block">
        {formData.menu_type === 'LINK' ? (
          <>
            <Label style={{ width: '346px', lineHeight: '20px', marginBottom: 10 }}>
              链接 (设置官网或商品链接，观众点击菜单即跳转，建议不要排在首个菜单)
            </Label>
            <FInput
              value={formData.linkUrl}
              onChange={({ target: { value } }) => dataChange('linkUrl', value)}
              style={{ width: 375 }}
              placeholder="链接需要以http://或https://开头"
            />
          </>
        ) : (
          <>
            <Label style={{ lineHeight: '20px', marginBottom: 10 }}>文字内容</Label>
            <Editor
              value={formData.activity_desc}
              placeholder="请输入文章内容"
              theme="snow"
              id="editor"
              onChange={editorChange}
              modules={modules}
              ref={editorRef}
            />
            <Label
              style={{ lineHeight: '20px', marginBottom: 10, marginTop: 10 }}
            >{`文字：${count.textLen}/${maxTextLength}，图片：${count.imageLen}/${maxImageLength}`}</Label>
          </>
        )}
        {message.visible ? <div style={{ color: 'red' }}>{message.text}</div> : null}
      </Line>

      {/* <Bottom>
        <XButton width={200} height={40} onClick={onSave}>
          保存
        </XButton>
      </Bottom> */}
      {formData.menu_type === 'TEXT' ? (
        <Tip>
          <div className="label">小技巧：</div>
          <div className="textContent">
            <p>1. 可用作活动简介、流程展示、嘉宾介绍等 </p>
            <p>2. 拍摄开始前，建议将本菜单排序至首位 </p>
            <p>{`3. 最多输入${maxTextLength}字、上传${maxImageLength}张图片，图片宽高 不超过4096px，大小在20MB以内`}</p>
          </div>
        </Tip>
      ) : null}
      {placeholder}
    </>
  );
});
