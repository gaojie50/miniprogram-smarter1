import { Block, View, Image, Text, ScrollView } from '@tarojs/components';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import './evaluationList.scss';
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

export function EvaluationList(props) {
  const [data, setData] = useState({});
  const [auth, setAuth] = useState(false);
  const { projectId } = props;

  useEffect(() => {
    if (projectId) {
      PureReq_EvaluationList({
        projectId
      }).then((res) => {
        const { success, data, error } = res;
        if (success) {
          setData(data);
          setAuth(true);
        } else {
          if (error && error.message === NO_AUTH_MESSAGE) {
            setAuth(false);
          }
        }
      })
    }
  }, [projectId])

  const [evaluationList] = useMemo(() => {
    const { evaluationList: __evaluationList = [] } = data;
    return [__evaluationList];
  }, [data])

  return  projectId ? (auth ? (
    <View>
      {
        evaluationList.map((item) => <EvalutaionCard {...item} />)
      }
    </View>
  ) : <Text className="no-auth-text">{NO_AUTH_MESSAGE}</Text>) : null
}

function EvalutaionCard(props) {

  const { round = '-', participantNumber, roundTitle, startDate, evaluationMethod, estimateBox, estimateScore, initiator = '-' } = props;

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
    const __arr = [
      {
        title: '参与人数',
        value: '-',
        unit: '',
      },
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
    ];
    if (participantNumber) {
      __arr[0].value = participantNumber;
      __arr[0].unit = '人';
    }
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
    return __arr;
  }, [participantNumber, estimateBox, estimateScore])

  return (
    <View className="evaluation-card">
      <View className="evaluation-card-title">
        <View className="evaluation-card-title-left">
          第{round}轮
        </View>
        <View className="evaluation-card-title-right">
          已评估
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
      <View className="evaluation-card-action">
        <View className="evaluation-card-action-btn">邀请参与</View>
        <View className="evaluation-card-action-btn">分享结果</View>
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

function onHandleResponse(res) {
  const { success, data, error } = res;
  if (success) return data;
  return error;
}
