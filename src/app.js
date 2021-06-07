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

    // 小程序版本更新
    const updateManager = Taro.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {    // 检查是否有新版本
      if(res.hasUpdate) {
        // 下载新版本
        updateManager.onUpdateReady(() => {
          updateManager.applyUpdate();  // 重启应用
        })

        // 新版本下载失败
        updateManager.onUpdateFailed(() => {
          Taro.showModal({
            title: '更新提示',
            content: '新版本已经上线啦，请您删除当前小程序，重新搜索打开哟~',
          })
        })
      }
    })
  }

  initReport() {
    lx.init("https://report.meituan.com/", {
      appnm: "zhiduoxing",
      category: 'movie_b',
      rtnm: '',
    });
    const { userInfo } = Taro.getStorageSync('authinfo') || {};
    if(userInfo) {
      lx.set('wxid', userInfo.keeperUserId);
      lx.set('user_id', userInfo.keeperUserId);
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