import React, { useState, useCallback } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { AtFloatLayout } from '../../components/m5';
import { CooperStatus } from './constant';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import Close from '../../static/close.png';
import './cooperStatus.scss';

const reqPacking = getGlobalData('reqPacking');
export default function Cooper(props) {
  const { basicData } = props;
  const [cooperActive, setCooperActive] = useState(basicData.cooperStatus);

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
    <AtFloatLayout className="cooper-status" onClose={() => props.cancelShow()} isOpened>
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
    </AtFloatLayout>
  )
}