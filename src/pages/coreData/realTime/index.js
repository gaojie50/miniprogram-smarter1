import React, { useState, useEffect } from 'react'; 
import { View, Image, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro'
import ArrowLeft from '@static/detail/arrow-left.png';
import FloatLayout from '@components/m5/float-layout';
import M5Input from '@components/m5/input';
import '@components/m5/style/components/input.scss';
import './index.scss'
import BoxCalculate from '../boxCalculate';

export default  function realTime({}) {

  const handleBack = () => {
    if(Taro.getCurrentPages().length>1){
      Taro.navigateBack();
    }else{
      Taro.redirectTo({
        url: `/pages/board/index`
      })
    }
  }

  const paramIndex = 0;
  const [showProgress, setShowProgress] = useState(true);
  const [officeIncomeIndex, setOfficeIncomeIndex] = useState(0);
  const incomeName = ['', '总发行代理费', '猫眼发行代理费', '主创分红']

  const changeShowProgress =(index)=> {
    setShowProgress(true);
    setOfficeIncomeIndex(index);
    console.log(index);
  }
  const lists=[
    [
      {
        title: '中国大陆境内地区票房收入预测(元)',
        remarks: '机器预测，含服务费',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '未来票房空间(元)',
        remarks: '中国大陆境内地区票房收入预测扣除已产生票房',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '中国大陆境内地区未来分账票房空间(元)',
        remarks: '去除约9%的手续费',
        money: 13.5,
        unit: '万',
      },
      {
        title: '已产生票房(元)',
        remarks: '含服务费',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '净票房(元)',
        remarks: '中国大陆境内地区未来分账票房空间扣除国家电影专项基金和增值税税金及附加',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '猫眼选座交易额占比',
        remarks: '计算公式；实时已产生的猫眼交易额/已产生票房',
        money: 3,
        unit: '%',
      },
      {
        title: '猫眼票务收入占比',
        remarks: '计算公式；实时已产生的票务收入/实时猫眼交易额',
        money: 9.2,
        unit: '%',
      },
      {
        title: '宣发费用中已花费片方票补(元)',
        remarks: '',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '宣发费用中已花费片方票补(元)',
        remarks: '计算公式：（已产生票房/票房收入预测）*宣发费用中猫眼平台资源收入',
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
        title: '宣发费用',
        money: 3445.1,
        unit: '万元',
      },
      {
        title: '总发行代理费',
        remarks: '一般为片方应得收入的15%或净票房的5%',
        money: 3445.1,
        toCalculate: '去计算',
        unit: '万元',
      },
      {
        title: '猫眼发行代理费',
        remarks: '以合同为准',
        toCalculate: '去计算',
        money: 3445.1,
        unit: '万元',
      },
      {
        title: '主创分红',
        remarks: '以合同为准',
        toCalculate: '去计算',
        money: 3445.1,
        unit: '万元',
      },
      {
        title: '猫眼投资成本',
        remarks: '',
        money: 3445.1,
        unit: '万元',
      },
      {
        title: '投资方成本',
        remarks: '',
        money: 3445.1,
        unit: '万元',
      },
      {
        title: '猫眼份额',
        remarks: '',
        money: 3445.1,
        unit: '%',
      },
      {
        title: '猫眼份额转让费',
        remarks: '',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '宣发费用中猫眼票补收入',
        remarks: '',
        money: 3445.1,
        unit: '万元',
      },
      {
        title: '宣发费用中已花费片方票补',
        remarks: '',
        money: 3445.1,
        unit: '万元',
      },
      {
        title: '宣发费用中猫眼平台资源收入',
        remarks: '',
        money: 3445.1,
        unit: '万元',
      },
      {
        title: '宣发费用中猫眼平台已获得资源收入',
        remarks: '',
        money: 3445.1,
        unit: '万元',
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

  return (
    <View className='detail-page'>
      <View className='detail-top'>
        <View className='top'>
          <View className='header'>
            <View className='backPage' onClick={handleBack}>
              <Image src={ArrowLeft}></Image>
            </View>
            <Text className='header-title'>实时参数</Text>
          </View>
        </View>
      </View>
      <ScrollView className='detail' scrollY>
        {lists[1].map((list, index)=>{
          return(
            (paramIndex !== 0 ?
                <View className='param-list' key={index}>
                  <View className='param-left'>
                    <View className='param-title'>{list.title}</View>
                    <View className='param-remarks'>{list.remarks}</View>
                  </View>
                  <View className='param-money'>{list.money}<Text className='unit'>{list.unit}</Text></View>
                </View>
                :
                <View className='param-list' key={index}>
                  <View className='param-left'>
                    <View className='param-title'>{list.title}</View>
                    <View className='param-remarks'>{list.remarks}</View>
                  </View>
                  {list.toCalculate ? 
                    <View className='param-to' onClick={()=>{changeShowProgress(index)}}>
                      <View className='param-header-right'>{list.toCalculate}</View>
                      <Image src='http://p0.meituan.net/scarlett/82284f5ad86be73bf51bad206bead653595.png' />
                    </View> 
                    :
                    <View className='param-money'><M5Input type='number' placeholder='请输入' /><Text className='unit1'>{list.unit}</Text></View>
                  }
                </View>
            )
          )
        })}
      </ScrollView>
      <View className='bottom-box' onClick={()=>{console.log('123')}}>
        <View className='button'>提交</View>
      </View>
      {showProgress ?
        <View className='float-bottom-box' onClick={()=>{console.log('333')}}>
          <View className='button'>计算</View>
        </View> : ''
      }
      <FloatLayout 
        isOpened={showProgress}
        className='layout-process'
        onClose={() => setShowProgress(false)}
        title={incomeName[officeIncomeIndex]}
      >
        <BoxCalculate
          closeEvt={() => setShowProgress(false)}
          officeIncomeIndex={officeIncomeIndex}
        ></BoxCalculate>
      </FloatLayout>
    </View>
  )
}