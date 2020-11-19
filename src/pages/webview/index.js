import { WebView } from '@tarojs/components'
import React from 'react'

class _C extends React.Component {
  state = {
    url: '',
  }

  onLoad = (options) => {
    this.setState({ url: decodeURIComponent(options.url) })
  }
  render() {
    const { url } = this.state
    return <WebView src={url}></WebView>
  }
}

export default _C
