import React, { useState } from 'react';
import Taro from '@tarojs/taro';
// import { AtCalendar }from 'taro-ui';
import { View, Button, Image, Block } from '@tarojs/components';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import backIcon from '../../static/detail/arrow-left.png';
import backWhiteIcon from '../../static/detail/arrow-left.png';
import './index.scss';

export default function dateBar(props){
  const {  } = props;
  return (
    <View className="date-bar-component">
      <View className="left-button">前一天</View>
      <View className="middle-block">
        <View className="date">
          2021年3月11日/周一
        </View>
      </View>
      <View className="right-button">后一天</View>
      {/* <AtCalendar isMultiSelect currentDate={{start: '2018/10/28', end: '2018/11/11'}}/> */}
    </View>
  )
}

dateBar.defaultProps = {
  
}