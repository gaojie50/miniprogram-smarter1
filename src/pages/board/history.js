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
      let username = '-';
      try {
        const obj = JSON.parse(operateAppendMessage);
        username = obj.userName;
      } catch (e) {

      }
      const d = time.getDate();
      const h = time.getHours();
      const m = time.getMinutes();
      const s = time.getSeconds();
      const str = `${time.getFullYear()}-${time.getMonth() + 1}-${d < 10 ? `0${d}` : d} ${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`

      let oStr1 = oldFiledValue || '-';
      let oStr2 = newFiledValue || '-';
      let isDate = false;
      if (filedName === '上映信息') {
        const obj1 = JSON.parse(oldFiledValue || '{}');
        const obj2 = JSON.parse(newFiledValue || '{}');

        oStr1 = obj1.startShowDate ? `${obj1.startShowDate}`.replace(/^(\d{4})(\d{2})(\d{2})$/, ($1, $2, $3, $4) => `${$2}.${$3}.${$4}`) : '-';
        oStr2 = obj2.startShowDate ? `${obj1.startShowDate}`.replace(/^(\d{4})(\d{2})(\d{2})$/, ($1, $2, $3, $4) => `${$2}.${$3}.${$4}`) : '-';
        isDate= true;
      }
      
      return (
        {
          title: `${username} 添加于${str}`,
          content: [
            <ChangeCard title={filedName || '-'} pre={oStr1} cur={oStr2} isDate={isDate} />
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
            <Text style={isDate ? { fontFamily: 'MaoYanHeiTi-H1' } : {}}>
              {pre}
            </Text>
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
