import Taro, { useDidShow } from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components';
import React, { useEffect, useMemo, useState, useRef, forwardRef } from 'react';
import { noDataPic, defaultMovieCover as Cover } from '@utils/imageUrl';
import dayjs from 'dayjs';
import './evaluate.scss';
import utils from '../../utils';
import reqPacking from '../../utils/reqPacking';
import useDeadline from '../assess/detail/useDeadline';
// import VirtualList from '@tarojs/components/virtual-list';

// function buildData (offset = 0) {
//   return Array(100).fill(0).map((_, i) => i + offset);
// }

// const Row = React.memo(({ id, index, style, data }) => {
//   console.log(id, index, style, data, 1111)
//   return (
//     <View id={id} className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
//       Row {index} : {data[index]}
//     </View>
//   );
// })


const { formatNumber, isDockingPerson } = utils;

const TYPE = {
  1: '大纲评估',
  2: '剧本评估',
  3: '成片评估',
}

const TYPE_MOVIE = 3 || 4;
// const DEFAULT_PROJECT_ROLE = 6;
const EvalutaionCard = forwardRef(_EvalutaionCard);

export function EvaluationList({type}, ref) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const fetch = useRef(false);
  // const [testData, setTestData] = useState(buildData(0));

  useDidShow(() => {
    setLoading(true)
    fetchEvalutaionData(type)
    .then(res => {
      const { success, error } = res;
      if(success) {
        setData(res.data || {})
      } else {
        Taro.showToast({
          title: error.message,
          icon: 'none'
        })
      }
      setLoading(false)
    })
    .catch(err => {
      Taro.showToast({
        title: err,
        icon: 'none'
      })
    })
  })

  useEffect(() => {
    if(!fetch.current) {
      fetch.current = true;
      return
    }
    setLoading(true)
    fetchEvalutaionData(type)
    .then(res => {
      const { success, error } = res;
      if(success) {
        setData(res.data || {})
      } else {
        Taro.showToast({
          title: error.message,
          icon: 'none'
        })
      }
      setLoading(false)
    })
    .catch(err => {
      Taro.showToast({
        title: err,
        icon: 'none'
      })
    })
  }, [type])

  const [evaluationList] = useMemo(() => {
    const { evaluationList: __evaluationList = [] } = data;
    return [__evaluationList];
  }, [data])

  return loading ? <mpLoading show type='circle' tips=''></mpLoading> :
          evaluationList?.length > 0 ? <>
          {/* <VirtualList
            height={500} 
            width='100%'
            itemData={testData} 
            itemCount={testData.length} 
            itemSize={20} 
          >
            {Row} 
          </VirtualList> */}
          {
            evaluationList.map((item, index) => <EvalutaionCard key={index} {...item} ref={ref} />)
          }
          <View className='assess-list-content-body-noMore'>没有更多了</View>
          </> : (
          <>
            <View className='no-eval-data'>
              <Image src={noDataPic} alt=''></Image>
              <View className='text'>暂无评估记录</View>
            </View>
          </>
          )
}

function _EvalutaionCard(props, ref) {
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

  if(deadline === 0) {
    deadline = null;
  }

  // const timeStr = useMemo(() => {
  //   if (!startDate) return '-'
  //   const time = new Date(startDate);
  //   const d = time.getDate();
  //   const h = time.getHours();
  //   const m = time.getMinutes();
  //   const s = time.getSeconds();
  //   const str = `${time.getFullYear()}-${time.getMonth() + 1}-${d < 10 ? `0${d}` : d} ${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
  //   return str;
  // }, [startDate])
  

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
  }, [participantNumber, estimateBox, estimateScore])

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
  
      if (isDockingPerson(role)) {
        if(deadline && dayjs().valueOf() > deadline) {
          prefix = '未参与'
        } else {
          if(initiator === realName) {
            prefix = '自己发起 ';
          }
        }
        
        return [2, prefix]
      }

      if (judgeInvitee(invitees, realName)) {
        if(deadline && dayjs().valueOf() > deadline) {
          prefix = '未参与'
        } else {
          prefix = <Text style={{color: '#F1303D'}}>邀您评估</Text>;
        }
        
        return [1, prefix]
      }

      return [3, prefix]
    }
  }, [deadline, hasAssess, initiator, invitees, realName]);

  return (
    <View className='assess-list-evaluation-card'>
      <View onClick={handleJump} >
        <Image className='assess-list-evaluation-card-image' src={imageUrl ? imageUrl.replace('/w.h', '') : Cover}></Image>
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
            {useDeadline(deadline).component}
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
          onClick={() => ref.current = props}
        >
          邀请参与
        </Button>}
        <Button
          data-roundTitle={roundTitle}
          data-roundId={roundId}
          data-sign='attend' 
          openType='share'
          className='assess-list-evaluation-card-action-btn'
          onClick={() => ref.current = props}
        >
          分享结果
        </Button>
        {
          (isDockingPerson(role) || judgeInvitee(invitees, realName)) && judgeDeadLine(deadline) && <Button
            className='assess-list-evaluation-card-action-btn assess-list-evaluation-card-action-btn-eval'
            onClick={() => {
              Taro.navigateTo({
                url: statusType === 0 ? `/pages/assess/detail/index?projectId=${projectId}&roundId=${roundId}` : `/pages/assess/index/index?projectId=${projectId}&roundId=${roundId}`,
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

  return !(time && dayjs().valueOf() > time)
}

function judgeInvitee(invitees, realName) {

  return typeof invitees === 'string' && invitees.includes(realName)
}

export function fetchEvalutaionData(type) {
  const { userInfo } = Taro.getStorageSync('authinfo');
  return new Promise(resolve => {
    reqPacking({
      url: 'api/applet/management/allEvaluationList',
      data: {
        type: type + 1,
        userId: userInfo.id,
        // offset: 0,
        // limit: 10
      }
    }, 'server').then(res => {
      resolve(res)
    
    })
  })
}