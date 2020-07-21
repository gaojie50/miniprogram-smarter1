import keepLogin from '../../utils/keepLogin';

const app = getApp()
  
Page({
  data: {
    userInfo: {},
    isLogin: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    const {code}=app.globalData;
    const {iv,encryptedData} = e.detail;
    app.globalData.userInfo = e.detail;
    
    keepLogin({
      iv,encryptedData,code
    })
    this.setData({
      userInfo: e.detail,
      hasUserInfo: true,
    })
  }
})
