import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance, setBackgroundColor } from '@tarojs/taro';
import { View, Block } from '@tarojs/components';

import DateBar from '../../components/dateBar';


export default function test() {

  useEffect(() => {
  }, []);


  return <View className="result" style={{backgroundColor: '#eee', height: '820px', width: '100%'}}>
        <DateBar />
  </View>
}