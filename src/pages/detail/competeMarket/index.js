import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import FilmComparePanel from '@components/filmComparePanel/index';
import reqPacking from '@utils/reqPacking.js';
import utils from '@utils/index';
import dayjs from 'dayjs';
import { defaultMovieCover } from '@utils/imageUrl';
import { picFn } from '@utils/pic';
import './index.scss'

const { errorHandle, rpxTopx } = utils;

const CompeteMarket=(props)=>{
  const [ isSetSchedule, setIsSetSchedule ] = useState(true);
  const [ weekType, setWeekType ] = useState('releaseWeek');
  const [ historyList, setHistoryList ] = useState([]);
  const [ startDate, setStartDate ] = useState('');
  const [ endDate, setEndDate ] = useState('');
  const [ filmList, setFilmList ] = useState([]);
  const [ estimateTotalNum, setEstimateTotalNum] = useState(0);
  const [ possiblyEstimateTotalNum, setPossiblyEstimateTotalNum ] = useState(null);
  const [ releaseNum, setReleaseNum ] = useState(0);
  const [ possiblyReleaseNum, setPossiblyReleaseNum ] = useState(null);
  
  const { show } = props;

  function handleChangeScheduleType(){
    setIsSetSchedule(!isSetSchedule);
  }

  useEffect(()=>{
    const { releaseTime = {} } = props;
    const releaseTimeArry = releaseTime.time && releaseTime.time.match(/-/g);
    if ((releaseTimeArry && releaseTimeArry.length === 2)) {
      // 获取该周的第几天
      const index = dayjs(releaseTime.time).day();

      // 自然周的周一到周日
      const natureStartDate = +dayjs(releaseTime.time).subtract(index - 1, 'days');
      const natureEndDate = +dayjs(releaseTime.time).add(7 - index, 'days');
      const releaseStartDate = +dayjs(releaseTime.time).subtract(index < 5 ? parseInt(index) + 2 : index - 5, 'days');
      const releaseEndDate = +dayjs(releaseTime.time).add(index < 5 ? 4 - index : 11 - index, 'days');

      if(weekType === 'releaseWeek'){
        setStartDate(releaseStartDate);
        setEndDate(releaseEndDate);
      }else{
        setStartDate(natureStartDate);
        setEndDate(natureEndDate);
      }
    }

  }, [show, weekType])

  
  useEffect(()=>{
    if(show && startDate && endDate) {
      fetchHistoryList();
      fetchCompetitiveSituation();
    }else{
      setHistoryList([])
      setFilmList([]);
    }
  }, [show, startDate, endDate])

  useEffect(()=>{
    if(show && startDate && endDate){
      fetchCompetitiveSituation();
    }
  }, [isSetSchedule])

  const fetchCompetitiveSituation=()=>{
    const { projectId } = props;
    const query = {
      projectId: projectId,
      startDt: startDate,
      endDt: endDate,
      hasConfirmed: isSetSchedule
    };
    
    reqPacking({
      url: 'api/management/searchcompetitivesituation',
      data: query,
    }).then(res =>{
      const { success, data = {},error } = res;
      if (success) {
        const newFilmList = (data.competitiveSituationDetailList || []).map(item=>{
          return {
            projectId: item.projectId,
            movieName: item.name,
            pic: item.pic ? picFn(item.pic) : defaultMovieCover,
            director: item.director || '-',
            scheduleType: item.scheduleType,
            estimateBox: item.estimateNum,
            releaseDesc: item.time,
            maoyanSign: item.maoyanSign || [],
            wishNum: item.wishNum || null
          }
        })
        setFilmList(newFilmList)
        setEstimateTotalNum(data.estimateTotalNum || 0);
        setPossiblyEstimateTotalNum(data.possiblyEstimateTotalNum);
        setReleaseNum(data.releaseNum || 0);
        setPossiblyReleaseNum(data.possiblyReleaseNum);
      } else {
        errorHandle(error)
      }
    })
  }

  const fetchHistoryList = () => {
    const reqParams = {
      closeNum: 5,
      startDt: startDate,
      endDt: endDate,
      projectId: props.projectId
    }
    reqPacking(
      {
        url: '/api/management/searchoveryearsschedulebox',
        data: reqParams
      },
      'server',
    ).then(res => {
        const { error, data:historyData = [] } = res;

        if (!error) {
         setHistoryList(historyData)
        }
        errorHandle(error);
      })
  };

  const handleWeekTypeChange = (type) => {
    setWeekType(type);
  }

  return (
    <FilmComparePanel
      showWeekType={true}
      weekType={weekType}
      onWeekTypeChange={handleWeekTypeChange}
      show={show}
      releaseDate={{
        startDate: startDate,
        endDate: endDate
      }}
      onChangeScheduleType={handleChangeScheduleType}
      isSetSchedule={isSetSchedule}
      data={{
        keyFilms: filmList
      }}
      estimateBox={estimateTotalNum}
      hasFixEstimateBox={estimateTotalNum-possiblyEstimateTotalNum}
      possiblyEstimateBox={possiblyEstimateTotalNum}
      scheduledFilmsNum={releaseNum-possiblyReleaseNum}
      possiblyReleaseNum={possiblyReleaseNum}
      closeFn={props.closeFn}
      historyList={historyList}
      titleHeight={200}
      filmListHeight={`calc(90vh - ${rpxTopx(460+150+20+70)}px)`}
    />
  )
}

export default CompeteMarket;
