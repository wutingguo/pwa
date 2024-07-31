import dayjs from 'dayjs';

export const countDown = (waitTime, doSomethingDuringCountDown, doSomethingAfterCountDown) => {
  if (waitTime > 0) {
    waitTime--;
    if (doSomethingDuringCountDown) {
      doSomethingDuringCountDown(waitTime);
    }
  } else {
    if (doSomethingAfterCountDown) {
      doSomethingAfterCountDown(waitTime);
    }
    return;
  }
  setTimeout(() => {
    countDown(waitTime, doSomethingDuringCountDown, doSomethingAfterCountDown);
  }, 1000);
};

/**
 * 获取图片列表最后记录的信息
 * @param {Array} images 图片列表
 */
export const getLastInfoByList = (images = []) => {
  const last_shot_time = images[images.length - 1].shot_time;
  const last_shot_time_en = images[images.length - 1].shot_time_str;

  const last_repeat_album_content_rel_id = images
    .filter(({ shot_time }) => shot_time === last_shot_time)
    .map(({ enc_album_content_rel_id }) => enc_album_content_rel_id)
    .join(',');

  return {
    lastShotTime: last_shot_time_en
      ? last_shot_time_en
      : dayjs(last_shot_time).format('YYYY-MM-DD HH:mm:ss'),
    lastRepeatAlbumContentRelId: last_repeat_album_content_rel_id,
  };
};
