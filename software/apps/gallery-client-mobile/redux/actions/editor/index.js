import env from './env';
import image from './image';
import productInfo from './productInfo';
import project from './project';

export default {
  ...image,
  ...env,
  ...productInfo,
  ...project
};
