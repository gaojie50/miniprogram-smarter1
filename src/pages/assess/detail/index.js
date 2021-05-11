import { View, ScrollView, Button } from '@tarojs/components'
import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import reqPacking from '@utils/reqPacking.js';
import utils from '@utils/index';
import _merge from 'lodash/merge';
import AtModal from '@components/m5/modal';
import '@components/m5/style/components/modal.scss';
import { Radio, MatrixRadio, MatrixScale, GapFillingText, GapFillingNum } from '@components/assess';
import FixedButton from '@components/fixedButton';
import Indexes from '@components/indexes';
import FingerPrint from '@utils/fingerprint';
import useDeadline from './useDeadline';
import './index.scss'

const { errorHandle } = utils;

export default function AssessPage(){
  const [ questions, setQuestions ] = useState([]);
  const [ basicQueslen, setBasicQueslen ] = useState(0);
  const [ finishNum, setFinishNum ] = useState(0);
  const [ rate, setRate ] = useState(0);
  const [ contentHeight, setContentHeight ] = useState();
  const [ scrollHeight, setScrollHeight ] = useState();
  const [ quesScrollTopList, setQuesScrollTopList ] = useState([]);
  const [ activeIndex, setActiveIndex ] = useState(1)
  const [ scrollTop, setScrollTop ] = useState(0);
  const [ openModal, setOpenModal ] = useState(false);
  const [ deadline, setDeadline ] = useState();

  const { projectId, roundId } = getCurrentInstance().router.params;

  const { component: deadlineShow, over } = useDeadline(deadline, () => {setOpenModal(true)});

  useEffect(()=>{
    Taro.showLoading({title: '加载中'});
    fetchQuestion();
  }, [])

  function fetchQuestion(){
    reqPacking(
      {
        url: 'api/applet/management/modifyEvaluate',
        data: { projectId, roundId },
      },
      'server',
    ).then(res => {
      const { error, data } = res;
      if (!error) {
        const { questions, appendTemplate, deadline } = data;
        setDeadline(deadline);
        let ques = questions;
        if (appendTemplate) {
          ques = questions.concat(appendTemplate);
        }
        ques.map((item) => {
          item.showError = false;
          item.finished = false;
          item.complete = false;
          switch (item.type) {
            case 1:
            case 2:
            case 4:
              if (item.answerContent) {
                item.complete = true;
                item.finished = true;
              }
            default: 
              if (item.matrixSelectList) {
                item.complete = item.matrixSelectList.some(c => c !== -1)
                item.finished = item.matrixSelectList.every(c => c !== -1)
              }
          }
          return item;
        })

        let leng = ques.filter(item => item.finished).length;
        setFinishNum(leng);
        setRate(`${Math.round(leng / ques.length * 1000) / 10}%`);

        setQuestions(ques);
        setBasicQueslen(questions.length);
        setActiveIndex('1');

        Taro.nextTick(() => {
          const query = Taro.createSelectorQuery();
          // 一次获取所有题的位置信息
          query.selectAll('.que-item').boundingClientRect(rect=>{
            const topList = rect.map(item=>parseInt(item.top));
            setQuesScrollTopList(topList.map(item=>item-topList[0]));
          }).exec();

          // 获取展示高度和滚动高度
          query.select('.assess-content-wrap').boundingClientRect(rect=>{
            setContentHeight(rect.height);
          }).exec();
      
          query.select('.assess-content-wrap .content').boundingClientRect(rect=>{
            setScrollHeight(rect.height);
          }).exec();

        });
        return;
      }

      errorHandle(error);
    }).finally(()=>{
      Taro.hideLoading();
    })
  }
  
  function updateQues (obj, questionId, itemObj) {
    let innerQues = questions.map(item => {
      if (item.questionId == questionId) return _merge(itemObj, obj);
      return item;
    });
    let leng = innerQues.filter(item => item.finished).length;
    setFinishNum(leng);
    setQuestions(innerQues);
    setRate(`${Math.round(leng / innerQues.length * 1000) / 10}%`);
  };

  function handleSubmit(){
    let errSign = false;
    let canFinish = false;
    let allScoreFinished = true;
    // 至少有一个填写
    for(let i=0; i<questions.length; i++){
      if(questions[i].complete){
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
    
    let finalQuestions = questions.map(item => {
      const {
        type, questionId, content, matrixSelectList=[], finished, questionNum
      } = item;
      let obj = {
        type,
        questionId,
        questionNum
      };
      // 只有矩阵量表题算分
      if(type===5 && !finished){
        allScoreFinished = false;
      }
      switch (type) {
        case 1:
        case 2:
        case 4: obj.content = content; break;
        default: obj.matrixSelectList = matrixSelectList;
      }

      return obj;
    });
    const appendTemplate = finalQuestions.slice(basicQueslen).length === 0 ? null : finalQuestions.slice(basicQueslen);

    reqPacking(
      {
        url: 'api/management/submit',
        method: 'POST',
        data: {
          projectId,
          roundId,
          questions: finalQuestions.slice(0,basicQueslen),
          appendTemplate,
          scoreFinished: allScoreFinished
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
         Taro.eventCenter.trigger('didEvaluated');
         Taro.redirectTo({
           url: `/pages/result/index?projectId=${projectId}&roundId=${roundId}`
         })
        } else {
          errorHandle({
            message: error.message || '提交失败',
          });
        }
      });
  }

  function handleScroll(e){
    // 计算滚动位置
    const quesLen = quesScrollTopList.length;
    const { scrollTop } = e.detail;
    for( let i=0; i<quesLen; i++){
      let curTop = quesScrollTopList[i];
      let nextTop = quesScrollTopList[i+1] || 99999;
      if( scrollTop >= curTop && scrollTop < nextTop){
        setActiveIndex(`${i+1}`);
        break;
      }
    }
  }


  function jumpTarget(target){
    let realTarget = target;
    if (target <= 1) {
      realTarget = 1;
    } else if (target >= questions.length) {
      realTarget = questions.length
    }
    setActiveIndex(realTarget);
    const targetTop = quesScrollTopList[realTarget-1];
    // 解决被手动滚动后，再次点击上次点击过的index定位不生效的问题
    setScrollTop(targetTop+0.001);
    Taro.nextTick(()=>{
      setScrollTop(targetTop);
    })
  }

  const IndexList = questions.map((item, index)=>{
    return {
      key: `${index+1}`,
      title: index+1
    }
  })
  const showIndexes = scrollHeight > contentHeight *2;
  return (
    <View className="assess-page">
      <FingerPrint />

      <View className="deadline">
        {deadlineShow}
      </View>

      <AtModal isOpened={openModal} >
        <View className="modal">
          <View className="modal-title">评估时间已结束</View>
          <View className="modal-content">感谢您的关注，本次评估已结束。如需添加评估内容，请联系评估发起人</View>
          <Button className="modal-button" onClick={() => { setOpenModal(false) }}>我知道了</Button>
        </View>
      </AtModal>


      {showIndexes && <Indexes 
        list={IndexList} 
        topKey={IndexList.length>1?IndexList[0].key:''}
        jumpTarget={ jumpTarget }
        activeKey={`${activeIndex}`}
      />}
      <ScrollView 
        className="assess-content-wrap"
        scrollY
        scrollTop={scrollTop}
        onScroll={showIndexes ? handleScroll:()=>{}}
      >
        <View className="content">
        {
          questions.map(({
            type, required, title, questionNum, gapFilling, radioItems, matrixScale, matrixRadio,
            showError, questionId, answerContent, matrixSelectList
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
                defaultValue={ answerContent }
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
                defaultValue={ answerContent }
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
                defaultValue={ matrixSelectList }
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
                defaultValue={ answerContent }
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
                defaultValue={ matrixSelectList }
                cb={ obj => updateQues(obj, questionId, arr[ index ]) }
              /></View>;
            }

            return null;
          })
        }
      </View>
      </ScrollView>
      <FixedButton className="submit-btn" onClick={handleSubmit} disabled={over}>
        <View className="inner-text">{over ? '评估已结束, 不能继续参与' : `${finishNum>0?`已完成${finishNum}题，`:''}提交评估`}</View>
        <View className="inner-bar" style={{width:`${rate}`}} />
      </FixedButton>
    </View>
  );
}

