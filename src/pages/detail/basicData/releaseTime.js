import { View, Block, Text } from "@tarojs/components";
import React from 'react';
import { ScheduleType } from '../constant';
import './releaseTime.scss';

export default function ReaseTiem(props) {
  const { data, judgeRole } = props;
  const { releaseTime = {} } = data;
  const index = releaseTime.time.indexOf('~');
  const scheduleType = releaseTime.scheduleType && (releaseTime.scheduleType - 1) || 4;

  return (
    <View className="releaseTime" style={{backgroundColor: ScheduleType[ scheduleType ].bgColor}}>
      {releaseTime.schedule && releaseTime.schedule.length > 0 ? <View className="schedule">{releaseTime.schedule[0]}</View> : ''}
      {
        releaseTime.scheduleType && judgeRole.releaseStage === 1 ?
        <View className="scheduleType" style={{
          backgroundColor: ScheduleType[ scheduleType ].color,
        }}>{ScheduleType[ scheduleType ].name}</View>
        : ''
      }
      <View className="title">上映时间</View>
      <View>
        {
          index === -1 ? 
          <View className="time accurateTime">{releaseTime.time.replace(/-/g,'.') || '-'}</View>
          : <View className="durationWrap">
            { SlotTime(releaseTime.time.substring(0, index), 'start') }
            {/* <Text className="time" style={{fontSize: '32px'}}>-</Text> */}
            { SlotTime(releaseTime.time.substring(index + 1), 'end') }
          </View>
        }
      </View>
    </View>
  )
}

function SlotTime(date, param) {
  return (
    <View className="time duration">
      <Text className="year">{ date.substring(0, 4).replace(/-/g, '.')}</Text>
      <Text className="date">{ date.substring(5).replace(/-/g, '.')}{param === 'end' ? '' : '-'}</Text>
    </View>
  )
}
