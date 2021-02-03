import React from 'react';
import { View } from '@tarojs/components';
import MatrixItem from '../matrixItem/index';
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
              { entry.xItems.map((item, turn) => <MatrixItem {...item || {}} key={turn} />)}
            </View>
          ))
        }
      </View>
    </View>
  </View>;
}
