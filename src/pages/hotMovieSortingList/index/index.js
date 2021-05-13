import React, { useEffect, useState } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import utils from '@utils/index.js';
import  Calendar from '@components/calendar'
import  AtTag from '@components/m5/tag';
import '@components/m5/style/components/tag.scss';
import ArrowLeft from '@static/detail/arrow-left.png';
import DateBar from '../../../components/dateBar';
import { get as getGlobalData } from '../../../global_data';
import './index.scss'

export default function hotMovieList() {

  const [cityId, setCityId] = useState(0);
  const [ranking, setRanking] = useState([]);
  const lists =[1,2,3,4,5,6,7,8,9,10];
  const { rpxTopx } = utils;
  const capsuleLocation = getGlobalData('capsuleLocation');
  const headerBarHeight = capsuleLocation.bottom + rpxTopx(15);
  const reqPacking = getGlobalData('reqPacking');
  const signText = ['', '主出', '主发', '联出', '联发', '出品', '发行'];

  const handleBack = () => {
    if(Taro.getCurrentPages().length>1){
      Taro.navigateBack();
    }else{
      Taro.redirectTo({
        url: `/pages/board/index`
      })
    }
  }

  const getMovieRanking = () => {
    reqPacking({
      url: 'api/management/finance/hotMovie/incomeScore/list',
      method: 'GET',
    },).then(res => {
      console.log(res);
      if (res.success && res.data && res.data.length > 0) {
        setRanking(res.data);
      }
    })
  }

  const onselectDate = (date) => {
    console.log(date);
  }

  useEffect(getMovieRanking, [cityId]);

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
      <View style={{ marginTop: `${headerBarHeight}px`, position: 'relative' }}>
        <DateBar callBack={onselectDate} />
        <View className='list-header'>
          <View className='list-header-left'>全国</View>
          <View className='list-header-img'>
            <Image src='http://p0.meituan.net/scarlett/40fccb6a0295cf33d8c7737a55883a1f398.png'></Image>
          </View>
          <View className='list-header-right'>排序推荐指数</View>
        </View>
        {
          ranking.map((item, index) => {
            return (
              <View className='list' key={index}>
                <View className='list-film'>
                  <Image src={item.pic ||'https://p0.meituan.net/movie/e2ecb7beb8dadc9f07f2fad9820459f92275588.jpg@464w_644h_1e_1c'}></Image>
                  <View className={`film-index index-${index}`} >{index+1}</View>
                </View>
                <View className='list-middle'>
                  <View className='list-film-name'>
                    {item.movieName}
                  </View>
                  <View className='list-film-label'>
                    {
                      item.maoyanSign.map((sign) => (
                        <View className='film-lable' key={sign}>
                          {signText[sign]}
                        </View>
                      ))
                    }
                  </View>
                  <View className='list-film-time'>{item.startDate}上映</View>
                </View>
                <View className='film-recommend'>{item.score}</View>
              </View>
            )
          })
        }
      </View>
    </View>
  );
}
