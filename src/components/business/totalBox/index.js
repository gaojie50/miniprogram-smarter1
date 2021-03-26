import React, { useState } from 'react';
import { View, Image, Text } from '@tarojs/components';
import utils from '@utils/index';
import './index.scss';

const {formatNumber,formatPercent} = utils;

export default function TotalBox({totalData = {}, handleInsteadBox}) {
  const {
    estimateNum,
    dateShow,
    boxSectionRatio=[],
    model,
  } = totalData;

  return <View className="total-box">
    <View className="h2">
      预估总票房
      <Text className="model">{model}</Text>
    </View>

    <View className="box">{formatNumber(estimateNum)?.num}
      <Text className="unit">{formatNumber(estimateNum)?.unit}</Text>
      <Text className="time">{dateShow}</Text>
    </View>
    <View className="change-btn" onClick={handleInsteadBox}>替换为最新预估总票房</View>

    <View className="h2"> 主要票房区间概率</View>

    <View className="ratio-wrap">
      {boxSectionRatio.map(({section,ratio}) =>
      <View className="item">
        {section}
        <View className="process">
          <Text className="inner" style={`width:${formatPercent(ratio, 2)};`} />
        </View>
        <Text className="ratio">{formatPercent(ratio, 2)}</Text>
      </View>
      )}
    </View>
  </View>
}