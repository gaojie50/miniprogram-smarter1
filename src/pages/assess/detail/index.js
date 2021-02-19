import { View, Button, Input, Textarea, Text, Block, ScrollView } from '@tarojs/components'
import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance, nextTick, useShareAppMessage } from '@tarojs/taro';
import reqPacking from '@utils/reqPacking.js';
import utils from '@utils/index';
import _cloneDeep from 'lodash/cloneDeep';
import _merge from 'lodash/merge';
import _debounce from 'lodash/debounce'
import { set as setGlobalData, get as getGlobalData, set } from '../../../global_data'
import { Radio, MatrixRadio, MatrixScale, GapFillingText, GapFillingNum } from '../../../components/assess';
import Indexes from '@components/indexes';
import AtActionSheet from '@components/m5/action-sheet';
import AtActionSheetItem from '@components/m5/action-sheet/body/item';
import AtFloatLayout from '@components/m5/float-layout';

import '@components/m5/style/components/action-sheet.scss';
import '@components/m5/style/components/float-layout.scss';
import './index.scss'

const { errorHandle } = utils;

export default function assessPage(){
  
  const [ briefInfo, setBriefInfo ] = useState({});
  const [ projectRole, setProjectRole ] = useState(6);
  const [ loading, setLoading ] = useState(true);
  const [ questions, setQuestions ] = useState([]);
  const [ rate, setRate ] = useState(0);
  const [ curEvalObj, setCurEvalObj ] = useState({});
  const [ contentHeight, setContentHeight ] = useState();
  const [ scrollHeight, setScrollHeight ] = useState();
  const [ quesScrollTopList, setQuesScrollTopList ] = useState([]);
  const [ activeIndex, setActiveIndex ] = useState(1)
  const [ scrollTop, setScrollTop ] = useState(0);
  const [ submitDisabled, setSubmitDisabled ] = useState(true);

  const { projectId, roundId } = getCurrentInstance().router.params;

  useEffect(()=>{
    fetchRole();
    fetchBrifInfo();
    fetchEveluationList();
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
            item.complete = false;
            return item;
          });

          setQuestions(ques);
          setActiveIndex('1');
          setLoading(false);

          Taro.nextTick(() => {
            const query = Taro.createSelectorQuery();
            // 一次获取所有题的位置信息
            query.selectAll('.que-item').boundingClientRect(rect=>{
              const topList = rect.map(item=>item.top);
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
        type, questionId, content, matrixSelectList=[]
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
    });
    reqPacking(
      {
        url: 'api/management/submit',
        method: 'POST',
        data: {
          projectId,
          roundId,
          questions: finalQuestions
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
      let nextTop = quesScrollTopList[i+1];

      if( scrollTop >= curTop && scrollTop < nextTop){
        setActiveIndex(`${i+1}`);
        break;
      }
    }
  }


  function jumpTarget(target){
    setActiveIndex(target);
    const targetTop = quesScrollTopList[target-1];
    // 解决被手动滚动后，再次点击上次点击过的index定位不生效的问题
    setScrollTop(targetTop+0.001);
    Taro.nextTick(()=>{
      setScrollTop(targetTop);
    })
  }

  function showShare(){
    Taro.showShareMenu({
      withShareTicket: true
    })
  }

  useShareAppMessage(res => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/pages/assess/index/index?projectId=14332&roundId=350'
    }
  })

  const IndexList = questions.map((item, index)=>{
    return {
      key: `${index+1}`,
      title: index+1
    }
  })
  const showIndexes = scrollHeight > contentHeight *2;
  return (
    <View className="assess-page">
      <Button onClick={showShare} openType="share">分享</Button>
      <View className="process-wrap">
        <View className="inner-bar" style={{width:`${rate}`}} />
      </View>

      {showIndexes && <Indexes 
        list={IndexList} 
        topKey={IndexList.length>1?IndexList[0].key:''}
        jumpTarget={ jumpTarget }
        activeKey={`${activeIndex}`}
      />}
      <ScrollView 
        className="assess-content-wrap"
        scrollY
        style={`height: calc(100vh - 20rpx - 40rpx - 20rpx);${showIndexes? 'padding-left:80rpx; padding-right:80rpx;':''}`}
        scrollTop={scrollTop}
        onScroll={showIndexes ? handleScroll:()=>{}}
      >
        <View className="content">
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
      </View>
      </ScrollView>
      <View className="btn-wrap">
        <Button 
          className="submit-btn"
          onClick={handleSubmit}
        >
            提交评估
        </Button>
      </View>
    </View>
  );
}

