import React, { useState } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import utils from '@utils/index.js';
import  Calendar from '@components/calendar'
import DateBar from '../../../components/dateBar';
import  AtTag from '@components/m5/tag'
import '@components/m5/style/components/tag.scss'
import ArrowLeft from '@static/detail/arrow-left.png';
import { get as getGlobalData } from '../../../global_data';
import './index.scss'

export default function hotMovieList() {
  // const [data, setData] = useState(1);
  const handleBack = () => {
    if(Taro.getCurrentPages().length>1){
      Taro.navigateBack();
    }else{
      Taro.redirectTo({
        url: `/pages/board/index`
      })
    }
  }
  const lists =[1,2,3,4,5,6,7,8,9,10];
  const { rpxTopx } = utils;
  const capsuleLocation = getGlobalData('capsuleLocation');
  const headerBarHeight = capsuleLocation.bottom + rpxTopx(15);

  return (
    <View>
      {/* <Calendar /> */}
      <View className='detail-top' style={{ height: `${headerBarHeight}px` }}>
        <View className='top'>
          <View className='header'>
            <View className='backPage' onClick={handleBack}>
              <Image src={ArrowLeft}></Image>
            </View>
            <Text className='header-title'>热映影片排序</Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: `${headerBarHeight}px` }}>
        <DateBar />
        <View className='list-header'>
          <View className='list-header-left'>全国</View>
          <View className='list-header-img'>
            <Image src='http://p0.meituan.net/scarlett/40fccb6a0295cf33d8c7737a55883a1f398.png'></Image>
          </View>
          <View className='list-header-right'>排序推荐指数</View>
        </View>
        {lists.map((list, index) => {
          return (
          <View className='list' key={index}>
            <View className='list-film'>
              <Image src='https://p0.meituan.net/movie/e2ecb7beb8dadc9f07f2fad9820459f92275588.jpg@464w_644h_1e_1c'></Image>
              <View className={`film-index index-${index}`} >{index+1}</View>
            </View>
            <View className='list-middle'>
              <View className='list-film-name'>
                最长的名称展示宽度样式hhhhhh
              </View>
              <View className='list-film-label'>
                <View className='film-label one'>跟投</View>
                <View className='film-label two'>主投</View>
                <View className='film-label three'>主出</View>
              </View>
              <View className='list-film-time'>2021-02-12上映</View>
            </View>
            <View className='film-recommend'>100</View>
          </View>
          )
        })}
      </View>
    </View>
  );
}
