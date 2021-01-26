import { View, Button, Input, Textarea, Text, Block } from '@tarojs/components'
import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import reqPacking from '../../../utils/reqPacking.js'
import './index.scss'

export default class _C extends React.Component {
  handleSelect(){
    const { tempId } = Taro.getCurrentInstance().router.params;
    Taro.setStorageSync('tempId', tempId);
    Taro.navigateBack();
  }

  render(){
    return (
      <View className="template-preview-wrap">
        <View>内容区</View>
        <Button className="select-btn" onClick={this.handleSelect}>选择该模板</Button>
      </View>
    )
  }
}