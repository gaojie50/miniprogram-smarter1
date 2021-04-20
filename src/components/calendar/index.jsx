import React from 'react'; 
import { View} from '@tarojs/components';
import  Calendar from '@components/m5/calendar'
import '@components/m5/style/components/calendar.scss'
import Taro from '@tarojs/taro'

export default function calendar() {
  return (
    <View>
      <Calendar />
    </View>
  );
}
