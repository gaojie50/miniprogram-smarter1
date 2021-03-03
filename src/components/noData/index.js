import React from 'react';
import Taro from '@tarojs/taro';
import {
  View,
  Image,
} from '@tarojs/components';
import './index.scss';

const noData = function(props){
  const { text } = props;
  return (
    <View className='no-data-component'>
      <Image src="../../../static/zwgxjl.png" />
      <View className="no-data-text">{text||'暂无数据'}</View>
    </View>
  )
}

export default noData;