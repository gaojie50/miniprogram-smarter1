import utils from './../../utils/index';
import projectConfig from '../../constant/project-config';
const {
  getMaoyanSignLabel
} = projectConfig;

const { rpxTopx, formatReleaseDate, formatNumber, formatDirector ,getFutureTimePeriod} = utils;
const app = getApp();
const {
  reqPacking,
  capsuleLocation,
  barHeight,
} = app.globalData;

Page({
  data: {
    initLoading:true,
    loading:true,
    curPagePermission: false,
    filterActive: '',
    backdropShow: '',
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
      id: 37786,
      name: "上海猫眼影业有限公司"
      },
      {
        id: 1230,
        name: "天津猫眼微影文化传媒有限公司",
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
    estimateBoxStr: '',
    projectBoxStr: '',
    lastFilterLength: 0,
    dateText:'未来1年'
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
      console.log(companyChecked)
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
        initLoading:false,
      });
      this.fetchSchedule();
      this.setData(
        {loading:true},()=>this._fetchData(this.data.dateSelect));
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
              initLoading:false,
            })
            this.setData({
              loading:true
            },()=>{
              this.fetchSchedule();
              this._fetchData(this.data.dateSelect);
            })
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
  fetchSchedule: function (){
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
          if(item.estimateBox){
            item.estimateBox2 = formatNumber(item.estimateBox/100);
          }
          item.releaseDate = formatReleaseDate(item.releaseDate);
          item.director = formatDirector(item.director);
          item.movieType = item.movieType.replace(/,/g,'/');
        })
        
        return this.setData({
          list: data,
          subList: data,
          loading:false,
        })
      }
      this.setData({
        list: [],
        subList: [],
        loading:false,
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
        backdropShow: ''
      })
    } else {
      this.setData({
        filterActive: e.target.dataset.num,
        backdropShow: 'filter'
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
          if((item.alias.indexOf(latestSchedule.name) !== -1) && (item.alias[0] === latestSchedule.name)){
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
    dataList.backdropShow = 'costom';
    dataList.costomShow = true;
    this.setData({
      ...dataList
    })
  },
  ongetCostom: function (e) {
    const dataList = this.data;
    dataList.backdropShow = '';
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
    dataList.filterItemHidden.map((item, index) => {
      dataList[`filterItemHidden${item}`] = true;
    })
    for(let i = 1; i < 13; i++){
      if(dataList.filterItemHidden.indexOf(i) === -1){
        dataList[`filterItemHidden${i}`] = false;
      }
    }
    this.setData({
      ...dataList
    })
  },
  ongetFilterShow: function (e) {
    const { 
      dimension,
      projectStatus,
      cost,
      cooperStatus,
      pcId,
      estimateBox,
      projectBox,
      costBox,
      cooperBox,
      company,
      customStartDate,
      customEndDate,
     } = e.detail;
    
    const checkedDate = e.detail.dateSet.filter(item=> item.checked=='checked')[0];
    const dateValue = checkedDate.value;
    let {dateText,dateSelect,} = this.data;    

    if(checkedDate.value != 'custom'){
      dateSelect = getFutureTimePeriod(dateValue);
      dateText = checkedDate.label;
    }else{
      //时间为自定义
      dateSelect ={
        startDate: +new Date(new Date(customStartDate.value).setHours(0, 0, 0, 0)),
        endDate: +new Date(new Date(customEndDate.value).setHours(23,59,59,999))
      }
      dateText = `${customStartDate.value}-${customEndDate.value}`;
    }
    
    const formateFilterStr = function (arr){
      if(!arr) return ;
      let newStr = '';
      if(arr.length !== 0 ){
        arr && arr.map((item, index) => {
          if(item.active){
            newStr= newStr + item.value + ',';
          }
        })
      }
      return newStr
    }
    const formateFilterLength = function (cost, cooper, company){
      const newCost = [];
      const newCooper = [];
      const newPcId = [];
      cost&&cost.map(item => {
        if(item.active){
          newCost.push(item)
        }
      })
      cooper&&cooper.map(item => {
        if(item.active){
          newCooper.push(item)
        }
      })
      Object.keys(company||{}).forEach(item => {
        if(company[item] === 'active') {
          newPcId.push(pcId[item])
        }
      })

      const result = newCost.length + newCooper.length + newPcId.length;
      return result
    }
    const handlePcId = function (pcId) {
      const pcIdArr = [];
      pcId&&pcId.map(item => {
        pcIdArr.push(item.id)
      })
      return pcIdArr
    }
    const estimateBoxStr = formateFilterStr(estimateBox);
    const projectBoxStr = formateFilterStr(projectBox);
    const lastFilterLength = formateFilterLength(costBox, cooperBox, company);
    const pcIdRequest = handlePcId(pcId);
    this.setData({
      dimension,
      projectStatus,
      cost,
      cooperStatus,
      pcId: pcIdRequest,
      estimateBoxStr,
      projectBoxStr,
      lastFilterLength,
      backdropShow: '',
      filterActive: '',
      dateText,
      dateSelect,
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
      this.setData({
        loading:true,
      },()=>this._fetchData(param));
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