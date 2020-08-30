import projectConfig from '../../constant/project-config';
import reqPacking from '../../utils/reqPacking';
import utils from '../../utils/index';

const {getMaoyanSignLabel,getProjectStatus,getCooperStatus} = projectConfig;
const {formatNumber,formatDirector,formatReleaseDate} = utils;

Page({
  data: {
    loading: true,
    isFlod: true,
    isChange: false,
    count: 0,
    calHeight: '',
    flod: {
      height: '200rpx',
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

  fold: function(){
    if(!this.data.isChange){
      return 
    }
    if(this.data.isFlod){
      this.setData({
        isFlod: !this.data.isFlod,
        flod: {
          height:  "auto",
          rotateZ: "rotateZ(0deg)"
        }
      })
    } else {
      this.setData({
        isFlod: !this.data.isFlod,
        flod: {
          height: this.data.calHeight,
          rotateZ: "rotateZ(180deg)"
        }
      })
    }
  },

  fetchData(movieId, projectId) {
    let that = this
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
          resData: this.formData(res.data),
          loading: false
        }, () => {
          console.log(this.data.count)
          if(this.data.count > 4) {
            wx.createSelectorQuery().selectAll('.info').boundingClientRect(function (rect) {
              wx.getSystemInfo({
                success: (result) => {
                  that.setData({
                    isChange: true,
                    flod: {
                      height: (rect[0].height+rect[1].height+rect[2].height+rect[3].height)*(750/result.windowWidth)+215+ 'rpx',
                      rotateZ: "rotateZ(180deg)"
                    },
                    calHeight: (rect[0].height+rect[1].height+rect[2].height+rect[3].height)*(750/result.windowWidth)+215+ 'rpx'
                    // + (61/(750/result.windowWidth))
                    // *(750/result.windowWidth)
                  })
                },
              })
            }).exec();
          } else if (this.data.count == 4) {
            wx.createSelectorQuery().selectAll('.info').boundingClientRect(function (rect) {
              wx.getSystemInfo({
                success: (result) => {
                  that.setData({
                    isChange: false,
                    flod: {
                      height: (rect[0].height+rect[1].height+rect[2].height+rect[3].height)*(750/result.windowWidth)+176+ 'rpx'
                    }
                  })
                },
              })
            }).exec();
          } else {
            wx.createSelectorQuery().selectAll('.info').boundingClientRect(function (rect) {
              wx.getSystemInfo({
                success: (result) => {
                  let height = 96
                  for(let i = 0; i < that.data.count; i++) {
                    height = height + 20 +rect[i].height*(750/result.windowWidth)
                  }
                  that.setData({
                    isChange: false,
                    flod: {
                      height: height + 'rpx'
                    }
                  })
                },
              })
            }).exec();
          }
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
    // if(count === 1) {
    //   this.setData({
    //     showArrow: false,
    //     isChange: false,
    //     flod: {
    //       height: "200rpx"
    //     }
    //   })
    // } else if(count === 3) {
    //   this.setData({
    //     showArrow: false,
    //     isChange: false,
    //     flod: {
    //       height: "330rpx"
    //     }
    //   })
    // }else {
    //   this.setData({
    //     showArrow: true,
    //     flod: {
    //       height: "417rpx",
    //       rotateZ: "rotateZ(180deg)"
    //     }
    //   })
    // }
    this.setData({
      count: count
    })
    return resData
  }
})