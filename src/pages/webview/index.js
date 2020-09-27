import { Block, WebView } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'

@withWeapp({
  data: {
    url: ''
  },

  onLoad: function(options) {
    this.setData({ url: decodeURIComponent(options.url) })
  }
})
class _C extends React.Component {
  render() {
    const { url } = this.data
    return <WebView src={url}></WebView>
  }
}

export default _C
