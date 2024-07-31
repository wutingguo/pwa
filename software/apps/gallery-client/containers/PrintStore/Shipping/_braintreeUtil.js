import 'isomorphic-fetch';
import { create as createClient } from 'braintree-web/client';
import { get, template } from 'lodash';
import { getWWWorigin } from '@resource/lib/utils/url';

// const GET_BRAINTREE_TOKEN = '<%=baseUrl%>web-api/app/payment/braintree/token';

// function getToken() {
//   return new Promise((resolve, reject) => {
//     const url = template(GET_BRAINTREE_TOKEN)({ baseUrl: getWWWorigin() });
//     fetch(url)
//       .then(response => response.json())
//       .then(result => {
//         const token = get(result, 'data.token');
//         if (token) {
//           resolve(token);
//         } else {
//           reject(get(result, 'message'));
//         }
//       })
//       .catch(reject);
//   });
// }

// let token = '';

// function init() {
//   return new Promise((resolve, reject) => {
//     if (!token) {
//       getToken()
//         .then(result => {
//           token = result;
//           resolve(result);
//         })
//         .catch(reject);
//     } else {
//       resolve(token);
//     }
//   });
// }

const braintreeClient = {
  // init,
  getClientInstance: () => {
    return new Promise((resolve, reject) => {
      // init()
      // .then(result => {
      //   createClient(
      //     { authorization: result },
      //     (createErr, clientInstance) => {
      //       if (!createErr) {
      //         resolve(clientInstance);
      //       } else {
      //         reject(createErr);
      //       }
      //     }
      //   );
      // })
      // .catch(reject);
    });
  }
};

export default braintreeClient;
