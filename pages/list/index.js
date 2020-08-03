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
    filterActive: '',
    backdropShow: false,
    costomShow: false, 
    barHeight,
    titleHeight: Math.floor(capsuleLocation.bottom + capsuleLocation.top - barHeight),
    gapHeight:Math.floor(capsuleLocation.top - barHeight),
    showIcon:false,
    dimension: [],
    projectStatus: [],
    cost: [],
    cooperStatus: [],
    pcId: [],
    list:[]
  },

  onLoad: function ({token}) {
  
    if(token) wx.setStorageSync('token', token);
    const eventChannel = this.getOpenerEventChannel();

    eventChannel.on && eventChannel.on('acceptDataFromOpenerPage', function (data) {
      const { companyChecked } = data;
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
          this._fetchData();
        }
      }
    })


  },

  _fetchData:function(param={}){
    reqPacking({
      url: '/api/management/list',
      data: {
        endDate: 1628006399999,
        startDate: 1596470400000
      },
      method:'POST'
    }).then(({
      success,
      data
    }) => {
      if (success && data && data.length > 0) {
        return this.setData({ 
          list: data 
        })
      }
  
      this.setData({ list: [] })
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
    const dataList = this.data;
    dataList.backdropShow = true;
    dataList.costomShow = true;
    this.setData({
      ...dataList
    })
  },
  ongetBackdropShow: function (e){
    const dataList = this.data;
    dataList.backdropShow = false;
    dataList.costomShow = false;
    this.setData({
      ...dataList
    })
  },
  ongetFilterShow: function (e){
    const dataList = this.data;
    dataList.backdropShow = false;
    dataList.filterActive = '';
    dataList.dimension = e.detail.dimension;
    dataList.projectStatus = e.detail.projectStatus;
    dataList.cost = e.detail.cost;
    dataList.cooperStatus = e.detail.cooperStatus;
    dataList.pcId = e.detail.pcId;
    this.setData({
      ...dataList,
    },()=>{
      const { dimension,projectStatus,cost,cooperStatus,pcId } = this.data;
      const param = {
        dimension,
        projectStatus,
        cost,
        cooperStatus,
        pcId
      }
      this._fetchData(param);
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