import {
  Block,
  View,
  ScrollView,
  Image,
  Text,
  PickerView,
  PickerViewColumn
} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../../utils/index.js'


import './index.scss'
const { getFutureTimePeriod, calcWeek, assignDeep, handleNewDate } = utils
const defaultCustomDate = getFutureTimePeriod(180)
const date = new Date()
let years = []
let months = []
let days = []

for (let i = 2011; i <= date.getFullYear() + 30; i++) years.push(i)
for (let i = 1; i <= 12; i++) months.push(i)
for (let i = 1; i <= 31; i++) days.push(i)

function formartDate(stamp) {
  const dateObj = handleNewDate(stamp)
  const yearStr = dateObj.getFullYear()
  const monthInner = dateObj.getMonth() + 1
  const dayInner = dateObj.getDate()
  const monthStr = monthInner < 10 ? `0${monthInner}` : monthInner
  const dayStr = dayInner < 10 ? `0${dayInner}` : dayInner

  return `${yearStr}.${monthStr}.${dayStr}`
}

function handleDays(day, long, sign = 'add') {
  const date = handleNewDate(day)

  if (sign == 'add') return date.setDate(date.getDate() + Number(long))

  return date.setDate(date.getDate() - Number(long))
}
function dateValueCommon(timeStamp) {
  const innerTimeStamp = handleNewDate(timeStamp)

  return [
    years.indexOf(innerTimeStamp.getFullYear()),
    months.indexOf(innerTimeStamp.getMonth() + 1),
    days.indexOf(innerTimeStamp.getDate()),
  ]
}

