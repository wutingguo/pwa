import React, { useEffect, useState } from 'react';

const Notification = ({ messages, interval }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // if (interval >= 5) {
    //   const timer = setInterval(() => {
    //     setIndex(prevIndex => (prevIndex + 1) % messages.length);
    //   }, interval);
    //   return () => {
    //     clearInterval(timer);
    //   };
    // }
  }, [messages, interval]);

  const handleClick = item => {
    logEvent.addPageEvent({
      name: 'Dashboard_Click_Announcement',
      link_id: item.link_id,
    });
    if (item.target === '__blank') {
      window.open(item.link);
      return;
    }
    if (item.link) {
      window.location.href = item.link;
    }
  };

  const displayedMessages = messages
    .slice(index, index + messages.length)
    .concat(messages.slice(0, index));

  return (
    <div className="notice-wrap">
      {displayedMessages.map((item, i) => (
        <div className="notice-block" key={i} onClick={() => handleClick(item)}>
          {item.src && <img src={item.src} alt="" className="notice-type" />}
          <span className="notice-cont">{item.content}</span>
          <span className="notice-time">{item.time}</span>
        </div>
      ))}
    </div>
  );
};

export default Notification;
