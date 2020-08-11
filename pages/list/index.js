import utils from './../../utils/index';
import projectConfig from '../../constant/project-config';
const {
  getMaoyanSignLabel
} = projectConfig;

const { rpxTopx, formatReleaseDate, formatNumber, formatDirector ,getFutureTimePeriod } = utils;
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
    companyList: [
      {
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
    directFilterList: [
      {
        name: 'maoyan',
        active: false,
      },
      {
        name: 'ali',
        active: false,
      },
      {
        name: 'latestSchedule',
        active: false,
      },
      {
        name: 'superOneMillonEstimateBox',
        active: false,
      }
    ],
    filterItemHidden: [],
    dateSelect: getFutureTimePeriod(),
    estimateBoxStr: '',
    projectBoxStr: '',
    lastFilterLength: 0,
    dateText:'未来1年',
  },
  onLoad: function ({
    token
  }) {
    if (token) wx.setStorageSync('token', token);
    const eventChannel = this.getOpenerEventChannel();
    this.setData({
      screenHeight: wx.getSystemInfoSync().windowHeight
    })

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
    if (wx.getStorageSync('listPermission') > +new Date()) {
      this.setData({
        curPagePermission: true,
        initLoading:false,
      });
      this.fetchSchedule();
      this.setData(
        {loading:true},()=>this._fetchData(this.data.dateSelect));
    } else {
      reqPacking({
        url: 'api/user/authinfo',
      }, 'passport').then(({
        success,
        data,
      }) => {
        if (success) {
          app.globalData.authinfo = data;

          console.log({ 
            token:wx.getStorageSync('token'),
            authinfoData:data,})
          if (data &&
            data.authIds &&
            (data.authIds.length > 0) &&
            data.authIds.includes(95110) &&
            (data.authEndTime > +new Date())
          ) {
            //用户有权限
            wx.setStorageSync('listPermission', data.authEndTime );

            this.setData({
              loading:true,
              curPagePermission: true,
              initLoading:false,
            },()=>{
              this.fetchSchedule();
              this._fetchData(this.data.dateSelect);
            })
          }

          this.setData({
            initLoading:false,
          })
        }

        this.setData({
          initLoading:false,
        });
      })
    }

    //获取上映时间的高度
    var obj = wx.createSelectorQuery();
    obj.select('.vheight').boundingClientRect();
    obj.exec(function (rect) {

    });
  },
  fetchSchedule: function (){
    reqPacking({
      url: 'api/applet/management/latestSchedule',
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
      url: 'api/management/list',
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
          item.wishNum = formatNumber(item.wishNum);
          item.sevenDayIncreaseWish = formatNumber(item.sevenDayIncreaseWish);
        })
        console.log(data)
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
        backdropShow: '',
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
    const derictFilterWrap = this.data;
    let newDataList = [];
    derictFilterWrap[`derictFilterActive${num}`] = !derictFilterWrap[`derictFilterActive${num}`];
    this.setData({
      ...derictFilterWrap
    }, () => {
      const { subList, latestSchedule, directFilterList } = this.data;
      const list = subList;
      directFilterList.map((item, index) => {
        if(num == index+1){
          item.active = !item.active;
        }
      })

      if(!directFilterList[0].active && !directFilterList[1].active && !directFilterList[2].active && !directFilterList[3].active){
        this.setData({
          list: subList
        })
      } else {
        //只看猫眼参与
      if(directFilterList[0].active){
        list.map(item => {
          if(item.company.indexOf(1) !== -1){
            for(let i=0; i<newDataList.length; i++){
              if(newDataList[i].maoyanId == item.maoyanId){
                newDataList.splice(i, 1);
              }
            }
            newDataList.push(item)
          }
        })
      }

      //只看阿里参与
      if(directFilterList[1].active){
        list.map(item => {
          if(item.company.indexOf(2) !== -1){
            for(let i=0; i<newDataList.length; i++){
              if(newDataList[i].maoyanId == item.maoyanId){
                newDataList.splice(i, 1);
              }
            }
            newDataList.push(item)
          }
        })
      }

      //最新档期筛选
      if(directFilterList[2].active){
        if(newDataList.length === 0){
          list.map(item => {
            if((item.alias.indexOf(latestSchedule.name) !== -1) && (item.alias[0] === latestSchedule.name)){
              newDataList.push(item)
            }
          })
        } else {
          const arr = [];
          newDataList.map(item => {
            if(item.alias[0] === latestSchedule.name){
              arr.push(item)
            }
          })
          newDataList = arr;
        } 
      }

      //票房超过1亿筛选
      if(directFilterList[3].active){
        if(newDataList.length === 0){
          list.map(item => {
            if(item.estimateBox/100 >= 100000000) {
              newDataList.push(item)
            }
          })
        } else {
          const arr2 = [];
          newDataList.map(item => {
            if(item.estimateBox/100 >= 100000000) {
              arr2.push(item)
            }
          })
          newDataList = arr2;
        }
      }
      console.log(newDataList)
      this.setData({
        list: newDataList
      })
      }
    })
  },
  tapExtend: function () {
    const dataList = this.data;
    dataList.backdropShow = 'costom';
    dataList.costomShow = true;
    this.setData({
      ...dataList
    })
  },
  ongetBackDrop: function (e) {
    this.setData({
      backdropShow: '',
      filterActive: '',
      costomShow: false,
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

      function abbrCurYear(str){
        const [year,month,day] = str.split('.');
        return year == `${new Date().getFullYear()}` ? `${month}.${day}` : str;
      }

      dateText = `${abbrCurYear(customStartDate.value)}-${abbrCurYear(customEndDate.value)}`;
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
      derictFilterActive1: false,
      derictFilterActive2: false,
      derictFilterActive3: false,
      derictFilterActive4: false,
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