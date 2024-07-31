import { useEffect, useState, useRef } from 'react';
/**
 *
 * @param {(Array | Promise))} data Promise 暂未实现
 * @param {Object} options
 * @param {string} [imageBoxHeightKey = 'imageBoxHeight'] options.imageBoxHeightKey
 * @param {string} [imageBoxWidthKey = 'imageBoxWidth'] options.imageBoxWidthKey
 * @param {string} [imageBoxWidthKey = 'imageWidth'] options.imageBoxWidthKey
 * @param {string} [imageHeightKey = 'imageHeight'] options.imageHeightKey
 * @param {string} [imageBoxleftkey = 'left'] options.imageBoxleftkey
 * @param {string} [imageBoxtopkey = 'top'] options.imageBoxtopkey
 * @param {Element | string | Object} [root = document.body] options.root
 * @param {number} [space = 0] options.space
 * @param {Array} [depend = []] options.depend 依赖更新会重新计算布局（diff）
 *
 * @returns {Array} config
 */

const defaultElementWidth = 360;
const defaultWidth = 720;

export default function useWaterfall(data, options) {
  const {
    imageBoxHeightKey = 'imageBoxHeight',
    imageBoxWidthKey = 'imageBoxWidth',
    imageWidthKey = 'imageWidth',
    imageHeightKey = 'imageHeight',
    imageBoxleftkey = 'left',
    imageBoxtopkey = 'top',
    root = document.body,
    space = 0,
    depend = []
  } = options;
  const [images, setImages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [maxHeight, setMaxHeight] = useState(0);
  const [baseWidth, setBaseWidth] = useState(750);
  const [cols, setCols] = useState(2);
  const dFunc = useRef(null);

  useEffect(() => {
    getImagePostion();
  }, [...depend]);

  useEffect(() => {
    dFunc.current = fDebounce(getImagePostion);
    window.addEventListener('resize', dFunc.current);
    return () => {
      window.removeEventListener('resize', dFunc.current);
    };
  }, []);
  useEffect(() => {
    initGroups();
  }, [data]);

  useEffect(() => {
    transformImage();
  }, [cols, baseWidth, groups]);

  function initGroups() {
    if (data instanceof Array) {
      setGroups([...data]);
    } else {
      // todo type promises here
    }
  }

  // 兼容处理旋转图片颠倒
  function getImageRect(item) {
    const { orientation, width, height } = item;
    let w = width,
      h = height;
    if (orientation === 5 || orientation === 6 || orientation === 7 || orientation === 8) {
      w ^= h;
      h ^= w;
      w ^= h;
    }
    return { width: w, height: h };
  }

  // 转换数据(核心算法)
  function transformImage() {
    const heightList = [];
    const newImages = groups.map((img, index) => {
      const { width: imgWidth, height: imgHeight } = getImageRect(img);
      // console.log('bounding', imgWidth, imgHeight, img.width, img.height);
      const w = ~~Math.max(defaultElementWidth, baseWidth / cols);
      const width = w,
        r = w / imgWidth;
      const height = ~~(imgHeight * r);
      let left = 0,
        top = 0;
      if (index < cols) {
        left = index * width;
        heightList.push(height);
      } else {
        const [i] = getMinHeight(heightList);
        top = heightList[i];
        left = i * width;
        heightList[i] = top + height;
      }

      return {
        ...img,
        [imageBoxleftkey]: left,
        [imageBoxtopkey]: top,
        [imageBoxHeightKey]: height,
        [imageBoxWidthKey]: width,
        [imageHeightKey]: height - space,
        [imageWidthKey]: width - space
      };
    });
    const [i] = getMaxHeight(heightList);
    setMaxHeight(heightList[i]);
    setImages(newImages);
  }

  /**
   * 获取最小高度
   * @param {any[]} list
   * @returns
   */
  function getMinHeight(list) {
    let min = list[0],
      i = 0;
    for (let j = 1; j < list.length; j++) {
      if (min > list[j]) {
        min = list[j];
        i = j;
      }
    }
    return [i];
  }
  /**
   * 获取最大高度
   * @param {any[]} list
   * @returns
   */
  function getMaxHeight(list) {
    let max = list[0],
      i = 0;
    for (let j = 1; j < list.length; j++) {
      if (max < list[j]) {
        max = list[j];
        i = j;
      }
    }
    return [i];
  }

  /**
   *
   * @param {Function} func
   * @param {number} timeout
   * @returns
   */
  function fDebounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  // 获取容器的宽度且计算cols
  function getImagePostion() {
    const container = getRoot(root);
    if (!container) return;
    const { width } = container.getBoundingClientRect();
    const num = Math.floor(width / defaultElementWidth);
    if (width > defaultWidth) {
      setBaseWidth(width);
      setCols(num);
    }
  }

  // 获取容器
  function getRoot(root) {
    let el = null;
    if (typeof root === 'string') {
      el = document.querySelector(root);
    } else if ('current' in root) {
      el = root.current;
    } else {
      el = root;
    }

    return el;
  }

  return [images, { maxHeight, updatePostion: getImagePostion }];
}
