import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import dayjs from 'dayjs';
import utils from '@utils'
import './index.scss';

const { calcWeek } = utils;
export default function EvaluateTime({ deadLine }) {
  deadLine = 1619510751350;
  const noLimit = deadLine == undefined;
  let [isEnd, setIsEnd] = useState(noLimit ? false : (+new Date() >= deadLine));
  const [seconds, setSeconds] = useState(0);

  function timeRender() {
    const now = +new Date();
    const timeFormat = timeStamp => {
      const dayObj = dayjs(timeStamp);
      const isToday = dayjs(timeStamp).isToday();
      let interval = 1;
      const exactSeconds = Math.floor((deadLine - now) / 1000);

      if (exactSeconds >= 0) setTimeout(() => setSeconds(exactSeconds));

      if (exactSeconds <= 0) setTimeout(() => setIsEnd(true));
      if (exactSeconds >= 10 * 60) interval = 5 * 60;
      if (2 * 60 < exactSeconds && exactSeconds < 10 * 60) interval = 60;

      if (exactSeconds > 0) setTimeout(timeRender, interval * 1000);
      
      if ((exactSeconds <= 60) && exactSeconds > 0) return <Text className="red">{seconds}秒后</Text>
      if (isToday) return <Text className="gray">今天{dayObj.format("HH:mm")}</Text>;
      return <Text className="gray">{dayObj.format("M月D日")}/{calcWeek(timeStamp)} {dayObj.format("HH:MM")}</Text>;
    };

    return <React.Fragment>
      {timeFormat(deadLine)}
      <Text>
        {isEnd ? '评估已结束' : '评估结束'}
        {!isEnd && <Text className="arrow" />}
      </Text>
    </React.Fragment>
  };

  return <View className={`evaluate-time ${isEnd}`}>
    {
      noLimit ?
        <Text className="one-line">不限时评估<Text className="arrow" /></Text> :
        timeRender()
    }
  </View >
}