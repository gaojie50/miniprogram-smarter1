import React from 'react';
import Taro from '@tarojs/taro';
import {
  View,
  Image,
} from '@tarojs/components';
import { noDataPic } from '@utils/imageUrl';
import './index.scss';


const noData = function(props){
  const { text } = props;
  return (
    <View className='no-data-component'>
      <Image src={noDataPic} />
      <View className="no-data-text">{text||'暂无数据'}</View>
    </View>
  )
}

export default noData;