import React, { useState, useEffect } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'
import utils from '@utils/index.js'
import  Calendar from '@components/calendar'
import '@components/m5/style/components/tag.scss'
import lx from '@analytics/wechat-sdk';
import ArrowLeft from '@static/detail/arrow-left.png';
import dayjs from 'dayjs';
import DateBar from '../../../components/dateBar';
import './index.scss';
import { cityMap } from './city';
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
  const [showDate, setShowDate] = useState(() => dayjs(new Date()).format('YYYYMMDD'));
  const [isGetList, setIsGetList] = useState(false);

  const handleBack = () => {
    Taro.navigateBack();
  }

  const getCityRanking = () => {
    reqPacking({
      url: 'api/management/finance/boxOfficeRate/list',
      data: {
        showDate,
        projectId,
      }
    }).then(res => {
      if (res.success && res.data && res.data.length >= 0) {
        let ranking = [];
        for (const item of res.data) {
          if (cityMap[item.cityId] && cityMap[item.cityId].name) {
            item.name = cityMap[item.cityId].name;
            ranking.push(item);
          }
        }
        setCityRanking(ranking);
      } else {
        Taro.showToast({
          title: res.error ? res.error.message : '网络请求出错，请稍后再试',
          icon: 'none',
          duration: 2000
        });
      }
      setIsGetList(true);
    });
  }

  const onSelectDate = (date) => {
    setShowDate(date.replaceAll('-', ''));
  }

  useEffect(getCityRanking, [showDate]);

  return (
    <View className='page-content'>
      <View className='detail-top'  style={{ height: `${headerBarHeight}px` }}>
        <View className='top'>
          <View className='header'>
            <View className='backPage' onClick={handleBack}>
              <Image src={ArrowLeft}></Image>
            </View>
            <Text className='header-title'>{name.length > 10 ? `${name.slice(0, 10)}...` : name}</Text>
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
          isGetList && cityRanking.length > 0 && cityRanking.map((item, index) => {
            return (
              <View className='list' key={index}>
                <View className={`list-index index-${index}`}>{index + 1}</View>
                <View className='list-city'>{item.name}</View>
                <View className='list-money'>{`${numberFormat(item.boxOffice).num}${numberFormat(item.boxOffice).unit}`}</View>
                <View className='list-percentage'>{item.boxOfficeRate}%</View>
              </View>
            );
          })
        }
        {
          isGetList && cityRanking.length <= 0 && (
            <View className='empty-list'>暂无数据</View>
          )
        }
      </View>
    </View>
  );
}
