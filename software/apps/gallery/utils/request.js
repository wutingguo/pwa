import request from '@resource/lib/utils/request';

export default (params) => request({...params, hostType: 'galleryBaseUrl'});