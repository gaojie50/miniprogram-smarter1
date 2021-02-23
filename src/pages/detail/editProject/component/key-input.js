import React, { useState, useEffect } from 'react';
import { View, Block, Text, Input } from '@tarojs/components';
import './key-input.scss';

export default function KeyInput(props, ref) {
  const { name, text, type } = props;
  const [inputValue, setInputValue] = useState();
  if(inputValue) {
    ref.current[type] = inputValue;
    props.updateRef();
  }

  useEffect(() => {
    if(props.data.movieName) {
      setInputValue(formateCost(props.data[type], type))
    }
  }, [props])

  return (
    <View className="key-input" >
      <Text className="title">{name}</Text>
      <Text className="param">{text}</Text>
      <Input onInput={e => setInputValue(e.detail.value)} value={inputValue} className="input" placeholder="请填写"></Input>
    </View>
  )
}

function formateCost(cost, type) {
  if(type === 'expectScore' || type === 'myShare') {
    return cost
  }

  const t = cost / 10000;
  const result = Math.floor(t * 100) / 100;
  return result
}