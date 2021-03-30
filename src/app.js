import React from "react";
import Taro from '@tarojs/taro';
import lx from '@analytics/wechat-sdk';


import "./app.scss";
import "../src/static/fonts/iconfont.css";

class App extends React.Component {

  componentDidShow(){
    const accountInfo = Taro.getAccountInfoSync();
    if([ 'develop', 'trial'].includes(accountInfo.miniProgram.envVersion)){
      lx.dev(true);
    }
    let validCode = Math.random().toString().slice(2, 8); //生成6-12位纯数字验证码
    console.log(validCode);
    lx.debug(true, {  //打开验证开关，并设置验证码
        code: validCode
    });
    this.initReport()
    lx.setLch();
    lx.start(); // 应用启动
  }

  initReport() {
    lx.init("https://report.meituan.com/", {
      appnm: "zhiduoxing",
      category: 'movie_b',
      rtnm: ''
    });
    const { userInfo } = Taro.getStorageSync('authinfo') || {};
    if(userInfo) {
      lx.set('wxid', userInfo.keeperUserId);
      lx.set('user_id', userInfo.mis);
      lx.set('uid', userInfo.keeperUserId);
      lx.set('keep_user_id', userInfo.keeperUserId);
    }
  }

  componentDidHide () {
    lx.quit()
  }

  render() {
    return this.props.children;
  }

}

export default App;