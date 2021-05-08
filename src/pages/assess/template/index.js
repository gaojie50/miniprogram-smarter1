/* eslint-disable jsx-quotes */
import { View, Button, Block } from '@tarojs/components';
import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance, useDidHide, useDidShow } from '@tarojs/taro';
import _cloneDeep from 'lodash/cloneDeep';
import { Radio, MatrixRadio, MatrixScale, GapFillingText, GapFillingNum } from '@components/assess';
import '@components/m5/style/components/float-layout.scss';
import reqPacking from '@utils/reqPacking.js';
import utils from '@utils/index';
import lx from '@analytics/wechat-sdk';
import AddQuesionts from './add-questions';
import './index.scss'

const { errorHandle } = utils;

export default function PerviewTemplate(){

  const [ questions, setQuestions ] = useState([]);
  const [ appendQuesList, setAppendQuesList ] = useState([]);
  const [ tempId, setTempId ] = useState();
  const [ projectId, setProjectId ] = useState();
  const [ tempName, setTempName ] = useState('');
  const [ isAddOpen, setIsAddOpen ] = useState(false);
  const [ curEditTemp, setCurEditTemp ] = useState();
  const pages = Taro.getCurrentPages(); // 获取当前的页面栈
  const current = pages[pages.length - 1];
  const eventChannel = current.getOpenerEventChannel();

  useDidShow(()=>{
    const { tempId:cId, projectId:pId } = getCurrentInstance().router.params;
    setTempId(cId);
    setProjectId(pId);

    eventChannel.on('previewTemp', data=>{
      setAppendQuesList(data.appendQuesList);
      setTempName( data.tempName );

      console.log('data', data);
      // pv埋点
      lx.pageView('c_movie_b_2dbfeaf7', {
        custom: {
          template_name: data.tempName,
          project_id: data.projectId,
        }
      })
    })
  })

  useDidHide(()=>{
    eventChannel.off('previewTemp');
  })

  useEffect(() => {
    if(tempId){
      fetchTemp(tempId);
    }
  }, [tempId]);

  const fetchTemp = value => {
    if (!value){
      return Taro.showModal({title: '提示', content:'缺少tempId', duration:1000});
    } 
    
    Taro.showLoading({
      title: '加载中'
    });
    reqPacking(
      {
        url: '/api/management/tempQuestion',
        data: { tempId },
      },
      'server',
    ).then(res => {
        const { data, error } = res;
        if (!error) {
          const { questions: quesList } = data;
          
          setQuestions(quesList);
          Taro.hideLoading();
          errorHandle(error);
          
          return;
        }
        errorHandle(error);
        Taro.hideLoading();

      }).catch(()=>{
        errorHandle({message: '加载失败'});
        Taro.hideLoading();
      })
  };

  const handleUse = () =>{
    eventChannel.emit('selectTemp', {
      tempId,
      appendQuesList
    });
    Taro.navigateBack();
  }

  // 点击添加题目按钮
  const handleAdd = () => {
    setIsAddOpen(true);

    // 埋点上报点击添加题目行为
    lx.moduleClick(
      // 事件bid
      'b_movie_b_4dd4j55g_mc',
      {
        template_name: tempName,
        project_id: projectId,
      }
    )
  }

  const handleAddClose = () => {
    setCurEditTemp('');
    setIsAddOpen(false);
  }

  const handleQuestion = (type, quesItem)=>{
    if( type === 'edit' ){
      appendQuesList[quesItem.questionNum-questions.length-1] = quesItem;
    }else{
      quesItem.isAdditional = true;
      appendQuesList.push(quesItem);
    }
    setAppendQuesList(appendQuesList);
    setIsAddOpen(false);
    eventChannel.emit('selectTemp', {
      tempId,
      appendQuesList
    });
  }

  const handleEdit = (item)=> {
    setIsAddOpen(true);
    setCurEditTemp(item);
  }

  const handleDelete = (item, index)=>{
    Taro.showModal({
      title: '提示',
      content: '是否删除该题目',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          appendQuesList.splice(index-questions.length,1);
          // 重新整理题号
          let newAppendQuesList = _cloneDeep(appendQuesList).map((qItem, qIndex)=>{
            qItem.questionNum = qItem.questionId = questions.length + qIndex + 1;
            return qItem;
          })
          setAppendQuesList(newAppendQuesList);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  }


  const allQuestions = _cloneDeep(questions.concat(appendQuesList));
  return (
    <View className="page-container">
      <View className="template-preview-wrap">
        <Block>
          {
            allQuestions.map((item,index)=>{
              const { type, required, title, questionNum, gapFilling, radioItems, matrixScale, matrixRadio, isAdditional } = item;

              if (type == 1) {
                return <GapFillingText
                  key={index}
                  isAdditional={isAdditional}
                  required={required}
                  title={title}
                  isPreview
                  questionNum={questionNum}
                  onEdit={()=>{handleEdit(item, index)}}
                  onDelete={()=>{handleDelete(item, index)}}
                />;
              }

              if (type == 2) {
                return <GapFillingNum
                  key={index}
                  isAdditional={isAdditional}
                  required={required}
                  isPreview
                  gapFilling={gapFilling}
                  questionNum={questionNum}
                  onEdit={()=>{handleEdit(item, index)}}
                  onDelete={()=>{handleDelete(item, index)}}
                />;
              }

              if (type == 3) {
                return <MatrixRadio
                  key={index}
                  required={required}
                  isPreview
                  title={title}
                  matrixRadio={matrixRadio}
                  questionNum={questionNum}
                />;
              }

              if (type == 4) {
                return <Radio
                  key={index}
                  isAdditional={isAdditional}
                  required={required}
                  isPreview
                  title={title}
                  questionNum={questionNum}
                  radioItems={radioItems}
                  onEdit={()=>{handleEdit(item, index)}}
                  onDelete={()=>{handleDelete(item, index)}}
                />;
              }

              if (type == 5) {
                return <MatrixScale
                  key={index}
                  required={required}
                  isPreview
                  title={title}
                  questionNum={questionNum}
                  matrixScale={matrixScale || {}}
                />;
              }

            })
          }
        </Block>
        <View className="btn-wrap">
        <Button
          className="use_btn btn"
          onClick={handleUse}
        >
            直接使用
        </Button>
        <Button
          className="add_btn btn"
          onClick={handleAdd}
        >
            添加题目
        </Button>
      </View>
      </View>

      <AddQuesionts 
        projectId={projectId}
        tempName={tempId}
        isEdit={curEditTemp?true:false}
        lastQuesNum={allQuestions.length}
        isOpened={isAddOpen}
        onClose={handleAddClose}
        onAdd={quesItem=>handleQuestion('add', quesItem)}
        onEdit={quesItem=>handleQuestion('edit', quesItem)}
        curEditTemp={curEditTemp}
      />
    </View>
  )
}