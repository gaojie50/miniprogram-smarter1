import { View, Image, Button, Block } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import { smartLogo, welcomeSlogan } from '@utils/imageUrl';
import keepLogin from '../../utils/keepLogin.js'
import { get as getGlobalData } from '../../global_data'
import auth from '../../utils/auth'

import './index.scss'

const capsuleLocation = getGlobalData('capsuleLocation')
const {statusBarHeight} = getGlobalData('systemInfo')
class _C extends React.Component {
  state = {
    titleHeight: Math.floor(
      capsuleLocation.bottom + capsuleLocation.top - statusBarHeight,
    ),
    target: null,
    isLogin: false,
    loading: false
  }

  onLoad = ({token, target}) => {
    // 校验登录状态
    if(token){
      Taro.setStorageSync('token', token);
    }
    let localToken = Taro.getStorageSync('token');
    if( token || localToken ){
      // 校验账号状态
      auth.checkLogin().then(res=>{
        if(res.isLogin){
          this.setState({ isLogin: true });
          target && Taro.reLaunch({ url: decodeURIComponent(target) });
        }
      })
    }
    this.setState({ target })
  }

  componentDidHide = ()=>{
    this.setState({ loading: false });
  }

  goList = () => {
    Taro.reLaunch({
      url: '../list/index',
    })
  }

  getUserInfo = (e) => {
    this.setState({ loading: true });
    const that = this;
    if (e.detail) {
      const { iv, encryptedData } = e.detail
      keepLogin({ 
        iv, encryptedData, target: this.state.target || `/pages/list/index` 
      }).catch(()=>{
        that.setState({ loading: false});
      })
      return;
    }
  }


  render() {
    const { titleHeight, isLogin, loading } = this.state
    return (
      <View className="welcome">
        <View style={'margin-top:' + titleHeight + 'px'}>
          <Image className="logo" src={smartLogo}></Image>
          <Image
            className="slogan"
            src={welcomeSlogan}
          ></Image>
          <View
            className="show"
            style={'height: calc(100vh - 742rpx - ' + titleHeight + 'px);'}
          ></View>
        </View>
        {!isLogin && (
          <Block>
            <Button
              className="login-btn"
              hoverClass="login-btn-hover"
              openType="getUserInfo"
              onGetuserinfo={this.getUserInfo}
              disabled={loading}
              loading={loading}
            >
              {loading ? '登录中' : '立即登录' }
            </Button>
            <View 
              className='stopLogin'
              onClick={() => {
                Taro.switchTab({
                  url: '/pages/list/index'
                });
              }}
            >
              暂不登录
            </View>
          </Block>
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
