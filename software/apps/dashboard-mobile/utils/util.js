const aDownlad = (url, fileName) => {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.download = fileName;
  link.style.display = 'none';
  document.body.append(link);
  link.click();
};

export { aDownlad };
