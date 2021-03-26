import React, { useState, forwardRef, useRef } from 'react';
import { View, Image, Text, Input,} from '@tarojs/components';
import dayjs from 'dayjs';
import closeIco from '@static/close.png';

export default function Conditions({
  closeEvt,
  formData,
  changeFormData,
}) {
  function handleReleaseDate() {

  };
  const {
    releaseTime,
    cost,
    estimateScore,
    wishNum,
    mainRole,
    director,
  } =formData || {};

  return <View className="adding-conditions">
    <View className="main">
      <View className="title">添加预测参考条件
        <View className="close-wrap" onClick={closeEvt}>
          <Image src={closeIco} />
        </View>
      </View>

      <ConditionsItems
        title="上映日期"
        required={true}
        contType="text"
        value={dayjs(releaseTime).format('YYYY.MM.DD')}
        event={handleReleaseDate}
        arrow={true} />

      <ConditionsItems
        title="制作成本"
        required={false}
        contType="input"
        value={cost}
        arrow={false}
        unit="万" />

      <ConditionsItems
        title="猫眼评分"
        required={true}
        contType="input"
        value={estimateScore}
        arrow={false}
        unit="分" />

      <ConditionsItems
        title="猫眼想看人数"
        required={false}
        contType="input"
        value={wishNum}
        arrow={false}
        unit="万" />

      <ConditionsItems
        title="导演"
        required={false}
        contType="btn"
        value={director}
        arrow={true} />

      <ConditionsItems
        title="主演"
        required={false}
        contType="btn"
        value={mainRole}
        arrow={true} />
    </View>

    <View className="start-wrap">
      <View className="start-btn">开始预测</View>
    </View>
  </View>
}


function ConditionsItems({
  title,
  required,
  contType,
  value,
  arrow,
  event,
  unit,
}) {

  function setInputValue() {

  }

  return <View
    onClick={event}
    className="conditions-items">

    <View className="name">
      {title}
      {required && <Text className="required">*</Text>}
    </View>

    {contType === 'text' && <View className="value"> {value} </View>}
    {contType === 'input' && <Input cursor-spacing="15" onInput={e => setInputValue(e.detail.value)} value={value} className="input" placeholder="请填写"></Input>}
    {contType === 'btn' && <View className="actor">
      {(value||[]).map(item =><Text className="star">{item}</Text>)}  
    </View>}
    {arrow && <View className="arrow" />}
    {unit && <View className="unit">{unit}</View>}

  </View>
}
