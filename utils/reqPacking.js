import envConfig from './../constant/env-config';
import  utils from './index';

const {errorHandle} = utils;

const isHttpSuccess = status => status >= 200 && status < 300 || status === 304;

export default function reqPacking(config = DefaultConfig,source='server') {
  const header = {
    ...{
      method: 'GET',
    },
    ...(
      source === 'keeper' ? 
      {} : 
      {
        source:'smarter',
        token: wx.getStorageSync('token'),
      }
    ),
    ...(config.header||{})
  }
  return new Promise((resolve, reject) => {
    return wx.request(
      Object.assign(
        config,
        {
        header,
        url: `${envConfig[source]}/${config.url}`,
        success(r) {
          isHttpSuccess(r.statusCode) ? resolve(r.data) : reject(r);
        },
        fail: reject,
      })
    )
  }).catch(errorHandle)
}