import { Block, View, Image, Text, ScrollView } from '@tarojs/components';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import './history.scss';
import utils from '../../utils';
import reqPacking from '../../utils/reqPacking'
import NoData from '../../components/noData';

const { formatNumber } = utils;

const UNITS = {
  '猫眼份额': '%',
  '制作成本': formatNumber,
  '宣发费用': formatNumber,
  '猫眼投资成本': formatNumber,
  '预估票房': formatNumber,
}

const NO_AUTH_MESSAGE = '您没有该项目管理权限';

export function EvaluationList(props) {
  const [data, setData] = useState([]);
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

  return  projectId ? (!auth ? 'Ok' : <Text className="no-auth-text">{NO_AUTH_MESSAGE}</Text>) : null
}


function PureReq_EvaluationList({ projectId }) {
  return reqPacking(
    {
      url: 'api/management/projectoperatelog',
      data: {
        projectId
      }
    },
    'server',
  ).then((res) => res)
}

function onHandleResponse(res) {
  const { success, data, error } = res;
  if (success) return data;
  return error;
}
