import Taro from '@tarojs/taro'
import projectConfig from '../constant/project-config.js'
import envConfig from '../constant/env-config.js'
import reqPacking from './reqPacking.js'
import utils from './index.js'
import { set as setGlobalData, get as getGlobalData } from '../global_data';

const { appkey, weixinAppTypeEnum } = projectConfig
const { errorHandle } = utils
const { keeper } = envConfig

function checkLogin() {
  return new Promise((resolve, reject)=>{
    console.log('checkLogin时，token是', Taro.getStorageSync('token'));
    if( Taro.getStorageSync('token') ){
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
          setGlobalData('authinfo', null);
        }else{
          Taro.setStorageSync('authinfo', data);
          setGlobalData('authinfo', data);
        }
        resolve({ isLogin: success ? true : false, authInfo: data,  error});
      }).catch(res=>{
        errorHandle(res);
        reject(res);
      })
    }else{
      Taro.removeStorageSync('authinfo');
      setGlobalData('authinfo', null);
      resolve({ isLogin: false, authInfo: {} });
    }
  });
}

export default {
  checkLogin
}

