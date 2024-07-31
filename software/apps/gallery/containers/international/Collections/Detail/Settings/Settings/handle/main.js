
const getCollectionsSettings = that => {
  const { boundProjectActions, match: { params } } = that.props;
  const { id } = params;

  return boundProjectActions.getCollectionsSettings(id);

};

export default {
  getCollectionsSettings
};
