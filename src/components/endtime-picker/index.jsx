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
  const [dayList, setDayList] = useState([]);
  const [hourList, setHourList] = useState([]);
  const [allHourList, setAllHourList] = useState([]);
  const [value, setValue] = useState([0, 0]);

  useEffect(() => {
    let curDay = dayjs();
    let list = [];

    for (let i = 0; i <= LIMIT_FUTURE_DAYS; i++) {
      list.push(curDay.add(i, 'day').startOf('day').valueOf());
    }
    list.push(-1); // 不限时
    setDayList(list);
  }, []);

  useEffect(() => {
    let list = [];

    for (let i = 0; i <= 23; i++) {
      list.push(i);
    }
    setHourList(list);
    setAllHourList(list);
  }, []);


  const onChange = e => {
    const val = e.detail.value;
    let curSelectDay = dayList[val[0]];

    if (dayjs(curSelectDay).isToday()) {
      const nowHour = new Date().getHours();
      let newHourList = allHourList.slice(nowHour);

      setHourList(newHourList);
    } else if (curSelectDay === -1) {
      setHourList([]);
    } else {
      setHourList(allHourList);
    }
    setValue(val);
  };

  const handleEndTimeChange = () => {

    console.log(hourList, value[1]);
    let newTime = dayjs(dayList[value[0]]).add(hourList[value[1]], 'hours').format('YYYY-MM-DD HH:mm');

    props.onEndTimeChange(newTime.valueOf());
    props.onClose();
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
          indicatorStyle={`height: ${rpxTopx(62)}px`}
          style="width: 100%; height: 384rpx;"
          onChange={onChange}
          value={value}
        >
          <PickerViewColumn indicator-class="picker-line">
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
