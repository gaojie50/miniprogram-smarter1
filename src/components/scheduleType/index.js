import { Block, View, Text } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'

@withWeapp({
  properties: {
    signContent: {
      type: String,
      value: '',
    },
  },
})
class _C extends React.Component {
  render() {
    const { signContent } = this.data
    return (
      <View className="scheduleType">
        <View>
          {signContent == '已定档' && (
            <Text className="scheduleDone">{signContent}</Text>
          )}
          {signContent == '非常确定' && (
            <Text className="scheduleDetermine">{signContent}</Text>
          )}
          {signContent == '可能' && (
            <Text className="scheduleMay">{signContent}</Text>
          )}
          {signContent == '内部建议' && (
            <Text className="scheduleInner">{signContent}</Text>
          )}
          {signContent == '待定' && (
            <Text className="scheduleNext">{signContent}</Text>
          )}
          {signContent == '重映' && (
            <Text className="scheduleRemake">{signContent}</Text>
          )}
        </View>
      </View>
    )
  }
}

export default _C
