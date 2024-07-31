import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import useMessage from '@common/hooks/useMessage';

// import { uploadFiles } from '@apps/live/services/photoLiveSettings';
import { XFileUpload } from '@common/components';

import ImageBox from '@apps/live/components/FImageBox';
import Add from '@apps/live/components/Icons/Add';
import { PhotoLiveSettingContext } from '@apps/live/context';

import HandleInput from '../HandleInput';

import { Box, Card, Container, Images, Text } from './layout';

function getId() {
  return Math.random().toString(16).slice(2);
}

export default forwardRef(UploadCard);
function UploadCard(props, ref) {
  const cardRef = useRef(null);
  const { baseUrl, defaultValue, saveUrl, intl } = props;
  const [data, setData] = useState(defaultValue || []);
  const { boundGlobalActions } = useContext(PhotoLiveSettingContext);
  const [placeholder, message] = useMessage();

  useImperativeHandle(ref, () => ({
    getValue,
  }));

  // 获取图片id值字符
  function getValue() {
    const value = data
      .filter(item => item.imageId !== null)
      .reduce((pre, item, index) => {
        if (index === 0) {
          return (pre += item.imageId);
        }
        return (pre += ',' + item.imageId);
      }, '');

    return value;
  }

  useEffect(() => {
    if (!defaultValue) return;
    setData(defaultValue);
  }, [defaultValue]);

  // 删除回调
  function onRemove(key) {
    const i = data.findIndex(item => item.key === key || item.imageId === key);

    // console.log('key', key);
    // console.log('data', data);
    data.splice(i, 1);
    setData([...data]);
  }

  // 文件上传回调
  function getUploadedImgs(successInfo) {
    const { upload_complete } = successInfo;
    const filedata = upload_complete.map(file => ({
      imageId: file.image_data.enc_image_id,
      orientation: Number(file.image_data.exif_orientation) || 0,
      key: getId(),
    }));
    setData(d => [...d, ...filedata]);
  }

  // 文件上传前回调
  function beforeUpload(files) {
    const len = files.length + data.length;
    if (len > 6) {
      message.error(intl.tf('LP_UPLOAD_FAILED_UP_TO_6_IMAGES_ARE_SUPPORTED'));
      return false;
    }
    return true;
  }

  // drop事件回调
  function onDrop({ source, target }) {
    setData(d => {
      const sourceIndex = d.findIndex(item => item.imageId === source);
      const targetIndex = d.findIndex(item => item.imageId === target);
      if (sourceIndex !== -1 && targetIndex !== -1) {
        const sourceData = d.splice(sourceIndex, 1)[0];
        d.splice(targetIndex, 0, sourceData);
        return [...d];
      }
      // console.log(sourceIndex, targetIndex);
      return d;
    });
  }

  async function urlChange(visible, value, index) {
    const { imageId } = data[index] || {};
    data[index].banner_ext_url = value;
    data[index].isOpen = visible;

    if (!visible) {
      const params = {
        image_id: imageId,
        external_url: value,
      };
      try {
        await saveUrl(params);
      } catch (error) {
        console.error(error);
      }
    }

    setData([...data]);
  }

  const fileUploadProps = {
    multiple: true,
    inputId: 'banner',
    isIconShow: false,
    uploadFilesByS3: true,
    isDropFile: true,
    getUploadedImgs,
    showModal: boundGlobalActions.showModal,
    maxUploadFileNums: 6,
    beforeUpload,
    values: data,
  };
  return (
    <Container>
      <Card ref={cardRef}>
        <XFileUpload {...fileUploadProps}>
          <Add fill="#1296db" style={{ width: '20px' }} />
          <div className="card_text">{intl.tf('LP_BANNER_BTN_TEXT')}</div>
        </XFileUpload>
      </Card>
      <Text>{intl.tf('LP_UPLOAD_BANNER_MESSAGE')}</Text>
      {intl.lang !== 'cn' ? <Text>The banner displays at the top of the gallery.</Text> : null}
      <Images>
        {data.map((item, index) => (
          <Box>
            <ImageBox
              onRemove={onRemove}
              index={item.key || item.imageId}
              key={item.key || item.imageId}
              // onLoad={onLoad}
              status="loading"
              code={item.imageId}
              baseUrl={baseUrl}
              size={4}
              style={{ marginRight: 18, marginTop: 18, marginLeft: 0 }}
              delay={index}
              isAnimated
              onDrop={onDrop}
              draggable
              orientation={item.orientation}
            />
            <HandleInput
              value={item.banner_ext_url || ''}
              open={item.isOpen}
              onChange={(visible, value) => urlChange(visible, value, index)}
              label={intl.tf('LP_BANNER_URL')}
              intl={intl}
            />
          </Box>
        ))}
      </Images>
      {placeholder}
    </Container>
  );
}
