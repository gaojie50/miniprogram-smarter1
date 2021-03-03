import React from 'react';
import { View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro';
import './index.scss';
import { navigateToMiniProgram } from '@tarojs/taro';

export default function LoginNotice(props){
  const { className, disabled, loading, text, target } = props;

  const gotoLogin = () => {
    if( !target ){
      Taro.redirectTo({
        url: '/pages/welcome/index'
      })
      return;
    }
    Taro.redirectTo({
      url: `/pages/welcome/index?target=${encodeURIComponent(target)}`
    })
  }

  return (
    <View className={`login-notice-component`}>
      <View className="notice">{text || '您还未登录，请先去登录'}</View>
      <Button
        disabled={disabled}
        loading={loading}
        className={`btn ${className}`}
        onClick={ gotoLogin }
      >
          去登录
      </Button>
    </View>
  )
}