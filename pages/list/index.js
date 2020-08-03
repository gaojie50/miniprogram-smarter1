const app = getApp();
const {
  reqPacking
} = app.globalData;

Page({
  data: {
    curPagePermission: true,
    filterActive: '',
    backdropShow: false,
    costomShow: false
  },

  onLoad: function () {
    // 判断用户是否有权限
    reqPacking({
      url: '/api/user/authinfo',
    }, 'passport').then(({
      success,
      data
    }) => {
      if(success &&
        data && 
        data.authIds && 
        data.authIds.length > 0 &&
        data.authIds.includes(95110)
      ){
        //用户有权限
        this.setData({
          curPagePermission:true,
        })
      }
    })
  },
  tapFilterItem: function (e){
    const num = e.target.dataset.num;
    const { filterActive } = this.data;
    if (num == filterActive) {
      this.setData({
        filterActive: '',
        backdropShow: false
      })
    } else {
      this.setData({
        filterActive: e.target.dataset.num,
        backdropShow: true
      })
    }
  },
  tapDerictFilter: function (e){
    const num = e.target.dataset.num;
    const derictFilterWrap = this.data;
    derictFilterWrap[`derictFilterActive${num}`] = !derictFilterWrap[`derictFilterActive${num}`];
    this.setData({
      ...derictFilterWrap
    })
  },
  tapExtend: function (){
    this.setData({
      costomShow: true,
      backdropShow: true
    })
  },
  ongetBackdropShow: function (e){
    this.setData({
      backdropShow: false
    })
  }
})