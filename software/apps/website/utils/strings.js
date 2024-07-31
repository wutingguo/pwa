export const publishStatus = {
  Unpublished: 1,
  Publishing: 2,
  Published: 3,
  NewEditsExist: 4,
};

export const publishedStatus = [publishStatus.Publishing, publishStatus.Published];

export const publishStatusLabel = {
  [publishStatus.Unpublished]: 'Publish',
  [publishStatus.Publishing]: 'Publishing',
  [publishStatus.Published]: 'Published',
  [publishStatus.NewEditsExist]: 'Update',
};

export const publishPollingStatus = {
  fail: 1,
  pending: 2,
  success: 3,
};