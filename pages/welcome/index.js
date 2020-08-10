import keepLogin from '../../utils/keepLogin';

const app = getApp();

const {capsuleLocation,barHeight} = app.globalData;

Page({
  data: {
    isLogin: wx.getStorageSync('token'),
    titleHeight: Math.floor(capsuleLocation.bottom + capsuleLocation.top - barHeight),
  },

  goList: function(){
    wx.reLaunch({
      url:'../list/index'
    })
  },

  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail;

      const {code ,userInfo } = app.globalData;
      const {iv,encryptedData} = userInfo;

      if(this.data.isLogin) return wx.redirectTo({url: `/pages/list/index`});

      return keepLogin({ code,iv,encryptedData})
    }

    wx.showModal({
      title: '提示',
      content: '您点击了拒绝授权，将无法正常使用智多星。请重新授权，或者删除小程序重新进入。',
    })
  },
})