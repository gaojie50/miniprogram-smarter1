import React from 'react';
import Taro from '@tarojs/taro';
import { View, Image, } from '@tarojs/components';
import { get as getGlobalData } from '../../global_data';
import projectConfig from '../../constant/project-config';
import './index.scss';

const reqPacking = getGlobalData('reqPacking');
const {getEvaluationLabel} = projectConfig
export default function ProjectInfo({ projectId, roundId, info }) {
  const fillZero = num => num < 10 ? `0${num}` : num;

  const {
    name,
    roundNum,
    pic='',
    participantNumber='',
    evaluationMethod=[],
  } = info;

  return <View className='project-info'>
    <Image src={pic} alt/>
    <View className="title">{name}</View>
    <View className="detail">第{roundNum}轮 / {getEvaluationLabel(evaluationMethod)} / {participantNumber}人参与</View>
    <View className="sign">{fillZero(roundNum)}</View>
  </View>
}