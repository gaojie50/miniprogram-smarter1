import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import FilmComparePanel from '@components/filmComparePanel/index';
import reqPacking from '@utils/reqPacking.js';
import utils from '@utils/index';
import './index.scss'

const { errorHandle, rpxTopx } = utils;

const FilmMarket=(props)=>{
  const [ isSetSchedule, setIsSetSchedule ] = useState(true);
  const [ historyList, setHistoryList ] = useState([]);

  const { data, show } = props;
  const { originalReleaseDate={}, estimateBox, hasFixEstimateBox, keyFilms=[] } = data;
  const scheduledFilmsNum = keyFilms.filter(v => v.scheduleType == 1).length;

  function handleChangeScheduleType(){
    setIsSetSchedule(!isSetSchedule);
  }

  useEffect(()=>{
    if(show){
      fetchHistoryList();
    }else{
      setHistoryList([])
    }
  }, [show])

  const fetchHistoryList = () => {
    const reqParams = {
      closeNum: 5,
      startDt: originalReleaseDate.startDate,
      endDt: originalReleaseDate.endDate,
    }
    reqPacking(
      {
        url: 'api/management/searchoveryearsschedulebox',
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

  return (
    <FilmComparePanel 
      show={show}
      releaseDate={originalReleaseDate}
      onChangeScheduleType={handleChangeScheduleType}
      isSetSchedule={isSetSchedule}
      data={data}
      estimateBox={estimateBox}
      hasFixEstimateBox={hasFixEstimateBox}
      possiblyEstimateBox={estimateBox - hasFixEstimateBox}
      scheduledFilmsNum={scheduledFilmsNum}
      possiblyReleaseNum={(data.keyFilms||[]).length - scheduledFilmsNum}
      closeFn={props.closeFn}
      historyList={historyList}
      filmListHeight={`calc(90vh - ${rpxTopx(460+150+20)}px)`}
    />
  )
}

export default FilmMarket;
