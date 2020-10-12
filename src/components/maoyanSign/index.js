import { Block, Text, View } from '@tarojs/components'
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
      <Block>
        {signContent == '主出' && (
          <View><Text className="mainOutput">{signContent}</Text></View>
        )}
        {signContent == '主发' && (
          <View><Text className="mainPublish">{signContent}</Text></View>
        )}
        {signContent == '联出' && (
          <View><Text className="nionOutput">{signContent}</Text></View>
        )}
        {signContent == '出品' && (
          <View><Text className="products">{signContent}</Text></View>
        )}
        {signContent == '发行' && (
          <View><Text className="issue">{signContent}</Text></View>
        )}
        {signContent == '联发' && (
          <View><Text className="unionPublish">{signContent}</Text></View>
        )}
      </Block>
    )
  }
}

export default _C
