import React from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { get as getGlobalData } from '../../global_data';
import utils from '../../utils/index.js';
import ProjectInfo from '../../components/projectInfo';
import './index.scss';

const reqPacking = getGlobalData('reqPacking');
export default function Result() {
  const { projectId,roundId } = getCurrentInstance().router.params;
  
  return <View className="result">
    <ProjectInfo  projectId={projectId} roundId={roundId} />
  </View>
}