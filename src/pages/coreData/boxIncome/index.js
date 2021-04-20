import React, { useState, useEffect } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'
import './index.scss'

export default function BoxIncome({officeIncomeIndex}) {

  const lists=[
    [
      {
        title: '中国大陆境内地区票房收入预测',
        remarks: '含服务费',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除已产生票房',
        remarks: '含服务费',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '未来票房空间',
        remarks: '计算公式：中国大陆境内地区票房收入预测-已产生票房',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '猫眼选座交易额',
        remarks: '计算公式：实时猫眼交易额/以产生票房*未来票房空间',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '票务总收入',
        remarks: '计算公式：实时已产生票务收入/实时交易额*猫眼选座交易额',
        money: 3445.1,
        unit: '万',
      },
    ],
    [
      {
        title: '中国大陆境内地区票房收入预测',
        remarks: '去除约9%手续费',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除国家电影专项基金',
        remarks: '5%票房',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除增值税税金及附加',
        remarks: '3.3%票房',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '净票房',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '片方应得收入',
        remarks: '43%净票房',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除中影代理费',
        remarks: '默认1%的片方应得收入，200万封顶',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除宣发费用',
        remarks: '片方应得收入*相应比例，计算公式为宣发你费用*(1-影片已产生票房/票房收入预测)',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除发行代理费（除网络外）',
        remarks: '比例以合同为准',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除主创分红',
        remarks: '比例以合同为准，计算公式为主创分红*（1-影片已产生票房/票房收入预测）',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除投资方回本',
        remarks: '3.3%票房',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '总扣除',
        remarks: '计算公式：上述5项扣除费用之和',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '净收入',
        remarks: '计算公式：片方应得收入+总扣除',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '猫眼份额转让费',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '投资回收',
        remarks: '含回收成本，计算公式：净收入*猫眼份额+猫眼投资成本',
        money: 3445.1,
        unit: '万',
      },
    ],
    [
      {
        title: '发行代理费',
        remarks: '计算公式：发行代理费*（1-影片已产生票房/票房收入预测）',
        money: 3445.1,
        unit: '万',
      },
    ],
    [
      {
        title: '票补收入',
        remarks: '',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '平台资源收入',
        remarks: '',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除已花片方票补',
        remarks: '计算公式：平台资源收入*（影片已产生票房/票房收入预测）',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：已获得资源收入',
        remarks: '计算公式：票补收入+平台资源收入+扣除：已花片方票补+扣除：已获得资源收入',
        money: 3445.1,
        unit: '万',
      },
    ]
  ]

  return(
    <View>
      {/* <View className='income-header'>
        <View className='income-header-title'>{incomeName[officeIncomeIndex]}</View>
        <Image src='http://p0.meituan.net/scarlett/758c0d7aaa2b996fa67f1b7a220ec561400.png' onClick={closeEvt}></Image>
      </View> */}
      {lists[officeIncomeIndex].map((list, index)=>{
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