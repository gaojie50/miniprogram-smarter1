import { Block, View, Image, Text, ScrollView } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import utils from '../../utils/index.js'
import projectConfig from '../../constant/project-config.js'

import FilmDetailList from '../../components/filmDetailList/index'
import CostumListItem from '../../components/costomListItem/index'
import FilterPanel from '../../components/filterPanel/index'
import Backdrop from '../../components/backdrop/index'
import FilmDistribution from '../../components/filmDistribution/index'
import { set as setGlobalData, get as getGlobalData } from '../../global_data'

import './index.scss'
const { getMaoyanSignLabel } = projectConfig

const {
  rpxTopx,
  formatNumber,
  formatDirector,
  getFutureTimePeriod,
  handleReleaseDesc,
  handleNewDate,
  formatWeekDate,
} = utils

const reqPacking = getGlobalData('reqPacking')
const capsuleLocation = getGlobalData('capsuleLocation')
const {statusBarHeight} = getGlobalData('systemInfo')

function strip(num, precision = 12) {
  return +parseFloat(num.toPrecision(precision));
}

class _C extends React.Component {
  state = {
    filmItemWidth: rpxTopx(216),
    filmItemMarginRight: rpxTopx(10),
    initLoading: true,
    loading: true,
    topFilmLoading: true,
    curPagePermission: false,
    filterActive: '',
    backdropShow: '',
    costomShow: false,
    isScroll: true,
    statusBarHeight,
    titleHeight: Math.floor(
      capsuleLocation.bottom + capsuleLocation.top - statusBarHeight,
    ),
    gapHeight: Math.floor(capsuleLocation.top - statusBarHeight),
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
    isShowFilmDetailList: false,
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
    yMaxLength:0,
  }

  onLoad = ({ token }) => {
    if (token) Taro.setStorageSync('token', token)

    this.setState({
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
      this.setState({
        curPagePermission: true,
        initLoading: false,
      })
      this.fetchfilmDistribution()
      this.fetchSchedule()
      this.setState({ loading: true }, () =>
        this._fetchData(this.state.dateSelect),
      )
    } else {
      reqPacking(
        {
          url: 'api/user/authinfo',
        },
        'passport',
      ).then(({ success, data }) => {
        if (success) {
          setGlobalData('authinfo', data)
          Taro.setStorageSync('authinfo', data);

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

            this.setState(
              {
                loading: true,
                curPagePermission: true,
                initLoading: false,
              },
              () => {
                this.fetchfilmDistribution()
                this.fetchSchedule()
                this._fetchData(this.state.dateSelect)
              },
            )
          }

          this.setState({
            initLoading: false,
          })
        }

        this.setState({
          initLoading: false,
        })
      })
    }
  }

  fetchfilmDistribution = () => {
    const { offset, limit } = this.state.paging
    const query = {
      offset,
      limit,
    }

    reqPacking({
      url: 'api/applet/management/filmDistribution',
      data: query,
    }).then((res) => {
      const { success, data = [], paging } = res
      if (success && data) {
        data.map((item) => {
          if (item.filmSchedule && item.filmSchedule.length > 0) {
            item.filmSchedule = formatDirector(item.filmSchedule)
          }
          if (item.keyFilms && item.keyFilms.length > 0) {
            (item.keyFilms || []).map((item2) => {
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
                ? `${item2.pic.replace('/w.h/', '/460.660/')}`
                : `../../static/icon/default-pic.svg`
              item2.wishNum = formatNumber(item2.wishNum)
            })
          }
          item.releaseDate = formatWeekDate(item.releaseDate)
        })

        this.setState({
          filmDistributionList: this.state.filmDistributionList.concat(data),
          paging,
          filmLoading: false,
          topFilmLoading: false,
        })
      } else {
        this.setState({
          filmDistributionList: [],
          topFilmLoading: false,
        })
      }
    })
  }

