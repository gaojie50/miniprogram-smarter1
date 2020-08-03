import envConfig from './../constant/env-config';
import  utils from './index';

const {errorHandle} = utils;

const Token = wx.getStorageSync('token');
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
        // token: Token ? Token : '',
        token:'keeper_eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTYxNzkyMjEsIm5iZiI6MTU5NjE3OTIyMSwiZXhwIjoxNjAxMzYzMjIxLCJhY2NvdW50SWQiOjEwMDAwMDAwMTIzMTg1LCJzYWx0IjoiZDNuZ2thIiwiaXNUZXN0IjpmYWxzZSwiYnVzaW5lc3NJZCI6MCwidmVyc2lvbiI6IjEuNyJ9.VXjPluOf62AUgZeUzrX5IneREyHZ6YhkZxOx9GnHHJo',
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