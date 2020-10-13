import {
  Block,
  View,
  Image,
  Text,
  ScrollView,
  CoverImage,
  Canvas,
} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../../utils/index.js'
import projectConfig from '../../constant/project-config.js'
import lineChart from '../../utils/chart.js'

import FilmDetailList from '../../components/filmDetailList/index'
import CostumListItem from '../../components/costomListItem/index'
import ScheduleType from '../../components/scheduleType/index'
import MaoyanSign from '../../components/maoyanSign/index'
import FilterPanel from '../../components/filterPanel/index'
import Backdrop from '../../components/backdrop/index'

import './index.scss'
let chart = null
const { getMaoyanSignLabel } = projectConfig

const {
  rpxTopx,
  formatNumber,
  formatDirector,
  getFutureTimePeriod,
  handleReleaseDesc,
  handleNewDate,
  formatWeekDate,
  throttle,
} = utils

const app = Taro.getApp()
import reqPacking from '../../utils/reqPacking.js'

const capsuleLocation = Taro.getMenuButtonBoundingClientRect()
const barHeight = Taro.getSystemInfoSync().statusBarHeight
// const { reqPacking, capsuleLocation, barHeight } = app.globalData

function rContScrollEvt({ detail }) {
  this.setData({
    rightContScrollLeft: detail.scrollLeft,
  })
}

