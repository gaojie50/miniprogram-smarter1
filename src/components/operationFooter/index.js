import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, } from '@tarojs/components';
import './index.scss';

export default function OperationFooter({ projectId, roundId,evaluated }) {
    return <View className="operation-footer">
        <Text>邀请参与</Text>
        <Text className="attend">{evaluated ? '分享报告':'去评估'}</Text>
    </View>
}