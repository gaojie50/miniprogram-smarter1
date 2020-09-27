import { Block, View, Image, Button } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import keepLogin from '../../utils/keepLogin.js'

import './index.scss'
const app = Taro.getApp()

// const { capsuleLocation, barHeight } = app.globalData
const capsuleLocation= Taro.getMenuButtonBoundingClientRect();
const barHeight= Taro.getSystemInfoSync().statusBarHeight;
@withWeapp({
  data: {
    isLogin: Taro.getStorageSync('token'),
    titleHeight: Math.floor(
      capsuleLocation.bottom + capsuleLocation.top - barHeight
    ),
    code: null
  },

  onLoad: function() {
    const { isLogin } = this.data

    if (isLogin) this.goList()
  },

  goList: function() {
    Taro.reLaunch({
      url: '../list/index'
    })
  },

  getUserInfo: function(e) {
    Taro.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] && e.detail) {
          const { iv, encryptedData } = e.detail

          if (this.data.isLogin)
            return Taro.redirectTo({ url: `/pages/list/index` })

          return keepLogin({ iv, encryptedData })
        }

        Taro.showModal({
          title: '提示',
          content:
            '您点击了拒绝授权，将无法正常使用智多星。请重新授权，或者删除小程序重新进入。'
        })
      }
    })
  }
})
class _C extends React.Component {
  render() {
    const { titleHeight, isLogin } = this.data
    return (
      <View className="welcome">
        <View style={'margin-top:' + titleHeight + 'px'}>
          <Image
            className="logo"
            src={require('../../static/welcome/logo.png')}
          ></Image>
          <Image
            className="slogan"
            src={require('../../static/welcome/slogan.png')}
          ></Image>
          <View
            className="show"
            style={'height: calc(100vh - 742rpx - ' + titleHeight + 'px);'}
          ></View>
        </View>
        {!isLogin && (
          <Button
            className="login-btn"
            hoverClass="login-btn-hover"
            openType="getUserInfo"
            onGetuserinfo={this.getUserInfo}
          >
            立即登录
          </Button>
        )}
        {isLogin && (
          <Button
            className="login-btn"
            hoverClass="login-btn-hover"
            type="primary"
            onClick={this.goList}
            plain="true"
          >
            查看情报
          </Button>
        )}
      </View>
    )
  }
}

export default _C
