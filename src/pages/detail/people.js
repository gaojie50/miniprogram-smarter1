import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtFloatLayout } from '../../components/m5';
import { CooperStatus } from './constant';
import Crown from '../../static/detail/crown.png';
import MainPeople from '../../static/detail/mainPeople.png';
import CooperPeople from '../../static/detail/cooperPeople.png';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import Close from '../../static/close.png';
import './people.scss';

const reqPacking = getGlobalData('reqPacking');
export default function People(props) {
  const { peopleData } = props;
  
  return (
    <AtFloatLayout className="people" onClose={() => props.cancelShow()} isOpened>
      <View className="title">
        <Text>对接人({peopleData.length})</Text>
        <View className="img" onClick={() => props.cancelShow()}>
          <Image src={Close} alt=""></Image>
        </View>
      </View>
      <View className="people-item">
      <ScrollView className="scroll" scrollY>
        {
          peopleData.map((item, index) => {
            return  <View className="item" key={index}>
            <Image className={item.role === 1 ? "item-left crown" : "item-left"} src={item.role === 1 ? MainPeople : CooperPeople} alt=""></Image>
            <View className="item-right">
              <View className="name">{item.userName}</View>
              <View className="describe">{item.userDesc}</View>
            </View>
          </View>
          })
        }
        </ScrollView>
      </View>
    </AtFloatLayout>
  )
}