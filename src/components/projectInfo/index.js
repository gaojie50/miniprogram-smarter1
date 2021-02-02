import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, } from '@tarojs/components';
import { get as getGlobalData } from '../../global_data';
import projectConfig from '../../constant/project-config';
import './index.scss';

const reqPacking = getGlobalData('reqPacking');
const {getEvaluationLabel} = projectConfig
export default function ProjectInfo({ projectId, roundId, setProjectEvaluationName }) {
  const [info, setInfo] = useState({});
  const fillZero = num => num < 10 ? `0${num}` : num;
  useEffect(
    () => reqPacking({
      url: 'api/management/briefInfo',
      data: { projectId, roundId },
      method: 'GET',
    }).then(res => {
      const { success, data = {}, error } = res;

      if (success) {
        setProjectEvaluationName(data.projectEvaluationName);
        return setInfo(data);
      }

      Taro.showToast({
        title: error && error.message,
        icon: 'none',
        duration: 2000
      });
    }), []);

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