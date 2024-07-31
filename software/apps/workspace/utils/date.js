export const format = (date = new Date(), dash = '-') => {
  const dt = new Date(date);
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1;
  const day = dt.getDate();

  return [year, month, day].join(dash);
};

export const formatTime = (time, format = 'yyyy-mm-dd') => {
  const d = time ? new Date(Number(time)) : new Date();
  const t = i => {
    return (i < 10 ? '0' : '') + i;
  };

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const weekday = d.getDay();

  return format.replace(
    /(yy){1,2}|m{1,3}|d{1,2}|h{1,2}|i{1,2}|s{1,2}|w{1,2}|t{1,2}|o{1,2}/gi,
    r => {
      switch (r.toUpperCase()) {
        case 'YY':
          return `${year}`.substr(2);
        case 'YYYY':
          return year;
        case 'M':
          return month;
        case 'MM':
          return t(month);
        case 'MMM': 
        return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]; 
        case 'D':
          return day;
        case 'DD':
          return t(day);
        case 'H':
          return hour;
        case 'HH':
          return t(hour);
        case 'O':
          return hour % 12 == 0 ? 12 : hour % 12;
        case 'OO':
            return t(hour % 12 == 0 ? 12 : hour % 12);
        case 'I':
          return minutes;
        case 'II':
          return t(minutes);
        case 'S':
          return seconds;
        case 'SS':
          return t(seconds);
        case 'TT':  
        return hour < 12 ? 'AM' : 'PM';        
        case 'W':
          return `星期${['日', '一', '二', '三', '四', '五', '六'][weekday]}`;
        case 'WW':
          return [
            'Sunday',
            'Monday',
            'TuesDay',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
          ][weekday];
      }
    }
  );
};

export const formatGapTime = (timestamp, format = 'yyyy-mm-dd') => {
  const t = i => {
    return (i < 10 ? '0' : '') + i;
  };

  const dayTimeStamp = 24 * 3600 * 1000;
  const hourTimeStamp = 3600 * 1000;
  const minuteTimeStamp = 60 * 1000;
  const day = Math.floor(timestamp / dayTimeStamp);
  const hour = Math.floor((timestamp - day * dayTimeStamp) / hourTimeStamp);
  const minutes = Math.floor(
    (timestamp - day * dayTimeStamp - hour * hourTimeStamp) / minuteTimeStamp
  );
  const seconds = Math.ceil(
    (timestamp -
      day * dayTimeStamp -
      hour * hourTimeStamp -
      minutes * minuteTimeStamp) /
      1000
  );

  return format.replace(/d{1,2}|h{1,2}|i{1,2}|s{1,2}|w{1,2}/gi, r => {
    switch (r.toUpperCase()) {
      case 'D':
        return day;
      case 'DD':
        return t(day);
      case 'H':
        return hour;
      case 'HH':
        return t(hour);
      case 'I':
        return minutes;
      case 'II':
        return t(minutes);
      case 'S':
        return seconds;
      case 'SS':
        return t(seconds);
    }
  });
};