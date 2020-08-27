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
      height: "417rpx",
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
    if(this.data.isFirst){
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
    if(this.data.isFlod && this.data.isChange){
      this.setData({
        isFlod: !this.data.isFlod,
        flod: {
          height: "auto",
          rotateZ: "rotateZ(0deg)"
        }
      })
    } else if(!this.data.isFlod && this.data.isChange) {
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
    if(resData.productInfo.maoyanSign && resData.productInfo.maoyanSign.length > 0){
      resData.productInfo.maoyanSign =  getMaoyanSignLabel(resData.productInfo.maoyanSign);
    }
    if(resData.productInfo.director){
      resData.productInfo.director = formatDirector(resData.productInfo.director)
    }
    if(resData.productInfo.movieType){
      resData.productInfo.movieType = resData.productInfo.movieType.join(" / ")
    }
    if(resData.productInfo.protagonist){
      resData.productInfo.protagonist = formatDirector(resData.productInfo.protagonist)
    }
    if(resData.productInfo.producer){
      resData.productInfo.producer = formatDirector(resData.productInfo.producer)
    }
    if(resData.productInfo.issuer){
      resData.productInfo.issuer = formatDirector(resData.productInfo.issuer)
    }
    if(resData.productInfo.supervisor){
      resData.productInfo.supervisor = formatDirector(resData.productInfo.supervisor)
    }
    if(resData.productInfo.screenWriter){
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
    return resData
  }
})