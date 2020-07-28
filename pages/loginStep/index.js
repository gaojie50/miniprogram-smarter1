import keepLogin from '../../utils/keepLogin';

const app = getApp();
const jumpWaitTime = 2e3;

Page({
  data: {
    open: false,
    checked: false,
    step: 0,

  },

  openModal: function () {
    this.setData({
      open: true
    })
  },

  closeModal: function () {
    this.setData({
      open: false
    })
  },

  bindRadio: function () {
    this.setData({
      checked: !this.data.checked
    });
  },

  onShareAppMessage() {
    return {
      title: 'scroll-view',
      path: 'page/component/pages/scroll-view/scroll-view'
    }
  },

  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail;
      this.setData({
        step: 1
      });

      return wx.showToast({
        title: '已经授权，进入短信验证页...',
        icon: 'loading',
        duration: jumpWaitTime,
        success: function () {
          setTimeout(() => {
            const {code ,userInfo } = app.globalData;
            const {iv,encryptedData} = userInfo;

            keepLogin({
              code,iv,encryptedData
            })
   
          }, jumpWaitTime)
        }
      });
    }

    wx.showModal({
      title: '警告',
      content: '您点击了拒绝授权，将无法正常使用智多星。请重新授权，或者删除小程序重新进入。',
    })
  },
})