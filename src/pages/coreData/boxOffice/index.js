import React, { useState, useEffect } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'
import FloatLayout from '@components/m5/float-layout';
import lx from '@analytics/wechat-sdk';
import BoxIncome from '../boxIncome/index'
import {numberFormat} from '../common'
import './index.scss'
// import { handleActive } from '@components/m5/calendar/common/plugins';

export default function BoxOfficeData({current, isMovieScreening, projectId, name, response, showDate,  childChangeShowProgress}) {
  const listsInfo =[
    {
      name: '票务收入',
      num: '',
      dataName: 'ticketIncome',
    },
    {
      name: '猫眼投资收入',
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
  const incomeName = ['票务收入(元)', '猫眼投资收入(元)', '发行代理收入(元)', '宣发收入(元)']
  const [lists, setLists] = useState(listsInfo);
  const [showProgress, setShowProgress] = useState(false);
  const [officeIncomeIndex, setOfficeIncomeIndex] = useState(0);
  
  useEffect(()=>{
    lists.map((item)=>{
      item.num = response[item.dataName] ? (item.dataName === 'distributionAgencyIncome' ? response[item.dataName].myDistributionAgencyIncome : response[item.dataName].total) : ''
    })
    setLists(lists);
  }, [response])
  
  useEffect(()=>{
    childChangeShowProgress(showProgress);
  }, [showProgress])
  
  const changeShowProgress =(index)=> {
    setShowProgress(true);
    setOfficeIncomeIndex(index);
  }

  const gotoParam = (index) => {
    if(index == '0') {
      const { userInfo } = Taro.getStorageSync('authinfo') || {};
    lx.moduleClick('b_movie_b_rumi8b0d_mc', {
      custom: {
        user_id: userInfo.keeperUserId,
        project_id: projectId,
        keep_user_id: userInfo.keeperUserId
      }
    }, { cid: 'c_movie_b_u55jfr38'});
    }
    Taro.navigateTo({
      url: `/pages/coreData/realTime/index?paramIndex=${index}&projectId=${projectId}&isMovieScreening=${isMovieScreening}&name=${name}&showDate=${showDate}`
    })
  }
  const handlePageHistory = () => {
    Taro.navigateTo({
      url: `/pages/coreData/fixHistory/index?projectId=${projectId}&isMovieScreening=${isMovieScreening}&name=${name}`
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
