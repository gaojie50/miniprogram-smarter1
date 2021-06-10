import Taro from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components';
import React, { useEffect, useMemo, useState } from 'react';
import { noDataPic } from '@utils/imageUrl';
import dayjs from 'dayjs';
import './evaluate.scss';
import utils from '../../utils';
import reqPacking from '../../utils/reqPacking';
import useDeadline from '../assess/detail/useDeadline';

const { formatNumber, isDockingPerson } = utils;

const TYPE = {
  1: '大纲评估',
  2: '剧本评估',
  3: '成片评估',
}

const NO_AUTH_MESSAGE = '您没有该项目管理权限';
const TYPE_MOVIE = 3 || 4;
const DEFAULT_PROJECT_ROLE = 6;

export function EvaluationList(props) {
  const [data, setData] = useState({});
  const [auth, setAuth] = useState(false);
  const [projectRole, setProjectRole] = useState(DEFAULT_PROJECT_ROLE);
  const { projectId, keyData, judgeRole, judgeData } = props;

  useEffect(() => {
    if (projectId) {
      PureReq_EvaluationList({
        projectId
      }).then((res) => {
        const { success, data, error } = res;
        if (success) {
          setData(data);
          setAuth(true);
          judgeData(data, 'evaluation');
        } else {
          if (error && error.message === NO_AUTH_MESSAGE) {
            setAuth(false);
          }
        }
      })

      PureReq_ProjectRole({
        projectId,
      }).then((res) => {
        const { success, data, error } = res;
        if (success) {
          setProjectRole(data?.projectRole || DEFAULT_PROJECT_ROLE);
        }
      })
    }
  }, [projectId, keyData])

  const [evaluationList] = useMemo(() => {
    const { evaluationList: __evaluationList = [] } = data;
    return [__evaluationList];
  }, [data])

  return  projectId ? (auth ? (
    <View>
      {
        evaluationList.length ? evaluationList.map((item) => <EvalutaionCard {...item} projectRole={projectRole} judgeRole={judgeRole} projectId={data.projectId} category={data.category}/>) : (
          <>
            <View className="no-eval-data" style={{backgroundColor: '#ffffff'}}>
              <Image src={noDataPic} alt=""></Image>
              <View className="text">暂无评估记录</View>
            </View>
          </>
        )
      }
    </View>
  ) : <Text className="no-auth-text">{NO_AUTH_MESSAGE}</Text>) : null
}

