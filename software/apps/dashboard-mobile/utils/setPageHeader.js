const pageHeader = ['选片反馈信息', '选片设置', '下载设置', '选片详情', '创建选片库', '下载记录'];
const setHeader = title => {
  document.title = '';
  document.title = title || '选片软件';
};
const setPageHeaders = index => {
  setHeader(pageHeader[index]);
};

export { setHeader, setPageHeaders };
