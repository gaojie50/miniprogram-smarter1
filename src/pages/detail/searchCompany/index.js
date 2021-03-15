import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import reqPacking from '@utils/reqPacking.js';
import './index.scss';

export default function SearchCompany() {
  const [focus, setFocus] = useState(false);

  useEffect(()=>{
    const pages =Taro.getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();
    eventChannel.on("acceptDataFromOpenerPage",(res)=>{
      console.log(res,999)
    })
  },[])

  return (
    <View className="edit-search-company"> 
      <View className="edit-search-company-box">
        <View className="edit-search-company-wrap">
          <View className="edit-search-company-bar" style={{width: focus ? '612rpx' : '690rpx'}}>
            <Image src="../../../static/icon/search.png" alt=""></Image>
            <input placeholder="搜索并添加出品方" onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className="edit-search-company-bar-input"></input>
            {focus ? <View className="cancel">取消</View> : null}
          </View>
        </View>
      </View>
      <ScrollView scrollY className="edit-rearch-result">
        
      </ScrollView>
    </View>
  )
}



