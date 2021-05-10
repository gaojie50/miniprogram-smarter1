import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Text } from '@tarojs/components';
import './index.scss';

const weekMap = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
}

export default function useDeadline(t, cb ) {
  const [message, setMessage] = useState();
  const [countNum, setCountNum] = useState();
  const [over, setOver] = useState(false);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (!t) {
      setMessage('不限时评估');
      return;
    }
    const nowTime = new Date();
    const endTime = new Date(t);
    const month = endTime.getMonth() + 1;
    const day = endTime.getDate();
    const week = weekMap[endTime.getDay()];
    const hour = addzero(endTime.getHours());
    const minute = addzero(endTime.getMinutes());
    const cost = endTime.valueOf() - nowTime.valueOf();
    if (cost < 1000) {
      setMessage(`${month}月${day}日/周${week} ${hour}:${minute} 评估已结束`);
      setCountNum();
      setOver(true);
    } else if (cost <= 1000 * 60) {
      setCountNum(parseInt(cost/1000));
    } else if (nowTime.getDate() === day) {
      setMessage(`今天 ${hour}:${minute} 评估结束`);
    }else {
      setMessage(`${month}月${day}日/周${week} ${hour}:${minute} 评估结束`);
    }
  }, [t, update]);

  return {
    over,
    component: (
      <>
        {
          countNum ? (
            <CountDown num={countNum} cb={() => { setUpdate(v => !v); cb()}} />
            ) : (
            <Text className="normal-text">{message}</Text>
          )
        }
      </>
    )
  }
}

function CountDown({ num, cb }) {
  const [countNum, setCountNum] = useState(num);
  useEffect(() => {
    count(--num);
  }, []);
  
  return(
    <Text className="countdown-text">
      {`${countNum}秒后 评估结束`}
    </Text>
  )

  function count(n) {
    if (n >= 0) {
      setTimeout(() => {
        setCountNum(n);
        count(--n);
      }, 1000);
    } else {
      if(cb) cb();
    }
  }
}

function addzero(num) {
  return (Array(2).join(0) + num).slice(-2);
}