import React, { useEffect, useState } from 'react';

import { XLoading } from '@common/components';

import { getDownloadUrl } from '@apps/live-photo-client/utils/helper';
import RadioImage from '@apps/live/components/RadioImage';
import { getLiveSkinList, get_skin_category_list } from '@apps/live/services/photoLiveSettings';

import src001 from './images/001.jpg';
import src002 from './images/002.jpg';
import src003 from './images/003.jpg';
import src004 from './images/004.jpg';
import src005 from './images/005.jpg';
import src006 from './images/006.jpg';
import src007 from './images/007.jpg';
import src01 from './images/01.jpg';
import src02 from './images/02.jpg';
import src03 from './images/03.jpg';
import src04 from './images/04.jpg';
import src05 from './images/05.jpg';
import src06 from './images/06.jpg';
import src07 from './images/07.jpg';
import { Container, Item, ScrollList, SkinCategory } from './layout';

// function getInitImg(id) {
//   const list = [
//     {
//       src: src01,
//       toggleSrc: src001,
//     },
//     {
//       src: src02,
//       toggleSrc: src002,
//     },
//     {
//       src: src03,
//       toggleSrc: src003,
//     },
//     {
//       src: src04,
//       toggleSrc: src004,
//     },
//     {
//       src: src05,
//       toggleSrc: src005,
//     },
//     {
//       src: src06,
//       toggleSrc: src006,
//     },
//     {
//       src: src07,
//       toggleSrc: src007,
//     },
//   ];
//   switch (id) {
//     case 1:
//       return list[0];
//     case 2:
//       return list[1];
//     case 3:
//       return list[2];
//     case 4:
//       return list[3];
//     case 5:
//       return list[4];
//     case 6:
//       return list[5];
//     case 7:
//       return list[6];
//     default:
//       return list[0];
//   }
// }

export default function DefaultContent(props) {
  const { baseUrl, value, onChange, changeDefaultCount } = props;
  const [data, setData] = useState([]);
  const [overlay, setOverlay] = useState(null);

  // 皮肤分类列表
  const [skinCategoryList, setSkinCategoryList] = useState([]);
  // 选中的分类
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  // loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSkinCategoryList();
  }, []);

  /**
   * 获取皮肤分类列表
   */
  async function getSkinCategoryList() {
    try {
      const params = { baseUrl };
      const res = await get_skin_category_list(params);
      setSkinCategoryList(res);
      // 存在默认值
      if (value?.skin_category?.id) {
        const { id } = value.skin_category;
        setSelectedCategoryId(id);
        getSkinList(id);
      } else if (res?.length > 0) {
        // 不存在，默认显示第一个分类
        const { id } = res[0];
        setSelectedCategoryId(id);
        getSkinList(id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function getInitImg(item) {
    const { preview_image, hover_preview_image } = item;
    const src = getDownloadUrl({ baseUrl, enc_image_uid: preview_image, size: 1 });
    const toggleSrc = getDownloadUrl({ baseUrl, enc_image_uid: hover_preview_image, size: 1 });
    return {
      src,
      toggleSrc,
    };
  }

  function onCheckChange(key) {
    const obj = data.find(item => item.album_skin_id === key);
    onChange && onChange(obj);
  }

  async function getSkinList(id) {
    const params = {
      baseUrl,
      type: 0,
      skin_category_id: id,
    };
    setLoading(true);
    try {
      const res = await getLiveSkinList(params);
      const list = res?.skin_items?.map(item => {
        const obj = getInitImg(item);

        return {
          ...item,
          ...obj,
        };
      });
      setData(list);
      changeDefaultCount(res?.total); // 总数量
      // console.log('list', list);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  function onMouseMove(e, src) {
    const { top, left, width } = e.target.getBoundingClientRect();
    setOverlay({
      style: {
        top,
        left: left + width + 10,
      },
      toggleSrc: src,
    });
  }
  function onMouseOut() {
    setOverlay(null);
  }

  /**
   * 切换分类事件
   * @param {Object} item 分类项信息
   */
  function changeSkinCategory(item) {
    const { id } = item;
    setSelectedCategoryId(id);
    getSkinList(id);
  }

  return (
    <Container>
      {/* loading */}
      <XLoading type="imageLoading" backgroundColor="transparent" isShown={loading} />
      {/* 皮肤分类 */}
      <SkinCategory>
        {skinCategoryList.map(item => (
          <Item
            key={item.id}
            active={item.id === selectedCategoryId}
            onClick={() => changeSkinCategory(item)}
          >
            {item.category_name}
          </Item>
        ))}
      </SkinCategory>
      <ScrollList>
        {data.map(item => {
          return (
            <RadioImage
              onChange={onCheckChange}
              imgStyle={{ width: 150 }}
              key={item.key}
              src={item.src}
              checked={value.album_skin_id === item.album_skin_id}
              text={item.album_skin_name}
              value={item.album_skin_id}
              style={{ display: 'inline-block', marginRight: 16 }}
              onMouseMove={e => onMouseMove(e, item.toggleSrc)}
              onMouseOut={e => onMouseOut(e, item.toggleSrc)}
            />
          );
        })}
      </ScrollList>
      {overlay ? (
        <div className="overlay_box" style={overlay?.style}>
          <img src={overlay?.toggleSrc} width={180} />
        </div>
      ) : null}
    </Container>
  );
}
