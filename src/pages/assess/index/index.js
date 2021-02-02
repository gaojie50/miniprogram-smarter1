import { View, Button, Input, Textarea, Text, Block, Image } from '@tarojs/components'
import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import reqPacking from '../../../utils/reqPacking.js';
import utils from '../../../utils/index';
import _cloneDeep from 'lodash/cloneDeep'
import _merge from 'lodash/merge'
import defaultPic from '../../../static/icon/default-pic.svg';
import { set as setGlobalData, get as getGlobalData } from '../../../global_data'
import '../../../components/m5/style/components/icon.scss';
import './index.scss'

const { errorHandle, hexColorToRgba } = utils;

export default function assessPage(){
  
  const [ briefInfo, setBriefInfo ] = useState({});
  const [ projectRole, setProjectRole ] = useState(6);
  const [ loading, setLoading ] = useState(true);
  const [ curEvalObj, setCurEvalObj ] = useState({});

  const { projectId, roundId } = getCurrentInstance().router.params;
  const capsuleLocation = getGlobalData('capsuleLocation');
  const {statusBarHeight} = getGlobalData('systemInfo');
  const titleHeight= Math.floor(
    capsuleLocation.bottom + capsuleLocation.top - statusBarHeight*2,
  );

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

  function navigateBack(){
    let curPages = Taro.getCurrentPages();
    if(curPages.length>1){
      Taro.navigateBack();
    }else{
      Taro.navigateTo({
        url: `/pages/list/index?projectId=${projectId}`
      })
    }
    
  }

  
  const { projectFile=[], backColor='#fff', name='', pic } = briefInfo;
  const { round, initiator, startDate, roundTitle } = curEvalObj;

  const projectPic = pic ? `${pic.replace('/w.h/', '/')}@416w_592h_1e_1c` : '';
  const coverPic = projectPic ? projectPic : defaultPic;
  const rgbColor = hexColorToRgba(backColor,0.9);
  
  return (
    <View className="assess-page-welcome" style={{backgroundImage: `url(${projectPic})`}}>
      <View className="all-container"  style={{backgroundColor: `${rgbColor}`}}>

        <View style={{height:`${statusBarHeight}px`}}></View>
        <View className="nav-bar" style={{height: `${titleHeight}px`}} onClick={navigateBack}>
          <View className="go-back-icon at-icon at-icon-chevron-left"></View>
        </View>

        <View className="content-container">
        <View className="briefinfo-wrap">
          <Image className="project-pic" src={coverPic}></Image>
          <View className="project-name">《{name}》</View>
          <View className="project-round">第{round}轮 / 剧本评估</View>
          <View className="project-creator">{initiator} {startDate}</View>
        </View>

        <View className="evaluation-info-wrap">
          <View className="round-title">{roundTitle}</View>
          <View className="project-file-wrap">
            {
              (projectFile || []).map(item=>{
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
      </View>
  );
}

