import React, { useState } from 'react';
import { View } from '@tarojs/components';
import FloatLayout from '@components/m5/float-layout';
import dayjs from 'dayjs';
import Conditions from './conditions';
import './index.scss';


export default function ReferenceConditions({ basicData, formData, changeFormData,stopScrollEvt }) {
  const {
    wishNum,
    estimateScore,
    cost,
    ticketExponent,
    releaseTime,
    director,
    mainRole,
  } = formData || {};
  const [showConditions, setShowConditions] = useState(false);

  const controlModal = (bool=false) => {
    stopScrollEvt(bool);
    setShowConditions(bool);
  }

  return <View className="reference-conditions">
    <View className="h2">预测参考条件
      <View className="modify-btn" onClick={ () => controlModal(true)}>修改条件</View>
    </View>

    <View className="conditions">
      <View className="detail">
        <View className="title">上映时间</View>
        <View className="cont">{releaseTime ? dayjs(releaseTime).format('YYYY.MM.DD') : '-'}</View>
      </View>

      <View className="detail">
        <View className="title">制作成本</View>
        <View className="cont">{cost ? `${cost}万` : '-'}</View>
      </View>

      <View className="detail">
        <View className="title">猫眼评分</View>
        <View className="cont">{estimateScore || '-'}</View>
      </View>

      <View className="detail">
        <View className="title">猫眼想看</View>
        <View className="cont">{wishNum ? `${wishNum}万` : '-'}</View>
      </View>

      <View className="detail">
        <View className="title">购票指数</View>
        <View className="cont">{ticketExponent || '-'}</View>
      </View>

      <View className="detail">
        <View className="title">导演</View>
        <View className="cont">{ director?.length > 0 ? director.join(' / ') : '-' }</View>
      </View>

      <View className="detail">
        <View className="title">主演</View>
        <View className="cont">{ mainRole?.length > 0 ? mainRole.join(' / ') : '-' }</View>
      </View>
    </View>

    <FloatLayout
      isOpened={showConditions}
      className="conditions-modal"
      onClose={()=>controlModal(false)}>

      <Conditions
        changeFormData={changeFormData}
        formData={formData}
        basicData={basicData}
        controlModal={(val=false)=>controlModal(val)} />

    </FloatLayout>
  </View>
}