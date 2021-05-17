import React, { useEffect, useState } from 'react';
import Taro,{useShareAppMessage} from '@tarojs/taro';
import { View, Text, Button, } from '@tarojs/components';
import reqPacking from '@utils/reqPacking';
import './index.scss';


export default function OperationFooter({ projectId, roundId, evaluated, evalEnd,info, canInvite }) {
  let { name,pic } = info;

  const [ inviteId, setInviteId ] = useState('');
  const [ participationCode, setParticipationCode ] = useState('')
  
  useEffect(()=>{
    getShareMessage(projectId);
  }, [])

  const getShareMessage = (projectId) => {
    reqPacking(
      {
        url: `api/management/shareEvaluation?roundId=${roundId}`,
        method: 'POST'
      },
      'server',
    ).then((res) => {
      const { success, error, data } = res;
      if(success){
        setInviteId( data.inviteId );
        setParticipationCode( data.participationCode );
      }
    })
  }
  
  const goToAssess = () => {
    Taro.navigateTo({
      url: `/pages/assess/index/index?projectId=${projectId}&roundId=${roundId}&inviteId=${inviteId}&participationCode=${participationCode}`,
    })
  }

  useShareAppMessage(({target,from}) => {
    if(from != 'button') return ;

    const {userInfo} = Taro.getStorageSync('authinfo');
    const {dataset} = target;
    const {realName=""} = userInfo;

    switch(dataset.sign){
      case 'invite':{
        return {
          title: `${realName} 邀请您参与《${name}》项目评估`,
          imageUrl: pic,
          path: `/pages/assess/index/index?projectId=${projectId}&roundId=${roundId}&inviteId=${inviteId}&participationCode=${participationCode}`
        };
      };

      case 'attend':{
        return {
          title: `${realName} 分享给您关于《${name}》项目的报告`,
          path: `/pages/result/index?projectId=${projectId}&roundId=${roundId}`
        }
      }
    }

    return {
      title: '分享报告',
      path: `/pages/result/index?projectId=${projectId}&roundId=${roundId}`,
    }
  })


  return <View className="operation-footer">
    {canInvite && <Button
      data-sign="invite"
      openType="share">邀请参与</Button>}
    {evaluated || evalEnd ?
      <Button
        className="attend"
        data-sign="attend"
        openType="share">分享报告</Button> :
      <Text className="attend" onClick={goToAssess}>去评估</Text>
    }
  </View>
}