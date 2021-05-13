import React, { useEffect, useState } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import utils from '@utils/index.js';
import  Calendar from '@components/calendar'
import  AtTag from '@components/m5/tag';
import '@components/m5/style/components/tag.scss';
import ArrowLeft from '@static/detail/arrow-left.png';
import dayjs from 'dayjs';
import DateBar from '../../../components/dateBar';
import { get as getGlobalData } from '../../../global_data';
import './index.scss'

export default function hotMovieList() {
  const url = Taro.getCurrentPages();
  const options = url[url.length - 1].options;
  const { cityId, cityName } = options;
  const [showDate, setShowDate] = useState(() => dayjs(new Date()).format('YYYYMMDD'));
  const [ranking, setRanking] = useState([]);
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
    let data = { 
      showDate,
    };
    if (cityId) {
      data = Object.assign(data, { cityId });
    }
    reqPacking({
      url: 'api/management/finance/hotMovie/incomeScore/list',
      method: 'GET',
      data,
    },).then(res => {
      if (res.success && res.data && res.data.length > 0) {
        setRanking(res.data);
      }
    })
  }

  const onSelectDate = (date) => {
    setShowDate(date.replaceAll('-', ''));
  }

  const gotoCheckCity = () => {
    let path = Taro.getCurrentInstance().router.path;
    let params = Taro.getCurrentInstance().router.params;
    let paramsStr = '';
    if (Object.keys(params).length > 0) {
      paramsStr += '?';
      for (const key of Object.keys(params)) {
        paramsStr += `${key}=${params[key]}&`;
      }
    }
    // console.log(path + paramsStr.slice(-1));
    Taro.redirectTo({
      url: `/pages/checkCity/index?fromUrl=${encodeURIComponent(path + paramsStr)}`
    });
  }

  useEffect(getMovieRanking, [cityId, showDate]);

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
        <DateBar callBack={onSelectDate.bind(this)} needButtons startDateBar='20210106' />
        <View className='list-header'>
          <View className='list-header-left' onClick={gotoCheckCity}>{ cityId ? cityName : '全国' }</View>
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
                  <Image src={item.pic.replace('/w.h/', '/')}></Image>
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
                  <View className='list-film-time'>{item.startDate.toString().replace(/^(\d{4})(\d{2})(\d{2})$/,"$1-$2-$3")}上映</View>
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
