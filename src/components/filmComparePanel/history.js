import { View, Text } from '@tarojs/components';
import React from 'react';
import utils from '@utils/index';
import dayjs from 'dayjs';
import './history.scss';

const { formatNumber } = utils;

export default function History(props){
  const { dataList } = props;
  
  return (
    <View className='history-list-wrap'>
      <View className='title'>同档期大盘票房</View>
      <View className="content-wrap">
        <View className="year-column column">
          {dataList.map(item=>{
            return <View className="text year">
              <Text className="value">{dayjs(item.startDt).format('YYYY')}</Text>年
            </View>
          })}
        </View>

        <View className="total-box-column column">
          {dataList.map(item=>{
            return <View className="text total-box">
              <Text className="value">{formatNumber(item.showTotalNum).text}</Text>
            </View>;
          })}
        </View>

        <View className="release-num-column column">
          {dataList.map(item=>{
            return <View className="text release-num">
            <Text className="value">{item.releaseNum}</Text>
            部</View>
          })}
        </View>
      </View>
      
    </View>
  )
}