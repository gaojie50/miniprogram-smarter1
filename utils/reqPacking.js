import envConfig from './../constant/env-config';
import  utils from './index';

const {errorHandle} = utils;

const isHttpSuccess = status => status >= 200 && status < 300 || status === 304;

export default function reqPacking(config = DefaultConfig,source='server') {
  const header = {
    ...{
      method: 'GET',
      // dataType: 'json',
      // 'content-type': 'application/json',
    },
    ...(
      source === 'keeper' ? 
      {} : 
      {
        source:'smarter',
        // token: wx.getStorageSync('token'),
        token:'keeper_eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTY0MjkxMDAsIm5iZiI6MTU5NjQyOTEwMCwiZXhwIjoxNjAxNjEzMTAwLCJhY2NvdW50SWQiOjEwMDAwMDAwMTIzMTg1LCJzYWx0IjoicXpsM2FtIiwiaXNUZXN0IjpmYWxzZSwiYnVzaW5lc3NJZCI6MCwidmVyc2lvbiI6IjEuNyJ9.v48ThWsuK2OjkywkbGB9mPURtsN_eEbxcMHIoFr207s',
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