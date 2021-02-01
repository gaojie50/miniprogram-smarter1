import { View, Image, Button } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import keepLogin from '../../utils/keepLogin.js'
import { get as getGlobalData } from '../../global_data'

import './index.scss'

const capsuleLocation = getGlobalData('capsuleLocation')
const {statusBarHeight} = getGlobalData('systemInfo')
class _C extends React.Component {
  state = {
    titleHeight: Math.floor(
      capsuleLocation.bottom + capsuleLocation.top - statusBarHeight,
    ),
    code: null,
  }

  onLoad = () => {
    if (Taro.getStorageSync('token')) this.goList()
  }

  goList = () => {
    Taro.reLaunch({
      url: '../list/index',
    })
  // Taro.reLaunch({
  //   url: '../management/assessIndex/index?projectId=6009&roundId=291'
  // })
    // Taro.reLaunch({
    //   url: '../management/assessIndex/index?projectId=14332&roundId=350'
    // })
  }

  getUserInfo = (e) => {
    Taro.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo'] && e.detail) {
          const { iv, encryptedData } = e.detail
          if (Taro.getStorageSync('token'))
            return Taro.redirectTo({ url: `/pages/list/index` })
            // return Taro.redirectTo({ url: `../management/create/index?projectId=14332` })
            // return Taro.redirectTo({ url: `../management/assessIndex/index?projectId=14332&roundId=350` })

          return keepLogin({ iv, encryptedData })
        }

        Taro.showModal({
          title: '提示',
          content:
            '您点击了拒绝授权，将无法正常使用智多星。请重新授权，或者删除小程序重新进入。',
        })
      },
    })
  }

  render() {
    const { titleHeight, isLogin } = this.state
    return (
      <View className="welcome">
        <View style={'margin-top:' + titleHeight + 'px'}>
          <Image className="logo" src="../../static/welcome/logo.png"></Image>
          <Image
            className="slogan"
            src="../../static/welcome/slogan.png"
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
