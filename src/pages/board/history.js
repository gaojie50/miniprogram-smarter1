import { Block, View, Image, Text, ScrollView } from '@tarojs/components';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import M5Timeline from '../../components/m5/timeline'
import '../../components/m5/style/components/timeline.scss';
import './history.scss';

import reqPacking from '../../utils/reqPacking'

export function UseHistory(props) {
  const [data, setData] = useState([]);
  const { projectId } = props;

  useEffect(() => {
    if (projectId) {
      PureReq_Projectoperatelog({
        projectId
      }).then((d) => setData(d))
    }
  }, [projectId])

  return  projectId ? <ChangeHistory data={data} /> : null
}

export function useChangeHistory(projectId) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (projectId) {
      PureReq_Projectoperatelog({
        projectId
      }).then((d) => setData(d))
    }
  }, [projectId])

  return {
    component: projectId ? <ChangeHistory data={data} /> : null
  }
}

export function ChangeHistory(props) {
  const { data = [] } = props;

  const validData = useMemo(() => {
    return data.map((item) => {
      const {
        filedName,
        newFiledValue,
        oldFiledValue,
        updateTime,
        operateAppendMessage,
        updateType,
      } = item;

      const time = new Date(updateTime);
      let username = '';
      try {
        const obj = JSON.parse(operateAppendMessage);
        username = obj.userName;
      } catch (e) {

      }
      
      const str = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
      
      return (
        {
          title: `${username} 添加于${str}`,
          content: [
            <ChangeCard title={filedName} pre={oldFiledValue || '-'} cur={newFiledValue || '-'} />
          ]
        }
      )
    })
  }, [data])

  return (
    <M5Timeline
      pending
      items={validData}
    />
  )
}

export function ChangeCard(props) {
  const { title = '-', pre = '-', cur = '-', isDate = false  } = props;
  return (
    <View className="change-card">
      <View className="change-card-title">
        {title}
      </View>
      <View className="change-card-wrapper">
        <View className="change-card-pre">
          <View className="change-card-pre-symbol">
            前
          </View>
          <View className={`change-card-pre-content`}>
            {/* <Text style={isDate ? { fontFamily: 'MaoYanHeiTi-H1' } : {}}>
              {pre}
            </Text> */}
            {pre}
        </View>
        </View>
        <View className="change-card-cur">
          <View className="change-card-cur-symbol">
            后
          </View>
          <View className={`change-card-cur-content`}>
            <Text style={isDate ? { fontFamily: 'MaoYanHeiTi-H1' } : {}}>
              {cur}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

function PureReq_Projectoperatelog({ projectId }) {
  return reqPacking(
    {
      url: 'api/management/projectoperatelog',
      data: {
        projectId
      }
    },
    'server',
  ).then((res) => onHandleResponse(res))
}

function onHandleResponse(res) {
  const { success, data, error } = res;
  if (success) return data;
  return [];
}
