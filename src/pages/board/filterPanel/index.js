import {
  Block,
  View,
  ScrollView,
  Image,
  Text,
  PickerView,
  PickerViewColumn,
} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import utils from '../../../utils/index.js'

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

class _C extends React.Component {
  static defalutProps = {
    filterShow: '',
    titleHeight: 0,
  }

  state = {
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
    projectType: [
      {
        value: '网络剧',
        active: false,
      },
      {
        value: '电视剧',
        active: false,
      },
      {
        value: '院线电影',
        active: false,
      },
      {
        value: '网络电影',
        active: false,
      },
      {
        value: '综艺',
        active: false,
      },
      {
        value: '其他',
        active: false,
      },
    ],
    cooperateType: [
      {
        value: '主投',
        active: false,
      },
      {
        value: '跟投',
        active: false,
      },
      {
        value: '开发',
        active: false,
      },
      {
        value: '宣传',
        active: false,
      },
      {
        value: '主发',
        active: false,
      },
      {
        value: '联发',
        active: false,
      },
      {
        value: '票务合作',
        active: false,
      },
      {
        value: '其他',
        active: false,
      },
    ],
    projectStage: [
      {
        value: '开发',
        active: false,
      },
      {
        value: '完片',
        active: false,
      },
      {
        value: '宣传',
        active: false,
      },
      {
        value: '发行',
        active: false,
      },
      {
        value: '上映',
        active: false,
      },
      {
        value: '映后',
        active: false,
      },
    ],
    movieLocation: [
      {
        value: '中国',
        active: false,
      },
      {
        value: '海外',
        active: false,
      },
    ],
    jobType: [
      {
        value: '我负责的',
        active: false,
      },
      {
        value: '我参与的',
        active: false,
      },
      {
        value: '我协作的',
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
  }

  dateSelect = (e) => {
    const val = e.detail.value
    const {
      dateShowFirstActive,
      years,
      months,
      days,
      customEndDate,
      customStartDate,
    } = this.state
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
      const minimumTimeStamp = +handleDays(customEndDate.value, 180, 'subtract')

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
      return this.setState(obj)
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
    this.setState(obj)
  }

  switchDate = (e) => {
    const { sign } = e.currentTarget.dataset
    const { dateShowFirstActive, customStartDate, customEndDate } = assignDeep(
      this.state,
    )

    if (
      (dateShowFirstActive && sign == 'begin') ||
      (!dateShowFirstActive && sign != 'begin')
    )
      return

    if (sign == 'begin') {
      return this.setState({
        dateShowFirstActive: true,
        dateValue: dateValueCommon(customStartDate.value),
      })
    }

    this.setState({
      dateShowFirstActive: false,
      dateValue: dateValueCommon(customEndDate.value),
    })
  }

  dateSelectEvent = (e) => {
    const { value } = e.target.dataset
    let { dateSet, showDateSureBtn } = this.state

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

    this.setState(
      {
        dateSet: dateSetVar,
        showDateSureBtn,
      },
      () => {
        const { showDateSureBtn } = this.state

        if (!showDateSureBtn) this.filterDefinedDate()
      },
    )
  }

  tapProjectType = (e) => {
    const num = e.target.dataset.num
    this.state.projectType[num].active = !this.state.projectType[num].active
    this.setState({
      projectType: this.state.projectType,
    })
  }

  tapCooperateType = (e) => {
    const num = e.target.dataset.num
    this.state.cooperateType[num].active = !this.state.cooperateType[num].active
    this.setState({
      cooperateType: this.state.cooperateType,
    })
  }


  tapMovieLocation = (e) => {
    const num = e.target.dataset.num;
    this.state.movieLocation[num].active = !this.state.movieLocation[num].active;
    this.setState({
      movieLocation: this.state.movieLocation,
    });
  }

  tapJobType = (e) => {
    const num = e.target.dataset.num
    const newJobType = this.state.jobType
    newJobType[num].active = !newJobType[num].active
    this.setState({
      jobType: newJobType,
    })
  }

  filterReset = () => {
    const { estimateBox, projectBox } = this.state
    const { filterShow } = this.props
    if (filterShow == '1') {
      estimateBox.map((item) => {
        item.active = false
      })
      this.setState({
        estimateBox,
      })
    } else if (filterShow == '2') {
      projectBox.map((item) => {
        item.active = false
      })
      this.setState({
        projectBox,
      })
    } else if (filterShow == '3') {
      const dataList = this.state
      dataList.costBox.map((item) => {
        item.active = false
      })
      dataList.cooperBox.map((item) => {
        item.active = false
      })
      for (let j = 0; j < dataList.companyList.length; j++) {
        dataList.company[j] = ''
      }
      this.setState({
        ...dataList,
      })
    }
  }

  filterDefined = () => {
    const {
      projectType,
      cooperateType,
      projectStage,
      dateSet,
      movieLocation,
      jobType,
      customStartDate,
      customEndDate,
    } = this.state;

    this.props.ongetFilterShow({
      projectType,
      cooperateType,
      projectStage,
      movieLocation,
      dateSet,
      jobType,
      customStartDate,
      customEndDate,
    })
  }

  filterDefinedDate = () => {
    const {
      projectType,
      cooperateType,
      projectStage,
      dateSet,
      movieLocation,
      jobType,
      customStartDate,
      customEndDate,
    } = this.state;

    this.props.ongetFilterShow({
      projectType,
      cooperateType,
      projectStage,
      movieLocation,
      dateSet,
      jobType,
      customStartDate,
      customEndDate,
    })
  }

  render() {
    const {
      dateShowFirstActive,
      customStartDate,
      customEndDate,
      dateValue,
      years,
      months,
      days,
      dateSet,
      projectType,
      cooperateType,
      projectStage,
      movieLocation,
      jobType,
      company,
      companyList,
      showDateSureBtn,
    } = this.state
    const { filterShow, titleHeight } = this.props

    return (
      filterShow.length != 0 && (
        <View className="filterPanel">
          <View
            className={filterShow.length != 0 ? "filterPanelWrap" : ""}
          >
            <View
              className={"filterPanels " + (filterShow == "4" ? `date ${showDateSureBtn === false ? 'filterPanel-no-bottom' : ''}` : "")}
            >
              {filterShow == "4" && (
                <ScrollView
                  className="dateBox"
                  style={
                    "max-height: calc(100vh * 0.75 - " + titleHeight + "px)"
                  }
                  scrollY
                >
                  {dateSet.map((item, index) => {
                    return (
                      <Block key={item.value}>
                        <View
                          className={item.checked + " item"}
                          data-value={item.value}
                          onClick={this.dateSelectEvent}
                        >
                          <Image
                            className="pic"
                            src="../../static/icon/checked.png"
                          ></Image>
                          {item.label}
                        </View>
                        {item.value == "custom" && item.checked == "checked" && (
                          <View className="custom-box">
                            <View className="date-show">
                              <View
                                className={
                                  "left " +
                                  (dateShowFirstActive ? "active" : "")
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
                              <View className="date-to">
                                <Text>至</Text>
                              </View>
                              <View
                                className={
                                  "right " +
                                  (!dateShowFirstActive ? "active" : "")
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
                                      key={item}
                                      style="line-height: 60rpx;text-align:right;"
                                    >
                                      {item + "年"}
                                    </View>
                                  );
                                })}
                              </PickerViewColumn>
                              <PickerViewColumn>
                                {months.map((item, index) => {
                                  return (
                                    <View
                                      key={item}
                                      style="line-height: 60rpx;text-align:center;"
                                    >
                                      {item + "月"}
                                    </View>
                                  );
                                })}
                              </PickerViewColumn>
                              <PickerViewColumn>
                                {days.map((item, index) => {
                                  return (
                                    <View
                                      key={item}
                                      style="line-height: 60rpx;text-align:left;"
                                    >
                                      {item + "日"}
                                    </View>
                                  );
                                })}
                              </PickerViewColumn>
                            </PickerView>
                          </View>
                        )}
                      </Block>
                    );
                  })}
                </ScrollView>
              )}
              {/*  项目类型  */}
              {filterShow == "1" && (
                <View className="estimateBox">
                  {projectType.map((item, index) => {
                    return (
                      <View
                        key={index}
                        data-num={index}
                        onClick={this.tapProjectType}
                        className={
                          "estimateBox-item " +
                          (item.active ? "filterPanelActive" : "")
                        }
                        style="margin-right: 20rpx;margin-bottom: 20rpx"
                      >
                        {item.value}
                      </View>
                    );
                  })}
                </View>
              )}
              {/*  合作类型  */}
              {filterShow == "2" && (
                <View className="projectStatus">
                  {cooperateType.map((item, index) => {
                    return (
                      <View
                        key={index}
                        data-num={index}
                        onClick={this.tapCooperateType}
                        className={
                          "projectStatus-item " +
                          (item.active ? "filterPanelActive" : "")
                        }
                        style="margin-right: 20rpx;margin-bottom: 20rpx"
                      >
                        {item.value}
                      </View>
                    );
                  })}
                </View>
              )}
              {/*  筛选  */}
              {filterShow == "3" && (
                <View className="filter">
                  <ScrollView
                    scrollY="true"
                    className="scroll-area"
                    style={
                      "max-height: calc(100vh * 0.75 - " + titleHeight + "px)"
                    }
                  >
                    <Text className="title">项目阶段</Text>
                    <View className="cost-wrap">
                      {projectStage.map((item, index) => {
                        return (
                          <View
                            key={index}
                            data-num={index}
                            onClick={this.tapProjectType}
                            className={
                              "cost-wrap-item " +
                              (item.active ? "filterPanelActive" : "")
                            }
                            style="margin-right: 20rpx;margin-bottom: 20rpx"
                          >
                            {item.value}
                          </View>
                        );
                      })}
                    </View>
                    <Text className="title">片源地</Text>
                    <View className="cost-wrap">
                      {movieLocation.map((item, index) => {
                        return (
                          <View
                            key={index}
                            data-num={index}
                            onClick={this.tapMovieLocation}
                            className={
                              "cost-wrap-item " +
                              (item.active ? "filterPanelActive" : "")
                            }
                            style="margin-right: 20rpx;margin-bottom: 20rpx"
                          >
                            {item.value}
                          </View>
                        );
                      })}
                    </View>
                    <Text className="title">参与程度</Text>
                    <View className="cost-wrap">
                      {jobType.map((item, index) => {
                        return (
                          <View
                            key={index}
                            data-num={index}
                            onClick={this.tapJobType}
                            className={
                              "cost-wrap-item " +
                              (item.active ? "filterPanelActive" : "")
                            }
                            style="margin-right: 20rpx;margin-bottom: 20rpx"
                          >
                            {item.value}
                          </View>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              )}
              {filterShow ? (
                filterShow !== "4" ? (
                  <View className="filterButton">
                    <View
                      onClick={this.filterReset}
                      className="filterButton-reset"
                    >
                      重置
                    </View>
                    <View
                      onClick={this.filterDefined}
                      className="filterButton-determine"
                    >
                      确定
                    </View>
                  </View>
                ) : (
                  showDateSureBtn && (
                    <View className="filterButton">
                      <View
                        onClick={this.filterDefinedDate}
                        className="filterButton-date-determine"
                      >
                        确定
                      </View>
                    </View>
                  )
                )
              ) : null}
            </View>
          </View>
        </View>
      )
    );
  }
}

export default _C
