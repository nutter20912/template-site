import axios from 'axios';
import storage from './storage';

/**
 * Promise HTTP client
 *
 * @param {string} method
 * @param {string} url
 * @param {object} payload
 * @returns {Promise}
 */
export default function request(method, url, payload) {
  const token = storage.get('token');
  return new Promise((resolve, reject) => {
    const axiosInstance = (() => {
      if (method === 'get') {
        return axios({
          headers: { Authorization: `Bearer ${token}` },
          method,
          url,
          params: payload,
        });
      }

      return axios({
        headers: {
          'X-Socket-ID': window.Echo?.socketId(),
          Authorization: `Bearer ${token}`,
        },
        method,
        url,
        data: payload,
      });
    })();

    axiosInstance
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
