import React from 'react';
import { View,Text} from '@tarojs/components';
import './index.scss';

export default function RadioEval({ title, questionNum, radios }) {
  const convertPercent = ratio => `${Math.round(ratio * 1e3) / 10}%`;
  const innerRadios = radios.filter(item => item.num);

  return <View className="radioEval-wrap">
    <View className="h5">{questionNum}、{title}</View>

    <View className='ul'>
      {innerRadios.map(({ itemTitle, ratio, num }, index) => <View className="li" key={ index }>
        <View className="inner-process" style={ { width: `${convertPercent(ratio)}` } }>
          <Text className="inner-title">{itemTitle}</Text>
          <View className="right-part">{convertPercent(ratio)} {num}人</View>
        </View>
        {itemTitle}
        <View className="right-part">{convertPercent(ratio)} {num}人</View>
      </View>)}
    </View>
  </View>;
}
