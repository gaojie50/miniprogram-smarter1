import {
  Block,
  View,
  ScrollView,
  Image,
  Text,
  PickerView,
  PickerViewColumn,
} from '@tarojs/components'
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Taro from '@tarojs/taro'
import utils from '../../../utils/index.js'

import './index.scss'
const { getFutureTimePeriod, calcWeek, assignDeep, handleNewDate, getDayPeriod } = utils
const defaultCustomDate = getDayPeriod(-6, 0);

const date = new Date()
let YEARS = []
let MONTHS = []
let DAYS = []

for (let i = 2011; i <= date.getFullYear() + 30; i++) YEARS.push(i)
for (let i = 1; i <= 12; i++) MONTHS.push(i)
for (let i = 1; i <= 31; i++) DAYS.push(i)

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
    YEARS.indexOf(innerTimeStamp.getFullYear()),
    MONTHS.indexOf(innerTimeStamp.getMonth() + 1),
    DAYS.indexOf(innerTimeStamp.getDate()),
  ]
}

const DATE_INIT = () => [
  {
    label: '最近7天',
    checked: 'checked',
    value() {
      return getDayPeriod(-6, 0);
    }
  },
  {
    label: '最近30天',
    checked: '',
    value() {
      return getDayPeriod(-29, 0);
    }
  },
  {
    label: '最近90天',
    checked: '',
    value() {
      return getDayPeriod(-89, 0);
    }
  },
  {
    label: '自定义',
    checked: '',
  },
];

const PROJECT_TYPE_INIT = () => [
  {
    value: '网络剧',
    active: false,
    code: 1,
  },
  {
    value: '电视剧',
    active: false,
    code: 2,
  },
  {
    value: '院线电影',
    active: false,
    code: 3,
  },
  {
    value: '网络电影',
    active: false,
    code: 4,
  },
  {
    value: '综艺',
    active: false,
    code: 5,
  },
  {
    value: '其他',
    active: false,
    code: 0,
  },
];

const COOPERATE_TYPE_INIT = () => [
  {
    value: '主投',
    active: false,
    code: 1,
  },
  {
    value: '跟投',
    active: false,
    code: 2,
  },
  {
    value: '开发',
    active: false,
    code: 3,
  },
  {
    value: '宣传',
    active: false,
    code: 4,
  },
  {
    value: '主发',
    active: false,
    code: 5,
  },
  {
    value: '联发',
    active: false,
    code: 6,
  },
  {
    value: '票务合作',
    active: false,
    code: 7
  },
  {
    value: '其他',
    active: false,
    code: 0,
  },
];

const PROJECT_STAGE_INIT = () => [
  {
    value: '开发',
    active: false,
    code: 1,
  },
  {
    value: '完片',
    active: false,
    code: 2,
  },
  {
    value: '宣传',
    active: false,
    code: 3,
  },
  {
    value: '发行',
    active: false,
    code: 4,
  },
  {
    value: '上映',
    active: false,
    code: 5,
  },
  {
    value: '映后',
    active: false,
    code: 6,
  },
];

export const PROJECT_STAGE_MAPPING = {};
PROJECT_STAGE_INIT().forEach((item) => {
  PROJECT_STAGE_MAPPING[item.code] = item.value
})

const MOVIE_LOCATION_INIT = () => [
  {
    value: '中国',
    active: false,
    code: 1,
  },
  {
    value: '海外',
    active: false,
    code: 2,
  },
];

const JOB_TYPE_INIT = () => [
  {
    value: '我负责的',
    active: false,
    code: 1,
  },
  {
    value: '我参与的',
    active: false,
    code: 2,
  },
  {
    value: '我协作的',
    active: false,
    code: 3
  },
];

const DEFAULT_DATE_VALUE_INIT = () => dateValueCommon(defaultCustomDate.startDate);

const DEFAULT_CUSTOM_START_DATE_INIT = () => ({
  value: formartDate(defaultCustomDate.startDate),
  week: calcWeek(defaultCustomDate.startDate),
});

