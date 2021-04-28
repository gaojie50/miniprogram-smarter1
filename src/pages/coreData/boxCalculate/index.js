import React, { useState, useEffect, useMemo, useCallback } from 'react'; 
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro'
import '@components/m5/style/components/input.scss';
import AtModal from '@components/m5/modal';
import AtModalContent from '@components/m5/modal/content';
import AtModalAction from '@components/m5/modal/action'
import '@components/m5/style/components/modal.scss';
import './index.scss'
import {numberFormat, centChangeTenThousand} from '../common'
import { get as getGlobalData } from '../../../global_data';

export default function BoxCalculate({calculateIndex, incomeName, calculate, showProgress, changeCalculate, childChangeShowProgress, projectId}) {
  const reqPacking = getGlobalData('reqPacking');

  const bonusButList = [
    [ {text: '票房分账收入', isOnclick: true}, {text: '净票房收入', isOnclick: false} ],
    [ {text: '固定比例', isOnclick: false}, {text: '固定金额', isOnclick: false}, {text: '阶梯', isOnclick: true} ],
    [ {text: '超额累进', isOnclick: true}, {text: '全额累进', isOnclick: false} ]
  ]
  const ladderListsInfo = [
    {name:'A', unit:'万', value:'', dataName: 'boxLevelA'},
    {name:'B', unit:'万', value:'', dataName: 'boxLevelB'},
    {name:'C', unit:'万', value:'', dataName: 'boxLevelC'},
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
    // setLists(bonusButList);
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
        dataType: calculateIndex

      }
    }).then((res)=>{
      const { success, error, data } = res;
      console.log('发行代理', res);
      if (success && data) {
        const {baseType, computeType, progressionType = 1, progressionValue, fixedRatioValue, fixedAmountValue} = data;
        lists[0].map((item, index)=>{
          item.isOnclick = (baseType === index+1)
        })
        lists[1].map((item, index)=>{
          item.isOnclick = (computeType === index+1)
        })
        lists[2].map((item, index)=>{
          item.isOnclick = (progressionType === index+1)
        })
        if(lists[1][2].isOnclick) {
          ladderLists.map((item)=> {
            if(item.dataName.includes('boxLevel')) {
              console.log('123');
              item.value = numberFormat(progressionValue[item.dataName], false);
            } else{
              item.value = progressionValue[item.dataName];
            }
          })
        }
        
        setAmount(numberFormat(fixedAmountValue, false));
        setGetValue(res.data);
        // setGetProgressionValue(progressionValue);
        // setFixedAmountValue(fixedAmountValue);
        setCoefficient(fixedRatioValue);
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
    console.log(calculateIndex, getValue, ladderLists);
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
    
    console.log('progressionValue', progressionValue);

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

    console.log('baseType', baseType, computeType, progressionType, postData);
    reqPacking({
      url: 'api/management/finance/contractData/compute',
      data: {
        projectId,
        dataType: calculateIndex,
        ...postData,
      },
      method: 'POST',
    }).then((res)=>{
      console.log('post发行代理', res)
      const {data, success} = res;
      if(success) {
        setShowModal(true);
        setComputeResults(data);
      }
    });
  }

  const changeCalculateButton = (index, param) => {
    // console.log(index, param, lists[index][param]);
    var newList = lists.concat();
    newList[index].forEach((item, i)=>{
      console.log('item', item);
      if(i===param) {
        item.isOnclick = true;
      }else{
        item.isOnclick = false;
      }
    })
    // console.log(newList);
    setLists(newList);
  }
  const changeLadderValue = (e, index) => {
    const val = e.detail.value;
    // console.log(index, val, ladderLists, count);
    var newLadderLists = ladderLists.concat();
    newLadderLists[index].value = val;
    console.log(newLadderLists);
    setladderLists(newLadderLists);
    judgeIsSubmit();
    // let count1 = 0;
    // ladderLists.map((item)=>{
    //   if(item.value !== '') {
    //     count1 = count1 + 1;
    //   }
    // })
    // setCount(count1);
  }

  // 计算按钮
  const bottomSubmit = () => {
    judgeIsSubmit('hasToast')
    if(isSubmit){
      postCompute();
      // setShowModal(true);
    }
    // } else {
    //   Taro.showToast({
    //     title: '请填写完全',
    //     icon: 'none',
    //     duration: 2000,
    //   });
    // }
  }

  const judgeIsSubmit = (hasToast) => {
    if(lists[1][2].isOnclick) {
      for(let i = 0; i<6; i++) {
        if(!ladderLists[i].value){
          hasToast && Taro.showToast({
            title: `请填写${ladderLists[i].name}`,
            icon: 'none',
            duration: 2000,
          });
          setIsSubmit(false);
          return;
        } 
      }
      for(let i = 0; i<6; i++) {
        if(ladderLists[i].value){
          if(i<3) {
            let judge = ladderLists[i].value.toString().split(".");
            if((judge[0] && judge[0].length > 10) || (judge[1] && judge[1].length > 6)){
              hasToast && Taro.showToast({
                title: `小数点${ladderLists[i].name}`,
                icon: 'none',
                duration: 2000,
              });
              setIsSubmit(false);
              return;
            }
          }else{
            if(Number(ladderLists[i].value)< 0 || Number(ladderLists[i].value)>100 ){
              hasToast && Taro.showToast({
                title: `${ladderLists[i].name}填写0~100数值`,
                icon: 'none',
                duration: 2000,
              });
              setIsSubmit(false);
              return;
            }
          }
        }
      }
    }
    if(lists[1][0].isOnclick) {
      if(!coefficient){
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
      if(!amount){
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
  
  useEffect(()=>{
    getComputeRule();
    console.log('123showProgress', showProgress, calculateIndex);
  }, [showProgress, calculateIndex])

  useEffect(()=>{
    cleanAllValue();
    console.log('123calculateIndex', calculateIndex);
  }, [calculateIndex])

  // 计算按钮是否可以计算
  // useEffect(()=>{
  //   if((lists[1][2].isOnclick && count == 6) || (lists[1][0].isOnclick && coefficient) || (lists[1][1].isOnclick && amount) ) {
  //     setIsSubmit(true);
  //   }else{
  //     setIsSubmit(false);
  //   }
  //   // setLists(lists);
  // }, [ladderLists, coefficient, amount, lists]);
  
  useEffect(()=>{
    console.log('showModal', showModal);
  },[showModal])

  return(
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
                <View className='param-money'><Input type='number' placeholder='请输入' value={item.value} onInput={(e)=>{changeLadderValue(e, index)}} /><Text className='unit1'>{item.unit}</Text></View>
              </View>
            )})}
          </View>
        </View> :
        <View>
          { lists[1][0].isOnclick ? 
            <View className='122'>
              <View className='remark-text'>基数*a%</View>
              <View className='prance'><Input placeholder='请输入固定比例系数' value={coefficient} onInput={(e)=>{setCoefficient(e.detail.value); judgeIsSubmit()}}></Input><Text className='unit1'>%</Text></View> 
            </View>
            : <View className='prance'><Input placeholder='请输入固定金额' value={amount} onInput={(e)=>{setAmount(e.detail.value); judgeIsSubmit()}}></Input><Text className='unit1'>万</Text></View> 
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
      <View className='float-bottom-box' onClick={()=>{bottomSubmit()}}>
          <View className='button' style={{opacity: `${isSubmit ? '1 !important':''}`}} >计算</View>
      </View>
    </View>
  )
}