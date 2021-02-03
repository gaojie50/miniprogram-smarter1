import React from 'react';
import { View, Text } from '@tarojs/components';
import MatrixItem from '../matrixItem/index';
import './index.scss';

export default function MatrixScaleEval({ matrixScales = {}, questionNum, title }) {
  let { xItems = [], yItems = [] } = matrixScales;

  const titlesArr = xItems.map((item, index, arr) => `${arr.length - index}/${item}`);

  return <View className="matrixScaleEval-wrap">
    <View className="h5">{questionNum}、{title}</View>
    {yItems.map((obj, index) => <Item
      {...obj}
      titlesArr={titlesArr}
      key={index}
      turn={++index} />)}
  </View>
}

function Item({ average, innerItems = [], innerTitle, turn, titlesArr }) {
  return <View className="part">
    <View className="inner-title">{turn}、{innerTitle}</View>
    <Text className="average">平均分: {average}</Text>
    {innerItems.map((o, i) => <MatrixItem {...o} xTitle={titlesArr[i]} />)}
  </View>
}
