import { View } from '@tarojs/components';
import React from 'react';
import './index.scss';

export default function bottomSubmit(props) {
  const { onClick, name } = props;
  return (
    <View className="bottom-submit">
      <View className="bottom-submit-btn" onClick={onClick}>{name}</View>
    </View>
  )
}