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
import {numberFormat} from '../common'
import { get as getGlobalData } from '../../../global_data';

export default  function realTime({}) {
  const reqPacking = getGlobalData('reqPacking');
  const listsInfo = [
    [
      {
        title: '宣发费用',
        money: '',
        dataIndex: 'advertisingCosts',
        unit: '万',
      },
      {
        title: '总发行代理费',
        remarks: '以合同为准，一般为片方应得收入的15%或净票房的5%',
        money: '',
        dataIndex: 'distributionAgencyFee',
        toCalculate: '去计算',
        unit: '万',
      },
      {
        title: '猫眼发行代理费',
        remarks: '以合同为准',
        toCalculate: '去计算',
        money: '',
        dataIndex: 'myDistributionAgencyFee',
        unit: '万',
      },
      {
        title: '主创分红',
        remarks: '以合同为准',
        toCalculate: '去计算',
        money: '',
        dataIndex: 'creatorDividend',
        unit: '万',
      },
      {
        title: '猫眼投资成本',
        remarks: '',
        money: '',
        dataIndex: 'myInvestment',
        unit: '万',
      },
      {
        title: '投资方成本',
        remarks: '以合同为准',
        money: '',
        dataIndex: 'productionCosts',
        unit: '万',
      },
      {
        title: '猫眼份额',
        remarks: '',
        money: '',
        dataIndex: 'myShare',
        unit: '%',
      },
      {
        title: '猫眼份额转让收入',
        remarks: '',
        money: '',
        dataIndex: 'myShareTransferIncome',
        unit: '万',
      },
      {
        title: '宣发费用中猫眼票补收入',
        remarks: '',
        money: '',
        dataIndex: 'ticketAllowanceIncome',
        unit: '万',
      },
      {
        title: '宣发费用中猫眼平台资源收入',
        remarks: '',
        money: '',
        dataIndex: 'ticketAllowanceIncome',
        unit: '万',
      },
      {
        title: '其它收入',
        remarks: '',
        money: '',
        dataIndex: 'otherIncome',
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
        dataIndex: 'movieSpecialFunds',
        unit: '%',
      },
      {
        title: '增值税税金及附加',
        remarks: '默认3.3%的票房',
        dataIndex: 'addedValueTax',
        unit: '%',
      },
      {
        title: '中影代理费/片方应得收入',
        remarks: '默认1%的片方应得收入，200万元封顶',
        dataIndex: 'cfgcAgencyFeeDividePianDueIncome',
        unit: '%',
      },
      {
        title: '片方应得收入/净票房',
        remarks: '默认43%',
        dataIndex: 'pianDueIncomeDividePureBox',
        unit: '%',
      },
    ]
  ]
  const incomeName = ['', '总发行代理费', '猫眼发行代理费', '主创分红']
  const paramTitle = ['合同参数', '实时参数', '假定条件']
  const getUrl = ['contractData' , 'realTimeData', 'defaultParameter'];
 
  const url = Taro.getCurrentPages();
  const paramIndex = url[0].options.paramIndex;
  const projectId = url[0].options.projectId;
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
  const changeCalculate = useCallback((calculateValue)=>setCalculate(calculateValue), []);
  const childChangeShowProgress = useCallback((childShowProgress)=>setShowProgress(childShowProgress),[]);
  

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

  // useEffect(()=>{
  //   changeShowProgress();
  // }, [index])

  const ChangeValue = (e, index) => {
    const val = e.detail.value;
    console.log(index, val, lists);
    var newList = lists.concat();
    newList[index].money = val;
    console.log(newList, newList);
    setLists(newList);
    let count = 0;
    lists.map((item)=>{
      if(item.money !== '') {
        count++
      }
    })
    console.log(count);
    if(count == 11) {
      setIsSubmit(true);
    }
  }

  const bottomSubmit = () => {
    
  }
  const postDataValue = () => {
    reqPacking({
      url: 'api/management/editProjectInfo',
      data:{
        [lists.dataIndex]: Number(lists.money*1000)
      },
      method: 'POST',
    })
    .then(res => {
      if(res.success) {
        // wx.navigateBack()
      }
    })
  }

  useEffect(()=>{
    getRealTimeData();
    getContractData();
    console.log('useEffect', calculate);
  }, []);

  const getContractData = () => {
    reqPacking({
      url:`app/mock/69/api/management/finance/contractData/get`,
      data: {
        projectId,
      }
    }, 'mapi').then(res => {
      const { success, error } = res;
      console.log(res);
      if (success) {
        const { data } = res;
        for(let key in data) {
          data[key] = numberFormat(data[key])
        }
        for(let key in lists) {
          lists[key].money = data[lists[key].dataIndex];
        }
        console.log('data', data, lists);
        setValueData(data);
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

  const getRealTimeData = () => {
    reqPacking({
      url:`app/mock/69/api/management/finance/realTimeData/get`,
      data: {
        projectId,
      }
    }, 'mapi').then(res => {
      const { success, error } = res;
      console.log(res);
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
                  <View className='param-money'>{valueData[list.dataIndex]}<Text className='unit'>{list.unit}</Text></View>
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