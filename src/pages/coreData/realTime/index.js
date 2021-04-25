import React, { useState, useEffect, useCallback } from 'react'; 
import { View, Image, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro'
import ArrowLeft from '@static/detail/arrow-left.png';
import FloatLayout from '@components/m5/float-layout';
import '@components/m5/style/components/input.scss';
import './index.scss'
import BoxCalculate from '../boxCalculate';
import BonusCalculate from '../bonusCalculate';
import { get as getGlobalData } from '../../../global_data';
import { REALTIME_DATA_LISTS as listsInfo } from '../constant';
import { numberFormat } from '../common';

export default  function realTime({}) {
  const reqPacking = getGlobalData('reqPacking');
  const incomeName = ['', '总发行代理费', '猫眼发行代理费', '主创分红']
  const paramTitle = ['合同参数', '实时参数', '假定条件']
  const requestUrls = [
    '',
    'api/management/finance/realTimeData/get',
    'api/management/finance/defaultParameter/get',
  ]
  const url = Taro.getCurrentPages();
  const paramIndex = url[0].options.paramIndex;
  const [showProgress, setShowProgress] = useState(false);
  const [officeIncomeIndex, setOfficeIncomeIndex] = useState();
  const [lists, setLists] = useState(listsInfo);
  const [isSubmit, setIsSubmit] = useState(false);
  const [calculate, setCalculate] =useState(1);
  const [valueData, setValueData] = useState(0);
  const changeCalculate = useCallback((calculateValue)=>setCalculate(calculateValue), []);
  const childChangeShowProgress = useCallback((childShowProgress)=>setShowProgress(childShowProgress),[]);

  const handleBack = () => {
    if(Taro.getCurrentPages().length>1){
      Taro.navigateBack();
    }else{
      Taro.redirectTo({
        url: `/pages/coreData/index`
      })
    }
  }

  const changeShowProgress =(index)=> {
    setShowProgress(true);
    setOfficeIncomeIndex(index);
    console.log(index);
  }

  const ChangeValue = (e, index) => {
    const val = e.detail.value;
    console.log(index, val, lists);
    var newList = lists.concat();
    newList[0][index].money = val;
    console.log(newList, newList[0]);
    setLists(newList);
    let count = 0;
    lists[0].map((item)=>{
      if(item.money !== '') {
        count++;
        console.log(item.money)
      }
    })
    if(count == 11) {
      setIsSubmit(true);
    }
  }

  const bottomSubmit = () => {
    
  }

  const getValueData = () => {
    reqPacking({
      url: requestUrls[paramIndex],
      data: {
        // projectId,
      }
    }).then(res => {
      const { success, error } = res;
      if (success) {
        const { data } = res;
        setValueData(data);
      } else {
        Taro.showToast({
          title: error && error.message,
          icon: 'none',
          duration: 2000,
        });
      }
    })
  }

  useEffect(getValueData, [paramIndex]);
  

  useEffect(()=>{
    console.log('useEffect', calculate);
  }, []);


  // getRealTimeData();

  return (
    <View className='detail-page'>
      <View className='detail-top'>
        <View className='top'>
          <View className='header'>
            <View className='backPage' onClick={handleBack}>
              <Image src={ArrowLeft}></Image>
            </View>
            <Text className='header-title'>{paramTitle[paramIndex]}</Text>
          </View>
        </View>
      </View>
      <ScrollView className='detail' scrollY>
        {listsInfo[paramIndex].map((list, index)=>{
          return(
            (paramIndex !== '0' ?
                <View className='param-list' key={index}>
                  <View className='param-left'>
                    <View className='param-title'>{list.title}</View>
                    <View className='param-remarks'>{list.remarks}</View>
                  </View>
                  <View className='param-money'>
                    { list.unit ? `${valueData[list.dataIndex]}${list.unit}` : `${numberFormat(valueData[list.dataIndex])}万` }
                  </View>
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
                    <View className='param-money'><Input type='number' placeholder='请输入' value={list.money} onInput={(e)=>{ChangeValue(e, index)}} />
                    <Text className='unit1'>{list.unit}</Text></View>
                  }
                </View>
            )
          )
        })}
      </ScrollView>
      <View className='bottom-box' onClick={()=>{bottomSubmit()}}>
        <View className='button' style={{opacity: `${isSubmit ? '1 !important':''}`}}>提交</View>
      </View>
      {/* {showProgress ?
        <View className='float-bottom-box' onClick={()=>{console.log('333')}}>
          <View className='button'>计算</View>
        </View> : ''
      } */}
      <FloatLayout 
        isOpened={showProgress}
        className='layout-process'
        onClose={() => setShowProgress(false)}
        title={incomeName[officeIncomeIndex]}
      >
        {
          officeIncomeIndex == 3 ? 
          <BonusCalculate
            closeEvt={() => setShowProgress(false)}
            calculateIndex={officeIncomeIndex}
            incomeName={incomeName[officeIncomeIndex]}
          ></BonusCalculate>
          : 
          <BoxCalculate
            closeEvt={() => setShowProgress(false)}
            calculateIndex={officeIncomeIndex}
            incomeName={incomeName[officeIncomeIndex]}
            calculate={calculate}
            changeCalculate={changeCalculate}
            // showProgress={showProgress}
            childChangeShowProgress={childChangeShowProgress}
          ></BoxCalculate>
        }
      </FloatLayout>
    </View>
  )
}