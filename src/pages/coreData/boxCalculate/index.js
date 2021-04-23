import React, { useState, useEffect, useMemo, useCallback } from 'react'; 
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro'
import '@components/m5/style/components/input.scss';
import AtModal from '@components/m5/modal';
import AtModalContent from '@components/m5/modal/content';
import AtModalAction from '@components/m5/modal/action'
import '@components/m5/style/components/modal.scss';
import './index.scss'

export default function BoxCalculate({calculateIndex, incomeName, calculate, changeCalculate, childChangeShowProgress}) {
  const bonusButList = [
    [ {text: '票房分账收入', isOnclick: true}, {text: '净票房收入', isOnclick: false} ],
    [ {text: '固定比例', isOnclick: false}, {text: '固定金额', isOnclick: false}, {text: '阶梯', isOnclick: true} ],
    [ {text: '超额累进', isOnclick: false}, {text: '全额累进', isOnclick: true} ],
  ]
  const ladderListsInfo = [{name:'A', unit:'万', value:''}, {name:'B', unit:'万', value:''}, {name:'C', unit:'万',  value:''}, {name:'a', unit:'%', value:''}, {name:'b', unit:'%',  value:''}, {name:'c', unit:'%',  value:''}];
  // const {name, btnlist, ladderLists} = calculateInfo;
  // const [isOnclick, setIsOnclick] = useState(false);
  // const [calculate, setCalculate] = useState(calculateInfo);
  const [lists, setLists] = useState(bonusButList);
  const [isSubmit, setIsSubmit] = useState(false);
  const [ladderLists, setladderLists] = useState(ladderListsInfo);
  const [coefficient, setCoefficient] = useState('');
  const [amount, setAmount] = useState('');
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const cleanAllValue =() => {
    // setLists(bonusButList);
    setCoefficient('');
    setCoefficient('');
    setladderLists(ladderListsInfo);
    setShowModal(false);
  }


  const changeCalculateButton = (index, param) => {
    console.log(index, param, lists[index][param]);
    var newList = lists.concat();
    newList[index].forEach((item, i)=>{
      console.log('item', item);
      if(i===param) {
        item.isOnclick = true;
      }else{
        item.isOnclick = false;
      }
    })
    console.log(newList);
    setLists(newList);
  }
  const changeLadderValue = (e, index) => {
    const val = e.detail.value;
    console.log(index, val, ladderLists, count);
    var NewLadderLists = ladderLists.concat();
    NewLadderLists[index].value = val;
    console.log(NewLadderLists);
    setladderLists(NewLadderLists);
    let count1 = 0;
    ladderLists.map((item)=>{
      if(item.value !== '') {
        count1 = count1 + 1;
      }
    })
    setCount(count1);
  }

  const bottomSubmit = () => {
    setShowModal('提交成功');
  }

  const recalculate = useCallback(()=>{
    changeCalculate(1000);
    setShowModal(false);
    childChangeShowProgress(false);
  }, [changeCalculate, calculate])

  useEffect(()=>{
    console.log('lists, calculateIndex, count', lists, calculateIndex, count);
    if((lists[1][2].isOnclick && count == 6) || (lists[1][0].isOnclick && coefficient) || (lists[1][1].isOnclick && amount) ) {
      setIsSubmit(true);
    }else{
      setIsSubmit(false);
    }
    // setLists(lists);
  }, []);

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
            <View className='prance'><Input placeholder='请输入固定比例系数' value={coefficient} onInput={(e)=>{setCoefficient(e.detail.value)}}></Input><Text className='unit1'>%</Text></View> 
            : <View className='prance'><Input placeholder='请输入固定金额' value={amount} onInput={(e)=>{setAmount(e.detail.value)}}></Input><Text className='unit1'>万</Text></View> 
          }
        </View>
      }
      <AtModal isOpened={showModal}>
        <AtModalContent className='modal-box'>
          <View className='modal-title'>{incomeName}</View>
          <View className='modal-text'>计算值为:</View>
        </AtModalContent>
        <AtModalAction><Button onClick={cleanAllValue}>重新计算</Button> <Button onClick={recalculate}>确定</Button> </AtModalAction>
      </AtModal>
      <View className='float-bottom-box' onClick={()=>{bottomSubmit()}}>
          <View className='button' style={{opacity: `${isSubmit ? '1 !important':''}`}} >计算</View>
      </View>
    </View>
  )
}