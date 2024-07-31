import React, { useEffect, useRef, useState } from 'react';

export default function ZoomImage(props) {
  const { src, item, onLoadImage, id } = props;
  const imgRef = useRef(null);
  const [pos, setPos] = useState({
    width: '100%',
    height: '100%',
  });
  useEffect(() => {
    const ob = new MutationObserver(mutations => {
      const mutation = mutations[0];
      const rect = imgRef.current.getBoundingClientRect();
      //   console.log('rect', mutation.target.style.transform);
      const transform = mutation.target.style.transform;
      const t = transform.replace('translate3d(0px, 0px, 0px)', 'translate(0px, 0px)');
      mutation.target.style.transform = t;
      setPos({
        width: rect.width,
        // height: rect.width,
      });
    });
    ob.observe(imgRef.current, { attributes: true });

    return () => ob.disconnect();
  }, []);
  return (
    <img
      ref={imgRef}
      id={id}
      loading="lazy"
      className="image"
      src={src}
      onLoad={() => onLoadImage?.(item)}
      width={pos.width}
      height={pos.height}
    />
  );
}
