import React, { useState, useEffect, useMemo, useCallback } from 'react'; 
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro'
import FloatLayout from '@components/m5/float-layout';
import '@components/m5/style/components/input.scss';
import AtModal from '@components/m5/modal';
import AtModalContent from '@components/m5/modal/content';
import AtModalAction from '@components/m5/modal/action'
import '@components/m5/style/components/modal.scss';
import './index.scss'
import {numberFormat, centChangeTenThousand, numberFormatCent} from '../common'
import { get as getGlobalData } from '../../../global_data';

export default function BoxCalculate({calculateIndex, incomeName, calculate, showProgress, changeCalculate, childChangeShowProgress, projectId, paramIndex}) {
  if (paramIndex !== '0') return null;
  const reqPacking = getGlobalData('reqPacking');
  const bonusButList = [
    [ {text: '票房分账收入', isOnclick: true}, {text: '净票房收入', isOnclick: false} ],
    [ {text: '固定比例', isOnclick: false}, {text: '固定金额', isOnclick: false}, {text: '阶梯', isOnclick: true} ],
    [ {text: '超额累进', isOnclick: true}, {text: '全额累进', isOnclick: false} ]
  ]
  const ladderListsInfo = [
    {name:'A', unit:'万', value:'', dataName: 'boxLevelA'},
    {name:'B', unit:'万', value:'', dataName: 'boxLevelB'},
    // {name:'C', unit:'万', value:'', dataName: 'boxLevelC'},
    {name:'a', unit:'%', value:'', dataName: 'ratioLevelA'},
    {name:'b', unit:'%', value:'', dataName: 'ratioLevelB'},
    {name:'c', unit:'%', value:'', dataName: 'ratioLevelC'}
  ];
  const [lists, setLists] = useState(bonusButList);
  const [isSubmit, setIsSubmit] = useState(false);
  const [ladderLists, setladderLists] = useState(ladderListsInfo);
  const [getValue, setGetValue] = useState('');
  const [coefficient, setCoefficient] = useState(''); // 系数
  const [amount, setAmount] = useState(''); // 金额
  // const [getProgressionValue, setGetProgressionValue] = useState('');
  const [fixedAmountValue, setFixedAmountValue] = useState('');
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [computeResults, setComputeResults] = useState('');

  // 清空数据
  const cleanAllValue =() => {
    setCoefficient('');
    setAmount('');
    setladderLists(ladderListsInfo);
    setShowModal(false);
  }
  const getComputeRule = () => {
    reqPacking({
      url: 'api/management/finance/contractData/computeRule/get',
      data: {
        projectId,
        dataType: calculateIndex,
      }
    }).then((res)=>{
      const { success, error, data } = res;
      if (success) {
        if(res.data) {
          const {baseType = null, computeType = null, progressionType = null, progressionValue = null, fixedRatioValue = null, fixedAmountValue = null} = data;
          baseType && lists[0].map((item, index)=>{
            item.isOnclick = (baseType === index+1)
          })
          computeType && lists[1].map((item, index)=>{
            item.isOnclick = (computeType === index+1)
          })
          if(progressionType){
            lists[2].map((item, index)=>{
              item.isOnclick = (progressionType === index+1)
            })
          }
          progressionValue && computeType == '3' && ladderLists.map((item)=> {
            if(item.dataName.includes('boxLevel')) {
              item.value = numberFormatCent(progressionValue[item.dataName]);
            } else{
              item.value = progressionValue[item.dataName];
            }
          })
          setAmount(numberFormatCent(fixedAmountValue));
          setGetValue(res.data);
          setCoefficient(fixedRatioValue == null ? '' : fixedRatioValue);
          setIsSubmit(true);
        }
      } else {
        Taro.showToast({
          title: error && error.message || '',
          icon: 'none',
          duration: 2000,
        });
      }
    })
  }
  const postCompute = () => {
    let baseType = lists[0].findIndex((item)=>item.isOnclick) + 1;
    let computeType = lists[1].findIndex((item)=>item.isOnclick) + 1;
    let progressionType = lists[2].findIndex((item)=>item.isOnclick) + 1;
    let progressionValue = {};
    if(lists[1][2].isOnclick) {
      ladderLists.map((item)=>{
        if(item.dataName.includes('boxLevel')) {
          progressionValue[item.dataName] = centChangeTenThousand(item.value);
        }else{
          progressionValue[item.dataName] = item.value
        }
      })
    }
    

    let postData = {};
    // 固定比例
    if(lists[1][0].isOnclick) {
      postData = {
        baseType,
        computeType,
        fixedRatioValue: Number(coefficient),
      }
    } else if(lists[1][1].isOnclick){ // 固定金额
      postData = {
        baseType,
        computeType,
        fixedAmountValue: centChangeTenThousand(amount)
      }
    } else if(lists[1][2].isOnclick){ // 阶梯
      postData = {
        baseType,
        computeType,
        progressionType,
        progressionValue
      }
    }

    reqPacking({
      url: 'api/management/finance/contractData/compute',
      data: {
        projectId,
        dataType: calculateIndex,
        ...postData,
      },
      method: 'POST',
    }).then((res)=>{
      const {data, success, error} = res;
      if(success) {
        setShowModal(true);
        setComputeResults(`${numberFormat(data).num}${numberFormat(data).unit}`);
      }else {
        Taro.showToast({
          title: error && error.message || '',
          icon: 'none',
          duration: 2000,
        });
      }
    });
  }
  const changeCalculateButton = (index, param) => {
    // cleanAllValue();
    var newList = lists.concat();
    newList[index].forEach((item, i)=>{
      if(i===param) {
        item.isOnclick = true;
      }else{
        item.isOnclick = false;
      }
    })
    setLists(newList);
  }
  const changeLadderValue = (e, index) => {
    const val = e.detail.value;
    var newLadderLists = ladderLists.concat();
    newLadderLists[index].value = val;
    setladderLists(newLadderLists);

  }

  // 计算按钮
  const bottomSubmit = () => {
    judgeIsSubmit('hasToast')
    if(isSubmit){
      postCompute();
    }
  }

  const judgeIsSubmit = (hasToast) => {
    if(lists[1][2].isOnclick) {
      for(let i = 0; i<5; i++) {
        if(ladderLists[i].value === ''){
          hasToast && Taro.showToast({
            title: `请填写${ladderLists[i].name}`,
            icon: 'none',
            duration: 2000,
          });
          setIsSubmit(false);
          return;
        } 
      }
      for(let i = 0; i<5; i++) {
        if(ladderLists[i].value){
          if(i<2) {
            let judge = ladderLists[i].value.toString().split(".");
            if((judge[0] && judge[0].length > 10) || (judge[1] && judge[1].length > 6)){
              hasToast && Taro.showToast({
                title: `${ladderLists[i].name}小数点后最多6位`,
                icon: 'none',
                duration: 2000,
              });
              setIsSubmit(false);
              return;
            }
          }else{
            let judge = ladderLists[i].value.toString().split(".");
            if(Number(ladderLists[i].value)< 0 || Number(ladderLists[i].value)>100 || (judge[1] && judge[1].length > 2)){
              hasToast && Taro.showToast({
                title: `${ladderLists[i].name}填写0~100数值`,
                icon: 'none',
                duration: 2000,
              });
              setIsSubmit(false);
              return;
            }
          }
          if(Number(ladderLists[0].value)-Number(ladderLists[1].value) > 0){
            hasToast && Taro.showToast({
              title: `请填写A<=B的值`,
              icon: 'none',
              duration: 2000,
            });
            setIsSubmit(false);
            return;
          }
        }
      }
    }
    if(lists[1][0].isOnclick) {
      if(coefficient === ''){
        hasToast && Taro.showToast({
          title: `请填写系数`,
          icon: 'none',
          duration: 2000,
        });
        setIsSubmit(false);
        return;
      } else{
        if(Number(coefficient)< 0 || Number(coefficient)>100 ){
          hasToast && Taro.showToast({
            title: `系数填写0~100数值`,
            icon: 'none',
            duration: 2000,
          });
          setIsSubmit(false);
          return;
        }
      }
    }
    if(lists[1][1].isOnclick) {
      if(amount === ''){
        hasToast && Taro.showToast({
          title: `请填写金额`,
          icon: 'none',
          duration: 2000,
        });
        setIsSubmit(false);
        return;
      } else{
        let judge = amount.toString().split(".");
        if((judge[0] && judge[0].length > 10) || (judge[1] && judge[1].length > 6)){
          hasToast && Taro.showToast({
            title: `小数点固定金额`,
            icon: 'none',
            duration: 2000,
          });
          setIsSubmit(false);
          return;
        }
      }
    }
    setIsSubmit(true);
  }

  // 确定返回参数页（关闭弹窗）
  const recalculate = useCallback(()=>{
    changeCalculate(computeResults);
    setShowModal(false);
    childChangeShowProgress(false);
  }, [changeCalculate, calculate])

  const footerBut = () => {
    return (
      <View className='cal-bottom-box' onClick={()=>{bottomSubmit()}}>
        <View className='cal-button' style={`${isSubmit ? 'opacity: 1 !important' : ''}`}>计算</View>
      </View>
    )
  }
  
  useEffect(()=>{
    if (showProgress && calculateIndex) {
      getComputeRule();
    }
  }, [showProgress, calculateIndex])
  
  useEffect(()=>{
    if(!showProgress) {
      cleanAllValue();
    }
  }, [showProgress])


  // 计算按钮是否可以计算
  useEffect(()=>{
    judgeIsSubmit();
  }, [ladderLists, coefficient, amount, lists]);
  

  return(

    <FloatLayout 
      isOpened={showProgress}
      className='layout-process'
      onClose={() => childChangeShowProgress(false)}
      title={incomeName}
      footer={footerBut()}
    >
    <View className='box-calculate'>
      <View className='calculate-title'>计算基数</View>
      <View className='calculate-btn'>
        {lists[0].map((list, index)=>{
          return (
            <View onClick={()=>{changeCalculateButton(0, index)}} key={index} className={`${list.isOnclick ?'calculate-button1' : 'calculate-button2'} `}>{list.text}</View>
          )
        })}
      </View>
      <View className='calculate-title'>计算方式</View>
      <View className='calculate-btn'>
        {lists[1].map((list, index)=>{
          return (
            <View onClick={()=>{changeCalculateButton(1, index)}} key={index} className={`${list.isOnclick ?'calculate-button1' : 'calculate-button2'} `}>{list.text}</View>
          )
        })}
      </View>
      { lists[1][2].isOnclick ? 
        <View className='prance2'>
          <View className='calculate-title'>阶梯类型</View>
          <View className='calculate-btn'>
            {lists[2].map((list, index)=>{
              return (
                <View onClick={()=>{changeCalculateButton(2, index)}} key={index} className={`${list.isOnclick ?'calculate-button1' : 'calculate-button2'} `}>{list.text}</View>
              )
            })}
          </View>
          <View className='remark-text'>
          {lists[2][0].isOnclick ? '计算公式：票房A元以下对应基数*a% + 票房A元至B元对应基数*b% + 票房B元以上对应基数*c%' : '计算公式：票房A元以下，基数*a% or 票房A元至B元，基数*b% or 票房B元以上，基数*c%%'}
          </View>
          <View className='ladder-lists'>
            {ladderLists.map((item, index)=>{
              return(
              <View className='param-list' key={index}>
                <View className='param-left'>
                <View className='param-title'>{item.name}</View>
                </View>
                <View className='param-money'><Input type='digit' placeholder='请输入' value={item.value} onInput={(e)=>{changeLadderValue(e, index)}} /><Text className='unit1'>{item.unit}</Text></View>
              </View>
            )})}
          </View>
        </View> :
        <View>
          { lists[1][0].isOnclick ? 
            <View className='122'>
              <View className='remark-text'>基数*a%</View>
              <View className='prance'><Input type='digit' placeholder='请输入固定比例系数' value={coefficient} onInput={(e)=>{setCoefficient(e.detail.value); judgeIsSubmit()}}></Input><Text className='unit1'>%</Text></View> 
            </View>
            : <View className='prance'><Input type='digit' placeholder='请输入固定金额' value={amount} onInput={(e)=>{setAmount(e.detail.value); judgeIsSubmit()}}></Input><Text className='unit1'>万</Text></View> 
          }
        </View>
      }
      <AtModal isOpened={showModal} closeOnClickOverlay={false}>
        <AtModalContent className='modal-box'>
          <View className='modal-title'>{incomeName}</View>
          <View className='modal-text'>计算值为:{computeResults}</View>
        </AtModalContent>
        <AtModalAction><Button onClick={cleanAllValue}>重新计算</Button> <Button onClick={recalculate}>确定</Button> </AtModalAction>
      </AtModal>
    </View>
    </FloatLayout>
    )
}