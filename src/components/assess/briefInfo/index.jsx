import React from 'react';
import Taro from '@tarojs/taro';
import {
  View,
  Image,
  Text
} from '@tarojs/components';
import './index.scss';
import coverPng from '@static/detail/cover.png';

const BriefInfo = function(props){
  const { name, roundNum, pic, text } = props;
  let finalPic = pic || coverPng;
  return (
    <View className='project-briefinfo-component'>
      <View className="left info-wrap">
        <View className="project-img" style={{backgroundImage: `url(${finalPic})`}}></View>
        <View className="info">
          <View className="project-name">{name || '-'}</View>
          {text && <View className="project-info-text">{text}</View>}
        </View>
      </View>
      {roundNum && <View className="right number-text">
        {roundNum}
      </View>}
    </View>
  )
}

export default BriefInfo;