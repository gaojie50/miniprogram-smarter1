import React from 'react';
import { View,Text} from '@tarojs/components';
import './index.scss';

export default function MatrixRadioEval({ matrixRadios = [], questionNum, title }) {

  return <View className="matrixRadioEval-wrap">
    <View className="h5">{questionNum}、{title}</View>

    <View className="matrix-radio-eval">
      <View className="list">
        {
          matrixRadios.map((entry, index) => (
            <View className="item" key={index}>
              <View className="yTitle">{entry.yTitle}</View>
              {
                entry.xItems.map((item, turn) => (
                  <View className="xItem" key={turn}>
                    <View className="title">
                      <View className="xTitle">{item.xTitle}</View>
                      <View className="xRatio">{`${Math.round(item.xRatio * 1000) / 10}%`} {item.xNum}人</View>
                    </View>
                    <View className="progress-outer">
                      <View className="progress-inner" style={{ width: `${Math.round(item.xRatio * 1000) / 10}%` }} />
                    </View>
                  </View>
                ))
              }
            </View>
          ))
        }
      </View>
    </View>
  </View>;
}
