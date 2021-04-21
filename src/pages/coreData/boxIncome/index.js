import React, { useState, useEffect } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'
import './index.scss'

export default function BoxIncome({current, officeIncomeIndex, isMovieScreening}) {

  const lists=[
    [
      {
        title: '中国大陆境内地区票房收入预测',
        remarks: '含服务费',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：已产生票房',
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
        remarks: '',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '票务收入',
        remarks: '计算公式：猫眼选座交易额*猫眼票务收入占比',
        money: 3445.1,
        unit: '万',
      },
    ],
    [
      {
        title: '中国大陆境内地区未来分账票房空间',
        remarks: '去除约9%手续费',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：国家电影专项基金',
        remarks: '5%票房',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：增值税税金及附加',
        remarks: '3.3%票房',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '净票房',
        remarks: '计算公式：中国大陆境内地区未来分账票房空间+扣除：国家电影专项基金+扣除：增值税税金及附加',
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
        title: '猫眼份额转让收入',
        remarks: '计算公式：猫眼份额转让收入*（1-影片已产生票房/票房收入预测）',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：中影代理费',
        remarks: '默认1%的片方应得收入，200万封顶',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：宣发费用',
        remarks: '片方应得收入*相应比例，计算公式为宣发你费用*(1-影片已产生票房/票房收入预测)',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：发行代理费（除网络外）',
        remarks: '比例以合同为准，计算公式：发行代理费*（1-影片已产生票房/票房收入预测）',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：主创分红',
        remarks: '比例以合同为准，计算公式：主创分红*（1-影片已产生票房/票房收入预测）',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：投资方回本',
        remarks: '比例以合同为准，计算公式：投资方成本*（1-影片已产生票房/票房收入预测）',
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
        title: '片方分账收入',
        remarks: '含回收成本，计算公式：净收入*猫眼份额+猫眼投资成本+猫眼份额转让收入',
        money: 3445.1,
        unit: '万',
      },
    ],
    [
      {
        title: '发行代理费',
        remarks: '以合同为准，计算公式为猫眼发行代理费*（1-影片已产生票房/票房收入预测',
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
        title: '扣除：已花片方票补',
        remarks: '',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：已获得资源收入',
        remarks: '计算公式：平台资源收入*（1-影片已产生票房/票房收入预测）',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '其它收入',
        remarks: '',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '宣发收入',
        remarks: '计算公式：票补收入+平台资源收入+扣除：已花片方票补+扣除：已获得资源收入',
        money: 3445.1,
        unit: '万',
      },
    ]
  ]

  const listsAfter=[
    [
      {
        title: '中国大陆境内地区票房收入预测',
        remarks: '含服务费',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '猫眼票务收入占比',
        remarks: '',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '猫眼选座交易额',
        remarks: '',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '票务收入',
        remarks: '计算公式：猫眼选座交易额*猫眼票务收入占比',
        money: 3445.1,
        unit: '万',
      },
    ],
    [
      {
        title: '总票房收入',
        remarks: '不含服务费',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：国家电影专项基金 ',
        remarks: '5%票房',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：增值税税金及附加',
        remarks: '3.3%票房',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '净票房',
        remarks: '计算公式：总票房收入（不含服务费）+扣除：国家电影专项基金+扣除：增值税税金及附加',
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
        title: '扣除：中影代理费',
        remarks: '默认1%的片方应得收入，200万封顶',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：宣发费用',
        remarks: '以合同为准',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：发行代理费（除网络外）',
        remarks: '以合同为准',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：主创分红',
        remarks: '以合同为准',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '扣除：投资方回本',
        remarks: '以合同为准',
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
        title: '片方分账收入', 
        remarks: '计算公式：净收入*猫眼份额+猫眼投资成本+猫眼份额转让收入',
        money: 3445.1,
        unit: '万',
      },
    ],
    [
      {
        title: '发行代理费',
        remarks: '以合同为准',
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
        title: '其它收入',
        remarks: '',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '宣发收入',
        remarks: '计算公式：票补收入+平台资源收入+其它收入',
        money: 3445.1,
        unit: '万',
      },
    ]
  ]

  useEffect(()=>{
    console.log('current', current)
  })

  return(
    <View>
      {/* <View className='income-header'>
        <View className='income-header-title'>{incomeName[officeIncomeIndex]}</View>
        <Image src='http://p0.meituan.net/scarlett/758c0d7aaa2b996fa67f1b7a220ec561400.png' onClick={closeEvt}></Image>
      </View> */}
      {(isMovieScreening ? lists[officeIncomeIndex] : listsAfter[officeIncomeIndex]).map((list, index)=>{
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