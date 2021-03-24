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