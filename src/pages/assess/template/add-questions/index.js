/* eslint-disable jsx-quotes */
import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import {
  View,
  Button,
  Textarea,
  Input
} from '@tarojs/components';
import _cloneDeep from 'lodash/cloneDeep';
import AtFloatLayout from '@components/m5/float-layout';
import FixedButton from '@components/fixedButton';
import '@components/m5/style/components/float-layout.scss';
import './index.scss';

const TYPE_FILL = 1; // 问答题
const TYPE_NUM = 2; // 数值题
const TYPE_RADIO = 3;  // 选择题
const DEFAULT_QUESTYPE = TYPE_FILL;


const QUES_TYPE_LIST = [
  {
    type: TYPE_FILL,
    name: '问答题',
  },
  {
    type: TYPE_NUM,
    name: '数值题'
  },
  {
    type: TYPE_RADIO,
    name: '选择题'
  }
]


const UNIT_LIST = ['亿', '千万', '万', '分'];

const AddQuestions = function(props) {

  const [ selectType, setSelectType ] = useState(DEFAULT_QUESTYPE);
  const [ selectUnit, setSelectUnit ] = useState();
  const [ options, setOptions ] = useState(['']);

  const handleSave = ()=> {
    props.onAdd();
    props.onClose();
  }

  const handleTypeChange = type => {
    setSelectType(type);
  }

  const handleUnitChange = unit => {
    setSelectUnit(unit)
  }

  const handleDeleteOption = index => {
    options.splice(index, 1);
    console.log(options);
    setOptions(_cloneDeep(options));
  }

  const handleAddOption = () => {
    options.push('');
    setOptions(_cloneDeep(options));
  }

  const handleInput = ({target}, index) => {
    let innerValue = target.value.trim();
    options[index] = innerValue;
    setOptions(_cloneDeep)
  }

  return (
    <AtFloatLayout
      className="add-questions-component"
      isOpened
      title="添加题目"
      onClose={props.onClose}
    >
      <View className="question-wap">
        <View className="type-wrap">
          <View className="title">题目类型</View>
          <View className="btn-wrap">
            {QUES_TYPE_LIST.map(item=>{
              return (
                <Button
                  key={item.type}
                  size={216}
                  className={`btn-item ${selectType===item.type?'active':''}`}
                  onClick={()=>{handleTypeChange(item.type)}}
                >
                  {item.name}
                </Button>
              )
            })}
          </View>
        </View>
        
        <View className="ques-title-wrap">
            <View className="title">题目名称</View>
            <Textarea
              className="ques-title-fill" 
              placeholder="请输入"
            />
        </View>

        {selectType === TYPE_NUM && (
          <View className="ques-unit-wrap">
            <View className="title">选项单位</View>
            <View className="radio-wrap">
              { UNIT_LIST.map(item=>{
                return (
                  <View className={`radio-item ${item===selectUnit?'active':''}`} value={item} key={item} onClick={()=>{handleUnitChange(item)}}>
                    <View className="dot" />
                    <View className="radio-text">{item}</View>
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {
          selectType === TYPE_RADIO && (
            <View className="ques-select-wrap">
              <View className="title-wrap">
                <View className="title">选项名称</View>
                <View className="add-btn" onClick={handleAddOption}>+添加选项</View>
              </View>
              
              <View className="options-list">
                {options.map((item,index)=>{
                  return (
                    <View className="options-item-wrap" key={index}>
                      <Input
                        type="text"
                        placeholder="请输入"
                        className="option-fill"
                        onInput={(e)=>{handleInput(e, index)}}
                        value={item}
                      />
                      {options.length > 1 && (
                        <View className="delete-btn" onClick={()=>{handleDeleteOption(index)}}>
                          <View className="smarter-iconfont icon-delete" style={{ fontSize: '44rpx' }} />
                        </View>
                      )}
                    </View>
                  )
                })}
              </View>
            </View>
          )
        }
      </View>
      <FixedButton onClick={handleSave}>保存并预览</FixedButton>
    </AtFloatLayout>
  );
};

export default AddQuestions;
