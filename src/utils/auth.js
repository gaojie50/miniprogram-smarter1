import Taro from '@tarojs/taro'
import reqPacking from './reqPacking.js'
import utils from './index.js'
import { set as setGlobalData } from '../global_data';

const { errorHandle } = utils

function checkLogin() {
  return new Promise((resolve, reject)=>{
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
          errorHandle(error);
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

