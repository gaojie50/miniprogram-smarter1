import { View, Textarea, Button, RadioGroup, Radio, ScrollView, Text　 } from '@tarojs/components';
import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { pagePath } from './constants';
import { get as getGlobalData } from '../../global_data';
import './index.scss';

const capsuleLocation = getGlobalData('capsuleLocation');
const titleBarHeight = capsuleLocation.bottom;

export default function JumpCustom() {
    const [value, setValue] = useState(pagePath[0].path);
    const [checked, setChecked] = useState(0);

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
            <ScrollView scrollY className='jump-path' style={{height: `calc(100vh - ${titleBarHeight}px - 165px)`}}>
              <RadioGroup>
                {
                  pagePath.map((item, index) => {
                    return <View className='path' key={index} onClick={() => {setValue(item.path);setChecked(index);}}>
                            <Radio  
                              className='path-radio'
                              checked={!!(index === checked)} 
                            />
                              <Text className='path-text'>{item.name} {item.path}</Text>
                          </View>
                  })
                }
              </RadioGroup>
            </ScrollView>
        </View>
    )
}