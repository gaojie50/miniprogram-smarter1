import React from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { get as getGlobalData } from '../../global_data';
import projectConfig from '../../constant/project-config';
import './index.scss';

const reqPacking = getGlobalData('reqPacking');
const {getEvaluationLabel} = projectConfig
export default function ProjectInfo({ projectId, roundId, info, showParticipantNumber }) {
  const fillZero = num => num < 10 ? `0${num}` : num;

  const {
    name,
    round,
    pic='',
    participantNumber='',
    evaluationMethod,
  } = info;

  return <View className='project-info'>
    <Image src={pic} alt/>
    <View className="title">{name}</View>
    <View className="detail">第{round}轮 / {getEvaluationLabel(evaluationMethod)}{showParticipantNumber && (<Text> / {participantNumber}人参与</Text>)}</View>
    <View className="sign">{fillZero(round)}</View>
  </View>
}