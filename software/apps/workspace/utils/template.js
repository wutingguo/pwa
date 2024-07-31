export const template = (template, data) => {
  return template.replace(/<%=([^%]*)%>/g, function(s, m) {
    return data[m] ? data[m] : '' ;
  });
};