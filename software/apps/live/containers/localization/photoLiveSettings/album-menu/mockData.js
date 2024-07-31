const data = {
  broadcast: {
    id: 'broadcast',
    name: '照片直播',
    enable: true,
    order: 1,
  },
  hots: {
    id: 'hots',
    name: '热门',
    enable: false,
    order: 2,
  },
  introduce: {
    id: 'introduce',
    name: '活动介绍',
    enable: false,
    order: 3,
  },
  column: {
    id: 'column',
    current: 'broadcast',
    tasks: ['broadcast', 'hots', 'introduce'],
  },
};

export default data;
