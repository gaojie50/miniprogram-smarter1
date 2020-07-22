import envConfig from './../constant/env-config';
import  utils from './index';

const {keeper,apiBase} = envConfig;
const {errorHandle} = utils;

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

export default function reqPacking(config = DefaultConfig,source) {
  return new Promise((resolve, reject) => {
    return wx.request(
      Object.assign({
        header: DefaultHeader,
        ...config,
      }, {
        url: `${source == 'keeper' ?keeper: apiBase}/${config.url}`,
        success(r) {
          isHttpSuccess(r.statusCode) ? resolve(r.data) : reject(r);
        },
        fail: reject,
      })
    )
  }).catch(errorHandle)
}