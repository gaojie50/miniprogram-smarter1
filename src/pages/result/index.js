import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, } from '@tarojs/components';
import { get as getGlobalData } from '../../global_data';
import ProjectInfo from '../../components/projectInfo';
import CoreSection from '../../components/coreSection';
import OperationFooter from '../../components/operationFooter';
import './index.scss';

const reqPacking = getGlobalData('reqPacking');
const isLeader = id => [1, 3, 5].includes(id);
export default function Result() {
  const { projectId, roundId } = getCurrentInstance().router.params;
  const [projectRole, setProjectRole] = useState(undefined);
  const [result, setResult] = useState({});
  const [projectEvaluationName, setProjectEvaluationName] = useState('');
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
      url: 'api/management/result',
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

  useEffect(() => {
    fetchRole();
    fetchResult();
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
  } = result;
  const noEvalText = isLeader(projectRole) ? "还没有人发布过评估内容" : "自行填答后，才能看到其他人的评估内容";

  return <View className="result">
    <ProjectInfo setProjectEvaluationName={setProjectEvaluationName} projectId={projectId} roundId={roundId} />
    <View className="result-cont">
      {
        !evaluated && !isLeader(projectRole) ? <View className="tip">为了保证评估客观公正，您需填答后才能看到他人的评估内容</View> : ""
      }
      <View className="h2">{projectEvaluationName}</View>

      {
        evaluated || (isLeader(projectRole) && participantNumber != 0) ?
          <View  className="result-comp-box">
            {coreExist ?
              <CoreSection
                core={core}
                categoryType={categoryType} /> :
              ""}
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

    <OperationFooter evaluated={evaluated} />
  </View>
}