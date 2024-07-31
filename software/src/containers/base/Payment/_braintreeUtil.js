import 'isomorphic-fetch';
import { create as createClient } from 'braintree-web/client';
import { get, template } from 'lodash';
import * as braintree from '@resource/pwa/services/braintree';
import {
  GET_BRAINTREE_TOKEN
} from '@resource/lib/constants/apiUrl';

function getToken(baseUrl) {
  return new Promise((resolve, reject) => {
    const url = template(GET_BRAINTREE_TOKEN)({ baseUrl });
    fetch(url)
      .then(response => response.json())
      .then(result => {
        const token = get(result, 'data.token');
        if (token) {
          resolve(token);
        } else {
          reject(get(result, 'message'));
        }
      })
      .catch(reject);
  });
}

let token = '';

function init(baseUrl) {
  return new Promise((resolve, reject) => {
    if (!token) {
      getToken(baseUrl)
        .then(result => {
          token = result;
          resolve(result);
        })
        .catch(reject);
    } else {
      resolve(token);
    }
  });
}

const braintreeClient = {
  init,
  getClientInstance: (baseUrl) => {
    return new Promise((resolve, reject) => {
      init(baseUrl)
        .then(result => {
          createClient(
            { authorization: result },
            (createErr, clientInstance) => {
              if (!createErr) {
                resolve(clientInstance);
              } else {
                reject(createErr);
              }
            }
          );
        })
        .catch(reject);
    });
  }
};

export default braintreeClient;
