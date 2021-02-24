import React, {useEffect, useState} from 'react';
import Taro, { connectSocket } from '@tarojs/taro';
import {
  View,
  Image,
  Text
} from '@tarojs/components';
import './index.scss';


const Indexes = function(props){
  const { list, topKey, jumpTarget, showTop=true, activeKey } = props;

  function handleItemClick(key){
    jumpTarget(key);
  }

  if(list.length>1){
    return (
      <View className='indexes-component'>
        <View className="indexes-menu">
          {showTop && <View
            className={`indexes-menu-item top`}
            onClick={()=>{handleItemClick(topKey)}}
          >
            Top
          </View>}
          {
            list.map(item=>{
              return (
                <View
                    className={`indexes-menu-item ${activeKey===item.key ? 'active': ''}`}
                    key={item.key}
                    onClick={()=>{handleItemClick(item.key)}}
                  >
                    {item.title}
                  </View>
              )
            })
          }
        </View>
      </View>
    )
  }else{
    return null;
  }
}

export default Indexes;