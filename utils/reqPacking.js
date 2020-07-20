import {apiBase} from '../constant/env-config';
import {errorHandle} from './util';

const Token = wx.getStorageSync('token');
const DefaultHeader = {
  token: Token ? Token : '',
  'content-type': 'application/json',
};
const DefaultConfig = {
  method: 'GET',
  dataType: 'json',
};

const isHttpSuccess = status => status >= 200 && status < 300 || status === 304;

export default function reqPacking(config = DefaultConfig) {
  return new Promise((resolve, reject) => {
    return wx.request(
      Object.assign({
        header: DefaultHeader,
        ...config,
      }, {
        url: `${apiBase}/${config.url}`,
        success(r) {
          isHttpSuccess(r.statusCode) ? resolve(r.data) : reject(r, 'ServerError');
        },
        fail: reject,
      })
    ).catch(errorHandle)
  })
}