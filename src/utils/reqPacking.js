import Taro from '@tarojs/taro'
import envConfig from '../constant/env-config.js'
import utils from './index.js'

const { errorHandle } = utils

const isHttpSuccess = status =>
  (status >= 200 && status < 300) || status === 304


Promise.prototype.finally = function (callback) {
    var Promise = this.constructor;
    return this.then(
        function (value) {
            Promise.resolve(callback()).then(
                function () {
                    return value;
                }
            );
        },
        function (reason) {
            Promise.resolve(callback()).then(
                function () {
                    throw reason;
                }
            );
        }
    );
}

export default function reqPacking(config = DefaultConfig, source = 'server') {
  const header = {
    ...{
      method: 'GET'
    },
    ...(source === 'keeper'
      ? {}
      : {
          source: 'smarter',
          token: Taro.getStorageSync('token')
        }),
    ...(config.header || {})
  }
  return new Promise((resolve, reject) => {
    return Taro.request(
      Object.assign(config, {
        header,
        url: `${envConfig[source]}/${config.url}`,
        success(r) {
          isHttpSuccess(r.statusCode) ? resolve(r.data) : reject(r)
        },
        fail: reject
      })
    )
  }).catch(errorHandle)
}
