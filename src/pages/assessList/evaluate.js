import Taro from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components';
import React, { useEffect, useMemo, useState } from 'react';
import { noDataPic } from '@utils/imageUrl';
import dayjs from 'dayjs';
import './evaluate.scss';
import utils from '../../utils';
// import reqPacking from '../../utils/reqPacking'

const { formatNumber, isDockingPerson } = utils;

const TYPE = {
  1: '大纲评估',
  2: '剧本评估',
  3: '成片评估',
}

const test = {evaluationList: [
  {
    "roundId": 6,
    "round": 4,
    "roundTitle": "《离天空这么近》项目第4轮评估",
    "roundDesc": "《离天空这么近》项目第4轮评估",
    "estimateBox": 1325000000,
    "estimateScore": 5,
    "evaluationTotalScore": 33,
    "participantNumber": 2,
    "invitees": "刘娟",
    "hasAssess": false,
    "evaluationMethod": 1,
    "projectFileTitle": [
      "测试.csv",
      "测试.csv",
      "7508.mp4"
    ],
    "startDate": 1614686114000,
    "initiator": "兰厅",
    "projectId": 12345,
    "name": "离天空这么近离天空这么近离天空这么近",
    "evaluationRole": 1,
    "category": 3,
    "evaluationTimes": 4,
    "imageUrl": "http://p0.meituan.net/w.h/movie/2691e395bb04c937cdfc9dd20d2dfcb436337.jpg",
    "deadline": 1622189490000,
    "role": 1,
    "projectRole": 1
  },
  {
    "roundId": 6,
    "round": 4,
    "roundTitle": "《离天空这么近》项目第4轮评估",
    "roundDesc": "《离天空这么近》项目第4轮评估",
    "estimateBox": 1325000000,
    "estimateScore": 5,
    "evaluationTotalScore": 33,
    "participantNumber": 2,
    "invitees": "兰厅",
    "hasAssess": true,
    "evaluationMethod": 1,
    "projectFileTitle": [
      "测试.csv",
      "测试.csv",
      "7508.mp4"
    ],
    "startDate": 1614686114000,
    "initiator": "刘娟",
    "projectId": 12345,
    "name": "离天空这么近",
    "evaluationRole": 1,
    "category": 6,
    "evaluationTimes": 4,
    "imageUrl": "http://p0.meituan.net/w.h/movie/2691e395bb04c937cdfc9dd20d2dfcb436337.jpg",
    "deadline": 1622189490000,
    "role": 1,
    "projectRole": 1
  }
]}

// const NO_AUTH_MESSAGE = '您没有该项目管理权限';
const TYPE_MOVIE = 3 || 4;
// const DEFAULT_PROJECT_ROLE = 6;

export function EvaluationList() {
  const [data, setData] = useState({});

  useEffect(() => {
    setData(test)
    // reqPacking()
  }, [])

  const [evaluationList] = useMemo(() => {
    const { evaluationList: __evaluationList = [] } = data;
    return [__evaluationList];
  }, [data])

  return <View>
      {
        evaluationList.length ? evaluationList.map((item, index) => <EvalutaionCard key={index} {...item} />) : (
          <>
            <View className='no-eval-data' style={{backgroundColor: '#ffffff'}}>
              <Image src={noDataPic} alt=''></Image>
              <View className='text'>暂无评估记录</View>
            </View>
          </>
        )
      }
    </View>
    
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
    role,
    imageUrl,
    name,
    deadline
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

    let __arr = [];
    let value = '-';
    let unit = '';

    if( isDockingPerson(role) ){ // 是对接人

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

    if(category === TYPE_MOVIE) {
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
  }, [role, category, participantNumber, estimateBox, estimateScore, evaluationTotalScore])

  useEffect(() => {
    const { userInfo } = Taro.getStorageSync('authinfo');
    setRealName(userInfo.realName);
  }, [])


  const handleJump = () => {
    if( hasAssess || projectRole === 1) {
      Taro.navigateTo({ url: `/pages/result/index?projectId=${projectId}&roundId=${roundId}`})
    } else {
      Taro.navigateTo({ url: `/pages/assess/index/index?projectId=${projectId}&roundId=${roundId}`})
    }
  }

  const jumpDetail = () => {
    Taro.navigateTo( {url: `/pages/detail/index?projectId=${projectId}`})
  }

  const [statusType, statusText] = useMemo(() => {
    if (hasAssess) {
      return [0, '已评估']
    } else {
      let prefix = '';
      if (typeof invitees === 'string' && invitees.includes(realName)) {
        if(dayjs().valueOf() > deadline) {
          prefix = '未参与'
        } else {
          prefix = <Text style={{color: '#F1303D'}}>邀您评估</Text>;
        }
        
        return [1, prefix]
      }

      if (initiator === realName) {
        if(dayjs().valueOf() > deadline) {
          prefix = '未参与'
        } else {
          prefix = '自己发起 ';
        }
        
        return [2, prefix]
      }
    }
  }, [deadline, hasAssess, initiator, invitees, realName]);

  return (
    <View className='assess-list-evaluation-card'>
      <View onClick={handleJump} >
        <Image className='assess-list-evaluation-card-image' src={imageUrl.replace('/w.h', '')}></Image>
        <View className='assess-list-evaluation-card-title'>
          <View className='assess-list-evaluation-card-title-left' onClick={jumpDetail}>
            <View className='assess-list-evaluation-card-title-left-name'>{name}</View>
            <Image className='name-arrow' src='../../static/detail/gray.png' alt='' />
          </View>
          <View className='assess-list-evaluation-card-title-right'>
            {statusText}
          </View>
        </View>
        <View className='assess-list-evaluation-card-status'>
          <View className='assess-list-evaluation-card-status-left'>
            第{round}轮 / {TYPE[evaluationMethod]}
          </View>
          <View className='assess-list-evaluation-card-status-right'>
            {timeStr}
          </View>
        </View>
        <View className='assess-list-evaluation-card-info'>
        <View className='assess-list-evaluation-card-info-title'>
          {roundTitle}
        </View>
        <View className='assess-list-evaluation-card-info-detail'>
          {
            arr.map(({ title, value, unit }, index) => (
              <View key={index} className='assess-list-evaluation-card-info-detail-grid'>
                <View className='assess-list-evaluation-card-info-detail-grid-title'>
                  {title}
                </View>
                <View className='assess-list-evaluation-card-info-detail-grid-content'>
                  <Text className='assess-list-evaluation-card-info-detail-grid-content-value'>
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
      <View className='assess-list-evaluation-card-action'>
        {isDockingPerson(role) && judgeDeadLine(deadline) && <Button
          data-roundTitle={roundTitle}
          data-roundId={roundId}
          data-sign='invite'
          openType='share'
          className='assess-list-evaluation-card-action-btn'
        >
          邀请参与
        </Button>}
        <Button
          data-roundTitle={roundTitle}
          data-roundId={roundId}
          data-sign='attend' 
          openType='share'
          className='assess-list-evaluation-card-action-btn'
        >
          分享结果
        </Button>
        {
          (isDockingPerson(role) || invitees.includes(realName)) && judgeDeadLine(deadline) && <Button
            className='assess-list-evaluation-card-action-btn assess-list-evaluation-card-action-btn-eval'
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/assess/index/index?projectId=${projectId}&roundId=${roundId}`,
              })
            }}
          >
             {statusType === 0 ? '修改评估' : '去评估' }
        </Button>
        }
      </View>
    </View>
)}

function judgeDeadLine(time) {

  return dayjs().valueOf() < time
}