import { Block, View } from '@tarojs/components'
import React from 'react'
import './index.scss'
class _C extends React.Component {
  static defaultProps = {
    backdropShow: '',
  }

  render() {
    console.log(this.privateStopNoop);
    const { backdropShow } = this.props
    return (
      <View className="backdropAll">
        <Block>
          {backdropShow === 'filter' && (
            <View
              onTouchMove={this.privateStopNoop}
              className="backdrop"
              onClick={() => this.props.ongetBackDrop()}
            ></View>
          )}
          {backdropShow === 'costom' && (
            <View
              onTouchMove={this.privateStopNoop}
              className="backdropTop"
              onClick={() => this.props.ongetBackDrop()}
            ></View>
          )}
        </Block>
      </View>
    )
  }
}

export default _C
