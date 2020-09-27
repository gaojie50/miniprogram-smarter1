import { Block, Text } from '@tarojs/components'
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
          <Text className="mainOutput">{signContent}</Text>
        )}
        {signContent == '主发' && (
          <Text className="mainPublish">{signContent}</Text>
        )}
        {signContent == '联出' && (
          <Text className="nionOutput">{signContent}</Text>
        )}
        {signContent == '出品' && (
          <Text className="products">{signContent}</Text>
        )}
        {signContent == '发行' && <Text className="issue">{signContent}</Text>}
        {signContent == '联发' && (
          <Text className="unionPublish">{signContent}</Text>
        )}
      </Block>
    )
  }
}

export default _C
