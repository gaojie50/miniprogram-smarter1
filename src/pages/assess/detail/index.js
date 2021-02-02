import { View, Button, Input, Textarea, Text, Block, ScrollView } from '@tarojs/components'
import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import reqPacking from '../../../utils/reqPacking.js';
import utils from '../../../utils/index';
import _cloneDeep from 'lodash/cloneDeep';
import _merge from 'lodash/merge';
import { set as setGlobalData, get as getGlobalData } from '../../../global_data'
import { Radio, MatrixRadio, MatrixScale, GapFillingText, GapFillingNum } from '../../../components/assess';
import AtActionSheet from '../../../components/m5/action-sheet';
import AtActionSheetItem from '../../../components/m5/action-sheet/body/item';
import AtFloatLayout from '../../../components/m5/float-layout';

import '../../../components/m5/style/components/action-sheet.scss';
import '../../../components/m5/style/components/float-layout.scss';
import './index.scss'

const { errorHandle } = utils;

export default function assessPage(){
  
  const [ briefInfo, setBriefInfo ] = useState({});
  const [ projectRole, setProjectRole ] = useState(6);
  const [ loading, setLoading ] = useState(true);
  const [ questions, setQuestions ] = useState([]);
  const [ curQuesId, setCurQuesId ] = useState(1);
  const [ disablePrev, setDisablePrev ] = useState(true);
  const [ disableNext, setDisableNext ] = useState(false);
  const [ rate, setRate ] = useState(0);
  const [ curEvalObj, setCurEvalObj ] = useState({});
  const [ viewHeight, setViewHeight ] = useState();
  const [ paginationHeight, setPaginationHeight ] = useState();
  const [ contentHeight, setContentHeight ] = useState();
  const [ quesScrollTopList, setQuesScrollTopList ] = useState([]);
  

  const { projectId, roundId } = getCurrentInstance().router.params;

  useEffect(()=>{
    fetchRole();
    fetchBrifInfo();
    fetchEveluationList();

    Taro.nextTick(() => {
      // 获取各元素高度
      const query = Taro.createSelectorQuery();
      query.selectViewport().boundingClientRect(rect => {
        setViewHeight(rect.height);
      }).exec();

      query.select('.pagination-wrap').boundingClientRect(rect=>{
        setPaginationHeight(rect.height);
      }).exec();

      query.select('.assess-content-wrap').boundingClientRect(rect=>{
        setContentHeight(rect.height)
      }).exec();
    })
  }, [])

  function fetchRole(){
    reqPacking(
      {
        url: 'api/management/projectRole',
        data: { projectId: projectId },
      },
      'server',
    ).then(res => {
        const { data, success, error } = res;
        const { projectRole } = data;
        if (success) return setProjectRole(projectRole);
        if (error) errorHandle(message);
      });
  };

  function fetchBrifInfo(){
    reqPacking(
      {
        url: 'api/management/briefInfo',
        data: { projectId, roundId },
      },
      'server',
    ).then(res => {
        const { error, data } = res;
        if (!error) {
          const briefInfo = data;
          const { chooseTempId } = briefInfo;
          if (!briefInfo.projectEvaluationName) briefInfo.projectEvaluationName = `《${briefInfo.name}》项目第${briefInfo.roundNum}轮评估`;
          fetchTemp(chooseTempId);
          return;
        }

        errorHandle(error);
      });
  }

  function fetchEveluationList(){
    reqPacking(
      {
        url: 'api/management/evaluationList',
        data: { projectId: projectId },
      },
      'server',
    ).then(res => {
        const { data, error } = res;
        const { evaluationList } = data;
        if (!error) {
          setCurEvalObj(evaluationList.filter(item => item.roundId == roundId)[ 0 ] || {})
          setLoading(false)
          return;
        }
        error.message && errorHandle(error);
        setQuestions([]);
        setLoading(false);
      });
  }

  function fetchTemp(value){
    console.log('fetchTemp');
    if (!value) return;

    reqPacking(
      {
        url: 'api/management/tempQuestion',
        data: { tempId: value },
      },
      'server',
    ).then(res => {
        const { data, error } = res;
        const { questions } = data;

        if (!error) {
          let ques = questions.map(item => {
            item.showError = false;
            item.finished = false;
            return item;
          });

          setQuestions(ques);
          setLoading(false);

          Taro.nextTick(() => {
            // 获取各元素高度
            const query = Taro.createSelectorQuery();
            console.log('dd',query.selectAll('.que-item').length);
            // 一次获取所有题的位置信息
            query.selectAll('.que-item').boundingClientRect(rect=>{
              console.log(rect)
            }).exec();
          });
          return;
        }

        error.message && errorHandle(error);
        setQuestions([]);
        setLoading(false);
      });
  };

  
  function updateQues (obj, questionId, itemObj) {
    let innerQues = questions.map(item => {
      if (item.questionId == questionId) return _merge(itemObj, obj);
      return item;
    });
    let leng = innerQues.filter(item => item.finished).length;

    setQuestions(innerQues);
    setRate(`${Math.round(leng / innerQues.length * 1000) / 10}%`);
  };

  function handleSubmit(){
    let errSign = false;
    let canFinish = false;
    // 至少有一个填写
    for(let i=0; i<questions.length; i++){
      if(questions[i].finished){
        canFinish = true;
        break;
      }
    }
    if (!canFinish){
      Taro.showModal({
        title: '提示',
        content: '请至少填写一题',
        showCancel: false
      });
      return;
    }
    

    reqPacking(
      {
        url: 'api/management/submit',
        method: 'POST',
        data: {
          projectId,
          roundId,
          questions: questions.map(item => {
            const {
              type, questionId, content, matrixSelectList
            } = item;
            let obj = {
              type,
              questionId,
            };
  
            switch (type) {
              case 1:
              case 2:
              case 4: obj.content = content; break;
              default: obj.matrixSelectList = matrixSelectList;
            }
  
            return obj;
          })
        },
      },
      'server',
    ).then(res => {
        const { success, data, error } = res;

        if (success && data) {
         Taro.showToast({
           title: '提交成功',
           icon: 'success'
         });

         Taro.navigateTo({
           url: `/assess/create/index?projectId=${projectId}`
         })
        } else {
          Taro.showToast({
            title: error.message || '提交失败',
          });
        }
      });
  }

  function onScroll(){
    console.log('scroll')
  }

  function handlePage(pos){
    if( pos === 'prev'){
      curQuesId>1 && setCurQuesId(curQuesId-1);
    }else{
      curQuesId<questions.length && setCurQuesId(curQuesId+1) && setDisablePrev(false);
    }
    
  }

  function handleScrollToUpper(){
    setDisablePrev(true);
  }
  
  function handleScrollToLower(){
    setDisableNext(true);
  }

  return (
    <View className="assess-page">
      <View className="pagination-wrap">
        <Button 
          disabled={disablePrev}
          className={`pagination-button prev ${disablePrev?'disable':''}`} 
          onClick={()=>{handlePage('prev')}}>
            上一题
        </Button>
        <View className="page-process-wrap">
          <View className="page-content">2/6</View>
          <View className="inner-bar" style={{width:'20%'}} />
        </View>
        <Button 
          disabled={disableNext}
          className={`pagination-button next ${disableNext?'disable':''}`} 
          onClick={()=>{handlePage('netx')}}>
            下一题
          </Button>
      </View>

      <ScrollView 
        className="assess-content-wrap"
        scrollY
        scrollWithAnimation
        style={`height: calc(100vh - 70rpx - 40rpx)`}
        onScroll={onScroll}
        scrollIntoView={`que-num-${curQuesId}`}
        onScrollToUpper={handleScrollToUpper}
        onScrollToLower={handleScrollToLower}
      >
      {
        questions.map(({
          type, required, title, questionNum, gapFilling, radioItems, matrixScale, matrixRadio, showError, questionId,
        }, index, arr) => {
          let qId = `que-num-${index+1}`;
          if (type == 1) {
            return <View className="que-item"><GapFillingText
              id={qId}
              key={ index }
              required={ required }
              title={ title }
              isPreview={ false }
              questionNum={ questionNum }
              showError={ showError }
              cb={ obj => updateQues(obj, questionId, arr[ index ]) }
            /></View>;
          }

          if (type == 2) {
            return <View className="que-item"><GapFillingNum
              id={qId}
              key={ index }
              required={ required }
              isPreview={ false }
              gapFilling={ gapFilling }
              questionNum={ questionNum }
              showError={ showError }
              cb={ obj => updateQues(obj, questionId, arr[ index ]) }
            /></View>;
          }

          if (type == 3) {
            return <View className="que-item"><MatrixRadio
              id={qId}
              key={ index }
              required={ required }
              isPreview={ false }
              title={ title }
              matrixRadio={ matrixRadio }
              questionNum={ questionNum }
              showError={ showError }
              cb={ obj => updateQues(obj, questionId, arr[ index ]) }
            /></View>;
          }

          if (type == 4) {
            return <View className="que-item"><Radio
              id={qId}
              key={ index }
              required={ required }
              isPreview={ false }
              title={ title }
              questionNum={ questionNum }
              radioItems={ radioItems }
              showError={ showError }
              cb={ obj => updateQues(obj, questionId, arr[ index ]) }
            /></View>;
          }

          if (type == 5) {
            return <View className="que-item"><MatrixScale
              id={qId}
              key={ index }
              required={ required }
              isPreview={ false }
              title={ title }
              questionNum={ questionNum }
              matrixScale={ matrixScale || {} }
              showError={ showError }
              cb={ obj => updateQues(obj, questionId, arr[ index ]) }
            /></View>;
          }

          return null;
        })
      }
      <View className="btn-wrap">
        <Button 
          className="submit-btn" 
          onClick={handleSubmit}
        >
            提交评估
        </Button>
      </View>
      </ScrollView>
    </View>
  );
}

