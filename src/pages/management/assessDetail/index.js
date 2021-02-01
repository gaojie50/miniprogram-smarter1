import { View, Button, Input, Textarea, Text, Block } from '@tarojs/components'
import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import reqPacking from '../../../utils/reqPacking.js';
import utils from '../../../utils/index';
import _cloneDeep from 'lodash/cloneDeep'
import _merge from 'lodash/merge'
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
  const [ rate, setRate ] = useState(0);
  const [ curEvalObj, setCurEvalObj ] = useState({});

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
          setCurEvalObj(evaluationList.filter(item => item.roundId == this.props.roundId)[ 0 ] || {})
          setLoading(false)
          return;
        }
        console.log(curEvalObj);
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
        data: { projectId: projectId },
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
          setLoading(false)
          return;
        }

        error.message && errorHandle(error);
        setQuestions([]);
        setLoading(false);
      });
  };

  // function setBriefInfo(briefInfo){
  //   setBriefInfo(briefInfo);
  //   const { chooseTempId } = briefInfo;
  //   fetchTemp(chooseTempId);
  // }

  
  function updateQues (obj, questionId, itemObj) {
    let innerQues = this.state.questions.map(item => {
      if (item.questionId == questionId) return _merge(itemObj, obj);
      return item;
    });
    let leng = innerQues.filter(item => item.finished).length;

    setQuestions(innerQues);
    setRate(`${Math.round(leng / innerQues.length * 1000) / 10}%`);
  };


  return (
    <View className="assess-page">
      <View className="pagination-wrap">
        <Button className="pagination-prev">上一页</Button>
        <Button className="pagination-next">下一页</Button>
        <View className="page-process-wrap">
          <View>2/6</View>
        </View>
      </View>

      <View className="assess-content-wrap">
      {
        questions.map(({
          type, required, title, questionNum, gapFilling, radioItems, matrixScale, matrixRadio, showError, questionId,
        }, index, arr) => {
          if (type == 1) {
            return <GapFillingText
              key={ index }
              required={ required }
              title={ title }
              isPreview={ false }
              questionNum={ questionNum }
              showError={ showError }
              cb={ obj => this.updateQues(obj, questionId, arr[ index ]) }
            />;
          }

          if (type == 2) {
            return <GapFillingNum
              key={ index }
              required={ required }
              isPreview={ false }
              gapFilling={ gapFilling }
              questionNum={ questionNum }
              showError={ showError }
              cb={ obj => this.updateQues(obj, questionId, arr[ index ]) }
            />;
          }

          if (type == 3) {
            return <MatrixRadio
              key={ index }
              required={ required }
              isPreview={ false }
              title={ title }
              matrixRadio={ matrixRadio }
              questionNum={ questionNum }
              showError={ showError }
              cb={ obj => this.updateQues(obj, questionId, arr[ index ]) }
            />;
          }

          if (type == 4) {
            return <Radio
              key={ index }
              required={ required }
              isPreview={ false }
              title={ title }
              questionNum={ questionNum }
              radioItems={ radioItems }
              showError={ showError }
              cb={ obj => this.updateQues(obj, questionId, arr[ index ]) }
            />;
          }

          if (type == 5) {
            return <MatrixScale
              key={ index }
              required={ required }
              isPreview={ false }
              title={ title }
              questionNum={ questionNum }
              matrixScale={ matrixScale || {} }
              showError={ showError }
              cb={ obj => this.updateQues(obj, questionId, arr[ index ]) }
            />;
          }

          return null;
        })
      }
      </View>
    </View>
  );
}

