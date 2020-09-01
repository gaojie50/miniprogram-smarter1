import keepLogin from '../../utils/keepLogin';

const app = getApp();

const {capsuleLocation,barHeight} = app.globalData;

Page({
  data: {
    isLogin: wx.getStorageSync('token'),
    titleHeight: Math.floor(capsuleLocation.bottom + capsuleLocation.top - barHeight),
    code:null,
  },
  
  onLoad:function(){
    const {isLogin} = this.data;

    if(isLogin) this.goList();
  },

  goList: function(){
    wx.reLaunch({
      url:'../list/index'
    })
  },

  getUserInfo: function (e) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] && e.detail) {
          const {iv,encryptedData} = e.detail;
          
          if(this.data.isLogin) return wx.redirectTo({url: `/pages/list/index`});
       
          return keepLogin({ iv,encryptedData});
        };

        wx.showModal({
          title: '提示',
          content: '您点击了拒绝授权，将无法正常使用智多星。请重新授权，或者删除小程序重新进入。',
        })
      }
    })
  },
})