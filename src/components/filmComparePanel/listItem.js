import { View, Text, Image } from '@tarojs/components';
import React from 'react';
import Taro from '@tarojs/taro';
import NumberLabel from '@components/numberLabel';
import { scheduleType } from './constant';
import utils from '@utils/index';
import './listItem.scss';

const { formatNumber } = utils;

export default function ListItem(props){
  const { item, orderNum, showNumber, totalBox } = props;
  const rate = totalBox && item.estimateBox ? `${((item.estimateBox/totalBox)*100).toFixed(2)}%` : '-'
  

  function jumpDetail(e){
    const { item:data } = e.currentTarget.dataset
    const { maoyanId, projectId } = data
    Taro.navigateTo({
      url: `/pages/detail/index?maoyanId=${maoyanId}&projectId=${projectId}`,
    })
  }
  
  return (
    <View
      className='list-item-wrap'
      onClick={jumpDetail}
      data-item={item}
      key={item.maoyanId}
    >
    {showNumber && <NumberLabel number={orderNum} />}
    <Image src={item.pic} alt></Image>
    <View className='content-wrap'>
      <View className="main-info-wrap flex-item">
        <View className='movie-name'>{item.movieName}</View>
        <View className="movie-sign-wrap">
          {(item.maoyanSignLabel || []).map((item, index) => {
            return (
              <View className="sign-item">猫眼{item}</View>
            )
          })}
        </View>
       
        <View className='director' style={{marginTop: `${item.maoyanSignLabel ? '15rpx': '24rpx' }`}}>
          {'导演：' + (item.director || '--')}
        </View>
        <View className="schedule-info">
          <Text>{item.releaseDesc}</Text>
          <scheduletype
            signContent={scheduleType[item.scheduleType]}
          ></scheduletype>
        </View>
      </View>

      <View className='value-info-wrap flex-item'>
        {item.estimateBox && (
          <View className='estimate-box'>
            <Text className='text'>预估</Text>
            <Text className="value">{formatNumber(item.estimateBox).num}</Text>
            <Text className="text">{formatNumber(item.estimateBox).unit}</Text>
          </View>
        )}
        {item.estimateBox && (
          <View className='estimate-rate'>
            <Text className='text'>票房占比</Text>
            <Text className="value">{rate}</Text>
          </View>
        )}
        {item.wishNum && item.wishNum !== '-' && (
          <View className={`wishNum ${item.estimateBox ? '': 'first-line'}`}>
            <Text className="value">{item.wishNum.num}{item.wishNum.unit}</Text>
            <Text className="text">人想看</Text>
          </View>
        )}
      </View>
    </View>
  </View>
  )
}