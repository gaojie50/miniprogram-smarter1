import React, { useState, useEffect } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { lists, listsAfter } from './constants.js'
import './index.scss';

export default function BoxIncome({current, officeIncomeIndex, isMovieScreening}) {
  useEffect(()=>{
    console.log('current', current)
  })

  return(
    <View>
      {/* <View className='income-header'>
        <View className='income-header-title'>{incomeName[officeIncomeIndex]}</View>
        <Image src='http://p0.meituan.net/scarlett/758c0d7aaa2b996fa67f1b7a220ec561400.png' onClick={closeEvt}></Image>
      </View> */}
      {(isMovieScreening ? lists[current][officeIncomeIndex] : listsAfter[officeIncomeIndex]).map((list, index)=>{
        return(
          <View className='income-list' key={index}>
            <View className='income-left'>
              <View className='income-title'>{list.title}</View>
              <View className='income-remarks'>{list.remarks}</View>
            </View>
            <View className='income-money'>{list.money}<Text className='unit'>{list.unit}</Text></View>
          </View>
        )
      })}
    </View>
  )
}