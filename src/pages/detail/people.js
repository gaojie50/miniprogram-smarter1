import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import FloatCard from '@components/m5/float-layout';
import { CooperStatus } from './constant';
import BottomSubmit from '@components/bottomSubmit';
import AtActionSheet from '@components/m5/action-sheet';
import AtActionSheetItem from '@components/m5/action-sheet/body/item';
import Crown from '@static/detail/crown.png';
import MainPeople from '@static/detail/mainPeople.png';
import CooperPeople from '@static/detail/cooperPeople.png';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import Close from '@static/close.png';
import './people.scss';

const reqPacking = getGlobalData('reqPacking');
export default function People(props) {
  const { peopleData, judgeRole } = props;
  const [openSheet, setOpenSheet] = useState(false);

  const addPeople = () => {
    Taro.navigateTo({
      url: `/pages/detail/addPeople/index?projectId=${peopleData[0].projectId}`,
    })
  }
  
  return (
    <FloatCard className="people" onClose={() => props.cancelShow()} isOpened={show}>
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
            <View className="last" onClick={() => setOpenSheet(true)}>
              <Image src="../../static/detail/company-edit.png" alt=""></Image>
            </View>
          </View>
          })
        }
        </ScrollView>
        <AtActionSheet isOpened={openSheet} cancelText='取消' onCancel={() => setOpenSheet(false)} onClose={() => setOpenSheet(false)}>
          <AtActionSheetItem onClick={changeMain}>取消负责人</AtActionSheetItem>
          <AtActionSheetItem onClick={changeMain}>设置备注名</AtActionSheetItem>
          <AtActionSheetItem onClick={changeMain}>设为负责人</AtActionSheetItem>
          <AtActionSheetItem onClick={changeMain}>移出该项目</AtActionSheetItem>
        </AtActionSheet>
        <BottomSubmit name="添加对接人" onClick={addPeople} />
      </View>
    </FloatCard>
  )
}