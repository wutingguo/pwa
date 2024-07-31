import { useSelector } from 'react-redux';

const useEnv = (arg = {}) => {
  const { baseUrl, estoreInfo, galleryBaseUrl, estoreBaseUrl } = useSelector(state => {
    const { urls } = state.root.system.env;
    const { estore } = state.root;

    return {
      baseUrl: urls.get('baseUrl'),
      galleryBaseUrl: urls.get('galleryBaseUrl'),
      estoreBaseUrl: urls.get('estoreBaseUrl'),
      estoreInfo: estore.get('estoreInfo')
    };
  });

  return { baseUrl, estoreInfo, galleryBaseUrl, estoreBaseUrl };
};

export default useEnv;
