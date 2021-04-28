import React, { useState,useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import dayjs from 'dayjs';
import utils from '@utils'
import './index.scss';

const { calcWeek } = utils;
export default function EvaluateTime({ deadLine }) {
  deadLine = +new Date() + 65 * 1000;
  let now = +new Date();
  const [timing, setTiming] = useState(false);
  const [line,setLine] = useState(deadLine);
  const [seconds, setSeconds] = useState(Math.floor((line - now) / 1000));
  const noLimit = line == undefined;

  let [isEnd, setIsEnd] = useState(noLimit ? false : (now >= line));
  
  if(!noLimit && !isEnd && !timing) setTiming(true);

  function modal(innerline) {
    setTiming(false);
    const newLine = +new Date() + 65 * 1000;
    setLine(newLine);
    setSeconds(Math.floor((newLine - new Date()) / 1000));
  };

  useEffect(() => {
    let interval
  
    if (timing) {
      interval = setInterval(() => {
        setSeconds(preSecond => {
          if (preSecond <= 1) {
            setTiming(false);
            setIsEnd(true);
            clearInterval(interval)

            return 0
          } else {
            return preSecond - 1
          }
        })
      },1000)
    }

    return () => clearInterval(interval)
  }, [timing])
  const dayObj = dayjs(line);
  const isToday = dayjs(line).isToday();

  const timeFormat = timeStamp => {
    if (timing && seconds<=60) return <Text className='red'>{seconds}秒后</Text>
    if (isToday) return <Text className='gray'>今天{dayObj.format("HH:mm")}</Text>;
    return <Text className='gray'>{dayObj.format("M月D日")}/{calcWeek(timeStamp)} {dayObj.format("HH:MM")}</Text>;
  };

  function timeRender(){
  return <React.Fragment>
    {timeFormat(line)}
    <Text>
      {isEnd ? '评估已结束' : '评估结束'}
      {!isEnd && <Text className='arrow' />}
    </Text>
  </React.Fragment>
  };

  return <View className={`evaluate-time ${isEnd}`} onClick={isEnd ? '' : () => modal(line)}>
    {
      noLimit ?
        <Text className='one-line'>不限时评估<Text className='arrow' /></Text> :
        timeRender()
    }
  </View >
}