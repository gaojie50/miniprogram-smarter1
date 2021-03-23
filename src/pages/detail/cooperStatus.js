import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
// import { AtFloatLayout } from '@components/m5';
import FloatCard from '@components/m5/float-layout';
import { CooperStatus } from './constant';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import Close from '@static/close.png';
import './cooperStatus.scss';

const reqPacking = getGlobalData('reqPacking');
export default function Cooper(props) {
  const { basicData, show } = props;
  const [cooperActive, setCooperActive] = useState(basicData.cooperStatus);

  useEffect(() => {
    if(basicData.projectId) {
      setCooperActive(basicData.cooperStatus)
    }
  },[basicData])

  const submit = useCallback(() => {
    reqPacking({
      url: '/api/management/setStatus',
      data: {
        projectId: basicData.projectId,
        cooperStatus: cooperActive
      },
      method: 'POST'
    })
    .then(res => {
      if(res.success) {
        props.fetchBasicData();
        props.cancelShow();
      }
    })
  }, [cooperActive]) 

  return (
    <FloatCard className="cooper-status" onClose={() => props.cancelShow()} isOpened={show}>
      <View className="title">
        <Text>变更合作状态</Text>
        <View className="img" onClick={() => props.cancelShow()}>
          <Image src={Close} alt=""></Image>
        </View>
      </View>
      <View className="cooper-item">
        {
          CooperStatus.map((item, index) => {
            return <Text 
              style={ { 
                background: cooperActive === index ? item.activeColor : item.bgColor, 
                color: (cooperActive === index && index < 3) ? '#FFFFFF' : item.statusColor 
              } } 
              className={ cooperActive === index ? 'item active' : 'item' } 
              key={ index } 
              onClick={ () => setCooperActive(index) }
              >
                {item.name}
              </Text>;
          })
        }
      </View>
      <View className="confirm" onClick={submit}>确定</View>
    </FloatCard>
  )
}