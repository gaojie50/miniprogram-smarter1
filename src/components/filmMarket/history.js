import { View } from '@tarojs/components';
import React, { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import reqPacking from '@utils/reqPacking.js';
import utils from '@utils/index';
import dayjs from 'dayjs';
import './history.scss';

const { errorHandle, formatNumber } = utils;

export default function History(props){
  const { startDate, endDate } = props;
  const [ dataList, setDataList ] = useState([]);

  useEffect(()=>{
    fetDataList();
  }, [])

  const fetDataList = () => {
    reqPacking(
      {
        url: '/api/management/searchoveryearsschedulebox',
        data: {
          closeNum: 6,
          startDt: startDate,
          endDt: endDate,
          projectId: 14332
        }
      },
      'server',
    ).then(res => {
        const { error, data = [] } = res;

        if (!error) {
         setDataList( data );
        }
        errorHandle(error);
      })
  };
  
  console.log(dataList);
  return (
    <View className='history-list-wrap'>
      <View className='title'>同档期大盘票房</View>
      <View className="content-wrap">
        <View className="year-column column">
          {dataList.map(item=>{
            return <View className="text year">{dayjs(item.startDt).format('YYYY')}</View>
          })}
        </View>

        <View className="total-box-column column">
          {dataList.map(item=>{
            return <View className="text total-box">{formatNumber(item.showTotalNum).text}</View>;
          })}
        </View>

        <View className="release-num-column column">
          {dataList.map(item=>{
            return <View className="text release-num">{item.releaseNum}</View>
          })}
        </View>
      </View>
      
    </View>
  )
}