import { Block, View, Text } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'

@withWeapp({
  properties: {
    signContent: {
      type: String,
      value: ''
    }
  }
})
class _C extends React.Component {
  render() {
    const { signContent } = this.data
    return (
      <View className="scheduleType">
        {signContent == '已定档' && (
          <View><Text className="scheduleDone">{signContent}</Text></View>
        )}
        {signContent == '非常确定' && (
          <View><Text className="scheduleDetermine">{signContent}</Text></View>
        )}
        {signContent == '可能' && (
          <View><Text className="scheduleMay">{signContent}</Text></View>
        )}
        {signContent == '内部建议' && (
          <View><Text className="scheduleInner">{signContent}</Text></View>
        )}
        {signContent == '待定' && (
          <View><Text className="scheduleNext">{signContent}</Text></View>
        )}
        {signContent == '重映' && (
          <View><Text className="scheduleRemake">{signContent}</Text></View>
        )}
      </View>
    )
  }
}

export default _C
