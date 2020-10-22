import { View, Text } from '@tarojs/components'
import React from 'react'
import './index.scss'

class _C extends React.Component {
  static defaultProps = {
    signContent: '',
  }

  render() {
    const { signContent } = this.props;
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