function EvalutaionCard(props) {
  
  const [realName, setRealName] = useState('');

  const {
    category,
    round = '-', participantNumber,
    roundTitle, startDate, evaluationMethod, evaluationTotalScore,
    estimateBox, estimateScore, initiator = '-', projectId, roundId,
    hasAssess, invitees,
    projectRole,
    judgeRole,
    deadline
  } = props;

  // const timeStr = useMemo(() => {
  //   if (!startDate) return '-'
  //   const time = new Date(startDate);
  //   const d = time.getDate();
  //   const h = time.getHours();
  //   const m = time.getMinutes();
  //   const s = time.getSeconds();
  //   const str = `${time.getFullYear()}-${time.getMonth() + 1}-${d < 10 ? `0${d}` : d} ${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
  //   return str;
  // }, [startDate])
  

  const arr = useMemo(() => {

    let __arr = [];
    let value = '-';
    let unit = '';

    if( isDockingPerson(judgeRole.role) ){ // 是对接人
      let list = [{
        title: '参与人数',
        value,
        unit,
      }];
      if (participantNumber) {
        list[0].value = participantNumber;
        list[0].unit = '人';
      }
      __arr = __arr.concat(list);
    }
   
    
    
    if( category === TYPE_MOVIE ) {
      let list = [
        {
          title: '预估票房',
          value: '-',
          unit: '',
        },
        {
          title: '预估评分',
          value: '-',
          unit: '',
        },
      ]
      if (estimateBox) {
        const rsl = formatNumber(Number(estimateBox), 'floor');
        if (rsl) {
          list[0].value = rsl.num;
          list[0].unit = rsl.unit;
        }
      }
      if (estimateScore) {
        list[1].value = estimateScore;
        list[1].unit = '分';
      }
      __arr = __arr.concat(list);
      
    } else {
      let list = [{
        title: '评估总得分',
        value: '-',
        unit: '',
      }];
      if (evaluationTotalScore) {
        list[0].value = evaluationTotalScore;
        list[0].unit = '分';
      }
      __arr = __arr.concat(list);
    }
    
    return __arr;
  }, [participantNumber, estimateBox, estimateScore])

  useEffect(() => {
    const { userInfo } = Taro.getStorageSync('authinfo');
    setRealName(userInfo.realName);
  }, [])



  const handleJump=()=>{
    Taro.navigateTo({ url: `/pages/result/index?projectId=${projectId}&roundId=${roundId}`});
  }

  const [statusType, statusText] = useMemo(() => {
    if (hasAssess) {
      return [0, '已评估']
    } else {
      let prefix = '';

      if (isDockingPerson(judgeRole.role)) {
        if(deadline && dayjs().valueOf() > deadline) {
          prefix = '未参与'
        } else {
          if(initiator === realName) {
            prefix = '自己发起 ';
          }
        }
        
        return [2, prefix]
      }

      if (judgeInvitee(invitees, realName)) {
        if(deadline && dayjs().valueOf() > deadline) {
          prefix = '未参与'
        } else {
          prefix = <Text style={{color: '#F1303D'}}>邀您评估</Text>;
        }
        
        return [1, prefix]
      }

      return [3, prefix]
    }
  }, [deadline, hasAssess, initiator, invitees, realName]);

  return (
    <View className="evaluation-card">
      <View onClick={handleJump} >
        <View className="evaluation-card-title">
          <View className="evaluation-card-title-left">
            第{round}轮
          </View>
          <View className="evaluation-card-title-right">
            {statusText}
          </View>
        </View>
        <View className="evaluation-card-status">
          <View className="evaluation-card-status-left">
            <View className="evaluation-card-status-left-initiator">
              {initiator}
            </View>
            <View className="evaluation-card-status-left-span">
              发起
            </View>
            <View className="evaluation-card-status-left-type">
              {TYPE[evaluationMethod]}
            </View>
          </View>
          <View className="evaluation-card-status-right">
            {useDeadline(deadline).component}
          </View>
        </View>
        <View className="evaluation-card-info">
        <View className="evaluation-card-info-title">
          {roundTitle}
        </View>
        <View className="evaluation-card-info-detail">
          {
            arr.map(({ title, value, unit }) => (
              <View className="evaluation-card-info-detail-grid">
                <View className="evaluation-card-info-detail-grid-title">
                  {title}
                </View>
                <View className="evaluation-card-info-detail-grid-content">
                  <Text className="evaluation-card-info-detail-grid-content-value">
                    {value}
                  </Text>
                  &nbsp;
                  {unit}
                </View>
              </View>
            ))
          }
        </View>
      </View>
      </View>
      <View className="evaluation-card-action">
      {isDockingPerson(judgeRole.role) && judgeDeadLine(deadline) && <Button
        data-roundTitle={roundTitle}
        data-roundId={roundId}
        data-sign='invite'
        openType='share'
        className='evaluation-card-action-btn'
      >
          邀请参与
        </Button>}
        <Button
          data-roundTitle={roundTitle}
          data-roundId={roundId}
          data-sign="attend"
          openType="share"
          className="evaluation-card-action-btn">
          分享结果
        </Button>
        {
          judgeDeadLine(deadline) && <Button
            className='evaluation-card-action-btn evaluation-card-action-btn-eval'
            onClick={() => {
              Taro.navigateTo({
                url: statusType === 0 ? `/pages/assess/detail/index?projectId=${projectId}&roundId=${roundId}` : `/pages/assess/index/index?projectId=${projectId}&roundId=${roundId}`,
              })
            }}
          >
             {statusType === 0 ? '修改评估' : '去评估' }
        </Button>
        }
      </View>
    </View>
  )
}


function PureReq_EvaluationList({ projectId }) {
  return reqPacking(
    {
      url: `api/management/evaluationList?projectId=${projectId}`,
    },
    'server',
  ).then((res) => res)
}

function PureReq_ProjectRole({ projectId }) {
  return reqPacking(
    {
      url: `api/management/projectRole?projectId=${projectId}`,
    },
    'server',
  ).then((res) => res)
}

function judgeDeadLine(time) {

  return !(time && dayjs().valueOf() > time)
}

function judgeInvitee(invitees, realName) {

  return typeof invitees === 'string' && invitees.includes(realName)
}