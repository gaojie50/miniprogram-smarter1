import React, { useState, useEffect, useImperativeHandle, useCallback } from 'react';
import { View, Block, Text, PickerView, PickerViewColumn } from '@tarojs/components';
import ListItem from '@components/m5/list/item';
import FloatCard from '@components/m5/float-layout';
import { SCHEDULE_LIST } from '../lib';
import utils from '@utils/index';
import Toast from '@components/m5/toast';
import '@components/m5/style/components/toast.scss';
import './releaseTime.scss';

const { handleNewDate, calcWeek } = utils;

const startDate = {
  value: '2021.02.22',
  week: '周一'
}
const endDate = {
  value: '2021.02.22',
  week: '周一'
}

const date = new Date()
let years = []
let months = []
let days = []

for (let i = 2011; i <= date.getFullYear() + 30; i++) years.push(i)
for (let i = 1; i <= 12; i++) months.push(i)
for (let i = 1; i <= 31; i++) days.push(i)
export default function ReleaseTime(props, ref) {

  const [scheduleActive, setScheduleActive] = useState();
  const [dateShowFirstActive, setDateShowFirstActive] = useState(true);
  const [dateValue, setDateValue] = useState([10, 1, 21]);
  const [customStartDate, setCustomStartDate] = useState(startDate);
  const [customEndDate, setCustomEndDate] = useState(endDate);
  const [showToast, setShowToast] = useState('');

  useEffect(() => {
    if(props.movieData.startShowDate) {
      const { scheduleType, startShowDate, endShowDate } = props.movieData;
      setScheduleActive(scheduleType)
      setDateValue(dateValueCommon(startShowDate));
      const startDate = {
        value: formartDate(startShowDate),
        week: calcWeek(startShowDate),
      }
      const endDate = {
        value: formartDate(endShowDate),
        week: calcWeek(endShowDate),
      }
      setCustomStartDate(startDate);
      setCustomEndDate(endDate);
    }
  }, [props])

  const dateSelect = e => {
    const val = e.detail.value;
    let timeStamp = +new Date(
      `${years[val[0]]}/${months[val[1]]}/${days[val[2]]}`,
    )
    if(scheduleActive === 1) {
      const startDate = {
        value: formartDate(timeStamp),
        week: calcWeek(timeStamp),
      }
      setCustomStartDate(startDate);
      setDateValue(dateValueCommon(timeStamp));
      return
    }
    if (dateShowFirstActive) {
      //开始时间大于结束时间
      if (timeStamp > +handleNewDate(customEndDate.value)) {
        const endDate = {
          value: formartDate(timeStamp),
          week: calcWeek(timeStamp),
        }
        setCustomEndDate(endDate);
      }
      const startDate = {
        value: formartDate(timeStamp),
        week: calcWeek(timeStamp),
      }
      setCustomStartDate(startDate);
      setDateValue(dateValueCommon(timeStamp));
    } else {
      //结束时间小于开始时间
      if (timeStamp < +handleNewDate(customStartDate.value)) {
        const startDate = {
          value: formartDate(timeStamp),
          week: calcWeek(timeStamp),
        }
        setCustomStartDate(startDate);
      }
      const endDate = {
        value: formartDate(timeStamp),
        week: calcWeek(timeStamp),
      }
      setCustomEndDate(endDate);
      setDateValue(dateValueCommon(timeStamp));
    }
  }

  const switchDate = e => {
    const { sign } = e.currentTarget.dataset;

    if (
      (dateShowFirstActive && sign == 'begin') ||
      (!dateShowFirstActive && sign != 'begin')
    )
      return;

    if (sign == 'begin') {
      setDateShowFirstActive(true);
      setDateValue(dateValueCommon(customStartDate.value));
    } else {
      setDateShowFirstActive(false);
      setDateValue(dateValueCommon(customEndDate.value));
    }
  }

  const submit = async () => {
    const query = {};
    if(!scheduleActive) {
      setShowToast('请选择档期类型')
      return
    }
    query.scheduleType = scheduleActive;
    if(scheduleActive === 1 || scheduleActive === 5) {
      query.startDate = +handleNewDate(customStartDate.value);
    } else {
      query.startDate = +handleNewDate(customStartDate.value);
      query.endDate = +handleNewDate(customEndDate.value);
    }

    ref.current = query;
    props.updateRef();
    props.updateReleaseTime();
    props.onClose();
  }

  return (
    <FloatCard
      isOpened={true}
      title="上映时间"
      onClose={props.onClose}
    >
      <View className="schedule-list">
        {
          SCHEDULE_LIST.map((item, index) => {
            return item.key !== 4 ? <View key={index} onClick={() => setScheduleActive(index + 1)} className={scheduleActive === index + 1 ? "schedule-item active" : "schedule-item"}>{item.name}</View> : null
          })
        }
      </View>
      <View className="date-show" style={{display: scheduleActive === 1 || scheduleActive === 5 ? 'none' : 'block'}}>
        <View
          className={
            'left ' +
            (dateShowFirstActive ? 'active' : '')
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
        <View>
          <Text>至</Text>
        </View>
        <View
          className={
            'right ' +
            (!dateShowFirstActive ? 'active' : '')
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
        onChange={dateSelect}
        className="date-box"
      >
        <PickerViewColumn>
          {years.map((item, index) => {
            return (
              <View
                key={item}
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
                key={item}
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
                key={item}
                style="line-height: 60rpx;text-align:left;"
              >
                {item + '日'}
              </View>
            )
          })}
        </PickerViewColumn>
      </PickerView>
      <View className="releaseTime-submit">
        <View className="releaseTime-submit-btn" onClick={submit}>确定</View>
      </View>
      <Toast duration={1000} isOpened={showToast} text={showToast} onClose={() => setShowToast('')} />
    </FloatCard>
  )
}

function dateValueCommon(timeStamp) {
  const innerTimeStamp = handleNewDate(timeStamp)

  return [
    years.indexOf(innerTimeStamp.getFullYear()),
    months.indexOf(innerTimeStamp.getMonth() + 1),
    days.indexOf(innerTimeStamp.getDate()),
  ]
}

function formartDate(stamp) {
  const dateObj = handleNewDate(stamp)
  const yearStr = dateObj.getFullYear()
  const monthInner = dateObj.getMonth() + 1
  const dayInner = dateObj.getDate()
  const monthStr = monthInner < 10 ? `0${monthInner}` : monthInner
  const dayStr = dayInner < 10 ? `0${dayInner}` : dayInner

  return `${yearStr}.${monthStr}.${dayStr}`
}