/* eslint-disable jsx-quotes */
import React, { useEffect, useState } from 'react';
import {
  View,
  PickerView,
  PickerViewColumn,
} from '@tarojs/components';
import AtFloatLayout from '@components/m5/float-layout';
import FixedButton from '@components/fixedButton';
import utils from '@utils/index';
import '@components/m5/style/components/float-layout.scss';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import './index.scss';

dayjs.extend(isToday);

const { calcWeek, rpxTopx } = utils;

const LIMIT_FUTURE_DAYS = 7;


const EndTimePicker = function(props) {
  const dayList = getDefaultDayList();
  const allHourList = getDefaultAllHourList();

  const [hourList, setHourList] = useState([]);
  const [value, setValue] = useState([0, 0]);

  function getDefaultDayList() {
    let curDay = dayjs();
    let list = [];

    for (let i = 0; i <= LIMIT_FUTURE_DAYS; i++) {
      list.push(curDay.add(i, 'day').startOf('day').valueOf());
    }
    list.push(-1); // 不限时
    return list;
  }

  function getDefaultAllHourList() {
    let list = [];

    for (let i = 0; i <= 23; i++) {
      list.push(i);
    }
    return list;
  }

  useEffect(() => {
    const newHourList = getNewHourList(props.endTime);
    const selectDayIndex = getDayIndex(dayList, props.endTime);
    const selectHourIndex = getHourIndex(newHourList, props.endTime);

    setHourList(newHourList);
    setValue([selectDayIndex, selectHourIndex]);

  }, [props.endTime]);



  const onChange = e => {
    const val = e.detail.value;
    let curSelectDay = dayList[val[0]];

    setValue(val);

    if (dayjs(curSelectDay).isToday()) {
      setHourList(getNewHourList(curSelectDay));
    } else if (curSelectDay === -1) {
      setHourList([]);
    } else {
      setHourList(allHourList);
    }
  };

  const getNewHourList = day => {
    if (!day) {
      return [];
    }
    if (dayjs(day).isToday()) {
      const nowHour = new Date().getHours();
      let newHourList = allHourList.slice(nowHour + 1);

      return newHourList;
    }
    return allHourList;
  };

  const getDayIndex = (dList, day) => {
    let selectDayIndex = 0;

    if (!props.endTime) {
      selectDayIndex = dList.length - 1;
    } else {
      selectDayIndex = dList.findIndex(item => {
        if (dayjs(item).startOf('day').valueOf() === dayjs(day).startOf('day').valueOf()) {
          return true;
        }
        return false;
      });
    }
    return selectDayIndex === -1 ? 0 : selectDayIndex;
  };

  const getHourIndex = (hList, day) => {
    let selectHourIndex = 0;

    selectHourIndex = hList.findIndex(hour => {
      if (hour === dayjs(day).hour()) {
        return true;
      }
      return false;
    });
    return selectHourIndex === -1 ? 0 : selectHourIndex;
  };

  const handleEndTimeChange = e => {
    let newTime = dayList[value[0]] === -1 ? '' : dayjs(dayList[value[0]]).add(hourList[value[1]], 'hours').valueOf();
    props.onEndTimeChange(newTime,e);
    props.onClose(e);
  };


  return (
    <AtFloatLayout
      className="endtime-picker-component"
      isOpened={props.isOpened}
      title="评估结束时间"
      onClose={props.onClose}
    >
      <View className="time-picker-wap">
        <PickerView
          style="width: 100%; height: 384rpx;"
          onChange={onChange}
          value={value}
          indicatorStyle={`height:${parseInt(rpxTopx(60))}px;`}
        >
          <PickerViewColumn>
            {dayList.map(item => {
              if (item === -1) {
                return (
                  <View key="-1" className="line-item day">
                    <View className="nature-day">不限时</View>
                  </View>
                );
              }
              return (
                <View key={item} className="line-item day">
                  <View className="nature-day">{dayjs(item).isToday() ? '今天' : dayjs(item).format('MM月DD日')}</View>
                  <View className="week-day">{calcWeek(item)}</View>
                </View>
              );
            })}

          </PickerViewColumn>
          <PickerViewColumn>
            {hourList.map(item => (
              <View key={item} className="line-item hour">
                {item < 10 ? `0${item}:00` : `${item}:00`}
              </View>
            ))}
          </PickerViewColumn>
        </PickerView>
      </View>
      <FixedButton onClick={handleEndTimeChange}>确定</FixedButton>
    </AtFloatLayout>
  );
};

export default EndTimePicker;
