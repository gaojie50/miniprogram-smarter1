import utils from './../../utils/index';
import projectConfig from '../../constant/project-config';
const {
  getMaoyanSignLabel
} = projectConfig;


const { rpxTopx, formatReleaseDate, formatNumber, formatDirector } = utils;

const {
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
    list:[],
    subList: [],
    filterItemHidden:[],
    latestSchedule: {},
    companyList: [{
      id: 1231,
      name: "北京猫眼"
      },
      {
        id: 1231,
        name: "天津猫眼",
      },
      {
        id: 1231,
        name: "霍尔果斯猫眼",
      },
      {
        id: 1231,
        name: "阿里巴巴影业",
      },
      {
        id: 1231,
        name: "阿里巴巴（娱乐宝）",
      }
    ],
    scheduleType: {
      1: "已定档",
      2: "非常确定",
      3: "可能",
      4: "内部建议",
      5: "待定",
    },
    project: {
      1: "筹备",
      2: "拍摄",
      3: "后期",
      4: "待过审",
      5: "已过审",
    },
    cooper: {
      1: "评估中",
      2: "跟进中",
      3: "未合作",
      4: "开发中",
      5: "投资中",
    },
    filterItemHidden: [],
    dateSelect: getFutureTimePeriod(),
  },

  onLoad: function ({
    token
  }) {
    if (token) wx.setStorageSync('token', token);
    const eventChannel = this.getOpenerEventChannel();

    eventChannel.on && eventChannel.on('acceptDataFromOpenerPage', data => {
      const {
        companyChecked
      } = data;
      if(companyChecked.length !== 0){
        const newCompanyList = this.data.companyList.concat(companyChecked)
        this.setData({
          companyList: newCompanyList
        })
      }
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
    console.log(param)
    reqPacking({
      url: '/api/applet/management/latestSchedule',
    }).then(({
      success,
      data
    }) => {
      if (success && data) {
        this.setData({
          latestSchedule: data
        })
      }
    })
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
          item.releaseDate = formatReleaseDate(item.releaseDate);
          item.estimateBox2 = formatNumber(item.estimateBox);
          item.director = formatDirector(item.director);
          item.movieType = item.movieType.replace(/,/g,'/');
        })
        return this.setData({
          list: data,
          subList: data
        })
      }
      this.setData({
        list: [],
        subList: []
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
    const  derictFilterWrap  = this.data;
    const { list, subList, latestSchedule } = this.data;
    const newDataList = [];
    derictFilterWrap[`derictFilterActive${num}`] = !derictFilterWrap[`derictFilterActive${num}`];
    this.setData({
      ...derictFilterWrap
    })
    const { derictFilterActive1,derictFilterActive2,derictFilterActive3,derictFilterActive4 } = this.data;
    if(num == 1 || num == 2){
      
      const mapList = (arr, mapNum) => {
        if(mapNum === 1){
          arr.map(item => {
            if(item.company.indexOf(1) !== -1){
              newDataList.push(item)
            }
          })
          this.setData({
            list: newDataList,
          })
        }
        if(mapNum === 2){
          arr.map(item => {
            if(item.company.indexOf(2) !== -1){
              newDataList.push(item)
            }
          })
          this.setData({
            list: newDataList,
          })
        }
      }
      if(num == 1 && derictFilterActive1){
        mapList(list, 1)
      }
      if(num == 1 && !derictFilterActive1){
        if(derictFilterActive2){
          mapList(subList, 2)
        }
        if(!derictFilterActive2){
          this.setData({
            list: subList
          })
        }
      }
      if(num == 2 && derictFilterActive2){
        mapList(list, 2)
      }
      if(num == 2 && !derictFilterActive2){
        if(derictFilterActive1){
          mapList(subList, 1)
        }
        if(!derictFilterActive1){
          this.setData({
            list: subList
          })
        }
      }
    }
    if(num == 3) {
      if(derictFilterActive3){
        list.map(item => {
          if(item.alias.indexOf(latestSchedule.name) !== -1){
            newDataList.push(item)
          }
        })
        this.setData({
          list: newDataList
        })
      } else {
        this.setData({
          list: subList
        })
      }
    }
    if(num == 4){
      if(derictFilterActive4){
        list.map(item => {
          if(item.estimateBox && item.estimateBox > 100000000){
            newDataList.push(item)
          }
          this.setData({
            list: newDataList
          })
        })
      } else {
        this.setData({
          list: subList
        })
      }
    }
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

      Object.keys(param).forEach(key => {
        if(param[key].length === 0){
          delete(param[key])
        }
        if(param[key] == 'pcId'){
          param[key] = param[key].id
        }
      })
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