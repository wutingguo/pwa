import { template } from './template';
import request from '@resource/websiteCommon/utils/ajax';
import { GET_VIRTUAL_PROJECT_PROJECT } from '../constants/apiUrl';


export const getVirtualProjectData = ({ userId, securityToken, timestamp, projectId, baseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(GET_VIRTUAL_PROJECT_PROJECT, {
      baseUrl
    });
    const userAuth = {
      customerId: userId,
      securityToken,
      timestamp
    };

    request({
      url: url,
      method: 'post',
      setJSON: true,
      data: {
        projectId,
        auth: userAuth
      },
      success: result => {
        const newResult = typeof result === 'string' ? JSON.parse(result) : result;
        const { data } = newResult;
        if (data) {
          resolve(data);
        } else {
          reject();
        }
      },
      error: () => {
        const result = { respCode: '2000', respMsg: 'failed' };
        reject(result);
      }
    });
  });
};