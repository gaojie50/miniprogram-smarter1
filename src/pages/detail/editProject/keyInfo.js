import React, { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
import { View, Block, Text, PickerView, PickerViewColumn } from '@tarojs/components';
import dayjs from 'dayjs';
import ListItem from '@components/m5/list/item';
import FloatCard from '@components/m5/float-layout';
import _KeyInput from './component/key-input';
import Divider from './component/divider';
import _ReleaseTime from './component/releaseTime';
import { SCHEDULE_LIST } from './lib';
import './keyInfo.scss';

const KeyInput = forwardRef(_KeyInput);
const ReleaseTime = forwardRef(_ReleaseTime);
const ReleaseTimeWrap = forwardRef(_ReleaseTimeWrap);
const textVoid = <Text style={{ color: '#CCCCCC' }}>请选择</Text>;
const divider = <Divider />

export default function KeyInfo(props, ref) {

  const keyRef = useRef({});
  const releaseTimeRef = useRef({});

  useEffect(() => {
    if(props.movieData.movieName) {
      const { scheduleType, startShowDate, endShowDate} = props.movieData;
      const query = {
        scheduleType,
        startDate: startShowDate,
        endDate: endShowDate
      }
      releaseTimeRef.current = query;
      updateRef();
    }
  }, [props])

  const updateRef = () => {
    ref.current = {
      ...keyRef.current,
      ...releaseTimeRef.current
    }
  }

  if(releaseTimeRef.current.scheduleType) {
    const { scheduleType, startDate, endDate = 0 } = releaseTimeRef.current;
    const start = dayjs(startDate).format('YYYY-MM-DD');
    const end = dayjs(endDate).format('YYYY-MM-DD');
  }

  return (
    <Block>
      <Text className="keyInfo-title">核心数据</Text>
      <View className="keyInfo-content">
        <ReleaseTimeWrap updateRef={updateRef} releaseTimeRef={releaseTimeRef} movieData={props.movieData} />
        <KeyInput updateRef={updateRef} ref={keyRef} data={props.movieData}  type="expectBox" name="预估票房" text="万"></KeyInput>
        {divider}
        <KeyInput updateRef={updateRef} data={props.movieData} ref={keyRef} type="expectScore" name="预估评分" text="分"></KeyInput>
        {
          props.judgeRole.role === 1 ? 
          <Block>
            {divider}
            <KeyInput updateRef={updateRef} data={props.movieData} ref={keyRef} type="productionCosts" name="制作成本" text="万"></KeyInput>
            {divider}
            <KeyInput updateRef={updateRef} data={props.movieData} ref={keyRef} type="advertisingCosts" name="宣发费用" text="万"></KeyInput>
            {divider}
            <KeyInput updateRef={updateRef} data={props.movieData} ref={keyRef} type="myShare" name="猫眼份额" text="%"></KeyInput>
            {divider}
            <KeyInput updateRef={updateRef} data={props.movieData} ref={keyRef} type="myInvestment" name="猫眼投资成本" text="万"></KeyInput>
          </Block>
          : null
        }
      </View>
    </Block>
  )
}

function _ReleaseTimeWrap(props) {

  const [openReleaseTime, setOpenReleaseTime] = useState(false);
  const [scheduleType, setScheduleType] = useState();
  const [time, setTime] = useState('');

  useEffect(() => {
    if(props.movieData.movieName) {
      const { scheduleType, startShowDate, endShowDate } = props.movieData;
      const time = handleTime(startShowDate, endShowDate);
      setScheduleType(scheduleType);
      setTime(time);
    }
  }, [props])

  let value = scheduleType && <Text>
    <Text className="releaseTime-tag" style={{
      color: SCHEDULE_LIST[scheduleType - 1].color,
      backgroundColor: SCHEDULE_LIST[scheduleType - 1].bgColor,
    }}>{SCHEDULE_LIST[scheduleType - 1].name}</Text>
    <Text className="releaseTime-text">{time}</Text>
  </Text>;

  const updateReleaseTime = () => {
    const { scheduleType, startDate, endDate } = props.releaseTimeRef.current;
    setScheduleType(scheduleType);
    const time = handleTime(startDate, endDate);
    setTime(time);
  }

  return (
    <Block>
      <ListItem title='上映时间' extraText={value || textVoid} arrow onClick={() => setOpenReleaseTime(true)} />
      {openReleaseTime ? <ReleaseTime updateReleaseTime={updateReleaseTime} updateRef={props.updateRef} ref={props.releaseTimeRef} movieData={props.movieData} onClose={() => setOpenReleaseTime(false)}></ReleaseTime> : null}
      {divider}
    </Block>
  )
}

function handleTime(startTime, endTime = 0) {
  const startTime1 = dayjs(startTime).format('YYYY-MM-DD');
  const endTime1 = dayjs(endTime).format('YYYY-MM-DD');
  const time = (startTime === endTime) || endTime === 0  ? startTime1 : `${startTime1}~${endTime1}`;

  return time
}
