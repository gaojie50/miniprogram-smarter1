import { Block, View, Image, Text, ScrollView } from '@tarojs/components'
import React from 'react';
import Taro from '@tarojs/taro';
import TotalBox from '@components/business/totalBox';
import ReferenceConditions from '@components/business/referenceConditions';
import './index.scss';

export default function BoxForecasting(){
  return <View className="bg">
   <ScrollView className="box-forecasting">
      <TotalBox />
      <ReferenceConditions />
    </ScrollView>
  </View>
}