@withWeapp({
  data: {
    filmItemWidth: rpxTopx(208),
    filmItemMarginRight: rpxTopx(8),
    initLoading: true,
    loading: true,
    topFilmLoading: true,
    curPagePermission: false,
    filterActive: '',
    backdropShow: '',
    costomShow: false,
    barHeight,
    titleHeight: Math.floor(
      capsuleLocation.bottom + capsuleLocation.top - barHeight,
    ),
    gapHeight: Math.floor(capsuleLocation.top - barHeight),
    showIcon: false,
    dimension: [],
    projectStatus: [],
    cost: [],
    cooperStatus: [],
    pcId: [],
    list: [],
    subList: [],
    filterItemHidden: [],
    latestSchedule: {},
    scheduleType: {
      1: '已定档',
      2: '非常确定',
      3: '可能',
      4: '内部建议',
      5: '待定',
    },
    project: {
      1: '筹备',
      2: '拍摄',
      3: '后期',
      4: '待过审',
      5: '已过审',
    },
    cooper: {
      1: '评估中',
      2: '跟进中',
      3: '未合作',
      4: '开发中',
      5: '投资中',
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
      },
    ],
    filterItemHidden: [],
    dateSelect: getFutureTimePeriod(),
    estimateBoxStr: '',
    projectBoxStr: '',
    lastFilterLength: 0,
    dateText: '未来1年',
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
      total: 0,
    },
    toView: '',
    redTextShow: false,
    canvasImg: '',
  },

  onLoad: function ({ token }) {
    if (token) Taro.setStorageSync('token', token)

    this.setData({
      screenHeight: Taro.getSystemInfoSync().windowHeight,
    })

    // 判断用户是否有权限
    const { authStartTime, authEndTime } = Taro.getStorageSync('listPermission')

    if (
      authEndTime &&
      authEndTime > +new Date() &&
      authStartTime &&
      authStartTime <= +new Date()
    ) {
      this.setData({
        curPagePermission: true,
        initLoading: false,
      })
      this.fetchfilmDistribution()
      this.fetchSchedule()
      this.setData({ loading: true }, () =>
        this._fetchData(this.data.dateSelect),
      )
    } else {
      reqPacking(
        {
          url: 'api/user/authinfo',
        },
        'passport',
      ).then(({ success, data }) => {
        if (success) {
          // app.globalData.authinfo = data todo
          if (
            data &&
            data.authIds &&
            data.authIds.length > 0 &&
            data.authIds.includes(95110) &&
            data.authEndTime &&
            data.authEndTime > +new Date() &&
            data.authStartTime &&
            data.authStartTime <= +new Date()
          ) {
            //用户有权限
            Taro.setStorageSync('listPermission', {
              authEndTime: data.authEndTime,
              authStartTime: data.authStartTime,
            })

            this.setData(
              {
                loading: true,
                curPagePermission: true,
                initLoading: false,
              },
              () => {
                this.fetchfilmDistribution()
                this.fetchSchedule()
                this._fetchData(this.data.dateSelect)
              },
            )
          }

          this.setData({
            initLoading: false,
          })
        }

        this.setData({
          initLoading: false,
        })
      })
    }
  },
  fetchfilmDistribution: function () {
    const { offset, limit } = this.data.paging
    const query = {
      offset,
      limit,
    }

    reqPacking({
      url: 'api/applet/management/filmDistribution',
      data: query,
    }).then((res) => {
      const { success, data, paging } = res
      if (success && data) {
        data.map((item) => {
          if (item.filmSchedule && item.filmSchedule.length > 0) {
            item.filmSchedule = formatDirector(item.filmSchedule)
          }
          if (item.keyFilms && item.keyFilms.length > 0) {
            item.keyFilms.map((item2) => {
              if (item2.maoyanSign && item2.maoyanSign.length > 0) {
                item2.maoyanSignLabel = getMaoyanSignLabel(item2.maoyanSign)
              }
              if (item2.director && item2.director.length > 0) {
                item2.director = formatDirector(item2.director)
              }
              if (!item2.projectId) {
                item2.projectId = 0
              }
              if (!item2.maoyanId) {
                item2.maoyanId = 0
              }
              if (item2.estimateBox) {
                item2.estimateBox = formatNumber(item2.estimateBox)
              }
              item2.pic = item2.pic
                ? `${item2.pic.replace('/w.h/', '/')}@460w_660h_1e_1c`
                : `../../static/icon/default-pic.svg`
              item2.wishNum = formatNumber(item2.wishNum)
            })
          }
          item.releaseDate = formatWeekDate(item.releaseDate)
        })

        this.setData(
          {
            filmDistributionList: this.data.filmDistributionList.concat(data),
            paging,
            filmLoading: false,
            topFilmLoading: false,
          },
          () => {
            this.chartDraw()
          },
        )
      } else {
        this.setData({
          filmDistributionList: [],
          topFilmLoading: false,
        })
      }
    })
  },
  chartDraw() {
    const { filmDistributionList } = this.data

    let key = []
    let value = []
    let redDot = []

    filmDistributionList.map((item, index) => {
      key.push(index)
      value.push(item.filmNum)
      if (item.company && item.company.indexOf(1) !== -1) {
        redDot.push(1)
      } else {
        redDot.push(0)
      }
    })
    const windowWidth = Taro.getSystemInfoSync().windowWidth
    chart = lineChart('chart', {
      tipsCtx: 'chart-tips',
      width: (key.length - 1) * ((windowWidth * 5) / 10) + 33,
      height: 120,
      margin: 20,
      xAxis: key,
      lines: [
        {
          points: value,
          redDot,
        },
      ],
    })
    chart.draw()
  },
  fetchSchedule: function () {
    reqPacking({
      url: 'api/applet/management/latestSchedule',
    }).then(({ success, data }) => {
      if (success && data) {
        this.setData({
          latestSchedule: data,
        })
      }
    })
  },

  _fetchData: function (param = {}) {
    reqPacking({
      url: 'api/management/list',
      data: param,
      method: 'POST',
    }).then(({ success, data }) => {
      if (success && data && data.length > 0) {
        data.map((item) => {
          if (item.maoyanSign && item.maoyanSign.length > 0) {
            item.maoyanSignLabel = getMaoyanSignLabel(item.maoyanSign)
          }
          if (item.estimateBox) {
            item.estimateBox2 = formatNumber(item.estimateBox)
          }
          // if(item.cost !== null && item.cost !== ''){
          //   item.cost =formatNumber(item.cost * 1e4 ).text;
          // }

          item.releaseDate = handleReleaseDesc(item.showType, item.releaseDesc)
          item.cost = formatNumber(item.cost).text
          item.director = formatDirector(item.director)
          item.movieType = item.movieType.replace(/,/g, '/')
          item.wishNum = formatNumber(item.wishNum).text
          item.sevenDayIncreaseWish = formatNumber(item.sevenDayIncreaseWish)
          if (item.name.length > 6 && item.maoyanSign.length !== 0) {
            item.trHeight = 160
          } else if (
            item.releaseDate.length !== 0 &&
            item.scheduleType !== 0 &&
            item.alias.length !== 0
          ) {
            if (item.releaseDate.length === 4) {
              item.trHeight = 120
            } else {
              item.trHeight = 160
            }
          } else if (
            (item.producer && item.producer[0].length > 16) ||
            (item.issuer && item.issuer[0].length > 16)
          ) {
            item.trHeight = 160
          } else if (item.movieType && item.movieType.length > 14) {
            item.trHeight = 160
          } else {
            item.trHeight = 120
          }
        })

        return this.setData({
          list: data,
          subList: data,
          loading: false,
        })
      }
      this.setData({
        list: [],
        subList: [],
        loading: false,
      })
    })
  },
  tapFilterItem: function (e) {
    const num = e.target.dataset.num
    const { filterActive } = this.data
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
        backdropShow: 'filter',
      })
    }
  },
  tapDerictFilter: function (e) {
    const num = e.target.dataset.num
    const derictFilterWrap = this.data
    let newDataList = []
    derictFilterWrap[`derictFilterActive${num}`] = !derictFilterWrap[
      `derictFilterActive${num}`
    ]
    this.setData(
      {
        ...derictFilterWrap,
      },
      () => {
        const { subList, latestSchedule, directFilterList } = this.data
        const list = subList

        directFilterList.map((item, index) => {
          if (num == index + 1) {
            item.active = !item.active
          }
        })

        if (
          !directFilterList[0].active &&
          !directFilterList[1].active &&
          !directFilterList[2].active &&
          !directFilterList[3].active
        ) {
          this.setData({
            list: subList,
          })
        } else {
          list.map((item) => {
            //只看猫眼参与
            if (directFilterList[0].active && item.company.indexOf(1) !== -1) {
              for (let i = 0; i < newDataList.length; i++) {
                if (newDataList[i].maoyanId == item.maoyanId) {
                  newDataList.splice(i, 1)
                }
              }
              newDataList.push(item)
            }

            //只看阿里参与
            if (directFilterList[1].active && item.company.indexOf(2) !== -1) {
              for (let i = 0; i < newDataList.length; i++) {
                if (newDataList[i].maoyanId == item.maoyanId) {
                  newDataList.splice(i, 1)
                }
              }
              newDataList.push(item)
            }
          })

          //最新档期筛选
          if (directFilterList[2].active) {
            if (newDataList.length === 0) {
              if (!directFilterList[0].active && !directFilterList[1].active) {
                list.map((item) => {
                  if (item.alias[0] === latestSchedule.name) {
                    newDataList.push(item)
                  }
                })
              }
            } else {
              const arr = []
              newDataList.map((item) => {
                if (item.alias[0] === latestSchedule.name) {
                  arr.push(item)
                }
              })
              newDataList = arr
            }
          }

          //票房超过1亿筛选
          if (directFilterList[3].active) {
            if (newDataList.length === 0) {
              if (
                !directFilterList[0].active &&
                !directFilterList[1].active &&
                !directFilterList[2].active
              ) {
                list.map((item) => {
                  if (item.estimateBox >= 100000000) {
                    newDataList.push(item)
                  }
                })
              }
            } else {
              const arr2 = []
              newDataList.map((item) => {
                if (item.estimateBox >= 100000000) {
                  arr2.push(item)
                }
              })
              newDataList = arr2
            }
          }
          this.setData({
            list: newDataList,
          })
        }
      },
    )
  },
  tapExtend: function () {
    const dataList = this.data
    dataList.backdropShow = 'costom'
    dataList.costomShow = true
    this.setData({
      ...dataList,
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
    const dataList = this.data
    dataList.backdropShow = ''
    dataList.costomShow = false
    dataList.filmDetailList = false
    dataList.toView = ''
    if (Array.isArray(e.detail)) {
      dataList.filterItemHidden = e.detail
      this.setData(
        {
          ...dataList,
        },
        () => {
          this.fetchFilterShow()
        },
      )
    } else {
      this.setData({
        ...dataList,
      })
    }
  },
  fetchFilterShow: function () {
    const dataList = this.data
    dataList.filterItemHidden.map((item, index) => {
      dataList[`filterItemHidden${item}`] = true
    })
    for (let i = 1; i < 13; i++) {
      if (dataList.filterItemHidden.indexOf(i) === -1) {
        dataList[`filterItemHidden${i}`] = false
      }
    }
    this.setData({
      ...dataList,
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
    } = e.detail

    const checkedDate = e.detail.dateSet.filter(
      (item) => item.checked == 'checked',
    )[0]
    const dateValue = checkedDate.value
    let { dateText, dateSelect } = this.data

    if (checkedDate.value != 'custom') {
      dateSelect = getFutureTimePeriod(dateValue)
      dateText = checkedDate.label
    } else {
      //时间为自定义
      dateSelect = {
        startDate: +new Date(
          handleNewDate(customStartDate.value).setHours(0, 0, 0, 0),
        ),
        endDate: +new Date(
          handleNewDate(customEndDate.value).setHours(23, 59, 59, 999),
        ),
      }

      function abbrCurYear(str) {
        const [year, month, day] = str.split('.')
        return year == `${new Date().getFullYear()}` ? `${month}.${day}` : str
      }

      dateText = `${abbrCurYear(customStartDate.value)}-${abbrCurYear(
        customEndDate.value,
      )}`
    }

    const formateFilterStr = function (arr) {
      if (!arr) return
      let newStr = ''
      if (arr.length !== 0) {
        arr &&
          arr.map((item, index) => {
            if (item.active) {
              newStr = newStr + item.value + ','
            }
          })
      }
      newStr = newStr.substring(0, newStr.length - 1)
      return newStr
    }
    const formateFilterLength = function (cost, cooper, company) {
      const newCost = []
      const newCooper = []
      const newPcId = []
      cost &&
        cost.map((item) => {
          if (item.active) {
            newCost.push(item)
          }
        })
      cooper &&
        cooper.map((item) => {
          if (item.active) {
            newCooper.push(item)
          }
        })
      Object.keys(company || {}).forEach((item) => {
        if (company[item] === 'active') {
          newPcId.push(pcId[item])
        }
      })

      const result = newCost.length + newCooper.length + newPcId.length
      return result
    }
    const handlePcId = function (pcId) {
      const pcIdArr = []
      pcId &&
        pcId.map((item) => {
          pcIdArr.push(item.id)
        })
      return pcIdArr
    }
    const estimateBoxStr = formateFilterStr(estimateBox)
    const projectBoxStr = formateFilterStr(projectBox)
    const lastFilterLength = formateFilterLength(costBox, cooperBox, company)
    const pcIdRequest = handlePcId(pcId)
    this.data.directFilterList.map((item) => {
      item.active = false
    })
    this.setData(
      {
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
      },
      () => {
        const {
          dimension,
          projectStatus,
          cost,
          cooperStatus,
          pcId,
          dateSelect,
        } = this.data
        const param = {
          dimension,
          projectStatus,
          cost,
          cooperStatus,
          pcId,
          ...dateSelect,
        }

        Object.keys(param).forEach((key) => {
          if (param[key].length === 0) {
            delete param[key]
          }
        })
        this.setData(
          {
            loading: true,
          },
          () => this._fetchData(param),
        )
      },
    )
  },
  scroll(e) {
    if (e.detail.scrollTop > rpxTopx(80)) {
      this.setData({
        showIcon: true,
      })
    } else {
      this.setData({
        showIcon: false,
      })
    }
  },

  jumpToSearch() {
    Taro.navigateTo({
      url: '/pages/search/index',
    })
  },
  jumpToDetail: function (e) {
    const { id } = e.currentTarget.dataset
    const { list } = this.data
    const filterList = JSON.parse(JSON.stringify(list)).filter(
      ({ maoyanId, projectId }) => maoyanId == id,
    )[0]

    Taro.navigateTo({
      url: `/pages/projectDetail/index`,
      success: function (res) {
        res.eventChannel.emit('acceptDataFromListPage', {
          item: filterList,
        })
      },
    })
  },

  copyMail() {
    Taro.setClipboardData({
      data: 'zhiduoxing@maoyan.com',
    })
  },
  rightContScroll: throttle(rContScrollEvt, 10),

  goTop() {
    if (this.data.filterActive) return
    this.setData({ toView: 'scroll-cont' })
  },
  tapfilmBox(e) {
    const filmDistributionItem = e.target.dataset.item

    if (filmDistributionItem.filmNum == 0) return

    filmDistributionItem &&
      this.setData({
        filmDistributionItem,
        backdropShow: 'costom',
        filmDetailList: true,
      })
  },
  filmScroll() {
    const { limit, offset, hasMore } = this.data.paging
    if (hasMore) {
      this.setData(
        {
          filmLoading: true,
          paging: {
            offset: offset + limit,
            limit,
          },
        },
        () => {
          this.fetchfilmDistribution()
        },
      )
    }
  },
  tapRedPrompt() {
    this.setData({
      redTextShow: true,
    })
  },
  redTextClose() {
    this.setData({
      redTextShow: false,
    })
  },
})
class _C extends React.Component {
  render() {
    const {
      initLoading,
      backdropShow,
      titleHeight,
      barHeight,
      toView,
      redTextShow,
      filmDistributionList,
      filmItemWidth,
      filmItemMarginRight,
      filmLoading,
      topFilmLoading,
      dateText,
      filterActive,
      estimateBoxStr,
      projectBoxStr,
      lastFilterLength,
      loading,
      derictFilterActive1,
      derictFilterActive2,
      derictFilterActive3,
      latestSchedule,
      derictFilterActive4,
      list,
      rightContScrollLeft,
      filterItemHidden1,
      filterItemHidden2,
      filterItemHidden3,
      filterItemHidden4,
      filterItemHidden5,
      filterItemHidden6,
      filterItemHidden7,
      filterItemHidden8,
      filterItemHidden9,
      filterItemHidden10,
      filterItemHidden11,
      filterItemHidden12,
      scheduleType,
      undefined,
      project,
      cooper,
      costomShow,
      filmDistributionItem,
      filmDetailList,
      curPagePermission,
    } = this.data
    return (
      <Block>
        {initLoading && (
          <View className="init-loading">
            <mpLoading
              type="circle"
              show={true}
              animated={true}
              duration={900}
              tips=""
            ></mpLoading>
          </View>
        )}
        {backdropShow === 'costom' && (
          <Backdrop
            onTouchMove={true}
            onMyevent={this.ongetBackDrop}
            backdropShow={backdropShow}
          ></Backdrop>
        )}
        {curPagePermission && !initLoading && (
          <View>
            <View className="header">
              <View
                className="header-bar"
                style={'height:' + titleHeight + 'px;'}
              >
                <View
                  className="header-inner"
                  style={
                    'line-height:' +
                    (titleHeight - barHeight) +
                    'px;padding-top:' +
                    barHeight +
                    'px;'
                  }
                >
                  <View
                    className="search-wrap"
                    style={
                      'top:calc( ' +
                      (titleHeight + barHeight) / 2 +
                      'px -  44rpx)'
                    }
                    onClick={this.jumpToSearch}
                  >
                    <Image
                      className="search"
                      src="../../static/icon/search-white.png"
                    ></Image>
                  </View>
                  <Text onClick={this.goTop}>影片市场情报</Text>
                </View>
              </View>
              {/*  <scroll-view scroll-y class="main" style="height:calc(100vh - {{titleHeight}}px)" bindscroll="scroll" upper-threshold="80rpx" bindscrolltoupper="upper">  */}
              <ScrollView
                scrollY={true}
                scrollIntoView={toView}
                className="main"
                style={'height:calc(100vh - ' + titleHeight + 'px)'}
              >
                <View id="scroll-cont">
                  {/*  上映影片分布  */}
                  <View className="filmDistribution">
                    <View className="title">
                      <Text>未来一年上映影片</Text>
                      <Image
                        onClick={this.tapRedPrompt}
                        className="redText"
                        src="../../static/list/redText.png"
                        alt
                      ></Image>
                      {redTextShow && (
                        <CoverImage
                          src="../../static/list/bubble.png"
                          className="redPrompt"
                        ></CoverImage>
                      )}
                    </View>
                    {filmDistributionList.length !== 0 && (
                      <ScrollView
                        lowerThreshold="2"
                        onScrollToLower={this.filmScroll}
                        scrollX
                      >
                        <View className="filmChart" style="width: 100%;">
                          <Canvas
                            canvasId="chart"
                            style={
                              'width:' +
                              (filmDistributionList.length * 218 + 20) +
                              'rpx;'
                            }
                          ></Canvas>
                        </View>
                        <View
                          className="filmList"
                          style={
                            'width:' +
                            (filmDistributionList.length * 216 + 52) +
                            'rpx;'
                          }
                        >
                          {filmDistributionList.map((item, index) => {
                            return (
                              <View
                                className="filmItem"
                                style={
                                  'width:' +
                                  filmItemWidth +
                                  'px;margin-right:' +
                                  filmItemMarginRight +
                                  'px'
                                }
                                key="yearWeek"
                              >
                                <View className="schedule">
                                  {item.filmSchedule || ''}
                                </View>
                                <View className="time">{item.releaseDate}</View>
                                <View
                                  className={
                                    item.filmNum == 0 ? 'no-filmBox' : 'filmBox'
                                  }
                                  data-item={item}
                                  onClick={this.tapfilmBox}
                                >
                                  <View data-item={item}>
                                    <Text data-item={item}>
                                      {item.keyFilms.length}
                                    </Text>
                                    <Text data-item={item}>部</Text>
                                    {item.filmNum !== 0 && (
                                      <Image
                                        data-item={item}
                                        src="../../static/film.png"
                                        alt
                                      ></Image>
                                    )}
                                  </View>
                                  {item.keyFilms.length === 0 && (
                                    <View data-item={item}>-</View>
                                  )}
                                  {item.keyFilms.length >= 1 && (
                                    <View data-item={item}>
                                      {item.keyFilms[0].movieName}
                                    </View>
                                  )}
                                  {item.keyFilms.length >= 2 && (
                                    <View data-item={item}>
                                      {item.keyFilms[1].movieName}
                                    </View>
                                  )}
                                  {item.keyFilms.length >= 3 && (
                                    <View data-item={item}>
                                      {item.keyFilms[2].movieName}
                                    </View>
                                  )}
                                </View>
                              </View>
                            )
                          })}
                          {filmLoading && (
                            <View className="filmLoading">
                              <mpLoading
                                show={true}
                                type="circle"
                                tips=""
                              ></mpLoading>
                            </View>
                          )}
                        </View>
                      </ScrollView>
                    )}
                    {topFilmLoading && (
                      <View className="list-loading">
                        <mpLoading
                          type="circle"
                          show={true}
                          tips=""
                        ></mpLoading>
                      </View>
                    )}
                    {!topFilmLoading && filmDistributionList.length === 0 && (
                      <View className="film-nodata">暂无数据</View>
                    )}
                  </View>
                  {redTextShow && (
                    <View
                      onClick={this.redTextClose}
                      className="redMessageClose"
                    ></View>
                  )}
                  <View
                    id="filter"
                    className="list"
                    style={'min-height: calc(100vh - ' + titleHeight + 'px)'}
                  >
                    <View
                      className="listFilter"
                      onTouchMove={this.privateStopNoop}
                      id="box"
                    >
                      <View
                        className="listFilter-item"
                        style="width: 189rpx"
                        data-num="4"
                        onClick={this.tapFilterItem}
                      >
                        <Text
                          data-num="4"
                          className="listFilter-item-text filterActive}}"
                        >
                          {dateText}
                        </Text>
                        <Image
                          data-num="4"
                          src={
                            '../../static/' +
                            (filterActive == 4
                              ? 'arrow-down-active'
                              : 'arrow-down') +
                            '.png'
                          }
                        ></Image>
                      </View>
                      <View
                        className="listFilter-item"
                        data-num="1"
                        onClick={this.tapFilterItem}
                      >
                        <Text
                          data-num="1"
                          className={
                            'listFilter-item-text ' +
                            (filterActive == 1 || estimateBoxStr !== ''
                              ? 'filterActive'
                              : '')
                          }
                        >
                          {estimateBoxStr === '' ? '预估票房' : estimateBoxStr}
                        </Text>
                        <Image
                          data-num="1"
                          src={
                            '../../static/' +
                            (filterActive == 1
                              ? 'arrow-down-active'
                              : 'arrow-down') +
                            '.png'
                          }
                        ></Image>
                      </View>
                      <View
                        className="listFilter-item"
                        data-num="2"
                        onClick={this.tapFilterItem}
                      >
                        <Text
                          data-num="2"
                          className={
                            'listFilter-item-text ' +
                            (filterActive == 2 || projectBoxStr !== ''
                              ? 'filterActive'
                              : '')
                          }
                        >
                          {projectBoxStr === '' ? '项目状态' : projectBoxStr}
                        </Text>
                        <Image
                          data-num="2"
                          src={
                            '../../static/' +
                            (filterActive == 2
                              ? 'arrow-down-active'
                              : 'arrow-down') +
                            '.png'
                          }
                        ></Image>
                      </View>
                      <View
                        className="listFilter-item"
                        data-num="3"
                        onClick={this.tapFilterItem}
                      >
                        <Text
                          data-num="3"
                          className={
                            'listFilter-item-text ' +
                            (filterActive == 3 || lastFilterLength > 0
                              ? 'filterActive'
                              : '')
                          }
                        >
                          筛选
                        </Text>
                        {lastFilterLength > 0 && (
                          <Text data-num="3">{lastFilterLength}</Text>
                        )}
                        <Image
                          data-num="3"
                          src={
                            '../../static/' +
                            (filterActive == 3
                              ? 'arrow-down-active'
                              : 'arrow-down') +
                            '.png'
                          }
                        ></Image>
                      </View>
                      {backdropShow === 'filter' && (
                        <Backdrop
                          onTouchMove={this.privateStopNoop}
                          onMyevent={this.ongetBackDrop}
                          backdropShow={backdropShow}
                        ></Backdrop>
                      )}
                      <FilterPanel
                        titleHeight={titleHeight}
                        onMyevent={this.ongetFilterShow}
                        filterShow={filterActive}
                      >
                        {filterActive}
                      </FilterPanel>
                      {!loading && (
                        <View className="extends" onClick={this.tapExtend}>
                          <Image
                            src="../../static/defined.png"
                            style="width: 20rpx; height: 20rpx; margin-left: 72rpx;"
                            alt
                          ></Image>
                        </View>
                      )}
                    </View>
                    <ScrollView className="derictFilter" scrollX>
                      <View className="listDerict">
                        <View
                          data-num="1"
                          onClick={this.tapDerictFilter}
                          className={
                            'listDerict-item ' +
                            (derictFilterActive1 ? 'derictFilterActive' : '')
                          }
                        >
                          猫眼参与
                        </View>
                        <View
                          data-num="2"
                          onClick={this.tapDerictFilter}
                          className={
                            'listDerict-item ' +
                            (derictFilterActive2 ? 'derictFilterActive' : '')
                          }
                        >
                          阿里参与
                        </View>
                        {latestSchedule.name && (
                          <View
                            data-num="3"
                            onClick={this.tapDerictFilter}
                            className={
                              'listDerict-item ' +
                              (derictFilterActive3 ? 'derictFilterActive' : '')
                            }
                          >
                            {latestSchedule.name}
                          </View>
                        )}
                        <View
                          data-num="4"
                          onClick={this.tapDerictFilter}
                          className={
                            'listDerict-item ' +
                            (derictFilterActive4 ? 'derictFilterActive' : '')
                          }
                        >
                          票房1亿以上
                        </View>
                      </View>
                    </ScrollView>
                    {loading && (
                      <View className="list-loading">
                        <mpLoading
                          type="circle"
                          show={true}
                          tips=""
                        ></mpLoading>
                      </View>
                    )}
                    {!loading && (
                      <View className="listTable">
                        <View className="table-left">
                          <View className="listTr tableLeftTitleFixed">
                            <View className="listTd shadow">
                              {list.length + '部影片'}
                            </View>
                          </View>
                          {list.map((item, index) => {
                            return (
                              <Block key="maoyanId">
                                <View
                                  className="listTr"
                                  onClick={this.jumpToDetail}
                                  data-id={item.maoyanId}
                                >
                                  <View
                                    style={
                                      'font-size: 28rpx;font-weight: bold;width: 218rpx;height: ' +
                                      item.trHeight +
                                      'rpx'
                                    }
                                    className="listTd tdPadding shadow"
                                  >
                                    <View>
                                      <View className="movieName">
                                        {item.name}
                                      </View>
                                      {(item.maoyanSignLabel || []).map(
                                        (item, index) => {
                                          return (
                                            <MaoyanSign
                                              key="index"
                                              signContent={item}
                                            ></MaoyanSign>
                                          )
                                        },
                                      )}
                                    </View>
                                  </View>
                                </View>
                              </Block>
                            )
                          })}
                        </View>
                        <View className="table-right">
                          <View className="listTr tableRightTitleFixed">
                            <View
                              className="listTr"
                              style={
                                'left:-' +
                                rightContScrollLeft +
                                'px;position:relative;'
                              }
                            >
                              <View
                                className={
                                  'listTd ' +
                                  (filterItemHidden1 ? 'itemHidden' : '')
                                }
                              >
                                上映日期
                              </View>
                              <View
                                className={
                                  'listTd ' +
                                  (filterItemHidden2 ? 'itemHidden' : '')
                                }
                              >
                                制作成本
                              </View>
                              <View
                                className={
                                  'listTd ' +
                                  (filterItemHidden3 ? 'itemHidden' : '')
                                }
                              >
                                预估票房
                              </View>
                              <View
                                className={
                                  'listTd ' +
                                  (filterItemHidden4 ? 'itemHidden' : '')
                                }
                              >
                                预估评分
                              </View>
                              <View
                                className={
                                  'listTd ' +
                                  (filterItemHidden5 ? 'itemHidden' : '')
                                }
                              >
                                主出品
                              </View>
                              <View
                                className={
                                  'listTd ' +
                                  (filterItemHidden6 ? 'itemHidden' : '')
                                }
                              >
                                主发行
                              </View>
                              <View
                                className={
                                  'listTd ' +
                                  (filterItemHidden7 ? 'itemHidden' : '')
                                }
                              >
                                类型
                              </View>
                              <View
                                className={
                                  'listTd ' +
                                  (filterItemHidden8 ? 'itemHidden' : '')
                                }
                              >
                                导演
                              </View>
                              <View
                                className={
                                  'listTd ' +
                                  (filterItemHidden9 ? 'itemHidden' : '')
                                }
                              >
                                项目状态
                              </View>
                              <View
                                className={
                                  'listTd ' +
                                  (filterItemHidden10 ? 'itemHidden' : '')
                                }
                              >
                                合作状态
                              </View>
                              <View
                                className={
                                  'listTd ' +
                                  (filterItemHidden11 ? 'itemHidden' : '')
                                }
                              >
                                跟进人
                              </View>
                              <View
                                className={
                                  'listTd ' +
                                  (filterItemHidden12 ? 'itemHidden' : '')
                                }
                              >
                                映前想看人数
                              </View>
                            </View>
                          </View>
                          <ScrollView
                            className="rightScroll"
                            scrollX
                            onScroll={this.rightContScroll}
                          >
                            <View
                              className="listTr"
                              style="min-height:0;"
                            ></View>
                            {list.map((item, index) => {
                              return (
                                <Block key="maoyanId">
                                  <View
                                    data-id={item.maoyanId}
                                    onClick={this.jumpToDetail}
                                    className="listTr rightTableHeight"
                                  >
                                    <View
                                      style={'height: ' + item.trHeight + 'rpx'}
                                      className={
                                        'listTd tdPadding ' +
                                        (filterItemHidden1 ? 'itemHidden' : '')
                                      }
                                    >
                                      {item.reRelease && (
                                        <View>
                                          <View>
                                            <View>
                                              <Text>{item.releaseDate}</Text>
                                            </View>
                                          </View>
                                          {item.releaseDate.length !== 4 && (
                                            <View>
                                              <View>
                                                <Text>{item.alias[0]}</Text>
                                              </View>
                                            </View>
                                          )}
                                          <ScheduleType signContent="重映"></ScheduleType>
                                        </View>
                                      )}
                                      {!item.reRelease && (
                                        <View>
                                          <View>
                                            <View>
                                              <Text>{item.releaseDate}</Text>
                                            </View>
                                          </View>
                                          {item.releaseDate.length !== 4 && (
                                            <View>
                                              <View>
                                                <Text>{item.alias[0]}</Text>
                                              </View>
                                            </View>
                                          )}
                                          <ScheduleType
                                            signContent={
                                              item.movieStatus === 2 &&
                                              item.scheduleType === 5
                                                ? ''
                                                : scheduleType[
                                                    item.scheduleType
                                                  ]
                                            }
                                          ></ScheduleType>
                                        </View>
                                      )}
                                    </View>
                                    <View
                                      style={'height: ' + item.trHeight + 'rpx'}
                                      className={
                                        'listTd tdPadding ' +
                                        (filterItemHidden2 ? 'itemHidden' : '')
                                      }
                                    >
                                      {item.cost === null && <Text>-</Text>}
                                      {item.cost !== null && (
                                        <Text>{item.cost}</Text>
                                      )}
                                    </View>
                                    <View
                                      style={'height: ' + item.trHeight + 'rpx'}
                                      className={
                                        'listTd tdPadding ' +
                                        (filterItemHidden3 ? 'itemHidden' : '')
                                      }
                                    >
                                      {item.estimateBox === null && (
                                        <Text>-</Text>
                                      )}
                                      <Text>{item.estimateBox2?.text}</Text>
                                    </View>
                                    <View
                                      style={'height: ' + item.trHeight + 'rpx'}
                                      className={
                                        'listTd tdPadding ' +
                                        (filterItemHidden4 ? 'itemHidden' : '')
                                      }
                                    >
                                      {item.estimateScore === null
                                        ? '-'
                                        : item.estimateScore}
                                    </View>
                                    <View
                                      style={'height: ' + item.trHeight + 'rpx'}
                                      className={
                                        'listTd tdPadding ' +
                                        (filterItemHidden5 ? 'itemHidden' : '')
                                      }
                                    >
                                      <View style>
                                        {(item.producer === null ||
                                          item.producer.length === 0) && (
                                          <Text>-</Text>
                                        )}
                                        <Text>{item.producer?.[0]}</Text>
                                      </View>
                                    </View>
                                    <View
                                      style={'height: ' + item.trHeight + 'rpx'}
                                      className={
                                        'listTd tdPadding ' +
                                        (filterItemHidden6 ? 'itemHidden' : '')
                                      }
                                    >
                                      <View>
                                        {item.issuer === null && <Text>-</Text>}
                                        <Text>{item.issuer?.[0]}</Text>
                                      </View>
                                    </View>
                                    <View
                                      style={'height: ' + item.trHeight + 'rpx'}
                                      className={
                                        'listTd tdPadding ' +
                                        (filterItemHidden7 ? 'itemHidden' : '')
                                      }
                                    >
                                      <Text>{item.movieType}</Text>
                                    </View>
                                    <View
                                      style={'height: ' + item.trHeight + 'rpx'}
                                      className={
                                        'listTd tdPadding ' +
                                        (filterItemHidden8 ? 'itemHidden' : '')
                                      }
                                    >
                                      <View>
                                        {item.director !== undefined
                                          ? item.director
                                          : '-'}
                                      </View>
                                    </View>
                                    <View
                                      style={'height: ' + item.trHeight + 'rpx'}
                                      className={
                                        'listTd tdPadding ' +
                                        (filterItemHidden9 ? 'itemHidden' : '')
                                      }
                                    >
                                      {item.projectStatus > 0 && (
                                        <Text>
                                          {project[item.projectStatus]}
                                        </Text>
                                      )}
                                      {item.projectStatus == 0 && (
                                        <Text>-</Text>
                                      )}
                                      {item.projectStatus == null && (
                                        <Text>-</Text>
                                      )}
                                    </View>
                                    <View
                                      style={'height: ' + item.trHeight + 'rpx'}
                                      className={
                                        'listTd tdPadding ' +
                                        (filterItemHidden10 ? 'itemHidden' : '')
                                      }
                                    >
                                      {item.cooperStatus != null && (
                                        <Text>{cooper[item.cooperStatus]}</Text>
                                      )}
                                      {item.cooperStatus == 0 && <Text>-</Text>}
                                    </View>
                                    {item.principal?.map((items, index) => {
                                      return (
                                        <View
                                          style={
                                            'height: ' + item.trHeight + 'rpx'
                                          }
                                          className={
                                            'listTd tdPadding ' +
                                            (filterItemHidden11
                                              ? 'itemHidden'
                                              : '')
                                          }
                                        >
                                          {item.principal !== null && (
                                            <Block>
                                              {item.principal.map(
                                                (item, index) => {
                                                  return (
                                                    <Text key="index">
                                                      {item}
                                                    </Text>
                                                  )
                                                },
                                              )}
                                            </Block>
                                          )}
                                          {item.principal == null && (
                                            <Text>-</Text>
                                          )}
                                        </View>
                                      )
                                    })}
                                    <View
                                      style={'height: ' + item.trHeight + 'rpx'}
                                      className={
                                        'listTd tdPadding ' +
                                        (filterItemHidden12 ? 'itemHidden' : '')
                                      }
                                    >
                                      <View>
                                        <Text>{item.wishNum || '-'}</Text>
                                        {item.sevenDayIncreaseWish && (
                                          <View>
                                            {'近七日新增 ' +
                                              item.sevenDayIncreaseWish.text}
                                          </View>
                                        )}
                                      </View>
                                    </View>
                                  </View>
                                </Block>
                              )
                            })}
                          </ScrollView>
                        </View>
                        {list.length !== 0 && (
                          <View className="noMore">没有更多了</View>
                        )}
                      </View>
                    )}
                    {!loading && list.length == 0 && (
                      <View className="no-data">暂无数据</View>
                    )}
                  </View>
                </View>
              </ScrollView>
            </View>
            <View className="customListItem">
              <CostumListItem
                onMyevent={this.ongetCostom}
                costomShow={costomShow}
              ></CostumListItem>
            </View>
            <FilmDetailList
              filmDistributionItem={filmDistributionItem}
              onMyevent={this.ongetCostom}
              show={filmDetailList}
            ></FilmDetailList>
          </View>
        )}
        {/*  无权限页面  */}
        {!curPagePermission && !initLoading && (
          <View>
            <View className="no-access">
              <View
                className="header-bar"
                style={'height:' + titleHeight + 'px;'}
              >
                <View
                  className="header-inner"
                  style={
                    'line-height:' +
                    (titleHeight - barHeight) +
                    'px;padding-top:' +
                    barHeight +
                    'px;'
                  }
                >
                  <Text>影片市场情报</Text>
                </View>
              </View>
              <Image src="../../static/list/no-access.png"></Image>
              <View className="title">暂无权限查看相关数据</View>
              <View className="content">
                申请开通请联系zhiduoxing@maoyan.com
              </View>
              <View className="btn" onClick={this.copyMail}>
                复制邮箱
              </View>
            </View>
          </View>
        )}
      </Block>
    )
  }
}

export default _C
