import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import dayjs from 'dayjs';
import utils from '@utils';
import reqPacking from '@utils/reqPacking.js';
import EndTimePicker from '@components/endtime-picker';
import './index.scss';

const { calcWeek } = utils;
export default function EvaluateTime({ deadLine,projectId,roundId,setStopScroll }) {
  let now = +new Date();
  const [timing, setTiming] = useState(false);
  const [line, setLine] = useState(deadLine);
  const [seconds, setSeconds] = useState(Math.floor((line - now) / 1000));
  const [modalSwitch, setModalSwitch] = useState(false);
  const noLimit = line == undefined;
  let [isEnd, setIsEnd] = useState(noLimit ? false : (now >= line));

  if (!noLimit && !isEnd && !timing) setTiming(true);

  function modal(event) {
    setStopScroll(true);
    setModalSwitch(true);
  };

  function modalClose(e) {
    e.stopPropagation();
    setStopScroll(false);
    setModalSwitch(false);
  }

  useEffect(() => {
    let interval

    if (timing) {
      interval = setInterval(() => {
        setSeconds(preSecond => {
          if (preSecond <= 1) {
            setTiming(false);
            setIsEnd(true);
            clearInterval(interval)

            Taro.redirectTo({
              url: `/pages/result/index?projectId=${projectId}&roundId=${roundId}`
            })

            return 0
          } else {
            return preSecond - 1
          }
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [timing])
  const dayObj = dayjs(line);
  const isToday = dayjs(line).isToday();

  const timeFormat = timeStamp => {
    if (timing && seconds <= 60) return <Text className='red'>{seconds}秒后</Text>
    if (isToday) return <Text className='gray'>今天{dayObj.format("HH:mm")}</Text>;
    return <Text className='gray'>{dayObj.format("M月D日")}/{calcWeek(timeStamp)} {dayObj.format("HH:mm")}</Text>;
  };

  function timeRender() {
    return <React.Fragment>
      {timeFormat(line)}
      <Text>
        {isEnd ? '评估已结束' : '评估结束'}
        {!isEnd && <Text className='arrow' />}
      </Text>
    </React.Fragment>
  };

  return <View className={`evaluate-time ${isEnd}`} onClick={isEnd ? '' : modal}>
    {
      noLimit ?
        <Text className='one-line'>不限时评估<Text className='arrow' /></Text> :
        timeRender()
    }
    <EndTimePicker
      onEndTimeChange={
        newLine => {
          reqPacking({
            url: 'api/applet/management/update',
            data: {
              deadline: newLine,
              projectId,
              roundId,
              modifyDate:2,
            }
          }).then(res => {
            const { error } = res;

            if (!error) {
              setTiming(false);
              setLine(newLine);
              setSeconds(Math.floor((newLine - new Date()) / 1000));
            }
          })
        }
      }
      onClose={modalClose}
      isOpened={modalSwitch}
      endTime={line} />
  </View >
}