const DEFAULT_CUSTOM_END_DATE_INIT = () => (
  {
    value: formartDate(defaultCustomDate.endDate),
    week: calcWeek(defaultCustomDate.endDate),
  }
);

function noop() {}

function useDatePicker() {
  const [dateShowFirstActive, setDateShowFirstActive] = useState(true);
  const [customStartDate, setCustomStartDate] = useState(DEFAULT_CUSTOM_START_DATE_INIT());
  const [customEndDate, setCustomEndDate] = useState(DEFAULT_CUSTOM_END_DATE_INIT());
  const [dateValue, setDateValue] = useState(DEFAULT_DATE_VALUE_INIT());
  const [years,] = useState(YEARS);
  const [months,] = useState(MONTHS);
  const [days,] = useState(DAYS);


  const getTimeStamp = useCallback((a, b, c) => {
    return +new Date(
      `${years[a]}/${months[b]}/${days[c]}`,
    );
  }, [years, months, days]);

  const reset = useCallback(() => {
    const v1 = true;
    const v2 = DEFAULT_CUSTOM_START_DATE_INIT();
    const v3 = DEFAULT_CUSTOM_END_DATE_INIT();
    const v4 = DEFAULT_DATE_VALUE_INIT();

    setDateShowFirstActive(v1);
    setCustomStartDate(v2);
    setCustomEndDate(v3);
    setDateValue(v4);

    return {
      dateShowFirstActive: v1,
      customStartDate: v2,
      customEndDate: v3,
      dateValue: v4,
    };
  }, [])

  const option = {
    dateShowFirstActive,
    customStartDate,
    customEndDate,
    dateValue,

    setDateShowFirstActive,
    setCustomStartDate,
    setCustomEndDate,
    setDateValue,

    getTimeStamp,
  }
  
  const switchDate = useCallback((e) => {
    const { sign } = e.currentTarget.dataset

    if (
      (dateShowFirstActive && sign == 'begin') ||
      (!dateShowFirstActive && sign != 'begin')
    )
      return

    if (sign == 'begin') {
      setDateShowFirstActive(true);
      setDateValue(dateValueCommon(customStartDate.value))
      return;
    }

    setDateShowFirstActive(false);
    setDateValue(dateValueCommon(customEndDate.value))
  }, [dateShowFirstActive, customStartDate, customEndDate])


  const handleDateSelect = useCallback((e) => {
    const val = e.detail.value
    let timeStamp = +new Date(
      `${years[val[0]]}/${months[val[1]]}/${days[val[2]]}`,
    )
    let obj = {}
    if (dateShowFirstActive) {
      //开始时间大于结束时间
      if (timeStamp > +handleNewDate(customEndDate.value)) {
        setCustomEndDate({
          value: formartDate(timeStamp),
          week: calcWeek(timeStamp),
        });
      }
      //一年时间限制 限制开始日期
      const minimumTimeStamp = +handleDays(customEndDate.value, 180, 'subtract')

      if (timeStamp < minimumTimeStamp) {
        const endStamp = +handleDays(timeStamp, 180)
        setCustomEndDate({
          value: formartDate(endStamp),
          week: calcWeek(endStamp),
        })
      }
      setCustomStartDate({
        value: formartDate(timeStamp),
        week: calcWeek(timeStamp),
      })
      setDateValue(dateValueCommon(timeStamp))
      return;
    }

    //结束时间小于开始时间
    if (timeStamp < +handleNewDate(customStartDate.value)) {
      setCustomStartDate({
        value: formartDate(timeStamp),
        week: calcWeek(timeStamp),
      })
    }

    //一年时间限制 限制结束日期
    const maxTimeStamp = +handleDays(customStartDate.value, 180)
    if (timeStamp > maxTimeStamp) {
      const startStamp = +handleDays(timeStamp, 180, 'subtract')
      setCustomStartDate({
        value: formartDate(startStamp),
        week: calcWeek(startStamp),
      })
    }

    setCustomEndDate({
      value: formartDate(timeStamp),
      week: calcWeek(timeStamp),
    })
    setDateValue(dateValueCommon(timeStamp))

  }, [dateShowFirstActive,
    years,
    months,
    days,
    customEndDate,
    customStartDate,])

  return {
    option,
    reset,
    component: (
      <View className="custom-box">
        <View className="date-show">
          <View
            className={
              "left " +
              (dateShowFirstActive ? "active" : "")
            }
            data-sign="begin"
            onClick={switchDate}
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
            onClick={switchDate}
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
          onChange={handleDateSelect}
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
    )
  }
}

