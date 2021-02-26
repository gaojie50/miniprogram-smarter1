import React from 'react';
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro';
import { get as getGlobalData } from '../../global_data';
import auth from '../../utils/auth';
import utils from '@utils/index';

const { errorHandle } = utils;

class _C extends React.Component {

  onLoad = ({token, target}) => {
    // 校验登录状态
    if(token){
      Taro.setStorageSync('token', token);
    }
    let localToken = Taro.getStorageSync('token');
    if( token || localToken ){
      // 校验账号状态
      auth.checkLogin().then(res=>{
        const { authInfo } = res;
        if(res.isLogin){
          target && Taro.reLaunch({ url: decodeURIComponent(target) });
        }else{
          errorHandle(res.error || '登录失败');
          setTimeout(()=>{
            Taro.redirectTo({ url: `/pages/welcome/index?target=${target}`})
          },1000)
         
        }
      }).catch(e=>{
        errorHandle(e);
      })
    }
    this.setState({ target })
  }

  render(){
    return (
      <View style={{textAlign: 'center', fontSize:'30rpx', marginTop: '20rpx'}}>跳转中...</View>
    )
  }
}

export default _C
