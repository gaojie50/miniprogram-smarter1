import Taro,{useShareAppMessage} from '@tarojs/taro';
import { Block, View, Image, Text, ScrollView, Button } from '@tarojs/components';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import NoFollow from '@static/detail/noFollows.png';
import './evaluate.scss';
import utils from '../../utils';
import reqPacking from '../../utils/reqPacking'
import NoData from '../../components/noData';

const { formatNumber } = utils;

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
  const { projectId, keyData, judgeData } = props;

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
        evaluationList.length ? evaluationList.map((item) => <EvalutaionCard {...item} projectRole={projectRole} projectId={data.projectId} category={data.category}/>) : (
          <>
            <View className="no-eval-data" style={{backgroundColor: '#ffffff'}}>
              <Image src={NoFollow} alt=""></Image>
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
    estimateBox, estimateScore, initiator = '-', projectId, roundId, pic,
    hasAssess, invitees,
    projectRole,
  } = props;

  const timeStr = useMemo(() => {
    if (!startDate) return '-'
    const time = new Date(startDate);
    const d = time.getDate();
    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    const str = `${time.getFullYear()}-${time.getMonth() + 1}-${d < 10 ? `0${d}` : d} ${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
    return str;
  }, [startDate])
  

  const arr = useMemo(() => {
    let __arr  = [
      {
        title: '参与人数',
        value: '-',
        unit: '',
      }
    ]
    if (participantNumber) {
      __arr[0].value = participantNumber;
      __arr[0].unit = '人';
    }
    
    if( category === TYPE_MOVIE ) {
      __arr = __arr.concat([
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
      ])
      if (estimateBox) {
        const rsl = formatNumber(Number(estimateBox), 'floor');
        if (rsl) {
          __arr[1].value = rsl.num;
          __arr[1].unit = rsl.unit;
        }
      }
      if (estimateScore) {
        __arr[2].value = estimateScore;
        __arr[2].unit = '分';
      }
    } else {
      __arr = __arr.concat([
        {
          title: '评估总得分',
          value: '-',
          unit: '',
        },
      ])
      if (evaluationTotalScore) {
        __arr[1].value = evaluationTotalScore;
        __arr[1].unit = '分';
      }
    }
    
    return __arr;
  }, [participantNumber, estimateBox, estimateScore])

  useEffect(() => {
    const { userInfo } = Taro.getStorageSync('authinfo');
    setRealName(userInfo.realName);
  }, [])

  
  useShareAppMessage(({ target, from }) => {
    if (from != 'button') return;

    const { userInfo } = Taro.getStorageSync('authinfo');
    const { dataset } = target;
    const { realName = "" } = userInfo;



    switch (dataset.sign) {
      case 'invite': {
        return {
          title: `${realName} 邀请您参与《${roundTitle}》项目评估`,
          imageUrl: pic ? pic : 'https://s3plus.meituan.net/v1/mss_e2821d7f0cfe4ac1bf9202ecf9590e67/cdn-prod/file:96011a7c/logo.png',
          path: `/pages/assess/index/index?projectId=${projectId}&roundId=${roundId}`
        };
      };

      case 'attend': {
        return {
          title: `${realName} 分享给您关于《${roundTitle}》项目的报告`,
          path: `/pages/result/index?projectId=${projectId}&roundId=${roundId}`
        }
      }
    }

    return {
      title: '分享报告',
      path: `/pages/result/index?projectId=${projectId}&roundId=${roundId}`,
    }
  })

  const handleJump=(e)=>{
    if( hasAssess || projectRole === 1){
      Taro.navigateTo({ url: `/pages/result/index?projectId=${projectId}&roundId=${roundId}`})
    }else{
      Taro.navigateTo({ url: `/pages/assess/index/index?projectId=${projectId}&roundId=${roundId}`})
    }
  }

  const [statusType, statusText] = useMemo(() => {
    if (hasAssess) {
      let prefix = '';
      if (initiator === realName) prefix = '自己发起 ';
      if (typeof invitees === 'string' && invitees.includes(realName)) {
        prefix = `${initiator}邀评 `;
      }
      return [0, `${prefix}已评估`]
    } else {
      let prefix = '';
      if (initiator === realName) prefix = '自己发起 ';
      if (typeof invitees === 'string' && invitees.includes(realName)) {
        prefix = `${initiator}邀评 `;
      }
      if (invitees) {
        return [1, `${prefix}未评估`]
      } else {
        return [2, `${prefix}未评估`]
      }
    }
  }, [hasAssess, initiator, realName]);

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
            {timeStr}
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
        <Button
          data-sign="invite"
          openType="share"
          className="evaluation-card-action-btn">
          邀请参与
        </Button>
        <Button
          data-sign="attend"
          openType="share"
          className="evaluation-card-action-btn">
          分享结果
        </Button>
        {
          statusType !== 0 && <Button
            className="evaluation-card-action-btn evaluation-card-action-btn-eval"
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/assess/index/index?projectId=${projectId}&roundId=${roundId}`,
              })
            }}
            >
             去评估
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
