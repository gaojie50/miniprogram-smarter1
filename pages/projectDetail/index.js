import projectConfig from '../../constant/project-config';
import reqPacking from '../../utils/reqPacking';
import utils from '../../utils/index';

const {getMaoyanSignLabel,getProjectStatus,getCooperStatus} = projectConfig;
const {formatNumber,formatDirector,formatReleaseDate} = utils;

Page({
  data: {
    isFirst: true,
    isFlod: true,
    isChange: true,
    auto: '',
    flod: {
      height: "",
      rotateZ: "rotateZ(180deg)"
    },
    resData: {}
  },

  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();

    eventChannel.on && eventChannel.on('acceptDataFromListPage', ({item={}}) => {
      this.fetchData(item.maoyanId, item.projectId)
    })
  },

  openOrClose: function(){
    if(this.data.isFirst && this.data.isChange){
      let that = this
      let info = null
      wx.createSelectorQuery().selectAll('.info').boundingClientRect(function (rect) {
        info = rect.pop()
      }).exec();
      wx.createSelectorQuery().select('#detail').boundingClientRect(function (rect) {
        wx.getSystemInfo({
          success: (result) => {
            if(rect.bottom - 61/(750/result.windowWidth)> info.bottom) {
              that.setData({
                isFirst: false,
                isChange: false
              }, () => {
                that.fold()
              })
            } else {
              that.setData({
                isFirst: false,
                isChange: true
              }, () => {
                that.fold()
              })
            }
          },
        })
      }).exec();
    } else {
      this.fold()
    }
  },

  fold: function(){
    if(!this.data.showArrow){
      return 
    }
    if(this.data.isFlod){
      this.setData({
        isFlod: !this.data.isFlod,
        flod: {
          height: this.data.isChange ? "auto" : "417rpx",
          rotateZ: "rotateZ(0deg)"
        }
      })
    } else {
      this.setData({
        isFlod: !this.data.isFlod,
        flod: {
          height: "417rpx",
          rotateZ: "rotateZ(180deg)"
        }
      })
    }
  },

  fetchData(movieId, projectId) {
    reqPacking({
      url: 'api/applet/management/projectDetail',
      data: {movieId: movieId, projectId: projectId},
      method: 'GET'
    }).then(res => {
      if(!res.success) {
        wx.showToast({
          title: res.error.message,
          icon: 'none',
          duration: 2000
        })
      } else {
        this.setData({
          resData: this.formData(res.data)
        })
      }
    })
  },

  formData(resData){
    let count = 0
    if(resData.productInfo.maoyanSign && resData.productInfo.maoyanSign.length > 0){
      resData.productInfo.maoyanSign =  getMaoyanSignLabel(resData.productInfo.maoyanSign);
    }
    if(resData.productInfo.filmSource){
      count++
    }
    if(resData.productInfo.director){
      count++
      if(resData.productInfo.director.length > 6) {
        resData.productInfo.director.splice(6)
      }
      resData.productInfo.director = formatDirector(resData.productInfo.director)
    }
    if(resData.productInfo.movieType){
      count++
      resData.productInfo.movieType = resData.productInfo.movieType.join(" / ")
    }
    if(resData.productInfo.protagonist){
      count++
      if(resData.productInfo.protagonist.length > 6) {
        resData.productInfo.protagonist.splice(6)
      }
      resData.productInfo.protagonist = formatDirector(resData.productInfo.protagonist)
    }
    if(resData.productInfo.producer){
      count++
      resData.productInfo.producer = formatDirector(resData.productInfo.producer)
    }
    if(resData.productInfo.issuer){
      count++
      resData.productInfo.issuer = formatDirector(resData.productInfo.issuer)
    }
    if(resData.productInfo.supervisor){
      count++
      resData.productInfo.supervisor = formatDirector(resData.productInfo.supervisor)
    }
    if(resData.productInfo.screenWriter){
      count++
      resData.productInfo.screenWriter = formatDirector(resData.productInfo.screenWriter)
    }
    if(resData.marketIntelligence.estimateBox){
      resData.marketIntelligence.estimateBox = formatNumber(resData.marketIntelligence.estimateBox)
    }
    if(resData.marketIntelligence.cost){
      resData.marketIntelligence.cost = formatNumber(resData.marketIntelligence.cost)
    }
    if(resData.marketIntelligence.publicityCost){
      resData.marketIntelligence.publicityCost = formatNumber(resData.marketIntelligence.publicityCost)
    }
    if(resData.marketIntelligence.maoyanInvest){
      resData.marketIntelligence.maoyanInvest = formatNumber(resData.marketIntelligence.maoyanInvest)
    }
    if(resData.productInfo.cooperStatus !== null){
      resData.productInfo.cooperStatus = getCooperStatus(resData.productInfo.cooperStatus)
    }

    if(resData.marketIntelligence.projectStatus !== null){
      resData.marketIntelligence.projectStatus = getProjectStatus(resData.marketIntelligence.projectStatus)
    }
    if(resData.createInfo.createTime){
      let date = new Date(resData.createInfo.createTime)
      resData.createInfo.createTime = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    }
    if(count === 1) {
      this.setData({
        showArrow: false,
        isChange: false,
        flod: {
          height: "200rpx"
        }
      })
    } else if(count === 3) {
      this.setData({
        showArrow: false,
        isChange: false,
        flod: {
          height: "330rpx"
        }
      })
    }else {
      this.setData({
        showArrow: true,
        flod: {
          height: "417rpx",
          rotateZ: "rotateZ(180deg)"
        }
      })
    }
    return resData
  }
})