import React from 'react';
import Taro from '@tarojs/taro';
import {
  View,
  Image,
  Text
} from '@tarojs/components';
import './index.scss';
import coverPng from '@static/detail/cover.png';

const noData = function(props){
  const { name, roundNum, pic, text } = props;
  let finalPic = pic || coverPng;
  return (
    <View className='project-briefinfo-component'>
      <View className="left info-wrap">
        <View className="project-img" style={{backgroundImage: `url(${finalPic})`}}></View>
        <View className="info">
          <View className="project-name">{name}</View>
          <View className="project-round">第{roundNum}轮</View>
        </View>
      </View>
      {roundNum && <View className="right number-text">
        {roundNum}
      </View>}
    </View>
  )
}

export default noData;