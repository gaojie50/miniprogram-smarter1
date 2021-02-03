import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button, } from '@tarojs/components';
import './index.scss';

export default function OperationFooter({ projectId, roundId, evaluated }) {
  const goToAssess = () => {
    console.log(projectId, roundId);
    Taro.navigateTo({
      url: `/pages/assess/detail/index?projectId=${projectId}&roundId=${roundId}`,
    })
  }

  const shareInvite = () => {
    return {
      title: '邀请参与',
      path: `/pages/assess/index/index?projectId=${projectId}&roundId=${roundId}`
    }
  }

  const shareResult = () => {
    return {
      title: '分享报告',
      path: `/pages/result/index?projectId=${projectId}&roundId=${roundId}`
    }
  }

  return <View className="operation-footer">
    <Button
      onShareAppMessage={shareInvite}
      openType="share">邀请参与</Button>
    {evaluated ?
      <Button
        className="attend"
        onShareAppMessage={shareResult}
        openType="share">分享报告</Button> :
      <Text className="attend" onClick={goToAssess}>去评估</Text>
    }
  </View>
}