import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, ScrollView, Block } from '@tarojs/components';
import { get as getGlobalData } from '../../global_data';
import ProjectInfo from '../../components/projectInfo';
import CoreSection from '../../components/coreSection';
import TextEval from '../../components/textEval';
import RadioEval from '../../components/radioEval';
import MatrixRadioEval from '../../components/matrixRadioEval';
import MatrixScaleEval from '../../components/matrixScaleEval';
import OperationFooter from '../../components/operationFooter';
import LoginNotice from '@components/loginNotice';
import utils from '@utils/index';
import { picFn } from '@utils/pic';
import FingerPrint from '@utils/fingerprint';
import './index.scss';

const { isDockingPerson } = utils;
const reqPacking = getGlobalData('reqPacking');
const isLeader = id => [1, 3, 5].includes(id);

export default function Result() {
  const { projectId, roundId } = getCurrentInstance().router.params;
  const [projectRole, setProjectRole] = useState(undefined);
  const [judgeRole, setJudgeRole] = useState(undefined);
  const [result, setResult] = useState({});
  const [info, setInfo] = useState({});
  const [projectEvaluationName, setProjectEvaluationName] = useState('');
  const isLogin = Taro.getStorageSync('token');
  const [stopScroll, setStopScroll] = useState(false);
  const [resultPageTextTitleEditingGuideState, setResultPageTextTitleEditingGuideState] = useState(Taro.getStorageSync('ResultPageTextTitleEditingGuide'));
  const fetchJudgeRole = () => {
    reqPacking({
      url: 'api/management/judgeRole',
      data: { projectId },
      method: 'GET',
    })
      .then(res => {
        const { success, data = {}, error } = res;
        const { role } = data;

        if (success) return setJudgeRole(role);

        Taro.showToast({
          title: error.message,
          icon: 'none',
          duration: 2000
        });
      });
  }

  const fetchRole = () => {
    reqPacking({
      url: 'api/management/projectRole',
      data: { projectId },
      method: 'GET',
    })
      .then(res => {
        const { success, data = {}, error } = res;
        const { projectRole } = data;

        if (success) return setProjectRole(projectRole);

        Taro.showToast({
          title: error.message,
          icon: 'none',
          duration: 2000
        });
      });
  };

  const fetchResult = () => {
    reqPacking({
      url: 'api/applet/management/result',
      data: {
        projectId,
        roundId,
      },
      method: 'GET',
    })
      .then(res => {
        const { success, data = {}, error } = res;

        if (success) return setResult(data);

        Taro.showToast({
          title: error.message,
          icon: 'none',
          duration: 2000
        });
      });
  };

  const fetchInfo = () => {
    Promise.all([
      reqPacking({
        url: 'api/management/evaluationList',
        data: { projectId },
        method: 'GET',
      }),
      reqPacking({
        url: 'api/applet/management/briefInfo',
        data: { projectId, roundId },
        method: 'GET',
      })
    ]).then(resList => {
      const { success, data = {}, error } = resList[0];
      const { pic, userId } = resList[1].data;

      if (success) {
        const { evaluationList = [], name } = data;
        const { roundTitle = "", round, participantNumber, evaluationMethod } = evaluationList.filter(item => item.roundId == roundId)[0];
        setProjectEvaluationName(roundTitle);

        return setInfo({
          name,
          round,
          participantNumber,
          evaluationMethod,
          userId,
          pic: pic ? picFn(pic) : 'https://s3plus.meituan.net/v1/mss_e2821d7f0cfe4ac1bf9202ecf9590e67/cdn-prod/file:96011a7c/cover.png',
        });
      }

      Taro.showToast({
        title: error && error.message,
        icon: 'none',
        duration: 2000
      });
    })
  }

  useEffect(() => {
    fetchJudgeRole();
    fetchRole();
    fetchResult();
    fetchInfo();
  }, []);

  if (projectRole == 6) return <View className="no-permission">
    <View className="title">暂无权限</View>
    <View className="content">抱歉，您暂无该项目评估权限</View>
  </View>

  const {
    evaluated,
    resultList = [],
    participantNumber,
    coreExist,
    categoryType,
    core = {},
    deadLine,
  } = result;
  const noEvalText = isLeader(projectRole) ? "还没有人发布过评估内容" : "自行填答后，才能看到其他人的评估内容";
  const showParticipantNumber = isDockingPerson(judgeRole);

  const hadFreeTime = deadLine ? +new Date() >= deadLine : false;
  const permissions = hadFreeTime && [1, 2, 3].includes(projectRole);
  const [evalEnd, setEvalEnd] = useState(hadFreeTime);

  useEffect(() => setEvalEnd(hadFreeTime), [hadFreeTime]);

  return <Block>
    <FingerPrint />
    <ScrollView
      enhanced bounces={false}
      scrollY={!stopScroll}
      className="result"
      style={stopScroll ? { position: 'fixed', width: '100%' } : ""}>
      {!isLogin ? (
        <LoginNotice target={`/pages/result/index?projectId=${projectId}&roundId=${roundId}`} />
      ) : (
        <View style={{'position':'relative','z-index':'2'}}>
          <ProjectInfo
            deadLine={deadLine}
            info={info}
            projectId={projectId}
            roundId={roundId}
            setStopScroll={setStopScroll}
            setEvalEnd={setEvalEnd}
            showParticipantNumber={showParticipantNumber} />
          <View className="result-cont">
            {
              !evaluated && !isLeader(projectRole) ? <View className="tip">为了保证评估客观公正，您需填答后才能看到他人的评估内容</View> : ""
            }
            {
              evaluated && projectRole == 4 ? <View className="tip">当前仅展示您自己的评估内容</View> : ""
            }
            <View className="h2">{projectEvaluationName}</View>

            {
              evaluated || (isLeader(projectRole) && participantNumber != 0) ?
                <View className="result-comp-box">
                  {coreExist ?
                    <CoreSection
                      core={core}
                      projectId={projectId}
                      roundId={roundId}
                      permissions={permissions}
                      categoryType={categoryType} /> :
                    ""}

                  {
                    resultList.map((item, index) => {
                      if (item.type == 1 || item.type == 2) {
                        return <TextEval
                          key={index}
                          resultPageTextTitleEditingGuideState={resultPageTextTitleEditingGuideState}
                          setResultPageTextTitleEditingGuideState={setResultPageTextTitleEditingGuideState}
                          title={item.title}
                          rightText={item?.rightText}
                          projectId={projectId}
                          roundId={roundId}
                          questionNum={index + (coreExist ? 2 : 1)}
                          texts={item.texts || []}
                          appendContent={!!item?.appendContent}
                          summaryText={item?.summaryText || ""}
                          isTopic={item.type == 2}
                          permissions={permissions}
                          type={item.type}
                          questionId={item.id}
                        />;
                      }

                      if (item.type == 3) {
                        return <MatrixRadioEval
                          key={index}
                          title={item.title}
                          questionNum={index + (coreExist ? 2 : 1)}
                          matrixRadios={item.matrixRadios}
                        />;
                      }

                      if (item.type == 4) {
                        return <RadioEval
                          key={index}
                          title={item.title}
                          questionNum={index + (coreExist ? 2 : 1)}
                          radios={item.radios}
                        />;
                      }

                      if (item.type == 5) {
                        return <MatrixScaleEval
                          key={index}
                          title={item.title}
                          questionNum={index + (coreExist ? 2 : 1)}
                          matrixScales={item.matrixScales}
                        />;
                      }

                      return null;
                    })
                  }
                </View> :
                <View>
                  {
                    coreExist && <View>
                      <View className="h5">1、核心数据</View>
                      <View className="p">{noEvalText}</View>
                    </View>
                  }
                  {
                    resultList.map((item, index) => <View key={index}>
                      <View className="h5">{index + (coreExist ? 2 : 1)}、{item.title}</View>
                      <View className="p">{noEvalText}</View>
                    </View>)
                  }
                </View>
            }

          </View>

          <OperationFooter
            info={info}
            projectId={projectId}
            roundId={roundId}
            evaluated={evaluated}
            evalEnd={evalEnd}
            canInvite={isDockingPerson(judgeRole)}
          />
        </View>
      )}

    </ScrollView>
  </Block>
}