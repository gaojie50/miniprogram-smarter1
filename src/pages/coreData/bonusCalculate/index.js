import React, { useState, useEffect, useMemo, useCallback } from 'react'; 
import { View, Image, Text, ScrollView, FloatLayout, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro'
import AtModal from '@components/m5/modal';
import AtModalContent from '@components/m5/modal/content';
import AtModalAction from '@components/m5/modal/action'
import '@components/m5/style/components/modal.scss';
import './index.scss';
import {numberFormat, centChangeTenThousand, numberFormatCent} from '../common'
import { get as getGlobalData } from '../../../global_data';

export default function BonusCalculate({calculateIndex, incomeName, calculate, showProgress, changeCalculate, childChangeShowProgress, projectId, paramIndex}) {
  if (paramIndex !== '0') return null;
  const reqPacking = getGlobalData('reqPacking');
  const butList = [
    [ {text: '固定比例', isOnclick: true}, {text: '固定金额', isOnclick: false}, {text: '阶梯', isOnclick: false} ],
    [ {text: '超额累进', isOnclick: true}, {text: '全额累进', isOnclick: false} ],
    [ {text: '制作成本', isOnclick: false}, {text: '票房', isOnclick: true} ],
    [ {text: '比例1', isOnclick: false}, {text: '比例2', isOnclick: true}, {text: '比例3', isOnclick: false} ]
  ]
  const ladderListsInfo = [
    {name:'A', unit:'万', value:'', dataName: 'boxLevelA'},
    {name:'B', unit:'万', value:'', dataName: 'boxLevelB'},
    {name:'C', unit:'万', value:'', dataName: 'boxLevelC'},
    {name:'a', unit:'%', value:'', dataName: 'ratioLevelA'},
    {name:'b', unit:'%', value:'', dataName: 'ratioLevelB'},
    {name:'c', unit:'%', value:'', dataName: 'ratioLevelC'}
  ];

  const [lists, setLists] = useState(butList);
  const [isSubmit, setIsSubmit] = useState(false);
  const [ladderLists, setladderLists] = useState(ladderListsInfo);
  const [getValue, setGetValue] = useState('');
  const [coefficient, setCoefficient] = useState(''); // 系数a
  const [coefficientA, setCoefficientA] = useState(''); // 系数A
  const [amount, setAmount] = useState(''); // 金额a
  const [proportiona, setProportiona] = useState(''); // a
  const [proportionA, setProportionA] = useState(''); // A
  const [showModal, setShowModal] = useState(false);
  const [computeResults, setComputeResults] = useState('');

  const cleanAllValue =() => {
    setCoefficient('');
    setCoefficientA('');
    setProportiona('');
    setProportionA('');
    setAmount('');
    setladderLists(ladderListsInfo);
    setShowModal(false);
  }
  const getComputeRule = () => {
    reqPacking({
      url: 'api/management/finance/contractData/computeRule/get',
      data: {
        projectId,
        dataType: 3

      }
    }).then((res)=>{
      const { success, error } = res;
      console.log('规则数据get', res);
      if (success) {
        const { data } = res;
        const {progressionBase, computeType, progressionType, progressionValue, fixedRatioValue, fixedRatioBoxValue, fixedAmountValue, fixedRatioType} = data;
        computeType && lists[0].map((item, index)=>{
          item.isOnclick = (computeType === index+1)
        })
        progressionType && lists[1].map((item, index)=>{
          item.isOnclick = (progressionType === index+1)
        })
        progressionBase && lists[2].map((item, index)=>{
          item.isOnclick = (progressionBase === index+1)
        })
        fixedRatioType && lists[3].map((item, index)=>{
          item.isOnclick = (fixedRatioType === index+1)
        })
        progressionValue && progressionBase == '2' && ladderLists.map((item)=> {
          if(item.dataName.includes('boxLevel')) {
            item.value = numberFormatCent(progressionValue[item.dataName]);
          } else{
            item.value = progressionValue[item.dataName];
          }
        })
        progressionValue && progressionBase == '1' && ladderLists.map((item)=> {
          item.value = progressionValue[item.dataName];
        })
        if(computeType == '1' && fixedRatioType == '1') {
          setCoefficient(fixedRatioValue);
        }
        if(computeType == '1' && fixedRatioType == '2') {
          setProportiona(numberFormatCent(fixedRatioValue));
          setProportionA(numberFormatCent(fixedRatioBoxValue));
        }
        if(computeType == '1' && fixedRatioType == '3') {
          setCoefficient(fixedRatioValue);
          setCoefficientA(fixedRatioBoxValue);
        }
        if(computeType == '2') {
          setAmount(numberFormatCent(fixedAmountValue));
        }
        setGetValue(res.data);
        judgeIsSubmit();
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
    console.log(getValue);
    console.log(calculateIndex, getValue, ladderLists);
    let computeType = lists[0].findIndex((item)=>item.isOnclick) + 1;
    let progressionType = lists[1].findIndex((item)=>item.isOnclick) + 1;
    let progressionBase = lists[2].findIndex((item)=>item.isOnclick) + 1;
    let fixedRatioType = lists[3].findIndex((item)=>item.isOnclick) + 1;
    let progressionValue = {};
    if(lists[2][1].isOnclick) {
      ladderLists.map((item)=>{
        if(item.dataName.includes('boxLevel')) {
          progressionValue[item.dataName] = centChangeTenThousand(item.value);
        }else{
          progressionValue[item.dataName] = Number(item.value)
        }
      })
    }
    if(lists[2][0].isOnclick) {
      ladderLists.map((item)=>{
        progressionValue[item.dataName] = Number(item.value)
      })
    }
    
    console.log('progressionValue', progressionValue);

    let postData = {};
    // 固定比例 比例1
    if(lists[0][0].isOnclick && lists[3][0].isOnclick) {
      postData = {
        computeType,
        fixedRatioType,
        fixedRatioValue: Number(coefficient),
      }
    }
    // 固定比例 比例2
    if(lists[0][0].isOnclick && lists[3][1].isOnclick) {
      postData = {
        computeType,
        fixedRatioType,
        fixedRatioValue: centChangeTenThousand(proportiona),
        fixedRatioBoxValue: centChangeTenThousand(proportionA),
      }
    }
    // 固定比例 比例3
    if(lists[0][0].isOnclick && lists[3][2].isOnclick) {
      postData = {
        computeType,
        fixedRatioType,
        fixedRatioValue: Number(coefficient),
        fixedRatioBoxValue: Number(coefficientA),
      }
    }
    if(lists[0][1].isOnclick){ // 固定金额
      postData = {
        computeType,
        fixedAmountValue: centChangeTenThousand(amount)
      }
    }

    if(lists[0][2].isOnclick){ // 阶梯
      postData = {
        computeType,
        progressionType,
        progressionBase,
        progressionValue
      }
    }

    console.log('baseType', computeType, progressionType, postData);
    reqPacking({
      url: 'api/management/finance/contractData/compute',
      data: {
        projectId,
        dataType: calculateIndex,
        ...postData
      },
      method: 'POST',
    }).then((res)=>{
      console.log('提交规则', res)
      const {data, success} = res;
      if(success) {
        setComputeResults(centChangeTenThousand(amount));
        setShowModal(true);
      }
    });
  }

  const changeCalculateButton = (index, param) => {
    cleanAllValue();
    var newList = lists.concat();
    newList[index].forEach((item, i)=>{
      console.log('item', item);
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
    var NewLadderLists = ladderLists.concat();
    NewLadderLists[index].value = val;
    setladderLists(NewLadderLists);
  }

  const judgeIsSubmit = (hasToast) => {
    // 比例1
    if(lists[0][0].isOnclick && lists[3][0].isOnclick) {
      if(coefficient === ''){
        hasToast && Taro.showToast({
          title: `请填写系数`,
          icon: 'none',
          duration: 2000,
        });
        setIsSubmit(false);
        return;
      }
    }
    // 比例2
    if(lists[0][0].isOnclick && lists[3][1].isOnclick) {
      if(proportiona === '' || proportiona === ''){
        hasToast && Taro.showToast({
          title: `请填写系数`,
          icon: 'none',
          duration: 2000,
        });
        setIsSubmit(false);
        return;
      } 
    }
    // 比例3
    if(lists[0][0].isOnclick && lists[3][2].isOnclick) {
      if(coefficient === '' || coefficientA === ''){
        hasToast && Taro.showToast({
          title: `请填写系数`,
          icon: 'none',
          duration: 2000,
        });
        setIsSubmit(false);
        return;
      }
    }
// 固定金额
    if(lists[0][1].isOnclick) {
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
// 阶梯
    if(lists[0][2].isOnclick ) {
      console.log(ladderLists, 'ladderLists');
      for(let i = 0; i<6; i++) {
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
      for(let i = 0; i<6; i++) {
        if(ladderLists[i].value){
          if(i<3) {
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
          }
          if(Number(ladderLists[0].value)-Number(ladderLists[1].value) > 0 || Number(ladderLists[1].value)-Number(ladderLists[2].value) > 0){
            hasToast && Taro.showToast({
              title: `请填写A<=B<=C的值`,
              icon: 'none',
              duration: 2000,
            });
            setIsSubmit(false);
            return;
          }
        }
      }
    }
    setIsSubmit(true);
  }

  const bottomSubmit = () => {
    judgeIsSubmit('hasToast');
    if(isSubmit){
      postCompute();
    }
  }

  const recalculate = useCallback(()=>{
    changeCalculate(1000);
    setShowModal(false);
    childChangeShowProgress(false);
  }, [changeCalculate, calculate])
  

  useEffect(()=>{
    console.log('judgeIsSubmit');
    judgeIsSubmit();
  }, [ladderLists, coefficient, amount, lists, coefficientA, proportionA, proportiona])

  useEffect(()=>{
    if(showProgress) {
      getComputeRule();
      setIsSubmit(false);
    }
  },[showProgress])

  return(
    <View className='box-calculate'>
      <View className='calculate-title'>计算方式</View>
      <View className='calculate-btn'>
        {lists[0].map((list, index)=>{
          return (
            <View onClick={()=>{changeCalculateButton(0, index)}} key={index} className={`${list.isOnclick ?'calculate-button1' : 'calculate-button2'} `}>{list.text}</View>
          )
        })}
      </View>
      {lists[0][0].isOnclick ? 
        <View>
          <View className='calculate-title'>比例类型</View>
          <View className='calculate-btn'>
          {lists[3].map((list, index)=>{
            return(
              <View onClick={()=>{changeCalculateButton(3, index)}} key={index} className={`${list.isOnclick ?'calculate-button1' : 'calculate-button2'} `}>{list.text}</View>
            )
          })}
          </View>
        </View> : ''
      }
      {lists[0][2].isOnclick ? 
        <View className='other'>
          <View className='calculate-title'>阶梯类型</View>
          <View className='calculate-btn'>
            {lists[1].map((list, index)=>{
              return (
                <View onClick={()=>{changeCalculateButton(1, index)}} key={index} className={`${list.isOnclick ?'calculate-button1' : 'calculate-button2'} `}>{list.text}</View>
              )
            })}
          </View>
          <View className='calculate-title'>{`${lists[1][0].isOnclick? '超额' : '全额'}累进类型`}</View>
          <View className='calculate-btn'>
            {lists[2].map((list, index)=>{
              return (
                <View onClick={()=>{changeCalculateButton(2, index)}} key={index} className={`${list.isOnclick ?'calculate-button1' : 'calculate-button2'} `}>{list.text}</View>
              )
            })}
          </View>
        </View>
        : ''
      }
      
      { lists[0][2].isOnclick ? 
        <View className='prance2'>
          <View className='remark-text'>
          {lists[1][0].isOnclick ? (lists[2][0].isOnclick ? '制作成本*(100+A)%<净收益≤制作成本*(100+B)%对应净利润*a% + 制作成本*(100+B)%<净收益≤制作成本*(100+C)%对应净利润*b% + 净收益>制作成本*(100+C)%对应净利润*c%' : '票房A元至B元对应净收益*a% + 票房B元至C元对应净收益*b% + 票房C元以上对应净收益*c%') 
          : (lists[2][0].isOnclick ?'制作成本*(100+A)%<净收益≤制作成本*(100+B)%，净利润*a% or 制作成本*(100+B)%<净收益≤制作成本*(100+C)%，净利润*b% or 净收益>制作成本*(100+C)%，净利润*c%' : '票房A元至B元，净收益*a% or 票房B元至C元，净收益*b% or 票房C元以上，净收益*c%')}
          </View>
          <View className='ladder-lists'>
            {ladderLists.map((item, index)=>{
              if(lists[2][0].isOnclick && item.dataName.includes('boxLevel')) {
                item.unit = '%'
              }
              if(lists[2][1].isOnclick && item.dataName.includes('boxLevel')) {
                item.unit = '万'
              }
              return(
                <View className='param-list' key={index}>
                  <View className='param-left'>
                  <View className='param-title'>{item.name}</View>
                  </View>
                  <View className='param-money'><Input type='number' placeholder='请输入'  value={item.value} onInput={(e)=>{changeLadderValue(e, index)}} /><Text className='unit1'>{item.unit}</Text></View>
                </View>
              )
              })}
          </View>
        </View> :
        <View>
          {lists[0][0].isOnclick ? 
            <View>
              <View className='remark-text'>
              {lists[3][0].isOnclick ? '净利润>0，净利润*a%' 
              : (lists[3][1].isOnclick ?'净利润>0时对应票房，此后票房每增长A，分红增加a' : '票房>制作成本*(100+A)%，(票房-制作成本*(100+A)%)*a%')}
              </View>
              <View className='ladder-lists'>
                {lists[3][0].isOnclick && 
                  <View className='param-list'>
                    <View className='param-left'>
                    <View className='param-title'>a</View>
                    </View>
                    <View className='param-money'><Input type='number' placeholder='请输入'  value={coefficient} onInput={(e)=>{setCoefficient(e.detail.value)}} /><Text className='unit1'>%</Text></View>
                  </View>
                }
                {lists[3][1].isOnclick &&
                <View>
                  <View className='param-list'>
                    <View className='param-left'>
                    <View className='param-title'>A</View>
                    </View>
                    <View className='param-money'><Input type='number' placeholder='请输入'  value={proportionA} onInput={(e)=>{setProportionA(e.detail.value)}} /><Text className='unit1'>万</Text></View>
                  </View>
                  <View className='param-list'>
                    <View className='param-left'>
                    <View className='param-title'>a</View>
                    </View>
                    <View className='param-money'><Input type='number' placeholder='请输入'  value={proportiona} onInput={(e)=>{setProportiona(e.detail.value)}} /><Text className='unit1'>万</Text></View>
                  </View>
                </View>
                }
                {lists[3][2].isOnclick &&
                <View>
                  <View className='param-list'>
                    <View className='param-left'>
                    <View className='param-title'>A</View>
                    </View>
                    <View className='param-money'><Input type='number' placeholder='请输入'  value={coefficientA} onInput={(e)=>{setCoefficientA(e.detail.value)}} /><Text className='unit1'>%</Text></View>
                  </View>
                  <View className='param-list'>
                    <View className='param-left'>
                    <View className='param-title'>a</View>
                    </View>
                    <View className='param-money'><Input type='number' placeholder='请输入'  value={coefficient} onInput={(e)=>{setCoefficient(e.detail.value)}} /><Text className='unit1'>%</Text></View>
                  </View>
                </View>
                }
              </View>
            </View>
            : <View className='prance'><Input placeholder='请输入固定金额' value={amount} onInput={(e)=>{setAmount(e.detail.value)}}></Input><Text className='unit1'>万</Text></View> 
          }
        </View>
      }
      <AtModal isOpened={showModal} closeOnClickOverlay={false}>
        <AtModalContent className='modal-box'>
          <View className='modal-title'>{incomeName}</View>
          <View className='modal-text'>计算完成</View>
        </AtModalContent>
        <AtModalAction><Button onClick={cleanAllValue}>重新计算</Button> <Button onClick={recalculate}>确定</Button> </AtModalAction>
      </AtModal>
      <View className='cal-bottom-bonus' onClick={()=>{bottomSubmit()}}>
        <View className='cal-button-bouns' >计算</View>
      </View>
    </View>
  )
}