  fetchSchedule = () => {
    reqPacking({
      url: 'api/applet/management/latestSchedule',
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          latestSchedule: data,
        })
      }
    })
  }

  _fetchData = (param = {}) => {
    reqPacking({
      url: 'api/management/list',
      data: param,
      method: 'POST',
    }).then(({ success, data = [], error }) => {
      if (success && data) {
        data.map((item) => {
          if (item.maoyanSign && item.maoyanSign.length > 0) {
            item.maoyanSignLabel = getMaoyanSignLabel(item.maoyanSign)
          }
          if (item.estimateBox) {
            item.estimateBox2 = formatNumber(item.estimateBox)
          }

          item.releaseDate = handleReleaseDesc(item.showType, item.releaseDesc)
          item.cost = formatNumber(item.cost).text
          item.director = formatDirector(item.director)
          item.movieType = item.movieType && item.movieType.replace(/,/g, '/')

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

        return this.setState({
          list: data,
          subList: data,
          loading: false,
        })
      }

      if(error && (error.code == 12110002)){
        Taro.removeStorageSync('token');
        Taro.removeStorageSync('listPermission');
 
        Taro.reLaunch({ url:'../welcome/index' })
      };
      
      this.setState({
        list: [],
        subList: [],
        loading: false,
      })
    })
  }

  tapFilterItem = (e) => {
    const num = e.target.dataset.num
    const { filterActive } = this.state
    if (num == filterActive) {
      this.setState({
        toView: 'filter',
        filterActive: '',
        backdropShow: '',
        isScroll: true,
      })
    } else {
      this.setState({
        toView: 'filter',
        filterActive: e.target.dataset.num,
        backdropShow: 'filter',
        isScroll: false,
      })
    }
  }

  tapDerictFilter = (e) => {
    const num = e.target.dataset.num
    const derictFilterWrap = this.state
    let newDataList = []
    derictFilterWrap[`derictFilterActive${num}`] = !derictFilterWrap[
      `derictFilterActive${num}`
    ]
    this.setState(
      {
        ...derictFilterWrap,
      },
      () => {
        const {
          subList = [],
          latestSchedule,
          directFilterList = [],
        } = this.state
        const list = subList || []

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
          this.setState({
            list: subList,
          })
        } else {
          list.map((item) => {
            //只看猫眼参与
            if (directFilterList[0].active && item.company.indexOf(1) !== -1) {
              for (let i = 0; i < newDataList.length; i++) {
                if (
                  newDataList[i].maoyanId == item.maoyanId &&
                  newDataList[i].projectId == item.projectId
                ) {
                  newDataList.splice(i, 1)
                }
              }
              newDataList.push(item)
            }

            //只看阿里参与
            if (directFilterList[1].active && item.company.indexOf(2) !== -1) {
              for (let i = 0; i < newDataList.length; i++) {
                if (
                  newDataList[i].maoyanId == item.maoyanId &&
                  newDataList[i].projectId == item.projectId
                ) {
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
          this.setState({
            list: newDataList,
          })
        }
      },
    )
  }

  tapExtend = () => {
    const dataList = this.state
    dataList.backdropShow = 'costom'
    dataList.costomShow = true
    this.setState({
      ...dataList,
    })
  }

  ongetBackDrop = () => {
    this.setState({
      backdropShow: '',
      filterActive: '',
      costomShow: false,
      isShowFilmDetailList: false,
      isScroll: true,
    })
  }

  ongetCostom = (e) => {
    const dataList = this.state
    dataList.backdropShow = ''
    dataList.costomShow = false
    dataList.isShowFilmDetailList = false
    dataList.toView = ''
    if (Array.isArray(e)) {
      dataList.filterItemHidden = e
      this.setState(
        {
          ...dataList,
        },
        () => {
          this.fetchFilterShow()
        },
      )
    } else {
      this.setState({
        ...dataList,
      })
    }
  }

  fetchFilterShow = () => {
    const dataList = this.state
    dataList.filterItemHidden.map((item, index) => {
      dataList[`filterItemHidden${item}`] = true
    })
    for (let i = 1; i < 13; i++) {
      if (dataList.filterItemHidden.indexOf(i) === -1) {
        dataList[`filterItemHidden${i}`] = false
      }
    }
    this.setState({
      ...dataList,
    })
  }

  ongetFilterShow = (e) => {
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
    } = e

    const checkedDate = e.dateSet.filter((item) => item.checked == 'checked')[0]
    const dateValue = checkedDate.value
    let { dateText, dateSelect } = this.state

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
    this.state.directFilterList.map((item) => {
      item.active = false
    })
    this.setState(
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
        isScroll: true,
      },
      () => {
        const {
          dimension,
          projectStatus,
          cost,
          cooperStatus,
          pcId,
          dateSelect,
        } = this.state
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
        this.setState(
          {
            loading: true,
          },
          () => this._fetchData(param),
        )
      },
    )
  }

  jumpToSearch = () => {
    Taro.navigateTo({
      url: '/pages/search/index',
      // url:'/pages/result/index?projectId=14332&roundId=351'
    })
  }

  copyMail = () => {
    Taro.setClipboardData({
      data: 'zhiduoxing@maoyan.com',
    })
  }

  goTop = () => {
    if (this.state.filterActive) return
    this.setState({ toView: 'scroll-cont' })
  }

  tapfilmBox = (index) => {
    const filmDistributionItem = this.state.filmDistributionList[index]
    if (filmDistributionItem.filmNum == 0) return
    filmDistributionItem &&
      this.setState({
        filmDistributionItem,
        backdropShow: 'costom',
        isShowFilmDetailList: true,
      })
  }

  filmScroll = () => {
    const { limit, offset, hasMore } = this.state.paging
    if (hasMore) {
      this.setState(
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
  }

  tapRedPrompt = () => {
    this.setState({
      redTextShow: true,
    })
  }

  redTextClose = () => {
    this.setState({
      redTextShow: false,
    })
  }

  setMaxLengthY = yMaxLength => this.setState({ yMaxLength });

  render() {
    const {
      initLoading,
      backdropShow,
      titleHeight,
      statusBarHeight,
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
      costomShow,
      filmDistributionItem,
      isShowFilmDetailList,
      curPagePermission,
      isScroll,
      yMaxLength,
    } = this.state;
    
    const yMaxLengthArr = ["","","","","",""].map((item,index)=>strip(formatNumber(yMaxLength * (1 - index/5)).posNum));
    
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
            ongetBackDrop={this.ongetBackDrop}
            backdropShow={backdropShow}
          ></Backdrop>
        )}
        {curPagePermission && !initLoading && (
          <View>
            <View className="header" style={`height:${titleHeight + rpxTopx(115)}px`}>
              <View
                className="header-bar"
                style={'height:' + titleHeight + 'px;'}
              >
                <View
                  className="header-inner"
                  style={
                    'line-height:' +
                    (titleHeight - statusBarHeight) +
                    'px;padding-top:' +
                    statusBarHeight +
                    'px;'
                  }
                >
                  <View
                    className="search-wrap"
                    style={
                      'top:calc( ' +
                      (titleHeight + statusBarHeight) / 2 +
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
              <ScrollView
                scrollY={isScroll}
                scrollIntoView={toView}
                className="main"
                style={'height:calc(100vh - ' + titleHeight + 'px)'}
                onScroll={() => {
                  toView !== '' &&
                    this.setState({
                      toView: '',
                    })
                }}
              >
                <View id="scroll-cont">
                  <View className="filmDistribution">
                    <View className="title">
                      <Text>待映影片及预估大盘</Text>
                      <Image
                        onClick={this.tapRedPrompt}
                        className="redText"
                        src="../../static/list/redText.png"
                        alt
                      ></Image>
                      {redTextShow && (
                        <Image
                          src="../../static/list/bubble.png"
                          className="redPrompt"
                        ></Image>
                      )}
                      <View className="toolTipSign">
                        <View>已定档</View>
                        <View>
                          <Image
                            src="../../static/list/dash.svg"
                          ></Image>
                          含可能定档</View>
                      </View>
                    </View>
                    {
                      filmDistributionList.length !== 0 && <View className="yAxis">{ yMaxLengthArr.map((item,index)=> <Text key={index}>{item}亿</Text> )}</View>
                    }
                    {filmDistributionList.length !== 0 && (
                      <FilmDistribution
                        filmInfo={{
                          filmDistributionList,
                          filmItemWidth,
                          filmItemMarginRight,
                          filmLoading,
                          topFilmLoading,
                        }}
                        setMaxLengthY = {this.setMaxLengthY}
                        onTapfilmBox={this.tapfilmBox}
                        onFilmScroll={this.filmScroll}/>
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
                  <View
                    onClick={this.redTextClose}
                    className="redMessageClose"
                    style={{ display: redTextShow ? 'block' : 'none' }}
                  ></View>

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
                      {/* <View
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
                      </View> */}
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
                          ongetBackDrop={this.ongetBackDrop}
                          backdropShow={backdropShow}
                        ></Backdrop>
                      )}
                      <FilterPanel
                        titleHeight={titleHeight}
                        ongetFilterShow={this.ongetFilterShow}
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
                        <movielist
                          list={list}
                          filterItemHidden1={filterItemHidden1}
                          filterItemHidden2={filterItemHidden2}
                          filterItemHidden3={filterItemHidden3}
                          filterItemHidden4={filterItemHidden4}
                          filterItemHidden5={filterItemHidden5}
                          filterItemHidden6={filterItemHidden6}
                          filterItemHidden7={filterItemHidden7}
                          filterItemHidden8={filterItemHidden8}
                          filterItemHidden9={filterItemHidden9}
                          filterItemHidden10={filterItemHidden10}
                          filterItemHidden11={filterItemHidden11}
                          filterItemHidden12={filterItemHidden12}
                        />
                      </View>
                    )}
                    {/* {!loading && list.length === 0 && (
                      <View className="no-data">暂无数据</View>
                    )} */}
                  </View>
                </View>
              </ScrollView>
            </View>
            <View className="customListItem">
              <CostumListItem
                ongetCostom={this.ongetCostom}
                costomShow={costomShow}
              ></CostumListItem>
            </View>
            <FilmDetailList
              filmDistributionItem={filmDistributionItem}
              ongetCostom={this.ongetCostom}
              show={isShowFilmDetailList}
              titleHeight={titleHeight} />
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
                    (titleHeight - statusBarHeight) +
                    'px;padding-top:' +
                    statusBarHeight +
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
