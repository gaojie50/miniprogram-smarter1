import {
  Block,
  View,
  ScrollView,
  Image,
  Text,
  PickerView,
  PickerViewColumn,
} from '@tarojs/components';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Taro from '@tarojs/taro';
import utils from '../../../utils/index.js';
import { CATEGORY_TYPE_INIT, SOURCE_TYPE_INIT, MOVIE_TYPE_INIT } from '../lib';
import './index.scss';

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
    label: '全部',
    checked: 'checked',
    value() {
      return defaultCustomDate;
    }
  },
  {
    label: '未来3个月',
    checked: '',
    value() {
      return getDayPeriod(0, 90);
    }
  },
  {
    label: '未来1年',
    checked: '',
    value() {
      return getDayPeriod(0, 365);
    }
  },
  {
    label: '未定档',
    checked: '',
    value() {
      return defaultCustomDate;
    }
  },
  {
    label: '已上映',
    checked: '',
    value() {
      return getDayPeriod(-365, 0);
    }
  },
  {
    label: '自定义',
    checked: '',
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
  const [categoryType, setCategoryType] = useState(CATEGORY_TYPE_INIT());
  const [sourceType, setSourceType] = useState(SOURCE_TYPE_INIT());
  const [dateSet, setDateSet] = useState(DATE_INIT());
  const [movieType, setMovieType] = useState(MOVIE_TYPE_INIT());

  const showDateSureBtn = useMemo(() => {
    return dateSet[5].checked === 'checked';
  }, [dateSet]);

  const {
    component: dtPicker,
    option: dtPickerOption,
    reset: datePickerReset,
  } = useDatePicker();

  const reset = useCallback((time) => {
    const v1 = DATE_INIT();
    const v2 = CATEGORY_TYPE_INIT();
    const v3 = SOURCE_TYPE_INIT();
    const v4 = MOVIE_TYPE_INIT();

    setCategoryType(v2);
    setSourceType(v3);
    setMovieType(v4);

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
      categoryType: v2,
      sourceType: v3,
      movieType: v4,
      ...obj,
      ...obj2,
    };
  }, []);

  const option = {
    dateSet,
    setDateSet,
    categoryType,
    setCategoryType,
    sourceType,
    setSourceType,
    movieType,
    setMovieType,

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

    if (dateSet.some((item) => item.value == value && item.checked == 'checked')) return

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

  tapCategoryType = (e) => {
    const num = e.target.dataset.num;
    const newCategoryType = CATEGORY_TYPE_INIT();
    newCategoryType[num].active = true;
    this.props.setCategoryType(newCategoryType);
  }

  tapSourceType = (e) => {
    const num = e.target.dataset.num
    const newSourceType = SOURCE_TYPE_INIT();
    newSourceType[num].active = true;
    this.props.setSourceType(newSourceType);
  }

  tapMovieType = (e) => {
    const num = e.target.dataset.num
    this.props.movieType[num].active = !this.props.movieType[num].active
    this.props.setMovieType([...this.props.movieType])
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
      categoryType,
      sourceType,
      movieType,
      dateSet,
    } = this.props;

    return {
      customStartDate,
      customEndDate,
      categoryType,
      sourceType,
      movieType,
      dateSet,
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
      categoryType,
      sourceType,
      movieType,
      showDateSureBtn,

      dtPicker,
      dtPickerOption,
    } = this.props;

    return (
      filterShow.length != 0 && (
        <View className="filterPanel">
          <View className={filterShow.length != 0 ? "filterPanelWrap" : ""}>
            <View
              className={
                "filterPanels " +
                (filterShow == "3"
                  ? `date ${
                      showDateSureBtn === false ? "filterPanel-no-bottom" : ""
                    }`
                  : "")
              }
            >
              {/*  项目品类  */}
              {filterShow == "1" && (
                <View className="estimateBox">
                  {categoryType.map((item, index) => {
                    return (
                      <View
                        key={index}
                        data-num={index}
                        onClick={this.tapCategoryType}
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
              {/*  片源地  */}
              {filterShow == "2" && (
                <View className="estimateBox">
                  {sourceType.map((item, index) => {
                    return (
                      <View
                        key={index}
                        data-num={index}
                        onClick={this.tapSourceType}
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
              {/*  上映时间  */}
              {filterShow == "3" && (
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
              {filterShow == "4" && (
                <ScrollView
                  scrollY="true"
                  className="scroll-area"
                  style={
                    "max-height: calc(100vh * 0.75 - " + (titleHeight + bottomHeight) + "px)"
                  }
                >
                  <View className="estimateBox">
                    {movieType.map((item, index) => {
                      return (
                        <View
                          key={index}
                          data-num={index}
                          onClick={this.tapMovieType}
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
                </ScrollView>
              )}
              {filterShow ? (
                filterShow !== "3" ? (
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