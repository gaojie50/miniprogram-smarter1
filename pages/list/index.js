import utils from './../../utils/index';
import projectConfig from '../../constant/project-config';
import lineChart from './../../utils/chart';

let chart = null;
const {
  getMaoyanSignLabel
} = projectConfig;


const { rpxTopx, formatNumber, formatDirector ,getFutureTimePeriod, handleReleaseDesc, handleNewDate, formatWeekDate, throttle } = utils;

const app = getApp();
const {
  reqPacking,
  capsuleLocation,
  barHeight,
} = app.globalData;

function rContScrollEvt({detail}){
  this.setData({
    rightContScrollLeft: detail.scrollLeft,
  })
}

Page({
  data: {
    filmItemWidth:rpxTopx(208),
    filmItemMarginRight:rpxTopx(8),
    initLoading:true,
    loading:true,
    topFilmLoading: true,
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
    filterItemHidden10: true,
    filterItemHidden11: true,
    filmDetailList: false,
    filmDistributionList: [],
    filmDistributionItem: {},
    filmLoading: false,
    paging: {
      hasMore: false,
      offset: 0,
      limit: 1000,
      total: 0
    },
    toView: '',
    redTextShow: false,
    canvasImg: ''
  },
 
  onLoad: function ({
    token
  }) {

    if (token) wx.setStorageSync('token', token);

    this.setData({
      screenHeight: wx.getSystemInfoSync().windowHeight
    })
    
    // 判断用户是否有权限
    const {
      authStartTime,
      authEndTime,
    } = wx.getStorageSync('listPermission');
    
    if (  authEndTime && 
          authEndTime  > +new Date() && 
          authStartTime &&
          authStartTime <= +new Date()
        ) {
      this.setData({
        curPagePermission: true,
        initLoading:false,
      });
      this.fetchfilmDistribution();
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
          if (data &&
            data.authIds &&
            (data.authIds.length > 0) &&
            data.authIds.includes(95110) &&
            data.authEndTime &&
            (data.authEndTime > +new Date()) &&
            data.authStartTime &&
            (data.authStartTime <= +new Date())
          ) {
            //用户有权限
            wx.setStorageSync('listPermission', {
              authEndTime:data.authEndTime,
              authStartTime:data.authStartTime,
            });


            this.setData({
              loading:true,
              curPagePermission: true,
              initLoading:false,
            
            },()=>{
              this.fetchfilmDistribution();
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
  },
  fetchfilmDistribution: function (){
    const { offset, limit } = this.data.paging;
    const query = {
      offset,
      limit,
    }

    reqPacking({
      url: 'api/applet/management/filmDistribution',
      data: query
    }).then(res => {
      const { success, data, paging } = res;
      if(success && data){
        data.map(item => {
          if(item.filmSchedule && item.filmSchedule.length > 0){
            item.filmSchedule = formatDirector(item.filmSchedule);
          }
          if(item.keyFilms && item.keyFilms.length > 0){
            item.keyFilms.map(item2 => {
              if (item2.maoyanSign && item2.maoyanSign.length > 0) {
                item2.maoyanSignLabel = getMaoyanSignLabel(item2.maoyanSign);
              }
              if(item2.director && item2.director.length > 0){
                item2.director = formatDirector(item2.director);
              }
              if(!item2.projectId){
                item2.projectId = 0;
              }
              if(!item2.maoyanId){
                item2.maoyanId = 0;
              }
              if(item2.estimateBox){
                item2.estimateBox = formatNumber(item2.estimateBox);
              }
              item2.pic = item2.pic ? `${item2.pic.replace('/w.h/', '/')}@460w_660h_1e_1c`: `../../static/icon/default-pic.svg`;
              item2.wishNum = formatNumber(item2.wishNum);
            })
          }
          item.releaseDate = formatWeekDate(item.releaseDate);
        })
       
        this.setData({
          filmDistributionList: this.data.filmDistributionList.concat(data),
          paging,
          filmLoading: false,
          topFilmLoading: false,
        }, () => {
         this.chartDraw();
        })
      }else {
        this.setData({
          filmDistributionList: [],
          topFilmLoading: false
        })
      }
    })
  },
  handleCanvarToImg(){
    const { filmDistributionList } = this.data;
    const windowWidth = wx.getSystemInfoSync().windowWidth;
  
    wx.canvasGetImageData({
      x: 0,
      y: 0,
      width: (filmDistributionList.length - 1) * (windowWidth * 5 /10) + 33,
      height: 120,
      canvasId: 'chart',
      fileType: 'png',
      success: res => {
        this.setData({
          canvasImg: res.tempFilePath
        })
        // this.setData({ canvasImg: res.tempFilePth});
      }
    });  
  },
  chartDraw(){
    const { filmDistributionList } = this.data;

    let key = [];
    let value = [];
    let redDot = []
 
    filmDistributionList.map((item, index) => {
      key.push(index);
      value.push(item.filmNum);
      if(item.company && item.company.indexOf(1) !== -1){
        redDot.push(1)
      } else {
        redDot.push(0)
      }
    })
    
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    chart = lineChart.init('chart', {
      tipsCtx: 'chart-tips',
      width: (key.length - 1) * (windowWidth * 5 /10) + 33,
      height: 120,
      margin: 20,
      xAxis: key,
      lines: [{
          points: value,
          redDot,
      }]
    });
    chart.draw();
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
            item.estimateBox2 = formatNumber(item.estimateBox);
          }
          // if(item.cost !== null && item.cost !== ''){
          //   item.cost =formatNumber(item.cost * 1e4 ).text;
          // }
         
          item.releaseDate = handleReleaseDesc(item.showType, item.releaseDesc);
          item.cost = formatNumber(item.cost).text;
          item.director = formatDirector(item.director);
          item.movieType = item.movieType.replace(/,/g,'/');
          item.wishNum = formatNumber(item.wishNum).text;
          item.sevenDayIncreaseWish = formatNumber(item.sevenDayIncreaseWish);
          if(item.name.length>6 && item.maoyanSign.length !== 0){
            item.trHeight = 160;
          } else if(item.releaseDate.length !== 0 && item.scheduleType !== 0 && item.alias.length !== 0 ) {
            if(item.releaseDate.length === 4){
              item.trHeight = 120;
            } else {
              item.trHeight = 160;
            }
            
          } else if((item.producer && item.producer[0].length >16) || (item.issuer && item.issuer[0].length > 16)){
            item.trHeight = 160;
          } else if(item.movieType && item.movieType.length > 14){
            item.trHeight = 160;
          }
          else {
            item.trHeight = 120;
          }
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
        toView: 'filter',
        filterActive: '',
        backdropShow: '',
      })
    } else {
      this.setData({
        toView: 'filter',
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
        list.map(item => {
          //只看猫眼参与
          if(directFilterList[0].active && item.company.indexOf(1) !== -1){
            for(let i=0; i<newDataList.length; i++){
              if(newDataList[i].maoyanId == item.maoyanId){
                newDataList.splice(i, 1);
              }
            }
            newDataList.push(item)
          }

          //只看阿里参与
          if(directFilterList[1].active && item.company.indexOf(2) !== -1){
            for(let i=0; i<newDataList.length; i++){
              if(newDataList[i].maoyanId == item.maoyanId){
                newDataList.splice(i, 1);
              }
            }
            newDataList.push(item)
          }
        })

      //最新档期筛选
      if(directFilterList[2].active){
        if(newDataList.length === 0){
          if(!directFilterList[0].active && !directFilterList[1].active && !directFilterList[3].active){
            list.map(item => {
              if((item.alias.indexOf(latestSchedule.name) !== -1) && (item.alias[0] === latestSchedule.name)){
                newDataList.push(item)
              }
            })
          }
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
            if(!directFilterList[0].active && !directFilterList[1].active && !directFilterList[2].active){
              list.map(item => {
                console.log(item.estimateBox)
                if(item.estimateBox >= 100000000) {
                  newDataList.push(item)
                }
              })
            }
          } else {
            const arr2 = [];
            newDataList.map(item => {
              if(item.estimateBox >= 100000000) {
                arr2.push(item)
              }
            })
            newDataList = arr2;
          }

      }
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
      filmDetailList: false,
    })
  },
  ongetCostom: function (e) {
    const dataList = this.data;
    dataList.backdropShow = '';
    dataList.costomShow = false;
    dataList.filmDetailList = false;
    dataList.toView = '';
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
        startDate: +new Date(handleNewDate(customStartDate.value).setHours(0, 0, 0, 0)),
        endDate: +new Date(handleNewDate(customEndDate.value).setHours(23,59,59,999)),
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
      newStr = newStr.substring(0, newStr.length-1);
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
    this.data.directFilterList.map(item => {
        item.active = false;
    })
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
  jumpToDetail:function(e){
    const { id } = e.currentTarget.dataset;
    const { list } = this.data;
    const filterList = JSON.parse(JSON.stringify(list)).filter(({maoyanId,projectId}) => maoyanId == id)[0];

    wx.navigateTo({
      url:`/pages/projectDetail/index`,
      success: function(res) {
        res.eventChannel.emit('acceptDataFromListPage', { 
          item:filterList
         })
      }
    })
  },

  copyMail() {
    wx.setClipboardData({
      data: 'zhiduoxing@maoyan.com'
    })
  },
  rightContScroll:throttle(rContScrollEvt,10),

  goTop() { 
    if(this.data.filterActive) return;
    this.setData({toView:'scroll-cont'});
  },
  tapfilmBox(e){
    console.log(111)
    const filmDistributionItem = e.target.dataset.item;

    if(filmDistributionItem.filmNum == 0) return ;
    
    filmDistributionItem && this.setData({
      filmDistributionItem,
      backdropShow: 'costom',
      filmDetailList: true,
    })
  },
filmScroll(){
  const { limit, offset, hasMore } = this.data.paging;
  if(hasMore){
    this.setData({
      filmLoading: true,
      paging: {
        offset: offset + limit,
        limit,
      }
    }, () => {
      this.fetchfilmDistribution()
    })
  } 
},
tapRedPrompt(){
  this.setData({
    redTextShow: true
  })
},
redTextClose(){
  this.setData({
    redTextShow: false
  })
}
})