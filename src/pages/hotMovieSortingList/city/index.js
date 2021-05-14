import React, { useState, useEffect } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'
import utils from '@utils/index.js'
import  Calendar from '@components/calendar'
import '@components/m5/style/components/tag.scss'
import ArrowLeft from '@static/detail/arrow-left.png';
import dayjs from 'dayjs';
import DateBar from '../../../components/dateBar';
import './index.scss';
import cityList from '../../checkCity/cities.json';
import { numberFormat } from '../../coreData/common';
import { set as setGlobalData, get as getGlobalData } from '../../../global_data';

export default function hotMovieList() {
  const url = Taro.getCurrentPages();
  const options = url[url.length - 1].options;
  const { name, projectId, cityId = '', cityName } = options;
  const reqPacking = getGlobalData('reqPacking');
  const { rpxTopx } = utils;
  const capsuleLocation = getGlobalData('capsuleLocation');
  const headerBarHeight = capsuleLocation.bottom + rpxTopx(15);
  const [cityRanking, setCityRanking] = useState([]);
  const [cityMap, setCityMap] = useState({});
  const [showDate, setShowDate] = useState(() => dayjs(new Date()).format('YYYYMMDD'));

  const handleBack = () => {
    if(Taro.getCurrentPages().length>1){
      Taro.navigateBack();
    }else{
      Taro.redirectTo({
        url: `/pages/board/index`
      })
    }
  }

  const getCityRanking = () => {
    reqPacking({
      url: 'api/management/finance/boxOfficeRate/list',
      data: {
        showDate,
        projectId,
      }
    }).then(res => {
      if (res.success && res.data && res.data.length > 0) {
        setCityRanking(res.data);
      }
    })
  }

  const onSelectDate = (date) => {
    setShowDate(date.replaceAll('-', ''));
  }

  useEffect(() => {
    // console.log(showDate);
    let x = utils.arrayToMap(cityList.cts, 'id');
    setCityMap(x);
  }, []);

  useEffect(getCityRanking, [showDate]);

  return (
    <View className='page-content'>
      <View className='detail-top'  style={{ height: `${headerBarHeight}px` }}>
        <View className='top'>
          <View className='header'>
            <View className='backPage' onClick={handleBack}>
              <Image src={ArrowLeft}></Image>
            </View>
            <Text className='header-title'>{name}</Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: `${headerBarHeight}px` }}>
        <DateBar callBack={onSelectDate.bind(this)} needButtons startDateBar='20210106' />
        <View className='list-header'>
          <View className='list-header-left'>城市</View>
          <View className='list-header-middle'>当日票房</View>
          <View className='list-header-right'>票房占比</View>
        </View>
        {
          cityRanking.map((item, index) => {
            return (
              <View className='list' key={index}>
                <View className={`list-index index-${index}`}>{index + 1}</View>
                <View className='list-city'>{cityMap[item.cityId] && cityMap[item.cityId].name}</View>
                <View className='list-money'>{`${numberFormat(item.boxOffice).num}${numberFormat(item.boxOffice).unit}`}</View>
                <View className='list-percentage'>{item.boxOfficeRate}%</View>
              </View>
            );
          })
        }
      </View>
    </View>
  );
}
