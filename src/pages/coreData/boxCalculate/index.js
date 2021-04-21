import React, { useState, useEffect, useMemo } from 'react'; 
import { View, Image, Text, ScrollView, FloatLayout } from '@tarojs/components';
import Taro from '@tarojs/taro'
import ArrowLeft from '@static/detail/arrow-left.png';
import M5Input from '@components/m5/input';
import '@components/m5/style/components/input.scss';
import './index.scss'

export default function BoxCalculate() {
  const btnLists = [
    [ {text: '票房分账收入', isOnclick: true}, {text: '净票房收入', isOnclick: false} ],
    [ {text: '固定比例', isOnclick: false}, {text: '固定金额', isOnclick: false}, {text: '阶梯', isOnclick: true} ],
    [ {text: '超额累进', isOnclick: false}, {text: '全额累进', isOnclick: true} ],
  ]
  const ladderLists = [
    [{name:'A', unit:'万'}, {name:'B', unit:'万'}, {name:'a', unit:'%'}, {name:'b', unit:'%'}, {name:'c', unit:'%'}],
    [{name:'A', unit:'万'}, {name:'B', unit:'万'}, {name:'C', unit:'万'},{name:'a', unit:'%'}, {name:'b', unit:'%'}, {name:'c', unit:'%'}]
  ];
  // const [isOnclick, setIsOnclick] = useState(false);
  const [lists, setLists] = useState(btnLists);

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

  useEffect(()=>{
    console.log(lists);
    // setLists(lists);
  }, [lists]);

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
          {lists[2][0].isOnclick ? '计算公式：票房A元以下对应基数a%+票房A元至B元对应基数*b%+票房B元以上对应技术*c%' : '计算公式：制作成本*(100+A)%，净利润*a%或制作成本*(100+B)%<净收益≤制作成本*(100+C)，净利润b%或者净收益>制作成本*(100+C)%，净利润c%'}
          </View>
          <View className='ladder-lists'>
            {(lists[2][0].isOnclick ? ladderLists[0]: ladderLists[1]).map((item, index)=>{
              return(
              <View className='param-list' key={index}>
                <View className='param-left'>
                <View className='param-title'>{item.name}</View>
                </View>
                <View className='param-money'><M5Input type='number' placeholder='请输入' /><Text className='unit1'>{item.unit}</Text></View>
              </View>
            )})}
          </View>
        </View> :
        <View className='prance'><M5Input placeholder={lists[1][0].isOnclick ? '请输入固定比例系数': '请输入固定金额'}></M5Input><Text className='unit1'>{lists[1][0].isOnclick ? '%' : '万元'}</Text></View> 
      }
      <View className='float-bottom-box' onClick={()=>{console.log('333')}}>
          <View className='button'>计算</View>
      </View>
    </View>
  )
}