import React from 'react';
import Taro from '@tarojs/taro';
import {
  View,
} from '@tarojs/components';
import './index.scss';

function getLabelColor(num){
  if(num===1){
    return '#F1303D';
  }
  if(num === 2){
    return '#FD9C00';
  }
  if(num === 3){
    return '#88A6DA'
  }
  return 'rgba(0,0,0,.6)'
}

const NumberLabel = function(props){
  const { number, color, style } = props;
  return (
    <View className='number-label-component' style={{backgroundColor: `${color ? color : getLabelColor(number)}`, ...style }}>
      {number}
    </View>
  )
}

export default NumberLabel;