import React from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { get as getGlobalData } from '../../global_data';
import projectConfig from '../../constant/project-config';
import EvaluateTime from '@components/evaluateTime';
import './index.scss';

const reqPacking = getGlobalData('reqPacking');
const {getEvaluationLabel} = projectConfig
export default function ProjectInfo({ deadLine, projectId, roundId, info, showParticipantNumber,setStopScroll,rollingDistance }) {
  const fillZero = num => num < 10 ? `0${num}` : num;

  const {
    name,
    round,
    pic='',
    participantNumber='',
    evaluationMethod,
    userId,
  } = info;

  const { userInfo } = Taro.getStorageSync('authinfo') || {};

  return <View className='project-info'>
    <Image className="moviePic" src={pic} alt/>
    <View className="title">{name}</View>
    <View className="detail">第{round}轮 / {getEvaluationLabel(evaluationMethod)}{showParticipantNumber && (<Text> / {participantNumber}人参与</Text>)}</View>
    {
      userInfo.id === userId ? 
        <EvaluateTime 
          roundId={roundId}
          projectId={projectId}
          setStopScroll={setStopScroll}
          deadLine={deadLine}/> : 
        <View className="sign">{fillZero(round)}</View>
    }
  </View>
}