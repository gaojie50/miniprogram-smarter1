import React from 'react';
import Taro from '@tarojs/taro';
import {
  View,
  Image,
  Text
} from '@tarojs/components';
import './index.scss';

const Indexes = function(props){
  const { list, topKey, jumpTarget } = props;
  return (
    <View className='indexes-component'>
      <View className="indexes-menu">
        <View
          className='indexes-menu-item'
          onClick={()=>{jumpTarget(topKey)}}
        >
          'Top'
        </View>
      {
        list.map(item=>{
          console.log(item)
          return (
            <View
                className='indexes-menu-item'
                key={item.key}
                onClick={()=>{jumpTarget(item.key)}}
              >
                {item.title}
              </View>
          )
        })
      }
      </View>
    </View>
  )
}

export default Indexes;