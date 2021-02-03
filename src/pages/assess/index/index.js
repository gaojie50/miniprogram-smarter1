import { View, Button, Input, Textarea, Text, Block, Image } from '@tarojs/components'
import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import reqPacking from '../../../utils/reqPacking.js';
import utils from '../../../utils/index';
import _cloneDeep from 'lodash/cloneDeep'
import _merge from 'lodash/merge'
import defaultPic from '../../../static/icon/default-pic.svg';
import '../../../components/m5/style/components/icon.scss';
import './index.scss'

const { errorHandle } = utils;

export default function assessPage(){
  
  const [ briefInfo, setBriefInfo ] = useState({});
  const [ projectRole, setProjectRole ] = useState(6);
  const [ loading, setLoading ] = useState(true);
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
          setBriefInfo(briefInfo);
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

  function handlePreviewFile(url, name){
    const extensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];

    let fileType = name.slice(name.lastIndexOf('.')+1);
    if( extensions.includes(fileType) ){
      Taro.downloadFile({
        url: url.replace('s3plus.vip.sankuai.com', 's3plus.sankuai.com'),
        success: function (res) {
          var filePath = res.tempFilePath
          Taro.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            },
            fail: function(res){
              console.log(res);
            }
          })
        }
      });
      return;
    }

    Taro.showModal({
      content: '暂不支持该格式预览，请至PC端查看',
      showCancel: false
    })
   
  }

  function handleStartAssess(){
    console.log('sdsdsd');
    Taro.navigateTo({
      url: `/pages/assess/detail/index?projectId=${projectId}&roundId=${roundId}`,
    })
  }

  console.log('briefInfo',briefInfo);
  console.log('curEvalObj',curEvalObj);
  const coverPic = briefInfo.pic ? `${briefInfo.pic.replace('/w.h/', '/')}@416w_592h_1e_1c` : defaultPic;
  return (
    <View className="assess-page-welcome">
      <View className="content-container">
        <View className="briefinfo-wrap">
          <Image className="project-pic" src={coverPic}></Image>
          <View className="project-name">《{briefInfo.name}》</View>
          <View className="project-round">第{curEvalObj.round}轮 / 剧本评估</View>
          <View className="project-creator">{curEvalObj.initiator} {curEvalObj.startDate}</View>
        </View>

        <View className="evaluation-info-wrap">
          <View className="round-title">{curEvalObj.roundTitle}</View>
          <View className="project-file-wrap">
            {
              (briefInfo.projectFile || []).map(item=>{
                return (
                  <View className="file-item" onClick={()=>{handlePreviewFile(item.url, item.title)}}>
                    <View className="logo"></View>
                    <View className="file-info-wrap">
                      <View className="file-name">{item.title}</View>
                    </View>
                    <View className='at-icon at-icon-chevron-right'></View>
                  </View>
                )
              })
            }
          </View>
        </View>
        
        <Button className="start-btn" onClick={handleStartAssess}>开始评估</Button>
      </View>
      
      </View>
  );
}

