/* eslint-disable jsx-quotes */
import React from 'react';
import Taro from '@tarojs/taro';
import {
  View,
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
            className="indexes-menu-item-wrapper"
            onClick={()=>{handleItemClick(topKey)}}
          >
            <View className="indexes-menu-item top">
              Top
            </View>
          </View>}
          {
            list.map(item=>{
              return (
                <View
                  className="indexes-menu-item-wrapper"
                  key={item.key}
                  onClick={()=>{handleItemClick(item.key)}}
                >
                  <View className={`indexes-menu-item ${activeKey===item.key ? 'active': ''}`}>
                    {item.title}
                  </View>
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