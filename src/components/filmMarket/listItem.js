import { View, Text, Image } from '@tarojs/components';
import React from 'react';
import Taro from '@tarojs/taro';
import NumberLabel from '@components/numberLabel';
import { scheduleType } from './constant';

export default function ListItem(props){
  const { item, orderNum, showNumber } = props;
  
  function jumpDetail(e){
    const { item:data } = e.currentTarget.dataset
    const { maoyanId, projectId } = data
    Taro.navigateTo({
      url: `/pages/detail/index?maoyanId=${maoyanId}&projectId=${projectId}`,
    })
  }
  
  return (
    <View
      className='item'
      onClick={jumpDetail}
      data-item={item}
      key={item.maoyanId}
    >
    {showNumber && <NumberLabel number={orderNum} />}
    <Image src={item.pic} alt></Image>
    <View className='main'>
      <View className='firstLine'>
        <View className='name'>{item.movieName}</View>
        {item.estimateBox && (
          <View className='yello'>
            <Text>{item.estimateBox.num}</Text>
            <Text>{item.estimateBox.unit + '预估票房'}</Text>
          </View>
        )}
        {!item.estimateBox && item.wishNum !== '-' && (
          <View className='yello'>
            <Text>{item.wishNum.num}</Text>
            <Text>{item.wishNum.unit + '想看数'}</Text>
          </View>
        )}
      </View>
      <View className='secondLine'>
        <View className='left'>
          {(item.maoyanSignLabel || []).map((item, index) => {
            return (
              <maoyansign
                key={index}
                signContent={item}
              ></maoyansign>
            )
          })}
          <View className='director'>
            {'导演：' + (item.director || '--')}
          </View>
        </View>
        {item.estimateBox && item.wishNum !== '-' && (
          <View className='wishNum'>
            <Text>{item.wishNum.num}</Text>
            <Text>{item.wishNum.unit + '想看数'}</Text>
          </View>
        )}
      </View>
      <View className='thirdLine'>
        <Text>{item.releaseDesc}</Text>
        <scheduletype
          signContent={scheduleType[item.scheduleType]}
        ></scheduletype>
      </View>
    </View>
  </View>
  )
}