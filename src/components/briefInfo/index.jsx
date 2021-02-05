import React from 'react';
import Taro from '@tarojs/taro';
import { picFn } from '@utils/pic';
import {
  View,
  Image,
  Text
} from '@tarojs/components';
import './index.scss';
import coverPng from '@static/detail/cover.png';

const noData = function(props){
  const { name, roundNum, pic, text } = props;
  let finalPic = pic ? picFn(pic) : coverPng;
  return (
    <View className='project-briefinfo-component'>
      <View className="left info-wrap">
        <View className="project-img" style={{backgroundImage: `url(${finalPic})`}}></View>
        <View className="info">
          <View className="project-name">{name}</View>
          <View className="project-text">{text}</View>
        </View>
      </View>
      {roundNum && <View className="right number-text">
        {roundNum}
      </View>}
    </View>
  )
}

export default noData;