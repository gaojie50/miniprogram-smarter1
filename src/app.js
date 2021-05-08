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
    // 埋点验证
    // let validCode = Math.random().toString().slice(2, 8);
    // lx.debug(true, {  
    //     code: validCode
    // });
    // console.log(validCode)
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