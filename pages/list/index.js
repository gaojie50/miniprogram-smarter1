import utils from './../../utils/index';
import projectConfig from '../../constant/project-config';
const {
  getMaoyanSignLabel
} = projectConfig;

const {
  rpxTopx,
  formatReleaseDate,
  getFutureTimePeriod,
} = utils;
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
    gapHeight: Math.floor(capsuleLocation.top - barHeight),
    showIcon: false,
    dimension: [],
    projectStatus: [],
    cost: [],
    cooperStatus: [],
    pcId: [],
    list: [],
    filterItemHidden: [],
    dateSelect: getFutureTimePeriod(),
  },

  onLoad: function ({
    token
  }) {
    if (token) wx.setStorageSync('token', token);
    const eventChannel = this.getOpenerEventChannel();

    eventChannel.on && eventChannel.on('acceptDataFromOpenerPage', function (data) {
      const {
        companyChecked
      } = data;
    })

    // 判断用户是否有权限
    if (wx.getStorageSync('listPermission')) {
      this.setData({
        curPagePermission: true,
      });

      this._fetchData(this.data.dateSelect);
    } else {
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
            wx.setStorageSync('listPermission', true);
            this.setData({
              curPagePermission: true,
            })
            this._fetchData(this.data.dateSelect);
          }
        }
      })
    }

    //获取上映时间的高度
    var obj = wx.createSelectorQuery();
    obj.select('.vheight').boundingClientRect();
    obj.exec(function (rect) {
      console.log(rect)
    });
  },

  _fetchData: function (param = {}) {
    reqPacking({
      url: '/api/management/list',
      data: param,
      method: 'POST'
    }).then(({
      success,
      data
    }) => {
      if (success && data && data.length > 0) {

        data.map(item => {

          if (item.maoyanSign && item.maoyanSign.length > 0) {
            item.maoyanSignLabel = getMaoyanSignLabel(item.maoyanSign);
          }
          if (item.releaseDate.startDate != null) {
            const formatStartDate = formatReleaseDate(item.releaseDate.startDate);

          }
          if (item.releaseDate.endDate != null) {
            const formatEndDate = formatReleaseDate(item.releaseDate.endDate);

          }
        })
        return this.setData({
          list: data
        })
      }
      this.setData({
        list: []
      })
    })
  },

  tapFilterItem: function (e) {
    const num = e.target.dataset.num;
    const {
      filterActive
    } = this.data;
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
  tapDerictFilter: function (e) {
    const num = e.target.dataset.num;
    const derictFilterWrap = this.data;
    derictFilterWrap[`derictFilterActive${num}`] = !derictFilterWrap[`derictFilterActive${num}`];
    this.setData({
      ...derictFilterWrap
    })
  },
  tapExtend: function () {
    const dataList = this.data;
    dataList.backdropShow = true;
    dataList.costomShow = true;
    this.setData({
      ...dataList
    })
  },
  ongetCostom: function (e) {
    console.log(e.detail)
    const dataList = this.data;
    dataList.backdropShow = false;
    dataList.costomShow = false;
    if (Array.isArray(e.detail)) {
      dataList.filterItemHidden = e.detail;
      this.setData({
        ...dataList
      }, () => {
        this.fetchFilterShow()
      })
    } else {
      this.setData({
        ...dataList
      })
    }
  },
  fetchFilterShow: function () {
    const dataList = this.data;
    for (let j = 0; j < dataList.filterItemHidden.length; j++) {
      const num = dataList.filterItemHidden[j];
      dataList[`filterItemHidden${num}`] = true;
    }
    this.setData({
      ...dataList
    })
  },
  ongetFilterShow: function (e) {
    const dataList = this.data;
    dataList.backdropShow = false;
    dataList.filterActive = '';
    dataList.dimension = e.detail.dimension;
    dataList.projectStatus = e.detail.projectStatus;
    dataList.cost = e.detail.cost;
    dataList.cooperStatus = e.detail.cooperStatus;
    dataList.pcId = e.detail.pcId;
    const dateValue = e.detail.dateSet.filter(item=> item.checked=='checked')[0].value;
    
    if(e.detail.dateSet.filter(item=> item.checked=='checked')[0].value != 'custom'){
      dataList.dateSelect = getFutureTimePeriod(dateValue);
    }

    this.setData({
      ...dataList,
    }, () => {
      const {
        dimension,
        projectStatus,
        cost,
        cooperStatus,
        pcId,
        dateSelect,
      } = this.data;
      const param = {
        dimension,
        projectStatus,
        cost,
        cooperStatus,
        pcId,
        ...dateSelect
      }
      this._fetchData(param);
    })
  },
  scroll(e) {
    if (e.detail.scrollTop > rpxTopx(80)) {
      this.setData({
        showIcon: true
      })
    } else {
      this.setData({
        showIcon: false
      })
    }

  },

  jumpToSearch() {
    wx.navigateTo({
      url: '/pages/search/index'
    })
  },

  copyMail() {
    wx.setClipboardData({
      data: 'zhiduoxing@maoyan.com'
    })
  }
})