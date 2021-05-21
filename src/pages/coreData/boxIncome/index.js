import React, { useState, useEffect } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { lists, listsAfter } from './constants.js'
import {numberFormat} from '../common'
import './index.scss';

export default function BoxIncome({current, officeIncomeIndex, isMovieScreening, response}) {
  useEffect(()=>{
    if(isMovieScreening) {
      lists[current][0].forEach((i) => {
        i.money = response.ticketIncome && response.ticketIncome[i.key];
      })
      lists[current][1].forEach((i) => {
        i.money = response.splitIncome && response.splitIncome[i.key];
      })
      lists[current][2].forEach((i) => {
        i.money = response.distributionAgencyIncome && response.distributionAgencyIncome[i.key];
      })
      lists[current][3].forEach((i) => {
        i.money = response.advertisingIncome && response.advertisingIncome[i.key];
      })
    } else {
      listsAfter[0].forEach((i) => {
        i.money = response.ticketIncome && response.ticketIncome[i.key];
      })
      listsAfter[1].forEach((i) => {
        i.money = response.splitIncome && response.splitIncome[i.key];
      })
      listsAfter[2].forEach((i) => {
        i.money = response.distributionAgencyIncome && response.distributionAgencyIncome[i.key];
      })
      listsAfter[3].forEach((i) => {
        i.money = response.advertisingIncome && response.advertisingIncome[i.key];
      })
    }
  })

  return(
    <View catchtouchmove="true">
      {/* <View className='income-header'>
        <View className='income-header-title'>{incomeName[officeIncomeIndex]}</View>
        <Image src='http://p0.meituan.net/scarlett/758c0d7aaa2b996fa67f1b7a220ec561400.png' onClick={closeEvt}></Image>
      </View> */}
      {(isMovieScreening ? lists[current][officeIncomeIndex] : listsAfter[officeIncomeIndex]).map((list, index)=>{
        return (
          <View className='income-list' key={index}>
            <View className='income-left'>
              <View className='income-title'>{list.title}</View>
              <View className='income-remarks'>{list.remarks}</View>
            </View>
            <View className='income-money'>{numberFormat(list.money).num}<Text className='unit'>{numberFormat(list.money).unit}</Text></View>
          </View>
        )
      })}
    </View>
  )
}