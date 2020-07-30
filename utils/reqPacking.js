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
        token:'keeper_eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTYwNzkwOTksIm5iZiI6MTU5NjA3OTA5OSwiZXhwIjoxNjAxMjYzMDk5LCJhY2NvdW50SWQiOjEwMDAwMDAwMTIzMTg1LCJzYWx0IjoidmwwbnFrIiwiaXNUZXN0IjpmYWxzZSwiYnVzaW5lc3NJZCI6MCwidmVyc2lvbiI6IjEuNyJ9.lUoQ9E7WKAxS5mkHpzkyIewBWi8FhKFFKaEzDKtMUDc',
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