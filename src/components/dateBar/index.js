import React, { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import Calendar from '@components/m5/calendar';
import dayjs from 'dayjs';
import { View, Button, Image, Block, Text } from '@tarojs/components';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import backIcon from '../../static/detail/arrow-left.png';
import backWhiteIcon from '../../static/detail/arrow-left.png';
import './index.scss';

export default function dateBar(props){
  const {  } = props;
  const [time, setTime] = useState(dayjs(new Date()).format('HH:mm:ss'));
  const [day, setDay] = useState(dayjs(new Date()).format('HH:mm:ss'));
  const [isShowSelect, setIsShowSelect] = useState(false);
  const [isShowButton, setIsShowButton] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  useEffect(() => {
    const weeks = ['天', '一', '二', '三', '四', '五', '六']
    setInterval(() => {
      const showDate = dayjs(new Date()).format('HH:mm:ss')
      const showDay = dayjs(new Date()).format(`YYYY年M月D日/周d`)
      showDay.replace(/^周d+$/g, ($,$1) => {console.log($,$1); return weeks[$]})
      setTime(showDate)
      setDay(showDay);
    }, 1000)
  },[])

  const changeDay = () => {
    console.log(time)
  }

  const showSelect = () => {
    console.log(!isShowSelect)
    setIsShowSelect(!isShowSelect)
  }

  const selectedDate = (e) => {
    console.log(e)
    setDateRange(e.value)
    if(e.value.end) {
      setIsShowButton(true);
    } else {
      setIsShowButton(false);
    }
  }

  const confirm = () => {
    console.log(dateRange)
    showSelect()
  }
  const cancel = () => {
    showSelect()
  }

  return (
    <View className="date-bar-component">
      <View className="left-button" onClick={() => changeDay(-1)}>前一天</View>
      <View className="middle-block">
        <View className="date"  onClick={() => showSelect()} src={'https://obj.pipi.cn/festatic/common/media/1618902553455-arrow-down%403x.png'}> 
          {day}
          <Image className="tap"></Image>
        </View>
        <View className="time" >
          <Text className="tips">更新时间</Text>{time}
          <Image className="tap" src={'https://obj.pipi.cn/festatic/common/media/1618902559393-i%403x.png'}></Image>
        </View>
      </View>
      <View className="right-button" onClick={() => changeDay(-1)}>后一天</View>
      {isShowSelect && (
        <View className="time-selector">
          <Calendar isMultiSelect isVertical onSelectDate={(e) => selectedDate(e)}/>
          {isShowButton && (
            <View>
              <Button className="button" onClick={() => confirm()}>确认时间</Button>,
              <Button className="button" onClick={() => cancel()}>取消</Button>
            </View>
          )}
        </View>
      )}
      {/* <AtCalendar isMultiSelect currentDate={{start: '2018/10/28', end: '2018/11/11'}}/> */}
    </View>
  )
}

dateBar.defaultProps = {
  
}