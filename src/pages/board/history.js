import { View, Image, Text } from '@tarojs/components';
import React, { useEffect, useMemo, useState } from 'react';
import { noDataPic, beforeIcon, afterIcon } from '@utils/imageUrl';
import M5Timeline from '../../components/m5/timeline'
import '../../components/m5/style/components/timeline.scss';
import './history.scss';
import utils from '../../utils';
import reqPacking from '../../utils/reqPacking'

const { formatNumber } = utils;

const UNITS = {
  '猫眼份额': '%',
  '预估评分': '分',
  '评估得分': '分',
  '制作成本': formatNumber,
  '宣发费用': formatNumber,
  '猫眼投资成本': formatNumber,
  '预估票房': formatNumber,
  '猫眼发行代理费' : formatNumber,
  '总发行代理费': formatNumber,
  '猫眼发行代理费': formatNumber,
  '主创分红': formatNumber,
  '猫眼份额转让收入': formatNumber,
  '宣发费用中猫眼票补收入': formatNumber,
  '宣发费用中猫眼平台资源收入': formatNumber,
  '其它收入': formatNumber,
}
const HAS_YUAN = {
  '制作成本': true,
  '宣发费用': true,
  '猫眼投资成本': true,
}

const NO_AUTH_MESSAGE = '您没有该项目管理权限';

export function UseHistory(props) {
  const [data, setData] = useState([]);
  const [auth, setAuth] = useState(false);
  const [hasData, setHasData] = useState(false);
  const { projectId, keyData, judgeData, queryType } = props;

  useEffect(() => {
    if (projectId) {
      PureReq_Projectoperatelog({
        projectId,
        queryType
      }).then((res) => {
        setHasData(true);
        const { success, data, error } = res;
        if (success) {
          setData(data);
          setAuth(true);
          judgeData && judgeData(data, 'history');
        } else {
          if (error && error.message === NO_AUTH_MESSAGE) {
            setAuth(false);
          }
        }
      })
    }
  }, [projectId, keyData])

  return projectId ? (auth ? data.length ? <ChangeHistory data={data} /> : (
    <View className="no-eval-data">
      <Image src={noDataPic} alt=""></Image>
      <View className="text">暂无变更历史</View>
    </View>
  ) : <Text className="no-auth-text">{hasData ? NO_AUTH_MESSAGE :''}</Text>) : null
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
      } = item;

      const time = new Date(updateTime);
      let username = '-';
      try {
        const obj = JSON.parse(operateAppendMessage);
        username = obj.userName || '-';
      } catch (e) {

      }
      const d = time.getDate();
      const h = time.getHours();
      const m = time.getMinutes();
      const s = time.getSeconds();
      const str = `${time.getFullYear()}-${time.getMonth() + 1}-${d < 10 ? `0${d}` : d} ${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`

      let oStr1 = oldFiledValue;
      let oStr2 = newFiledValue;
      let isDate = false;
      if (filedName === '上映信息') {
        const obj1 = JSON.parse(oldFiledValue || '{}');
        const obj2 = JSON.parse(newFiledValue || '{}');

        oStr1 = obj1.startShowDate !== undefined && obj1.startShowDate !== 0 ? `${obj1.startShowDate}`.replace(/^(\d{4})(\d{2})(\d{2})$/, ($1, $2, $3, $4) => `${$2}.${$3}.${$4}`) : '-';
        oStr2 = obj2.startShowDate !== undefined && obj2.startShowDate !== 0 ? `${obj2.startShowDate}`.replace(/^(\d{4})(\d{2})(\d{2})$/, ($1, $2, $3, $4) => `${$2}.${$3}.${$4}`) : '-';
        isDate= true;
      }

      if (typeof UNITS[filedName] === 'function') {
        if (oStr1) {
          const rsl = UNITS[filedName]( filedName === '预估票房' ? Number(oStr1) / 100  : Number(oStr1) * 10000, 'floor');
          if (rsl) {
            oStr1 = `${rsl.num} ${rsl.unit}${HAS_YUAN[filedName] ? '元' : ''}`;
          }
        }

        if (oStr2) {
          const rsl = UNITS[filedName]( filedName === '预估票房' ? Number(oStr2) / 100 : Number(oStr2) * 10000, 'floor');
          if (rsl) {
            oStr2 = `${rsl.num} ${rsl.unit}${HAS_YUAN[filedName] ? '元' : ''}`;
          }
        }
      }

      if (typeof UNITS[filedName] === 'string') {
        if (oStr1) {
          oStr1 = `${oStr1} ${UNITS[filedName]}`;
        }

        if (oStr2) {
          oStr2 = `${oStr2} ${UNITS[filedName]}`;
        }
      }
      
      return (
        {
          title: `${username} 添加于${str}`,
          content: [
            <ChangeCard title={filedName || '-'} pre={oStr1 || '-'} cur={oStr2 || '-'} isDate={isDate} />
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
          <View className="change-card-pre-symbol" style={{backgroundImage: `url(${beforeIcon})`}} />
          <View className={`change-card-pre-content ${pre === '-' || !pre ? 'change-card-pre-content-no-line' : ''}`}>
            <Text style={isDate ? { fontFamily: 'MaoYanHeiTi-H1' } : {}}>
              {pre}
            </Text>
        </View>
        </View>
        <View className="change-card-cur">
          <View className="change-card-cur-symbol" style={{backgroundImage: `url(${afterIcon})`}} />
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

function PureReq_Projectoperatelog({ projectId, queryType }) {
  return reqPacking(
    {
      url: 'api/management/projectoperatelog',
      data: {
        projectId,
        queryType: queryType || ''
      }
    },
    'server',
  ).then((res) => res)
}
