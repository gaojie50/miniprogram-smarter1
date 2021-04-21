import React, { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import Calendar from '@components/m5/calendar';
import dayjs from 'dayjs';
import { View, Button, Image, Block, Text } from '@tarojs/components';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import backIcon from '../../static/detail/arrow-left.png';
import backWhiteIcon from '../../static/detail/arrow-left.png';
import './index.scss';

let aInterval;
export default function dateBar(props){
  const { callBack } = props;
  const [time, setTime] = useState('');
  const [day, setDay] = useState('');
  const [now, setNow] = useState('');
  const [thatTime, setThatTime] = useState('');
  const [isShowSelect, setIsShowSelect] = useState(false);
  const [isShowButton, setIsShowButton] = useState(false);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    clearInterval(aInterval);
    calculateTime(new Date());
    aInterval = setInterval(() => {calculateTime(new Date())}, 1000);
  },[thatTime])

  const calculateTime = (now) => {
    const weeks = ['周天', '周一', '周二', '周三', '周四', '周五', '周六'];
    const showTime = dayjs(now).format('HH:mm:ss');
    const showDay = dayjs(thatTime || now).format(`YYYY年M月D日/周d`);
    setTime(showTime);
    setDay(showDay.replace(/周./, ($) => {
      const str = $.split('');
      const weekDay = weeks[str[1]];
      return weekDay;
    }));
    setNow(now);
  }
  
  const changeDay = (passDay) => {
    const originTime = thatTime || new Date();
    const changeTime = originTime.setTime(originTime.getTime()+passDay*24*60*60*1000);
    const selectDate = dayjs(changeTime).format('YYYY-MM-DD');
    if(dayjs(now).format('YYYY-MM-DD') === selectDate) {
      setThatTime(null)
    } else {
      calculateTime(now, new Date(changeTime))
      setThatTime(new Date(changeTime))
    }
    if(callBack) {
      callBack(selectDate)
    }
  }

  const showSelect = () => {
    console.log(!isShowSelect)
    setIsShowSelect(!isShowSelect)
  }

  const selectedDate = (e) => {
    setDateRange(e.value)
    if(e.value.end) {
      setIsShowButton(true);
    } else {
      setIsShowButton(false);
    }
  }

  const confirm = () => {
    callBack(dateRange);
    showSelect()
  }
  const cancel = () => {
    showSelect()
  }

  return (
    <View className="date-bar-component">
      <View className="left-button" onClick={() => changeDay(-1)}>前一天</View>
      <View className="middle-block">
        <View className="date"  onClick={() => showSelect()}> 
          {day}
          <Image className="tap" src={'https://obj.pipi.cn/festatic/common/media/1618902553455-arrow-down%403x.png'}></Image>
        </View>
        <View className="time" >
          <Text className="tips">更新时间</Text>{time}
        </View>
      </View>
      <View className="right-button" onClick={() => changeDay(+1)}>后一天</View>
      {isShowSelect && (
        <View className="time-selector">
          <Calendar isMultiSelect isVertical onSelectDate={(e) => selectedDate(e)}/>
          
            <View>
            {isShowButton && (
              <Button className="button" onClick={() => confirm()}>确认时间</Button>
            )}
              <Button className="button" onClick={() => cancel()}>取消</Button>
            </View>
        </View>
      )}
    </View>
  )
}

dateBar.defaultProps = {
  callBack: (time) => {console.log(time)} 
}