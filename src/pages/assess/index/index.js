import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro';
import { View, Button, Input, Textarea, Text, Block, Image } from '@tarojs/components';
import TopBar from '@components/topBar';
import LoginNotice from '@components/loginNotice';
import NoAccess from '@components/noAccess';
import dayjs, { Dayjs } from 'dayjs';
import reqPacking from '../../../utils/reqPacking.js';
import utils from '../../../utils/index';
import _cloneDeep from 'lodash/cloneDeep';
import _merge from 'lodash/merge';
import { set as setGlobalData, get as getGlobalData } from '../../../global_data';
import projectConfig from '../../../constant/project-config';
import '../../../components/m5/style/components/icon.scss';
import './index.scss';

const { errorHandle, hexColorToRgba, previewFile } = utils;
const { getEvaluationLabel, getEvaluationIcon } = projectConfig;
const AUTH_ID = 95130;

export default function assessPage(){
  
  const [ briefInfo, setBriefInfo ] = useState({});
  const [ projectRole, setProjectRole ] = useState(6);
  const [ curEvalObj, setCurEvalObj ] = useState({});
  const [ didAssessed, setDidAssessed ] = useState(false);  // 是否评估过
  const [ canEvaluate, setCanEvaluate ] = useState(false);
  const [ hasPermission, setHasPermission ] = useState(false);
  
  const isLogin = Taro.getStorageSync('token');
  const { projectId, roundId, inviteId, participationCode } = getCurrentInstance().router.params;
  const capsuleLocation = getGlobalData('capsuleLocation');
  const {statusBarHeight} = getGlobalData('systemInfo');
  const titleHeight= Math.floor(
    capsuleLocation.bottom + capsuleLocation.top - statusBarHeight*2,
  );
  
  useDidShow(()=>{
    ( async ()=>{
      if(isLogin){
        const authInfo = Taro.getStorageSync('authinfo');
        if( authInfo?.authIds?.includes(AUTH_ID)){
          setHasPermission(true);
          fetchData()
        }
      }
    })()
  })

  const fetchData = async () => {
    Taro.showLoading({
      title: '评估权限获取中'
    })
    const statusData = await fetchAccessStatus();
    const { hasAssess, hasCodeInput } = statusData;
    if( hasCodeInput ){
      setDidAssessed( hasAssess );
    }else{
      const assessData = await setAssessPermission();

      setDidAssessed( assessData?.hasAssess );
    }
    fetchRole();
    fetchBrifInfo();
    fetchEveluationList();
  }

  const fetchAccessStatus = () => {
    return new Promise((resolve, reject)=>{
      reqPacking(
        {
          url: 'api/management/inviteInfo',
          data: { 
            inviteId,
          },
        },
        'server',
      ).then(res => {
          const { data, success, error } = res;
          if (success) {
            resolve( data );
          }
          
          if (error){
            errorHandle(error);
            reject(error);
          } 
        });
    })
  } 

  const setAssessPermission = () => {
    return new Promise((resolve, reject)=>{
      reqPacking(
        {
          url: 'api/management/assessmentLink',
          data: { 
            inviteId,
            participationCode
          },
        },
        'server',
      ).then(res => {
        const { data, success, error } = res;
        if (success) {
          resolve(data);
        }
        if (error){
          errorHandle(error); 
          reject(error);
        } 
      });
    })
  }

  const setPermission = () => {
    reqPacking(
      {
        url: 'api/management/assessmentLink',
        data: { 
          inviteId,
          participationCode
        },
      },
      'server',
    ).then(res => {
      const { data, success, error } = res;
      if (success) {
        setDidAssessed(data.hasAssess);
      }
      if (error) errorHandle(message);
    });
  }


  const fetchRole = () => {
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

  const fetchBrifInfo = () =>{
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
      })
  }

  const fetchEveluationList = () => {
    Taro.showLoading({title: '加载中'});
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
          const evalObj = evaluationList.filter(item => item.roundId == roundId)[ 0 ] || {};
          if( !evalObj.round ){
            errorHandle({ message: '该评估轮次不存在' });
            setCanEvaluate(false);
          }else{
            setCanEvaluate(true);
          }
          setCurEvalObj(evalObj);
          return;
        }
        error.message && errorHandle(error);
        setCanEvaluate(false);
      }).finally(()=>{
        Taro.hideLoading();
      })
  }

  const handleStartAssess = () => {

    if(projectRole === 6){
      Taro.showModal({
        title: '提示',
        content: '对不起，您没有评估权限，请确认权限后再评估'
      });
      return;
    }

    if(didAssessed){
      Taro.redirectTo({
        url: `/pages/result/index?projectId=${projectId}&roundId=${roundId}`,
      })
    }else{
      Taro.navigateTo({
        url: `/pages/assess/detail/index?projectId=${projectId}&roundId=${roundId}`,
      })
    }
  }

  const handleBack = () => {
    if(Taro.getCurrentPages().length>1){
      Taro.navigateBack();
    }else{
      Taro.redirectTo({
        url: `/pages/detail/index?projectId=${projectId}`
      })
    }
  }

  
  const { projectFile=[], backColor, name='', pic, categoryType } = briefInfo;
  const { round, initiator, startDate, roundTitle } = curEvalObj;
  const defaultPicUrl = 'https://obj.pipi.cn/festatic/common/image/90f5be009a6f7852f14f9553a14a3e35.png';
  const projectPic = pic ? `${pic.replace('/w.h/', '/')}@416w_592h_1e_1c` : defaultPicUrl;
  const coverPic = projectPic ? projectPic : defaultPicUrl;
  const rgbColor = hexColorToRgba(backColor||'#475975',0.9);


  return (
    <View className="assess-page-welcome" style={{backgroundImage: `url(${projectPic})`}}>
      <View className="bg-color" style={{backgroundColor: `${rgbColor}`}} />
      <TopBar background="transparent" hasBack={isLogin?true:false} onBack={ handleBack } />
      {!isLogin && (
        <LoginNotice target={`/pages/assess/index/index?projectId=${projectId}&roundId=${roundId}`} />
      )}
      {
       isLogin && !hasPermission && (
        <NoAccess title="暂无评估权限" />
       )
      }
      { isLogin && hasPermission && (
        <View className="all-container" style={{height: `calc(100vh - ${(titleHeight+statusBarHeight)}px)`}}>
          <View className="content-container">
          <View className="briefinfo-wrap">
            <Image className="project-pic" src={coverPic}></Image>
            {name && <View className="project-name">《{name}》</View>}
            {round && <View className="project-round">第{round}轮 / {getEvaluationLabel(categoryType)}</View>}
            { initiator && <View className="project-creator">{initiator} {dayjs(startDate).format('YYYY-MM-DD HH:mm')}</View>}
          </View>

          <View className="evaluation-info-wrap">
            <View className="round-title">{roundTitle}</View>
            <View className="project-file-wrap">
              {
                (projectFile || []).map(item=>{
                  return (
                    <View className="file-item" onClick={()=>{previewFile(item.url, item.title)}}>
                      <Image className="logo" src={getEvaluationIcon(categoryType)} />
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
          
          {canEvaluate && <Button className="start-btn" onClick={handleStartAssess}>{!didAssessed? '开始评估': '您已填写，查看结果'}</Button>}
        </View>
      </View>
      )}
      </View>
  );
}

