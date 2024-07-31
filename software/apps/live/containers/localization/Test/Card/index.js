import React, { forwardRef, useEffect, useRef, useState } from 'react';

import ImageBox from '@apps/live/components/FImageBox';
import IconUpload from '@apps/live/components/Icons/IconUpload';
import { uploadPhotoFiles } from '@apps/live/services/photoLiveSettings';

import { Card, Container, Images, Text } from './layout';

function getId() {
  return Math.random().toString(16).slice(2);
}

const fileTypes = ['image/jpg', 'image/png', 'image/jpeg'];
export default forwardRef(UploadCard);
function UploadCard(props) {
  const cardRef = useRef(null);
  const { baseUrl, baseInfo } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    ['dragenter', 'dragover', 'dragleave'].forEach(name => {
      cardRef.current.addEventListener(name, e => {
        e.preventDefault();
        e.stopPropagation();
        const type = e.type;
        if (type === 'dragenter' || type === 'dragover') {
          cardRef.current.classList.add('highlighted');
        } else if (type === 'dragleave') {
          cardRef.current.classList.remove('highlighted');
        }
      });
    });
  }, []);
  useEffect(() => {
    cardRef.current.ondrop = handleDrop;
  }, [data, baseInfo]);

  async function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    cardRef.current.classList.remove('highlighted');
    const dt = e.dataTransfer;
    const names = [];
    const files = Array.from(dt.files)
      .filter(file => fileTypes.includes(file.type))
      .map(file => {
        names.push({ client_file_name: file.name });
        return file;
      });
    const params = {
      baseUrl,
      files,
      id: baseInfo?.enc_album_id,
    };
    const promises = await uploadPhotoFiles(params);
    const newData = promises.map(p => {
      return {
        key: getId(),
        imageId: p,
      };
    });
    setData([...data, ...newData]);
  }

  function onLoad(options) {
    const { key, result } = options;

    const index = data.findIndex(item => item.key === key);
    data[index].imageId = result[0].image_data.enc_image_id;
    setData([...data]);
  }

  function upload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.click();
    input.addEventListener('change', async e => {
      const files = e.target.files;
      const params = {
        baseUrl,
        files,
        id: baseInfo?.enc_album_id,
      };
      const promises = await uploadPhotoFiles(params);
      const newData = promises.map(p => {
        return {
          key: getId(),
          imageId: p,
        };
      });
      setData([...data, ...newData]);
    });
  }
  return (
    <Container>
      <Card ref={cardRef} onClick={upload}>
        <IconUpload fill="#1296db" style={{ width: '20px' }} />
        <div className="card_text">点击上传 / 或拖拽到此区域</div>
      </Card>
      <Images>
        {data.map((item, index) => {
          return (
            <ImageBox
              index={item.key || item.imageId}
              key={item.key || item.imageId}
              onLoad={onLoad}
              status="loading"
              code={item.imageId}
              baseUrl={baseUrl}
              size={4}
              style={{ marginRight: 18, marginTop: 18 }}
              delay={index}
              isAnimated
            />
          );
        })}
      </Images>
    </Container>
  );
}
