import utils from './../../utils/index';

const { rpxTopx } = utils;
const app = getApp();
const {
  reqPacking,
  capsuleLocation,
  barHeight,
} = app.globalData;

Page({
  data: {
    curPagePermission: false,
    barHeight,
    titleHeight: Math.floor(capsuleLocation.bottom + capsuleLocation.top - barHeight),
    showIcon:false,
  },

  onLoad: function (option) {
    console.log(option);
    const eventChannel = this.getOpenerEventChannel();

    eventChannel.on && eventChannel.on('acceptDataFromOpenerPage', function (data) {
      const {
        companyChecked
      } = data;
    })

    // 判断用户是否有权限
    reqPacking({
      url: '/api/user/authinfo',
    }, 'passport').then(({
      success,
      data
    }) => {
      if (success) {
        app.globalData.authinfo = data;
        if (data &&
          data.authIds &&
          data.authIds.length > 0 &&
          data.authIds.includes(95110)
        ) {
          //用户有权限
          this.setData({
            curPagePermission: true,
          })
        }
      }
    })
  },

  scroll(e) {
    if (e.detail.scrollTop > rpxTopx(80)) {
      this.setData({ showIcon:true })
    } else {
      this.setData({ showIcon:false })
    }

  },

  jumpToSearch(){
    wx.navigateTo({
      url:'/pages/search/index'
    })
  },

  copyMail(){
    wx.setClipboardData({
      data:'zhiduoxing@maoyan.com'
    })
  }
})