export function useFilterPanel(config = {}) {
  const {
    titleHeight,
    filterActive,
    ongetFilterShow = noop,
  } = config;
  const [dateSet, setDateSet] = useState(DATE_INIT());
  const [projectType, setProjectType] = useState(PROJECT_TYPE_INIT());
  const [cooperateType, setCooperateType] = useState(COOPERATE_TYPE_INIT());
  const [projectStage, setProjectStage] = useState(PROJECT_STAGE_INIT());
  const [movieLocation, setMovieLocation] = useState(MOVIE_LOCATION_INIT());
  const [jobType, setJobType] = useState(JOB_TYPE_INIT());

  const showDateSureBtn = useMemo(() => {
    return dateSet[3].checked === 'checked';
  }, [dateSet]);

  const {
    component: dtPicker,
    option: dtPickerOption,
    reset: datePickerReset,
  } = useDatePicker();

  const reset = useCallback((time) => {
    const v1 = DATE_INIT();
    const v2 = PROJECT_TYPE_INIT();
    const v3 = COOPERATE_TYPE_INIT();
    const v4 = PROJECT_STAGE_INIT();
    const v5 = MOVIE_LOCATION_INIT();
    const v6 = JOB_TYPE_INIT();

    setProjectType(v2);
    setCooperateType(v3);
    setProjectStage(v4);
    setMovieLocation(v5);
    setJobType(v6);

    let obj = {};
    let obj2 = {};
    if (time) {
      setDateSet(v1);
      obj = datePickerReset();
      obj2 = {
        dateSet: v1,
      }
    }

    return {
      projectType: v2,
      cooperateType: v3,
      projectStage: v4,
      movieLocation: v5,
      jobType: v6,
      ...obj,
      ...obj2,
    };
  }, []);


  const option = {
    dateSet,
    setDateSet,
    projectType,
    setProjectType,
    cooperateType,
    setCooperateType,
    projectStage,
    setProjectStage,
    movieLocation,
    setMovieLocation,
    jobType,
    setJobType,
    showDateSureBtn,

    titleHeight,
    filterShow: filterActive,
    ongetFilterShow(v) {
      const d = {
        ...v,
        dtPickerOption,
      };
      ongetFilterShow(d);
    },

    dtPicker,
    dtPickerOption,

    reset,

  };

  return {
    option,
    Component: FilterPanel,
    component: (
      <FilterPanel {...option} />
    )
  }
}

export default class FilterPanel extends React.Component {
  static defalutProps = {
    filterShow: '',
    titleHeight: 0,
  }

  dateSelectEvent = (e) => {
    const { value } = e.target.dataset
    let { dateSet, setDateSet, ongetFilterShow } = this.props

    if (
      dateSet.some((item) => item.value == value && item.checked == 'checked')
    )
      return

    let rsl;
    const dateSetVar = dateSet.map((item) => {
      item.checked = ''
      if (item.label == value) {
        item.checked = 'checked'
        if (item.label !== '自定义') {
          rsl = item.value();
        }
      }
      return item
    })
    setDateSet(dateSetVar);
    if (value !== '自定义') {
      const {
        setCustomStartDate,
        setCustomEndDate,
        setDateValue,
      } = this.props.dtPickerOption;
      const v1 = dateValueCommon(rsl.startDate);
      const v2 = formartDate(rsl.startDate);
      const v3 = calcWeek(rsl.startDate);
      const v4 = formartDate(rsl.endDate);
      const v5 = calcWeek(rsl.endDate);

      const dateValue = v1;
      const customStartDate = {
        value: v2,
        week: v3,
      };
      const customEndDate = {
        value: v4,
        week: v5,
      };
      setDateValue(dateValue);
      setCustomStartDate(customStartDate);
      setCustomEndDate(customEndDate);
      ongetFilterShow({
        ...this.getParams(),
        ...({
          dateValue,
          customStartDate,
          customEndDate,
        }),
        dateSet: dateSetVar,
      });
    }
  }

