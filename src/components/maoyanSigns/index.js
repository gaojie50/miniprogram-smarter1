import { Block, Text, View } from '@tarojs/components'
import React from 'react'
import './index.scss'

class _C extends React.Component {
  static defaultProps = {
    signContent: ''
  }
  render() {
    const { signContent } = this.props
    return (
      <Block>
        <View className="mainInline">
          <View>
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
            {signContent == '发行' && (
              <Text className="issue">{signContent}</Text>
            )}
            {signContent == '联发' && (
              <Text className="unionPublish">{signContent}</Text>
            )}
          </View>
        </View>
      </Block>
    )
  }
}

export default _C
