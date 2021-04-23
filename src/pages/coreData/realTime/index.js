import React, { useState, useEffect, useCallback } from 'react'; 
import { View, Image, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro'
import ArrowLeft from '@static/detail/arrow-left.png';
import FloatLayout from '@components/m5/float-layout';
import M5Input from '@components/m5/input';
import '@components/m5/style/components/input.scss';
import './index.scss'
import BoxCalculate from '../boxCalculate';
import BonusCalculate from '../bonusCalculate';

export default  function realTime({}) {
  const listsInfo = [
    [
      {
        title: '宣发费用',
        money: '',
        unit: '万',
      },
      {
        title: '总发行代理费',
        remarks: '以合同为准，一般为片方应得收入的15%或净票房的5%',
        money: '',
        toCalculate: '去计算',
        unit: '万',
      },
      {
        title: '猫眼发行代理费',
        remarks: '以合同为准',
        toCalculate: '去计算',
        money: '',
        unit: '万',
      },
      {
        title: '主创分红',
        remarks: '以合同为准',
        toCalculate: '去计算',
        money: '',
        unit: '万',
      },
      {
        title: '猫眼投资成本',
        remarks: '',
        money: '',
        unit: '万',
      },
      {
        title: '投资方成本',
        remarks: '以合同为准',
        money: '',
        unit: '万',
      },
      {
        title: '猫眼份额',
        remarks: '',
        money: '',
        unit: '%',
      },
      {
        title: '猫眼份额转让收入',
        remarks: '',
        money: '',
        unit: '万',
      },
      {
        title: '宣发费用中猫眼票补收入',
        remarks: '',
        money: '',
        unit: '万',
      },
      {
        title: '宣发费用中猫眼平台资源收入',
        remarks: '',
        money: '',
        unit: '万',
      },
      {
        title: '其它收入',
        remarks: '',
        money: '',
        unit: '万',
      },
    ],
    [
      {
        title: '中国大陆境内地区票房收入预测(元)',
        remarks: '机器预测，含服务费',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '已产生票房',
        remarks: '含服务费',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '未来票房空间',
        remarks: '中国大陆境内地区票房收入预测扣除已产生票房',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '中国大陆境内地区未来分账票房空间',
        remarks: '去除约9%的手续费',
        money: 13.5,
        unit: '万',
      },
      {
        title: '净票房',
        remarks: '中国大陆境内地区未来分账票房空间扣除国家电影专项基金和增值税税金及附加',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '猫眼选座交易额占比',
        remarks: '计算公式：实时猫眼选座交易额/已产生的票房',
        money: 3,
        unit: '%',
      },
      {
        title: '猫眼票务收入占比',
        remarks: '计算公式：实时已产生的票务收入/实时猫眼选座交易额',
        money: 9.2,
        unit: '%',
      },
      {
        title: '宣发费用中已花费片方票补',
        remarks: '',
        money: 3445.1,
        unit: '万',
      },
      {
        title: '宣发费用中猫眼平台已获得的资源收入',
        remarks: '计算公式：(已产生票房/票房收入预测)*宣发费用中猫眼平台资源收入',
        money: 3445.1,
        unit: '万',
      }
    ],
    [
      {
        title: '国家电影专项基金',
        remarks: '默认5%的票房',
        money: 3445.1,
        unit: '%',
      },
      {
        title: '增值税税金及附加',
        remarks: '默认3.3%的票房',
        money: 3445.1,
        unit: '%',
      },
      {
        title: '中影代理费/片方应得收入',
        remarks: '默认1%的片方应得收入，200万元封顶',
        money: 3445.1,
        unit: '%',
      },
      {
        title: '片方应得收入/净票房',
        remarks: '默认43%',
        money: 3445.1,
        unit: '%',
      },
    ]
  ]
  const incomeName = ['', '总发行代理费', '猫眼发行代理费', '主创分红']
  const paramTitle = ['合同参数', '实时参数', '假定条件']
 
  const url = Taro.getCurrentPages();
  const paramIndex = url[0].options.paramIndex;
  const [showProgress, setShowProgress] = useState(false);
  const [officeIncomeIndex, setOfficeIncomeIndex] = useState();
  const [lists, setLists] = useState(listsInfo);
  const [isSubmit, setIsSubmit] = useState(false);
  const [calculate, setCalculate] =useState(1)
  const changeCalculate = useCallback((calculateValue)=>setCalculate(calculateValue), []);
  const childChangeShowProgress = useCallback((childShowProgress)=>setShowProgress(childShowProgress),[]);

  const changeShowProgress =(index)=> {
    setShowProgress(true);
    setOfficeIncomeIndex(index);
    console.log(index);
  }
  const handleBack = () => {
    if(Taro.getCurrentPages().length>1){
      Taro.navigateBack();
    }else{
      Taro.redirectTo({
        url: `/pages/coreData/index`
      })
    }
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

  useEffect(()=>{
    console.log('useEffect', calculate);
  })


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
        {lists[paramIndex].map((list, index)=>{
          return(
            (paramIndex !== '0' ?
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