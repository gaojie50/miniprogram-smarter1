import React, { useState, useEffect, useCallback } from 'react'; 
import { View, Image, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro'
import ArrowLeft from '@static/detail/arrow-left.png';
import FloatLayout from '@components/m5/float-layout';
import '@components/m5/style/components/input.scss';
import './index.scss'
import BoxCalculate from '../boxCalculate';
import BonusCalculate from '../bonusCalculate';
import { numberFormat, centChangeTenThousand } from '../common'
import { get as getGlobalData } from '../../../global_data';
import { REALTIME_DATA_LISTS as listsInfo } from '../constant';

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
  const projectId = Number(url[0].options.projectId);
  const name = url[0].options.name;
  const isMovieScreening = url[0].options.isMovieScreening;
  const [showProgress, setShowProgress] = useState(false);
  const [officeIncomeIndex, setOfficeIncomeIndex] = useState();
  const [lists, setLists] = useState(listsInfo[paramIndex]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [calculate, setCalculate] =useState(1);
  const [valueData, setValueData] = useState(0);
  const [clickIndex, setClickIndex] = useState('');
  const [isBonusCalculate, setIsBonusCalculate] = useState(false)
  const [getValue, setGetValue] =useState('');
  const changeCalculate = useCallback((calculateValue)=>setCalculate(calculateValue), []);
  const childChangeShowProgress = useCallback((childShowProgress)=>setShowProgress(childShowProgress),[]);
  const isChangeCalculate =  useCallback((isChangeCalculate) => {console.log(123, isChangeCalculate)}, [])

  const handleBack = () => {
    if(Taro.getCurrentPages().length>1){
      Taro.navigateBack();
    }else{
      Taro.redirectTo({
        url: `/pages/coreData/index?name=${name}&projectId=${projectId}&isMovieScreening=${isMovieScreening}`,
      })
    }
  }

  const changeShowProgress =(index)=> {
    setOfficeIncomeIndex(index);
    setShowProgress(true);
  }

  const ChangeValue = (e, index) => {
    const val = e.detail.value;
    console.log(index, val, lists);
    var newList = lists.concat();
    newList[index].money = val;
    newList[index].isChange = true;
    setLists(newList);
    let count = 0;
    lists.map((item)=>{
      if(item.money !== '') {
        count++
      }
    })
    console.log('lists', lists, newList);
    console.log(count);
    if(count == 11) {
      setIsSubmit(true);
    }
  }

  const bottomSubmit = () => {
    postDataValue();
    
  }
  const postDataValue = () => {
    console.log('getValue, lists', getValue, lists);
    const data = getValue || {};
    for(let item of lists) {
      if (item.isChange) {
        if(item.dataIndex !== 'myShare'){
          data[item.dataIndex] = centChangeTenThousand(item.money);
        }else{
          data[item.dataIndex] = Number(item.money);
        }
      }
    }
    console.log('post合同参数', data);
    reqPacking({
      url: 'api/management/finance/contractData/saveOrUpdate',
      data:{
        ...data,
        projectId,
      },
      method: 'POST',
    })
    .then(res => {
      const { success, error } = res;
      console.log(res);
      if(success) {
        console.log(res.data);
        // wx.navigateBack()
      }else {
        Taro.showToast({
          title: error && error.message || '',
          icon: 'none',
          duration: 2000,
        });
      }
    })
  }


  const getValueData = () => {
    reqPacking({
      url: requestUrls[paramIndex],
      data: {
        projectId,
      }
    }).then(res => {
      const { success, error } = res;
      console.log('实时参数&假定参数', res);
      if (success) {
        const { data } = res;
        setValueData(data);
      } else {
        Taro.showToast({
          title: error && error.message || '',
          icon: 'none',
          duration: 2000,
        });
      }
    })
  }


  useEffect(()=>{
    if(paramIndex !== '0') {
      getValueData();
    } else {
      getContractData();
    }
    console.log('useEffect', calculate, paramIndex);
  }, []);

  useEffect(()=>{
    console.log(calculate);
  },[calculate])

  const getContractData = () => {
    reqPacking({
      // url:`app/mock/69/api/management/finance/contractData/get`,
      url:`api/management/finance/contractData/get`,
      data: {
        projectId,
      }
    }).then(res => {
      const { success, error } = res;
      console.log('合同参数', res);
      if (success) {
        const { data } = res;
        let newData = Object.assign('', data);
        setGetValue(res.data);
        for(let key in newData) {
          newData[key] = numberFormat(newData[key])
        }
        for(let key in lists) {
          lists[key].money = newData[lists[key].dataIndex];
        }
        setValueData(newData);
        console.log('data', data, lists, newData);
        setLists(lists);
      } else {
        Taro.showToast({
          title: error && error.message || '',
          icon: 'none',
          duration: 2000,
        });
      }
    })
  }

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
        {lists.map((list, index)=>{
          return(
            (paramIndex !== '0' ?
                <View className='param-list' key={index}>
                  <View className='param-left'>
                    <View className='param-title'>{list.title}</View>
                    <View className='param-remarks'>{list.remarks}</View>
                  </View>
                  <View className='param-money'>
                    { list.unit ? `${valueData[list.dataIndex] || '-'}${list.unit}` : `${numberFormat(valueData[list.dataIndex])}万` }
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
                      <View>
                        {list.money ? <View className='param-money'>{list.money}万</View> : ''}
                        <View className='param-header-right'>{list.toCalculate}</View>
                      </View>
                      <Image src='http://p0.meituan.net/scarlett/82284f5ad86be73bf51bad206bead653595.png' />
                    </View> 
                    :
                    <View className='param-money'><Input type='number' placeholder='请输入' value={list.money} onInput={(e)=>{ChangeValue(e, index)}} />
                    <Text className='unit'>{list.unit}</Text></View>
                  }
                </View>
            )
          )
        })}
      </ScrollView>
      {
        paramIndex == '0' ?
        <View className='bottom-box' onClick={()=>{bottomSubmit()}}>
          <View className='button' style={{opacity: `${isSubmit ? '1 !important':''}`}}>提交</View>
        </View> : ''
      }
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
            calculate={calculate}
            changeCalculate={changeCalculate}
            showProgress={showProgress}
            childChangeShowProgress={childChangeShowProgress}
            projectId={projectId}
          ></BonusCalculate>
          : 
          <BoxCalculate
            closeEvt={() => setShowProgress(false)}
            calculateIndex={officeIncomeIndex}
            isBonusCalculate={false}
            incomeName={incomeName[officeIncomeIndex]}
            calculate={calculate}
            changeCalculate={changeCalculate}
            showProgress={showProgress}
            childChangeShowProgress={childChangeShowProgress}
            projectId={projectId}
          ></BoxCalculate>
        }
      </FloatLayout>
    </View>
  )
}