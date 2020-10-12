import { Block, View } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'

@withWeapp({
  properties: {
    backdropShow: {
      type: String,
      value: '1',
    },
  },
  methods: {
    tapFilterBackdrop: function () {
      const cancelPanel = {
        backdropShow: '',
        filterActive: '',
      }
      this.triggerEvent('myevent', cancelPanel)
    },
    tapCostomBackdrop: function () {
      const cancelPanel = {
        backdropShow: '',
        costomShow: false,
      }
      this.triggerEvent('myevent', cancelPanel)
    },
  },
})
class _C extends React.Component {

  render() {
    const { backdropShow } = this.props
    return (
      <View className="backdropAll">
        <Block>
          {backdropShow === 'filter' && (
            <View
              onTouchMove={this.privateStopNoop}
              className="backdrop"
              onClick={this.tapFilterBackdrop}
            ></View>
          )}
          {backdropShow === 'costom' && (
            <View
              onTouchMove={this.privateStopNoop}
              className="backdropTop"
              onClick={this.tapCostomBackdrop}
            ></View>
          )}
        </Block>
      </View>
    )
  }
}

export default _C
