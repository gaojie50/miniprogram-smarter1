import Taro from '@tarojs/taro'
import projectConfig from '../constant/project-config.js'
import envConfig from '../constant/env-config.js'
import reqPacking from './reqPacking.js'
import utils from './index.js'

const { appkey, weixinAppTypeEnum } = projectConfig
const { errorHandle } = utils
const { keeper } = envConfig

function checkLogin() {
  return new Promise((resolve, reject)=>{
    if( Taro.getStorageSync('token') ){
      console.log('authInfo接口');
      reqPacking(
        {
          url: 'api/user/authinfo',
        },
        'passport',
      ).then(res=>{
        const { success, error, data } = res;
        if( !success ){
          Taro.removeStorageSync('token');
          Taro.removeStorageSync('authinfo');
          Taro.removeStorageSync('listPermission');
        }
        resolve({ isLogin: success ? true : false, authInfo: data });
      }).catch(res=>{
        console.log('catch', res);
        reject(res);
      })
    }else{
      resolve({ isLogin: false, authInfo: {} });
    }
  });
}

export default {
  checkLogin
}

