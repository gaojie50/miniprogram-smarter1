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
  const { callBack, minDate, maxDate, needButtons, needInterval, style, startDateBar } = props;
  const [time, setTime] = useState('');
  const [day, setDay] = useState('');
  const [now, setNow] = useState('');
  const [thatTime, setThatTime] = useState('');
  const [isShowSelect, setIsShowSelect] = useState(false);
  const [isShowButton, setIsShowButton] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [startDate, setStartDate] = useState('');
  const today = dayjs(new Date()).format('YYYYMMDD');

  useEffect(() => {
    clearInterval(aInterval);
    calculateTime(new Date());
    if(needInterval) {
      aInterval = setInterval(() => {calculateTime(new Date())}, 1000);
    }
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
    const selectDate = dayjs(changeTime).format('YYYYMMDD');
    if(dayjs(now).format('YYYYMMDD') === selectDate) {
      setThatTime(null)
    } else {
      calculateTime(now, new Date(changeTime))
      setThatTime(new Date(changeTime))
    }
    if(callBack) {
      // console.log(callBack)
      callBack(selectDate)
    }
  }

  const showSelect = () => {
    setIsShowSelect(!isShowSelect)
  }

  const selectedDate = (e) => {
    console.log('select', e.value);
    setDateRange(e.value);
    setIsShowButton(true);
  }

  const confirm = () => {
    console.log('confirm', dateRange);
    setThatTime(null);
    callBack(dateRange);
    calculateTime(dateRange);
    showSelect()
  }
  const cancel = () => {
    showSelect()
  }
  const beforeDay = () => {
    let showDay = dayjs(thatTime||now).format('YYYYMMDD');
    if(showDay && showDay - startDateBar > 0){
      changeDay(-1)
    } else {
      Taro.showToast({
        title: '无法点击前一天',
        icon: 'none',
        duration: 1000
      });
    }
  }
  const nextDay = () => {
    let showDay = dayjs(thatTime).format('YYYYMMDD');
    if(showDay && showDay - today < 0){
      changeDay(+1)
    }else{
      Taro.showToast({
        title: '无法点击后一天',
        icon: 'none',
        duration: 1000
      });
    }
  }

  useEffect(()=>{
    let newStartDateBar = startDateBar && startDateBar.toString().replace(/^(\d{4})(\d{2})(\d{2})$/,"$1/$2/$3");
    setStartDate(newStartDateBar);
  }, [startDateBar])

  return (
    <View className="date-bar-component" style={style} >
      <View className="left-button" style={{visibility: needButtons ? '' : 'hidden'}} onClick={() => beforeDay()}>前一天</View>
      <View className="middle-block">
        <View className="date"  onClick={() => showSelect()}> 
          {day}
          <Image className="tap" src={'https://obj.pipi.cn/festatic/common/media/1618902553455-arrow-down%403x.png'}></Image>
        </View>
        <View className="time" >
          <Text className="tips">更新时间</Text>{time}
          <Image className="tip-icon" src="http://p0.meituan.net/scarlett/27df10a3087031c48bfc183953b3514b1287.png" />
        </View>
      </View>
      <View className="right-button" style={{visibility: needButtons ? '' : 'hidden'}} onClick={() =>nextDay()}>后一天</View>
      {isShowSelect && (
        <View className="time-selector">
          <Calendar minDate={startDate} maxDate={dayjs(new Date()).format('YYYY/MM/DD')} isVertical onDayClick={(e) => selectedDate(e)} />
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
  callBack: (time) => {console.log(time)},
  minDate: '',
  maxDate: '',
  needButtons: false,
  needInterval: false
}