import React, { useState, useEffect } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'
import FloatLayout from '@components/m5/float-layout';
import BoxIncome from '../boxIncome/index'
import {numberFormat} from '../common'
import './index.scss'
import { handleActive } from '@components/m5/calendar/common/plugins';

export default function BoxOfficeData({current, isMovieScreening, projectId, name, response, showDate}) {
  const listsInfo =[
    {
      name: '票务收入',
      num: '',
      dataName: 'ticketIncome',
    },
    {
      name: '片方分账收入',
      num: '',
      dataName: 'splitIncome'
    },
    {
      name: '发行代理收入',
      num: '',
      dataName: 'distributionAgencyIncome'
    },
    {
      name: '宣发收入',
      num: '',
      dataName: 'advertisingIncome'
    },
  ]
  const preIncome = ['未来收入预估', '已实现收入预估', '总收入预估']
  const incomeName = ['票务收入(元)', '片方分账收入(元)', '发行代理收入(元)', '宣发收入(元)']
  const [lists, setLists] = useState(listsInfo);
  const [showProgress, setShowProgress] = useState(false);
  const [officeIncomeIndex, setOfficeIncomeIndex] = useState(0);

  useEffect(()=>{
    console.log(showDate, 'showDate!!!!!!!!');
  }, [showDate])
  
  useEffect(()=>{
    lists.map((item)=>{
      item.num = response[item.dataName] ? response[item.dataName].total : ''
    })
    setLists(lists);
  }, [response])
  const changeShowProgress =(index)=> {
    setShowProgress(true);
    setOfficeIncomeIndex(index);
    console.log(index);
  }

  const gotoParam = (index) => {
    Taro.redirectTo({
      url: `/pages/coreData/realTime/index?paramIndex=${index}&projectId=${projectId}&isMovieScreening=${isMovieScreening}&name=${name}&showDate=${showDate}`
    })
  }
  const handlePageHistory = () => {
    Taro.redirectTo({
      url: `/pages/coreData/fixHistory/index?projectId=${projectId}`
    })
  }

  return (
    <View>
      <View className='pre-income'>{isMovieScreening ? preIncome[current] : '总收入'}</View>
      <View className='income-num'>{numberFormat(response.totalIncome).num}<Text className='unit'>{numberFormat(response.totalIncome).unit}</Text></View>
      <View className='office-income-box'>
        {lists.map((list, index)=>{
          return (
            <View className='office-income' key={index} onClick={()=>{changeShowProgress(index)}}>
              <View className='office-income-left'>
                <View className='office-income-name'>{list.name}</View>
                <View className='office-income-num'>{numberFormat(list.num).num}<Text className='unit'>{numberFormat(list.num).unit}</Text></View>
              </View>
              <Image src='http://p0.meituan.net/scarlett/82284f5ad86be73bf51bad206bead653595.png'></Image>
            </View>
          )
        })}
      </View>
      <View className='param-header'>
        <View className='param-left'>参数与条件</View>
        <View className='param-right' onClick={()=>handlePageHistory()}>变更记录</View>
      </View>
      <View className='param' onClick={()=>{gotoParam(0)}}>
        <View className='param-header-left'>合同参数</View>
        <View className='param-header-right'>去更改</View>
        <Image src='http://p0.meituan.net/scarlett/82284f5ad86be73bf51bad206bead653595.png'></Image>
      </View>
      <View className='param' onClick={()=>{gotoParam(1)}}>
        <View className='param-header-left'>实时参数</View>
        <View className='param-header-right'>去查看</View>
        <Image src='http://p0.meituan.net/scarlett/82284f5ad86be73bf51bad206bead653595.png'></Image>
      </View>
      <View className='param' onClick={()=>{gotoParam(2)}}>
        <View className='param-header-left'>假定条件</View>
        <View className='param-header-right'>去查看</View>
        <Image src='http://p0.meituan.net/scarlett/82284f5ad86be73bf51bad206bead653595.png'></Image>
      </View>
      <FloatLayout 
        isOpened={showProgress} 
        className='layout-process'
        onClose={() => setShowProgress(false)}
        title={incomeName[officeIncomeIndex]}
      >
        <BoxIncome
          closeEvt={() => setShowProgress(false)}
          current={current}
          isMovieScreening={isMovieScreening}
          officeIncomeIndex={officeIncomeIndex}
          response={response}
        ></BoxIncome>
      </FloatLayout>
    </View>
  );
}
