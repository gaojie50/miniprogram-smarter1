import React, { useState, useMemo, useEffect, useCallback, forwardRef, useRef } from 'react';
import { View, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import reqPacking from '@utils/reqPacking.js';
import { Search, projectSearch, searchRole } from './search.js';
import Toast from '@components/m5/toast';
import _BasicInfo from './basicInfo';
import _KeyInfo from './keyInfo';
import { CATEGORY_LIST } from './lib';
import './index.scss';

const KeyInfo = forwardRef(_KeyInfo);
const BasicInfo = forwardRef(_BasicInfo);
export default function EditProject() {
  const keyDataRef = useRef();
  const basicDateRef = useRef();

  const [showToast, setShowToast] = useState('');
  const [projectId, setProjectId] = useState();
  const [movieList, setMovieList] = useState({});
  const [projectInfoList, setProjectInfoList] = useState({});
  const [projectData, setProjectData] = useState({});
  const [judgeRole, setJudgeRole] = useState({});
  const [scroll, setScroll] = useState(true);

  useEffect(() => {
    const url = Taro.getCurrentPages();
    url.forEach(item => {
      if(item.route === 'pages/detail/editProject/index') {
        setProjectId(item.options.projectId)
      }
    })

    if(projectId && projectId !== 0 ) {
      Search(projectId)
      .then(res => {
        setMovieList(res[0]);
      })
      projectSearch(projectId)
      .then(res => {
        setProjectInfoList(res);
        setProjectData(res)
      })
      searchRole(projectId)
      .then(res => {
        setJudgeRole(res)
      })
    }
  }, [projectId])

  const submit = useCallback(() => {
    let {name, category, t1, isOtherCategory, cooperType, customCategory, cooperStatus, type = [], customCooperType } = basicDateRef.current;
    const {scheduleType, startDate, endDate, advertisingCosts, expectBox, expectScore, myInvestment, myShare, productionCosts} = keyDataRef.current;
    if(type === false) {
      type = [];
    }

    if (!name) {
      toast("请填写片名");
      return
    }
    if (!t1) {
      toast("请选择品类");
      return
    }

    if (isOtherCategory && !customCategory) {
      toast("请填写品类名称");
      return
    }

    if (!cooperType || cooperType.length === 0) {
      toast("请填写意向合作类型");
      return
    }
    if(cooperType.indexOf('其他') !== -1 && (customCooperType === undefined || customCooperType === '')) {
      toast("请填写意向合作类型");
      return
    }

    if (cooperStatus === undefined) {
      toast("请填写合作状态");
      return
    }
    const query = {};
    if(scheduleType) {
      query.scheduleType = scheduleType; 
    }  
    if(startDate) {
      query.startDate = startDate;
    }
    if(endDate) {
      query.endDate = endDate;
    }
    
    if(expectBox) {
      if(!(/^[0-9]+([.]{1}[0-9]{1,2}){0,1}$/.test(expectBox))) {
        toast("预估票房应为数字类型，可保留2位小数");
        return
      } 
      query.estimateBox = expectBox * 10000;
    } 

 
    if(expectScore) {
      judgeNumToast(+expectScore, '预估评分');
      if(+expectScore > 10 || +expectScore < 0) {
        toast("分数应在0-10之间");
        return
      }
      query.estimateScore = +expectScore;
    }

    if(productionCosts) {
      judgeNumToast(productionCosts, '制作成本');
      query.cost = productionCosts * 10000;
    }

    if(advertisingCosts) {
      judgeNumToast(advertisingCosts, '宣发费用');
      query.advertisingCost = advertisingCosts * 10000;
    }  

    if(myShare) {
      judgeNumToast(myShare, '猫眼份额');
      query.share = myShare;
    }

    if(myInvestment) {
      judgeNumToast(myInvestment, '猫眼投资成本');
      query.investingCost = myInvestment * 10000;
    } 

    const index = cooperType.indexOf('其他');
    if(index !== -1) {
      cooperType.splice(index, 1)
    }

    const elseQuery = {};

    if(movieList && movieList !== {}) {
      if(movieList.maoyanId) {
        elseQuery.maoyanId = movieList.maoyanId;
      }
  
      elseQuery.director = movieList.director || [];
      elseQuery.issuer = movieList.issuer || [];
      elseQuery.mainControl = movieList.mainControl || {};
      elseQuery.movieSource = movieList.filmSource || [];
      elseQuery.producer = movieList.producer || [];
      elseQuery.protagonist = movieList.protagonist || [];
      handleFormatPeople(elseQuery.director);
      handleFormatPeople(elseQuery.protagonist);
    }
    
    reqPacking({
      url: 'api/management/editProjectInfo',
      data:{
        projectId,
        name,
        category,
        cooperStatus,
        cooperType,
        type,
        ...query,
        ...elseQuery
      },
      method: 'POST',
    })
    .then(res => {
      if(res.success) {
        wx.navigateBack()
      }
    })
  }, [keyDataRef, basicDateRef, projectId, movieList])

  const changeCategory = (category) => {
    let key = 0;
    let newData = JSON.parse(JSON.stringify(projectData));
    newData.category = category;
    CATEGORY_LIST.forEach(item => {
      if(item.name === category) {
        key = item.key
      }
    })
    projectInfoList.category = key;

    setProjectData(newData)
  }

  return (
    <ScrollView scrollY={ scroll } className="editProject">
      <BasicInfo ref={basicDateRef} changeScroll={param => setScroll(param)} movieData={movieList} changeCategory={changeCategory} projectData={projectInfoList} />
      <KeyInfo ref={keyDataRef} movieData={movieList} judgeRole={judgeRole} projectData={projectData} />
      <View style={{height: '124rpx'}}></View>
      {
        scroll ? <View className="releaseTime-submit">
          <View className="releaseTime-submit-btn" onClick={submit}>保存</View>
        </View> : null
      }
    </ScrollView>
  )
}

function toast(text) {
  Taro.showToast({
    title: text,
    duration: 1000, 	
    icon: 'none',
  })
}

function judgeNumToast(num, text) {
  if(!(/^[0-9]+([.]{1}[0-9]{1}){0,1}$/.test(num))) {
    toast(`${text}应为数字类型，可保留1位小数`);
    throw console.info()
  }
}

function handleFormatPeople(people) {
  if(people.length > 0) {
    people.forEach(item => {
      item.id = item.maoyanId;
      delete item.maoyanId;
      delete item.enName;
    })
  }
}