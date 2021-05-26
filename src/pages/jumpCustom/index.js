import { View, Textarea, Button　 } from '@tarojs/components';
import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import './index.scss';

export default function JumpCustom() {
    const [value, setValue] = useState();

    return (
        <View className='jump-custom'>
            <View className='jump-custom-title'>请输入链接：</View>
            <Textarea 
              className='jump-custom-text'
              value={value} 
              onInput={e => setValue(e.detail.value)}  
              placeholder='请输入...'
              placeholderClass='place-text'
              autoHeight 
              autoFocus
            >
            </Textarea>
            <Button
              className='jump-custom-btn'
              onClick={() => {
                Taro.navigateTo({
                    url: value,
                  })
                }}
            >
                跳转
            </Button>
            <View style={{color: '#333333'}}>示例：/pages/detail/index?projectId=12345</View>
        </View>
    )
}