@withWeapp({
  properties: {
    filterShow: {
      type: String,
      value: '4',
    },
    titleHeight: {
      type: Number,
      value: 100,
    },
  },
  data: {
    dimension: [],
    projectStatus: [],
    cost: [],
    cooperStatus: [],
    pcId: [],
    company: {},
    companyList: [
      {
        id: 37786,
        name: '上海猫眼影业有限公司',
      },
      {
        id: 1230,
        name: '天津猫眼微影文化传媒有限公司',
      },
    ],
    dateSet: [
      {
        label: '未来30天',
        checked: '',
        value: 30,
      },
      {
        label: '未来90天',
        checked: '',
        value: 90,
      },
      {
        label: '未来1年',
        checked: 'checked',
        value: 365,
      },
      {
        label: '自定义',
        checked: '',
        value: 'custom',
      },
    ],
    estimateBox: [
      {
        value: '10亿以上',
        active: false,
      },
      {
        value: '5亿～10亿',
        active: false,
      },
      {
        value: '1亿～5亿',
        active: false,
      },
      {
        value: '5000万～1亿',
        active: false,
      },
      {
        value: '5000万以下',
        active: false,
      },
      {
        value: '未知',
        active: false,
      },
    ],
    projectBox: [
      {
        value: '筹备',
        active: false,
      },
      {
        value: '拍摄',
        active: false,
      },
      {
        value: '后期',
        active: false,
      },
      {
        value: '待过审',
        active: false,
      },
      {
        value: '已过审',
        active: false,
      },
      {
        value: '已上映',
        active: false,
      },
      {
        value: '未知',
        active: false,
      },
    ],
    costBox: [
      {
        value: '8000万以上',
        active: false,
      },
      {
        value: '5000万～8000万',
        active: false,
      },
      {
        value: '1000万～5000万',
        active: false,
      },
      {
        value: '1000万以下',
        active: false,
      },
      {
        value: '未知',
        active: false,
      },
    ],
    cooperBox: [
      {
        value: '评估中',
        active: false,
      },
      {
        value: '跟进中',
        active: false,
      },
      {
        value: '未合作',
        active: false,
      },
      {
        value: '开发中',
        active: false,
      },
      {
        value: '投资中',
        active: false,
      },
    ],
    years,
    months,
    days,
    dateValue: dateValueCommon(defaultCustomDate.startDate),
    customStartDate: {
      value: formartDate(defaultCustomDate.startDate),
      week: calcWeek(defaultCustomDate.startDate),
    },
    customEndDate: {
      value: formartDate(defaultCustomDate.endDate),
      week: calcWeek(defaultCustomDate.endDate),
    },
    dateShowFirstActive: true,
    showDateSureBtn: false,
  },
  methods: {
    dateSelect: function (e) {
      const val = e.detail.value
      const {
        dateShowFirstActive,
        years,
        months,
        days,
        customEndDate,
        customStartDate,
      } = this.data
      let timeStamp = +new Date(
        `${years[val[0]]}/${months[val[1]]}/${days[val[2]]}`,
      )
      let obj = {}
      if (dateShowFirstActive) {
        //开始时间大于结束时间
        if (timeStamp > +handleNewDate(customEndDate.value)) {
          obj.customEndDate = {
            value: formartDate(timeStamp),
            week: calcWeek(timeStamp),
          }
        }
        //一年时间限制 限制开始日期
        const minimumTimeStamp = +handleDays(
          customEndDate.value,
          180,
          'subtract',
        )

        if (timeStamp < minimumTimeStamp) {
          const endStamp = +handleDays(timeStamp, 180)

          obj.customEndDate = {
            value: formartDate(endStamp),
            week: calcWeek(endStamp),
          }
        }

        obj['customStartDate'] = {
          value: formartDate(timeStamp),
          week: calcWeek(timeStamp),
        }
        obj.dateValue = dateValueCommon(timeStamp)
        return this.setData(obj)
      }

      //结束时间小于开始时间
      if (timeStamp < +handleNewDate(customStartDate.value)) {
        obj.customStartDate = {
          value: formartDate(timeStamp),
          week: calcWeek(timeStamp),
        }
      }

      //一年时间限制 限制结束日期
      const maxTimeStamp = +handleDays(customStartDate.value, 180)
      if (timeStamp > maxTimeStamp) {
        const startStamp = +handleDays(timeStamp, 180, 'subtract')

        obj.customStartDate = {
          value: formartDate(startStamp),
          week: calcWeek(startStamp),
        }
      }

      obj['customEndDate'] = {
        value: formartDate(timeStamp),
        week: calcWeek(timeStamp),
      }

      obj.dateValue = dateValueCommon(timeStamp)
      this.setData(obj)
    },

    switchDate: function (e) {
      const { sign } = e.currentTarget.dataset
      const {
        dateShowFirstActive,
        customStartDate,
        customEndDate,
      } = assignDeep(this.data)

      if (
        (dateShowFirstActive && sign == 'begin') ||
        (!dateShowFirstActive && sign != 'begin')
      )
        return

      if (sign == 'begin') {
        return this.setData({
          dateShowFirstActive: true,
          dateValue: dateValueCommon(customStartDate.value),
        })
      }

      this.setData({
        dateShowFirstActive: false,
        dateValue: dateValueCommon(customEndDate.value),
      })
    },

    dateSelectEvent: function (e) {
      const { value } = e.target.dataset
      let { dateSet, showDateSureBtn } = this.data

      if (
        dateSet.some((item) => item.value == value && item.checked == 'checked')
      )
        return

      const dateSetVar = dateSet.map((item) => {
        item.checked = ''
        if (item.value == value) {
          item.checked = 'checked'
          showDateSureBtn = item.label == '自定义'
        }
        return item
      })

      this.setData(
        {
          dateSet: dateSetVar,
          showDateSureBtn,
        },
        () => {
          const { showDateSureBtn } = this.data

          if (!showDateSureBtn) this.filterDefinedDate()
        },
      )
    },
    tapEstimateBox: function (e) {
      const num = e.target.dataset.num
      const newEstimateBox = this.data.estimateBox
      newEstimateBox[num].active = !newEstimateBox[num].active
      this.setData({
        estimateBox: newEstimateBox,
      })
    },
    tapProjectStatus: function (e) {
      const num = e.target.dataset.num
      const newprojectBox = this.data.projectBox
      newprojectBox[num].active = !newprojectBox[num].active
      this.setData({
        projectBox: newprojectBox,
      })
    },
    tapCost: function (e) {
      const num = e.target.dataset.num
      const newcostBox = this.data.costBox
      newcostBox[num].active = !newcostBox[num].active
      this.setData({
        costBox: newcostBox,
      })
    },
    tapCooper: function (e) {
      const num = e.target.dataset.num
      const newcooperBox = this.data.cooperBox
      newcooperBox[num].active = !newcooperBox[num].active
      this.setData({
        cooperBox: newcooperBox,
      })
    },
    tapCompany: function (e) {
      const num = e.target.dataset.num
      const { companyList } = this.data
      const dataList = this.data
      if (JSON.stringify(dataList.company) == '{}') {
        for (let m = 0; m < companyList.length; m++) {
          dataList.company[m] = ''
        }
      }
      if (num != null) {
        if (dataList.company[num] == '') {
          dataList.company[num] = 'active'
        } else {
          dataList.company[num] = ''
        }
      }
      this.setData({
        ...dataList,
      })
    },
    tapCompanyText: function (e) {
      const num = e.target.dataset.num
      const { companyList } = this.data
      const dataList = this.data
      if (JSON.stringify(dataList.company) == '{}') {
        for (let m = 0; m < companyList.length; m++) {
          dataList.company[m] = ''
        }
      }
      if (num != null) {
        if (dataList.company[num] !== '') {
          dataList.company[num] = 'active'
        } else {
          dataList.company[num] = ''
        }
      }
      this.setData({
        ...dataList,
      })
    },
    filterReset: function () {
      const { filterShow, estimateBox, projectBox } = this.data
      if (filterShow == '1') {
        estimateBox.map((item) => {
          item.active = false
        })
        this.setData({
          estimateBox,
        })
      } else if (filterShow == '2') {
        projectBox.map((item) => {
          item.active = false
        })
        this.setData({
          projectBox,
        })
      } else if (filterShow == '3') {
        const dataList = this.data
        dataList.costBox.map((item) => {
          item.active = false
        })
        dataList.cooperBox.map((item) => {
          item.active = false
        })
        for (let j = 0; j < dataList.companyList.length; j++) {
          dataList.company[j] = ''
        }
        this.setData({
          ...dataList,
        })
      }
    },
    filterDefined: function () {
      const {
        estimateBox,
        projectBox,
        costBox,
        cooperBox,
        dimension,
        projectStatus,
        cost,
        cooperStatus,
        dateSet,
        pcId,
        company,
        companyList,
        customStartDate,
        customEndDate,
      } = this.data
      //处理预估票房
      estimateBox.map((item, index) => {
        if (item.active && dimension.indexOf(index + 1) === -1) {
          dimension.push(index + 1)
        }
        if (!item.active && dimension.indexOf(index + 1) !== -1) {
          const i = dimension.indexOf(index + 1)
          dimension.splice(i, 1)
        }
      })
      //处理项目状态
      projectBox.map((item, index) => {
        if (item.active && projectStatus.indexOf(index + 1) === -1) {
          projectStatus.push(index + 1)
        }
        if (!item.active && projectStatus.indexOf(index + 1) !== -1) {
          const i = projectStatus.indexOf(index + 1)
          projectStatus.splice(i, 1)
        }
      })
      //处理筛选
      costBox.map((item, index) => {
        if (item.active && cost.indexOf(index + 1) === -1) {
          cost.push(index + 1)
        }
        if (!item.active && cost.indexOf(index + 1) !== -1) {
          const i = cost.indexOf(index + 1)
          cost.splice(i, 1)
        }
      })
      cooperBox.map((item, index) => {
        if (item.active && cooperStatus.indexOf(index + 1) === -1) {
          cooperStatus.push(index + 1)
        }
        if (!item.active && cooperStatus.indexOf(index + 1) !== -1) {
          const i = cooperStatus.indexOf(index + 1)
          cooperStatus.splice(i, 1)
        }
      })
      companyList.map((item, index) => {
        if (company[index] === 'active') {
          if (pcId.length !== 0) {
            let add = true
            pcId.map((item1) => {
              if (item1.id == companyList[index].id) {
                add = false
              }
            })
            if (add) {
              pcId.push(companyList[index])
            }
          } else {
            pcId.push(companyList[index])
          }
        }
        if (company[index] !== 'active') {
          pcId.map((item2, i) => {
            if (item2.id === companyList[index].id) {
              pcId.splice(i, 1)
            }
          })
        }
      })

      const myEventDetail = {
        dimension,
        projectStatus,
        cost,
        cooperStatus,
        dateSet,
        pcId,
        estimateBox,
        projectBox,
        costBox,
        cooperBox,
        company,
        customStartDate,
        customEndDate,
      }

      this.triggerEvent('myevent', myEventDetail)
    },
    filterDefinedDate: function () {
      const {
        dimension,
        projectStatus,
        cost,
        cooperStatus,
        pcId,
        dateSet,
        customStartDate,
        customEndDate,
        estimateBox,
        projectBox,
        costBox,
        cooperBox,
        company,
      } = this.data
      this.triggerEvent('myevent', {
        dimension,
        projectStatus,
        cost,
        cooperStatus,
        pcId,
        dateSet,
        customStartDate,
        customEndDate,
        estimateBox,
        projectBox,
        costBox,
        cooperBox,
        company,
      })
    },
    movieAdd: function () {
      Taro.navigateTo({
        url: '/pages/searchCompany/index',
        events: {
          searchPCFinish: (data) => {
            const { companyChecked } = data
            const { companyList } = this.data

            if (companyChecked.length !== 0) {
              let toastStr = ''
              for (let j = 0; j < companyList.length; j++) {
                for (let i = 0; i < companyChecked.length; i++) {
                  if (companyList[j].id === companyChecked[i].id) {
                    this.data.company[j] = 'active'
                    toastStr = toastStr + companyChecked[i].name + '、'
                    companyChecked.splice(i, 1)
                    i--
                  }
                }
              }
              toastStr = toastStr.substring(0, toastStr.length - 1)
              if (toastStr.length !== 0) {
                if (toastStr.length > 30) {
                  toastStr = toastStr.substring(0, 30)
                  toastStr = toastStr + '...'
                }
                Taro.showToast({
                  title: `${toastStr}已存在`,
                  icon: 'none',
                  duration: 4000,
                })
              }

              const newCompanyList = companyList.concat(companyChecked)
              const newCompany = this.data.company
              for (let i = companyList.length; i < newCompanyList.length; i++) {
                newCompany[i] = 'active'
              }
              this.setData({
                companyList: newCompanyList,
                company: newCompany,
              })
            }
          },
        },
      })
    },
    handleTouchMove() {
      return
    },
  },
})
class _C extends React.Component {
  render() {
    const {
      filterShow,
      titleHeight,
      dateShowFirstActive,
      customStartDate,
      customEndDate,
      dateValue,
      years,
      months,
      days,
      dateSet,
      estimateBox,
      projectBox,
      costBox,
      cooperBox,
      company,
      companyList,
      showDateSureBtn,
    } = this.data

    return (
      filterShow.length != 0 && (
        <View className="filterPanel">
          <View
            className={filterShow.length != 0 ? 'filterPanelWrap' : ''}
            onTouchMove={this.handleTouchMove}
          >
            <View
              className={'filterPanels ' + (filterShow == '4' ? 'date' : '')}
            >
              {filterShow == '4' && (
                <ScrollView
                  className="dateBox"
                  style={
                    'max-height: calc(100vh * 0.75 - ' + titleHeight + 'px)'
                  }
                  scrollY
                >
                  {dateSet.map((item, index) => {
                    return (
                      <Block key="value">
                        <View
                          className={item.checked + ' item'}
                          data-value={item.value}
                          onClick={this.dateSelectEvent}
                        >
                          <Image
                            className="pic"
                            src='../../static/icon/checked.png'
                          ></Image>
                          {item.label}
                        </View>
                        {item.value == 'custom' && item.checked == 'checked' && (
                          <View className="custom-box">
                            <View className="date-show">
                              <View
                                className={
                                  'left ' +
                                  (dateShowFirstActive ? 'active' : '')
                                }
                                data-sign="begin"
                                onClick={this.switchDate}
                              >
                                <View className="detail">
                                  {customStartDate.value}
                                </View>
                                <Text className="week">
                                  {customStartDate.week}
                                </Text>
                              </View>
                              <View><Text>至</Text></View>
                              <View
                                className={
                                  'right ' +
                                  (!dateShowFirstActive ? 'active' : '')
                                }
                                data-sign="end"
                                onClick={this.switchDate}
                              >
                                <View className="detail">
                                  {customEndDate.value}
                                </View>
                                <Text className="week">
                                  {customEndDate.week}
                                </Text>
                              </View>
                            </View>
                            <PickerView
                              value={dateValue}
                              indicatorClass="data-selected"
                              onChange={this.dateSelect}
                              className="date-box"
                            >
                              <PickerViewColumn>
                                {years.map((item, index) => {
                                  return (
                                    <View
                                      key="item"
                                      style="line-height: 60rpx;text-align:right;"
                                    >
                                      {item + '年'}
                                    </View>
                                  )
                                })}
                              </PickerViewColumn>
                              <PickerViewColumn>
                                {months.map((item, index) => {
                                  return (
                                    <View
                                      key="item"
                                      style="line-height: 60rpx;text-align:center;"
                                    >
                                      {item + '月'}
                                    </View>
                                  )
                                })}
                              </PickerViewColumn>
                              <PickerViewColumn>
                                {days.map((item, index) => {
                                  return (
                                    <View
                                      key="item"
                                      style="line-height: 60rpx;text-align:left;"
                                    >
                                      {item + '日'}
                                    </View>
                                  )
                                })}
                              </PickerViewColumn>
                            </PickerView>
                          </View>
                        )}
                      </Block>
                    )
                  })}
                </ScrollView>
              )}
              {/*  预估票房  */}
              {filterShow == '1' && (
                <View className="estimateBox">
                  {estimateBox.map((item, index) => {
                    return (
                      <View
                        key="index"
                        data-num={index}
                        onClick={this.tapEstimateBox}
                        className={
                          'estimateBox-item ' +
                          (item.active ? 'filterPanelActive' : '')
                        }
                        style="margin-right: 20rpx;margin-bottom: 20rpx"
                      >
                        {item.value}
                      </View>
                    )
                  })}
                </View>
              )}
              {/*  项目状态  */}
              {filterShow == '2' && (
                <View className="projectStatus">
                  {projectBox.map((item, index) => {
                    return (
                      <View
                        key="index"
                        data-num={index}
                        onClick={this.tapProjectStatus}
                        className={
                          'projectStatus-item ' +
                          (item.active ? 'filterPanelActive' : '')
                        }
                        style="margin-right: 20rpx;margin-bottom: 20rpx"
                      >
                        {item.value}
                      </View>
                    )
                  })}
                </View>
              )}
              {/*  筛选  */}
              {filterShow == '3' && (
                <View className="filter">
                  <ScrollView
                    scrollY="true"
                    className="scroll-area"
                    style={
                      'max-height: calc(100vh * 0.75 - ' + titleHeight + 'px)'
                    }
                  >
                    <Text className="title">制作成本</Text>
                    <View className="cost-wrap">
                      {costBox.map((item, index) => {
                        return (
                          <View
                            key="index"
                            data-num={index}
                            onClick={this.tapCost}
                            className={
                              'cost-wrap-item ' +
                              (item.active ? 'filterPanelActive' : '')
                            }
                            style="margin-right: 20rpx;margin-bottom: 20rpx"
                          >
                            {item.value}
                          </View>
                        )
                      })}
                    </View>
                    <Text className="title">合作状态</Text>
                    <View className="cooper-wrap">
                      {cooperBox.map((item, index) => {
                        return (
                          <View
                            key="index"
                            data-num={index}
                            onClick={this.tapCooper}
                            className={
                              'cooper-wrap-item ' +
                              (item.active ? 'filterPanelActive' : '')
                            }
                            style="margin-right: 20rpx;margin-bottom: 20rpx"
                          >
                            {item.value}
                          </View>
                        )
                      })}
                    </View>
                    <View className="last-title">
                      <Text className="title">片方</Text>
                      <Text onClick={this.movieAdd} className="add">
                        添加
                      </Text>
                      <Image
                        onClick={this.movieAdd}
                        src='../../static/arrow.png'
                        style="height: 20rpx;width: 11rpx"
                        alt
                      ></Image>
                    </View>
                    <View className="company">
                      <View className="company-left">
                        <Block>
                          {companyList.map((item, index) => {
                            return (
                              index % 2 === 0 && (
                                <View
                                  data-num={index}
                                  onClick={this.tapCompany}
                                  key="index"
                                  className={
                                    'company-item ' +
                                    (company[index] == 'active'
                                      ? 'companyActive'
                                      : '')
                                  }
                                >
                                  <Text
                                    data-num={index}
                                    onClick={this.tapCompanyText}
                                  >
                                    {item.name}
                                  </Text>
                                </View>
                              )
                            )
                          })}
                        </Block>
                      </View>
                      <View className="company-right">
                        <Block>
                          {companyList.map((item, index) => {
                            return (
                              index % 2 !== 0 && (
                                <View
                                  onClick={this.tapCompany}
                                  key="index"
                                  data-num={index}
                                  className={
                                    'company-item ' +
                                    (company[index] == 'active'
                                      ? 'companyActive'
                                      : '')
                                  }
                                >
                                  <Text
                                    data-num={index}
                                    onClick={this.tapCompanyText}
                                  >
                                    {item.name}
                                  </Text>
                                </View>
                              )
                            )
                          })}
                        </Block>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              )}
              <View
                className={
                  filterShow == '3' ? 'lastFilterButton' : 'filterButton'
                }
              >
                {filterShow != 4 && (
                  <View
                    onClick={this.filterReset}
                    className="filterButton-reset"
                  >
                    重置
                  </View>
                )}
                {filterShow != 4 && (
                  <View
                    onClick={this.filterDefined}
                    className="filterButton-determine"
                  >
                    确定
                  </View>
                )}
                {filterShow == 4 && showDateSureBtn && (
                  <View
                    onClick={this.filterDefinedDate}
                    className="filterButton-date-determine"
                  >
                    确定
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      )
    )
  }
}

export default _C
