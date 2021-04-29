/* eslint-disable jsx-quotes */
import React, { useEffect, useState } from 'react';
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
const TYPE_RADIO = 4;  // 选择题
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

  // 题型格式
  const quesObj = {
    questionId: null,
    title: "",
    type: DEFAULT_QUESTYPE,
    required: false,
    gapFilling: null,
    matrixRadio: null,
    matrixScale: null,
    questionNum: props.lastQuesNum ? props.lastQuesNum+1 : 1,
    radioItems: null,
  }
  
  const [ selectType, setSelectType ] = useState(DEFAULT_QUESTYPE);
  const [ tempQuesObj, setTempQuesObj ] = useState(_cloneDeep(quesObj));
  const [ selectUnit, setSelectUnit ] = useState();
  const [ options, setOptions ] = useState(['']);
  const { lastQuesNum } = props;

  useEffect(()=>{
    const { curEditTemp } = props;
    
    if(props.isEdit){
      const { type, gapFilling={}, radioItems=[] } = curEditTemp;
      
      setTempQuesObj(_cloneDeep(curEditTemp));
      setSelectType(type);
      if(type===TYPE_NUM){
        setSelectUnit(gapFilling.rightText)
      }
      if(type===TYPE_RADIO){
        setOptions(radioItems);
      }
    }
  }, [props.curEditTemp])


  const handleSave = ()=> {
    console.log(tempQuesObj);
     // 校验题目是否填写完成
     if(!validate()){
      return;
    };

    if(props.isEdit){
      props.onEdit(tempQuesObj);
    }else{
      tempQuesObj.questionNum = lastQuesNum +1;
      tempQuesObj.questionId = lastQuesNum+1;
      props.onAdd(tempQuesObj);
    }

    console.log(tempQuesObj);    
    props.onClose();
    // 重置表单
    reset();
  }

  const reset = () => {
    let newTempQuesObj = _cloneDeep(quesObj);
    setSelectType(TYPE_FILL);
    setTempQuesObj(newTempQuesObj)
    setOptions(['']);
    setSelectUnit();
  }

  const validate = ()=>{
    if( !tempQuesObj.title ){
      Taro.showModal({
        title: '提示',
        content: '请填写题目名称',
      })
      return false;
    }

    if(selectType === TYPE_NUM && !tempQuesObj.gapFilling.rightText ){
      Taro.showModal({
        title: '提示',
        content: '请选择选项单位',
      })
      return false;
    }


    if(selectType === TYPE_RADIO && tempQuesObj.radioItems.filter(item=>item).length === 0 ){
      Taro.showModal({
        title: '提示',
        content: '请填写至少一个选项',
      })
      return false;
    }
    return true;
  }

  const handleTypeChange = type => {
    let newTempQuesObj = {
      ..._cloneDeep(quesObj),
      type
    }
    switch(type){
      case TYPE_NUM:
        newTempQuesObj.gapFilling = { leftText: null, rightText: null };
        break;
      case TYPE_RADIO:
        newTempQuesObj.radioItems = [];
        break;
      default:
    }
    setTempQuesObj(newTempQuesObj);
    setSelectType(type);
  }

  const handleTitleInput = ({target}) => {
    let innerValue = target.value.trim();
    tempQuesObj.title = innerValue;
    if(selectType === TYPE_NUM ){
      tempQuesObj.gapFilling.leftText =innerValue;
    }
    setTempQuesObj(tempQuesObj);
  }

  const handleUnitChange = unit => {
    tempQuesObj.gapFilling.rightText = unit;
    setTempQuesObj(tempQuesObj);
    setSelectUnit(unit)
  }

  const handleDeleteOption = index => {
    console.log(options);
    options.splice(index, 1);
    tempQuesObj.radioItems=options;
    setOptions(_cloneDeep(options));
    setTempQuesObj(tempQuesObj);
  }

  const handleAddOption = () => {
    options.push('');
    setOptions(_cloneDeep(options));
  }

  const handleOptionInput = ({target}, index) => {
    let innerValue = target.value.trim();
    options[index] = innerValue;
    const newOptions = _cloneDeep(options.filter(item=>item));
    tempQuesObj.radioItems = newOptions;
    setTempQuesObj(tempQuesObj);
    setOptions(options);
  }

  return (
    <AtFloatLayout
      className="add-questions-component"
      isOpened={props.isOpened}
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
              value={tempQuesObj.title}
              onInput={e=>handleTitleInput(e)}
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
                        onInput={(e)=>{handleOptionInput(e, index)}}
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
