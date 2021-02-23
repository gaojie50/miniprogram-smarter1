import React from 'react';
import { View} from '@tarojs/components';
import './index.scss';

export default function MatrixItem ({ xTitle,xRatio,xNum }) {
  return <View className="xItem">
  <View className="title">
    <View className="xTitle">{xTitle}</View>
    <View className="xRatio">{`${Math.round(xRatio * 1000) / 10}%`} {xNum}人</View>
  </View>
  <View className="progress-outer">
    <View className="progress-inner" style={{ width: `${Math.round(xRatio * 1000) / 10}%` }} />
  </View>
</View>
}