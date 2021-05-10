import React, { useState, useEffect } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'
import utils from '@utils/index.js'
import  Calendar from '@components/calendar'
import DateBar from '../../../components/dateBar';
import '@components/m5/style/components/tag.scss'
import ArrowLeft from '@static/detail/arrow-left.png';
import './index.scss'
import { set as setGlobalData, get as getGlobalData } from '../../../global_data';

export default function hotMovieList() {

  const lists =[1,2,3,4,5,6,7,8,9,10,11,12,13,14, 15,16];
  const systemInfo = Taro.getSystemInfoSync();
  const { rpxTopx } = utils;
  const capsuleLocation = getGlobalData('capsuleLocation');
  const headerBarHeight = capsuleLocation.bottom + rpxTopx(15);


  const handleBack = () => {
    if(Taro.getCurrentPages().length>1){
      Taro.navigateBack();
    }else{
      Taro.redirectTo({
        url: `/pages/board/index`
      })
    }
  }


  // useEffect(handleBack);
  // useEffect(pageScroll);

  return (
    <View className="page-content">
      <View className='detail-top'  style={{ height: `${headerBarHeight}px` }}>
        <View className='top'>
          <View className='header'>
            <View className='backPage' onClick={handleBack}>
              <Image src={ArrowLeft}></Image>
            </View>
            <Text className='header-title'>你好，李焕英</Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: `${headerBarHeight}px` }}>
        <DateBar />
        <View className='list-header'>
          <View className='list-header-left'>城市</View>
          <View className='list-header-middle'>当日票房</View>
          <View className='list-header-right'>票房占比</View>
        </View>
        {lists.map((list, index) => {
          return (
          <View className='list' key={index}>
            <View className={`list-index index-${index}`}>{index+1}</View>
            <View className='list-city'>北京市</View>
            <View className='list-money'>534万</View>
            <View className='list-percentage'>29%</View>
          </View>
          )
        })}
      </View>
    </View>
  );
}
