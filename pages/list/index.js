const app = getApp();
const {
  reqPacking
} = app.globalData;

Page({
  data: {
    curPagePermission:false,
  },

  onLoad: function () {
    // 判断用户是否有权限
    reqPacking({
      url: '/api/user/authinfo',
    }, 'passport').then(({
      success,
      data
    }) => {
      if(success){
        app.globalData.authinfo = data;
        if(data && 
          data.authIds && 
          data.authIds.length > 0 &&
          data.authIds.includes(95110)
        ){
          //用户有权限
          this.setData({
            curPagePermission:true,
          })
        }
      }
    })
  },

})