  tapProjectType = (e) => {
    const num = e.target.dataset.num
    this.props.projectType[num].active = !this.props.projectType[num].active
    this.props.setProjectType([...this.props.projectType])
  }

  tapCooperateType = (e) => {
    const num = e.target.dataset.num
    this.props.cooperateType[num].active = !this.props.cooperateType[num].active
    this.props.setCooperateType([...this.props.cooperateType])
  }

  tapProjectStage = (e) => {
    const num = e.target.dataset.num
    this.props.projectStage[num].active = !this.props.projectStage[num].active
    this.props.setProjectStage([...this.props.projectStage])
  }


  tapMovieLocation = (e) => {
    const num = e.target.dataset.num;
    this.props.movieLocation[num].active = !this.props.movieLocation[num].active;
    this.props.setMovieLocation([...this.props.movieLocation])
  }

  tapJobType = (e) => {
    const num = e.target.dataset.num
    const newJobType = this.props.jobType
    newJobType[num].active = !newJobType[num].active
    this.props.setJobType([...newJobType])
  }

  filterReset = () => {
    const a = this.props.reset();
    // this.props.ongetFilterShow(a);
  }

  getParams() {
    const {
      customStartDate,
      customEndDate,
    } = this.props.dtPickerOption;

    const {
      projectType,
      cooperateType,
      projectStage,
      dateSet,
      movieLocation,
      jobType,

    } = this.props;

    return {
      customStartDate,
      customEndDate,
      projectType,
      cooperateType,
      projectStage,
      dateSet,
      movieLocation,
      jobType,
    };
  }

  filterDefined = () => {
    this.props.ongetFilterShow(this.getParams())
  }

  filterDefinedDate = () => {
    this.filterDefined();
  }

  render() {
    const {
      filterShow,
      titleHeight,
      bottomHeight = 96,
      dateSet,
      projectType,
      cooperateType,
      projectStage,
      movieLocation,
      jobType,
      showDateSureBtn,

      dtPicker,
      dtPickerOption,

      permission,
      member,
      department,
    } = this.props;

    return (
      filterShow.length != 0 && (
        <View className="filterPanel">
          <View className={filterShow.length != 0 ? "filterPanelWrap" : ""}>
            <View
              className={
                "filterPanels " +
                (filterShow == "4"
                  ? `date ${
                      showDateSureBtn === false ? "filterPanel-no-bottom" : ""
                    }`
                  : "")
              }
            >
              {filterShow == "4" && (
                <ScrollView
                  className="dateBox"
                  style={
                    "max-height: calc(100vh * 0.75 - " + (titleHeight) + "px)"
                  }
                  scrollY
                >
                  {dateSet.map((item, index) => {
                    return (
                      <Block key={item.label}>
                        <View
                          className={item.checked + " item"}
                          data-value={item.label}
                          onClick={this.dateSelectEvent}
                        >
                          <Image
                            className="pic"
                            src="../../static/icon/checked.png"
                          ></Image>
                          {item.label}
                        </View>
                        {item.label == "自定义" &&
                          item.checked == "checked" &&
                          dtPicker}
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
                      "max-height: calc(100vh * 0.75 - " + (titleHeight + bottomHeight) + "px)"
                    }
                  >
                    <Text className="title">项目阶段</Text>
                    <View className="cost-wrap">
                      {projectStage.map((item, index) => {
                        return (
                          <View
                            key={index}
                            data-num={index}
                            onClick={this.tapProjectStage}
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
                    {permission === 1 ? (
                      <>
                        <Text className="title">成员</Text>
                        <View className="cost-wrap">
                          {member.map((item, index) => {
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
                      </>
                    ) : null}
                    {permission === 3 ? (
                      <>
                        <Text className="title">所属部门</Text>
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
                      </>
                    ) : null}
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
